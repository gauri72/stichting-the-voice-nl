import env from "../config/env.js";
import { isMailerConfigured, verifySmtpConnection } from "../services/smtpTransport.js";
import { isStripeConfigured } from "../services/stripe.js";

export async function getHealth(_req, res) {
  const smtpConfigured = isMailerConfigured();
  let smtpReachable = null;
  if (smtpConfigured) {
    smtpReachable = await verifySmtpConnection().catch(() => false);
  }

  res.status(200).json({
    status: "ok",
    service: "voice-nl-api",
    timestamp: new Date().toISOString(),
    smtp: {
      configured: smtpConfigured,
      reachable: smtpReachable,
      host: env.email.host || null,
      port: env.email.port || null,
      secure: env.email.secure,
      user: env.email.user ? env.email.user.replace(/(?<=.).(?=.*@)/g, "*") : null,
      from: env.email.from || null
    },
    stripe: {
      configured: isStripeConfigured()
    }
  });
}
