import env from "../config/env.js";
import { getDonationTier } from "../config/donationTiers.js";
import { getTier } from "../config/sponsorshipTiers.js";
import { getStripe, isStripeConfigured } from "../services/stripe.js";
import { sendDonationEmails, sendSponsorshipEmails } from "../services/mailer.js";
import { recordSucceededPaymentIntent } from "../services/paymentRecordService.js";
import { buildReceiptNumber } from "../utils/receiptNumber.js";
import { isMailerConfigured, getSmtpTransporter, verifySmtpConnection } from "../services/smtpTransport.js";

// In-memory guard so we don't email twice if both webhook and client confirmation fire.
const emailedIntents = new Set();

function describePaymentMethod(intent) {
  const pm = intent?.payment_method;
  if (pm && typeof pm === "object") {
    if (pm.type === "card" && pm.card?.brand) {
      const brand = pm.card.brand
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return `${brand} card via Stripe`;
    }
    if (pm.type) {
      const label = pm.type.replace(/_/g, " ");
      return `${label.charAt(0).toUpperCase() + label.slice(1)} via Stripe`;
    }
  }
  const charge = intent?.latest_charge;
  if (charge && typeof charge === "object") {
    const details = charge.payment_method_details;
    if (details?.card?.brand) {
      const brand = details.card.brand
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return `${brand} card via Stripe`;
    }
  }
  return "Card via Stripe";
}

function sanitizeSponsor(input = {}) {
  const firstName = String(input.firstName || "").trim().slice(0, 80);
  const lastName = String(input.lastName || "").trim().slice(0, 80);
  const name =
    String(input.name || `${firstName} ${lastName}`).trim().slice(0, 160) || "Sponsor";
  const email = String(input.email || "").trim().slice(0, 160);
  const phone = String(input.phone || "").trim().slice(0, 40);
  const organization = String(input.organization || "").trim().slice(0, 160);
  const country = String(input.country || "").trim().slice(0, 80);
  const message = String(input.message || "").trim().slice(0, 1000);

  return { name, firstName, lastName, email, phone, organization, country, message };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

async function emailSponsorOnce(payload) {
  const { paymentIntentId } = payload;
  if (!paymentIntentId) return;
  if (emailedIntents.has(paymentIntentId)) return;
  emailedIntents.add(paymentIntentId);

  try {
    await sendSponsorshipEmails(payload);
  } catch (error) {
    emailedIntents.delete(paymentIntentId);
    console.error("[payments] Failed to send sponsorship email:", error.message);
  }
}

async function emailDonationOnce(payload) {
  const { paymentIntentId } = payload;
  if (!paymentIntentId) return;
  if (emailedIntents.has(paymentIntentId)) return;
  emailedIntents.add(paymentIntentId);

  try {
    await sendDonationEmails(payload);
  } catch (error) {
    emailedIntents.delete(paymentIntentId);
    console.error("[payments] Failed to send donation email:", error.message);
  }
}

export async function createPaymentIntent(req, res) {
  if (!isStripeConfigured()) {
    return res.status(503).json({
      error:
        "Stripe is not configured on the server. Set STRIPE_SECRET_KEY in server/.env."
    });
  }

  try {
    const { kind = "sponsorship", tierId, amount: customAmount, sponsor: rawSponsor } =
      req.body || {};
    const isDonation = kind === "donation";
    const tier = isDonation ? getDonationTier(tierId) : getTier(tierId);
    if (!tier) {
      return res.status(400).json({
        error: isDonation ? "Unknown donation tier." : "Unknown sponsorship tier."
      });
    }

    const sponsor = sanitizeSponsor(rawSponsor);
    if (!sponsor.email || !isValidEmail(sponsor.email)) {
      return res.status(400).json({
        error: isDonation ? "A valid donor email is required." : "A valid sponsor email is required."
      });
    }
    if (!sponsor.name) {
      return res.status(400).json({
        error: isDonation ? "Donor name is required." : "Sponsor name is required."
      });
    }

    const stripeMinCents = 50;
    let amountMinor = tier.amount;
    if (tier.allowCustom) {
      if (!Number.isFinite(Number(customAmount))) {
        return res.status(400).json({ error: "A custom amount is required for this option." });
      }
      const requested = Math.round(Number(customAmount));
      if (requested < stripeMinCents) {
        return res.status(400).json({ error: "Enter a valid amount in EUR." });
      }
      amountMinor = requested;
    }

    const stripe = getStripe();
    const baseMeta = {
      tier_id: tier.id,
      tier_name: tier.name,
      sponsor_name: sponsor.name,
      sponsor_email: sponsor.email,
      sponsor_phone: sponsor.phone,
      sponsor_organization: sponsor.organization,
      sponsor_country: sponsor.country,
      sponsor_message: sponsor.message ? sponsor.message.slice(0, 480) : ""
    };
    const metadata = {
      ...baseMeta,
      ...(isDonation ? { payment_kind: "donation" } : {}),
      ...(req.user?.id ? { user_id: String(req.user.id) } : {})
    };

    const intent = await stripe.paymentIntents.create({
      amount: amountMinor,
      currency: env.stripe.currency,
      // Do not set receipt_email — your app sends thank-you mail + PDF via SiteGround SMTP.
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "always"
      },
      description: isDonation ? `Donation - ${tier.name}` : `Sponsorship - ${tier.name}`,
      metadata
    });

    return res.status(201).json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: amountMinor,
      currency: env.stripe.currency,
      tier: { id: tier.id, name: tier.name }
    });
  } catch (error) {
    console.error("[payments] createPaymentIntent error:", error);
    return res.status(500).json({ error: "Unable to create payment intent." });
  }
}

// Fallback for environments without Stripe webhooks (e.g. local dev without the Stripe CLI).
// The client calls this after stripe.confirmPayment() resolves successfully.
export async function confirmPayment(req, res) {
  if (!isStripeConfigured()) {
    return res.status(503).json({ error: "Stripe is not configured on the server." });
  }

  try {
    const { paymentIntentId } = req.body || {};
    if (!paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId is required." });
    }

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["payment_method", "latest_charge"]
    });

    if (intent.status !== "succeeded") {
      return res.status(202).json({ status: intent.status });
    }

    const meta = intent.metadata || {};
    const sponsor = {
      name: meta.sponsor_name,
      firstName: (meta.sponsor_name || "").split(" ")[0] || "",
      email: meta.sponsor_email,
      phone: meta.sponsor_phone,
      organization: meta.sponsor_organization,
      country: meta.sponsor_country,
      message: meta.sponsor_message
    };
    const tier = { id: meta.tier_id, name: meta.tier_name };
    const payload = {
      sponsor,
      tier,
      amountMinor: intent.amount_received || intent.amount,
      currency: intent.currency,
      paymentIntentId: intent.id,
      paymentCreated: intent.created,
      paymentMethod: describePaymentMethod(intent),
      receiptNumber: buildReceiptNumber(intent.id, intent.created)
    };

    try {
      await recordSucceededPaymentIntent(intent);
    } catch (err) {
      console.error("[payments] recordSucceededPaymentIntent (confirm):", err.message);
    }

    if (meta.payment_kind === "donation") {
      await emailDonationOnce(payload);
    } else {
      await emailSponsorOnce(payload);
    }

    return res.status(200).json({ status: "succeeded" });
  } catch (error) {
    console.error("[payments] confirmPayment error:", error);
    return res.status(500).json({ error: "Unable to confirm payment." });
  }
}

// Stripe webhook handler. Mounted with `express.raw()` body parser in app.js.
export async function stripeWebhook(req, res) {
  if (!isStripeConfigured()) {
    return res.status(503).end();
  }

  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    if (env.stripe.webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, signature, env.stripe.webhookSecret);
    } else {
      // Webhook secret not configured: parse without signature verification.
      // This is acceptable only for local experimentation - never in production.
      event = JSON.parse(req.body.toString());
    }
  } catch (error) {
    console.error("[payments] Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const baseIntent = event.data.object;
    const meta = baseIntent.metadata || {};

    // The webhook payload omits expanded objects. Re-fetch with expansions so
    // the receipt PDF / email can show a precise payment method label.
    let intent = baseIntent;
    try {
      intent = await stripe.paymentIntents.retrieve(baseIntent.id, {
        expand: ["payment_method", "latest_charge"]
      });
    } catch (err) {
      console.warn(
        "[payments] Webhook: could not expand payment intent, falling back to webhook payload:",
        err.message
      );
    }

    const sponsor = {
      name: meta.sponsor_name,
      firstName: (meta.sponsor_name || "").split(" ")[0] || "",
      email: meta.sponsor_email,
      phone: meta.sponsor_phone,
      organization: meta.sponsor_organization,
      country: meta.sponsor_country,
      message: meta.sponsor_message
    };
    const tier = { id: meta.tier_id, name: meta.tier_name };
    const payload = {
      sponsor,
      tier,
      amountMinor: intent.amount_received || intent.amount,
      currency: intent.currency,
      paymentIntentId: intent.id,
      paymentCreated: intent.created,
      paymentMethod: describePaymentMethod(intent),
      receiptNumber: buildReceiptNumber(intent.id, intent.created)
    };

    try {
      await recordSucceededPaymentIntent(intent);
    } catch (err) {
      console.error("[payments] recordSucceededPaymentIntent (webhook):", err.message);
    }

    if (meta.payment_kind === "donation") {
      await emailDonationOnce(payload);
    } else {
      await emailSponsorOnce(payload);
    }
  }

  return res.json({ received: true });
}

// Debug endpoint — sends a plain test email to ORG_NOTIFY_EMAIL.
// Only works when NODE_ENV !== "production" OR when a ?secret= token matches ORG_NOTIFY_EMAIL hash.
// Usage: POST /api/payments/test-email  { "to": "optional@override.com" }
export async function testEmail(req, res) {
  if (!isMailerConfigured()) {
    return res.status(503).json({
      ok: false,
      step: "config_check",
      error: "SMTP not configured — check EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM env vars.",
      smtp: {
        host: env.email.host || null,
        port: env.email.port || null,
        secure: env.email.secure,
        user: env.email.user || null,
        from: env.email.from || null
      }
    });
  }

  // In production require a simple secret guard to avoid open relay abuse.
  if (env.nodeEnv === "production") {
    const secret = req.query.secret || req.body?.secret;
    const expected = env.email.orgNotify || env.org.contactEmail;
    if (!secret || secret !== expected) {
      return res.status(403).json({ ok: false, error: "Pass ?secret=<ORG_NOTIFY_EMAIL> to use this in production." });
    }
  }

  const to = String(req.body?.to || env.email.orgNotify || env.org.contactEmail || "").trim();
  if (!to) {
    return res.status(400).json({ ok: false, error: "No recipient — set ORG_NOTIFY_EMAIL or pass { to } in body." });
  }

  // Step 1: verify SMTP connection
  let reachable = false;
  let verifyError = null;
  try {
    reachable = await verifySmtpConnection();
  } catch (err) {
    verifyError = err.message;
  }

  if (!reachable) {
    return res.status(502).json({
      ok: false,
      step: "smtp_verify",
      error: verifyError || "SMTP server unreachable or auth failed — check host/port/credentials.",
      smtp: { host: env.email.host, port: env.email.port, secure: env.email.secure }
    });
  }

  // Step 2: send the actual email
  try {
    const tx = getSmtpTransporter();
    await tx.sendMail({
      from: env.email.from,
      to,
      subject: "VOICE NL — SMTP test email",
      text: `This is a test email sent at ${new Date().toISOString()}.\n\nIf you received this, SMTP is working correctly.\n\nConfig:\n  HOST: ${env.email.host}\n  PORT: ${env.email.port}\n  SECURE: ${env.email.secure}\n  FROM: ${env.email.from}`
    });
    return res.status(200).json({ ok: true, step: "sent", to, from: env.email.from });
  } catch (err) {
    console.error("[test-email] Send failed:", err.message);
    return res.status(502).json({
      ok: false,
      step: "send",
      error: err.message,
      smtp: { host: env.email.host, port: env.email.port, secure: env.email.secure }
    });
  }
}
