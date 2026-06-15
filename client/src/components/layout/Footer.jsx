import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandYoutube,
  IconBuilding,
  IconBulb,
  IconClipboard,
  IconCrown,
  IconGift,
  IconHeartHandshake,
  IconHome,
  IconMail,
  IconMapPin,
  IconMicrophone,
  IconSend,
  IconShield,
  IconSparkles,
  IconUsers,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { apiFetch } from "../../utils/api.js";
import { WHATSAPP_GROUP_URL } from "../../constants/siteLinks.js";
import footerBg from "../../assets/footer-bg.png";
import voiceNlLogo from "../../assets/logos/V.O.I.C.E. NL Copyright HD Logo.png";
import voiceVentureStudioLogo from "../../assets/VOICE Venture Studio.png";
import "../../styles/footer.css";
import "../../styles/footer-mobile.css";

function buildWhatsAppHref() {
  const raw = import.meta.env.VITE_WHATSAPP_E164;
  const digits =
    raw && typeof raw === "string" && raw.replace(/\D/g, "").length >= 8
      ? raw.replace(/\D/g, "")
      : "31619032104";
  return `https://wa.me/${digits}`;
}

const footerNavLinks = [
  { label: "Home", to: "/" },
  { label: "Experience", to: "/events" },
  { label: "Stories", to: "/stories" },
  { label: "Impact", to: "/impact" },
  { label: "Innovation", to: "/voice-venture-studio" },
  { label: "Become A Member", to: "/membership" },
  { label: "Sponsor Us", to: "/sponsorship" },
  { label: "Donate", to: "/donate" },
  { label: "About Us", to: "/about-us" },
];

const footerLegalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];

const footerSiteLinks = [...footerNavLinks, ...footerLegalLinks];

const footerMobileQuickLinksLeft = [
  { label: "Home", to: "/", Icon: IconHome },
  { label: "Experiences", to: "/events", Icon: IconSparkles },
  { label: "Stories", to: "/stories", Icon: IconMicrophone },
  { label: "Impact", to: "/impact", Icon: IconHeartHandshake },
  { label: "Innovation", to: "/voice-venture-studio", Icon: IconBulb },
  { label: "Become A Member", to: "/membership", Icon: IconCrown },
];

const footerMobileQuickLinksRight = [
  { label: "Sponsor Us", to: "/sponsorship", Icon: IconHeartHandshake },
  { label: "Donate", to: "/donate", Icon: IconGift },
  { label: "About Us", to: "/about-us", Icon: IconUsers },
  { label: "Privacy Policy", to: "/privacy-policy", Icon: IconShield },
  { label: "Terms & Conditions", to: "/terms-and-conditions", Icon: IconClipboard },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/p/The-VOICE-NL-61552129209396/",
    label: "Facebook",
    Icon: IconBrandFacebook,
  },
  {
    href: "https://www.instagram.com/stichting_the_voice_nl/?hl=en",
    label: "Instagram",
    Icon: IconBrandInstagram,
  },
  {
    href: "https://www.linkedin.com/in/stichting-the-v-o-i-c-e-nl-b67427316/",
    label: "LinkedIn",
    Icon: IconBrandLinkedin,
  },
  {
    href: "https://www.youtube.com/@StichtingTheVOICENL",
    label: "YouTube",
    Icon: IconBrandYoutube,
  },
  {
    href: "https://x.com/St_The_VOICE_NL",
    label: "X",
    Icon: IconBrandX,
  },
];

const DEFAULT_CONTACT_EMAIL = "info@stichtingthevoice.nl";

function FooterSectionTitle({ children }) {
  return (
    <h3 className="footer-mobile-section-title">
      <span className="footer-mobile-section-title__line" aria-hidden="true" />
      <span>{children}</span>
      <span className="footer-mobile-section-title__line" aria-hidden="true" />
    </h3>
  );
}

export default function Footer() {
  const [contactEmail, setContactEmail] = useState(DEFAULT_CONTACT_EMAIL);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    apiFetch("/api/public/site")
      .then((data) => {
        if (data?.contactEmail) setContactEmail(data.contactEmail);
      })
      .catch(() => {});
  }, []);

  const contactCards = [
    {
      label: "KVK",
      value: "92180213",
      accent: "blue",
      Icon: IconBuilding,
    },
    {
      label: "Address",
      value: "Wengehout 30, 2719 KA Zoetermeer, Netherlands",
      accent: "green",
      Icon: IconMapPin,
    },
    {
      label: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      accent: "purple",
      Icon: IconMail,
    },
    {
      label: "Website",
      value: "stichtingthevoice.nl",
      href: "https://stichtingthevoice.nl",
      accent: "teal",
      Icon: IconWorld,
    },
  ];

  return (
    <footer className="site-footer site-footer--with-bg" style={{ "--footer-bg-image": `url(${footerBg})` }}>
      <div className="footer-mobile">
        <div className="footer-mobile-hero">
          <h2 className="footer-mobile-hero__title">Together, We Can</h2>
          <p className="footer-mobile-hero__subtitle">
            <span className="footer-mobile-hero__subtitle-blue">Create a Better </span>
            <span className="footer-mobile-hero__subtitle-green">Tomorrow.</span>
          </p>

          <div className="footer-mobile-hero__brand">
            <img
              className="footer-mobile-hero__logo"
              src={voiceNlLogo}
              alt="V.O.I.C.E. NL"
              loading="lazy"
            />
            <p className="footer-mobile-hero__brand-name">V.O.I.C.E. NL</p>
            <p className="footer-mobile-hero__brand-tagline">Stichting The V.O.I.C.E. NL</p>
          </div>

          <a
            className="footer-mobile-whatsapp-btn"
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandWhatsapp aria-hidden stroke={1.75} />
            <span>Join WhatsApp Group</span>
            <span className="footer-mobile-whatsapp-btn__arrow" aria-hidden="true">
              <IconArrowRight stroke={2} />
            </span>
          </a>
        </div>

        <section className="footer-mobile-section" aria-label="Follow us">
          <FooterSectionTitle>Follow Us</FooterSectionTitle>
          <div className="footer-mobile-social">
            {socialLinks.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon aria-hidden stroke={1.75} />
              </a>
            ))}
          </div>
        </section>

        <section className="footer-mobile-section" aria-label="Quick links">
          <FooterSectionTitle>Quick Links</FooterSectionTitle>
          <div className="footer-mobile-quick-grid">
            <div className="footer-mobile-quick-col">
              {footerMobileQuickLinksLeft.map(({ label, to, Icon }) => (
                <Link key={to} to={to} className="footer-mobile-quick-link">
                  <span className="footer-mobile-quick-link__icon">
                    <Icon aria-hidden stroke={1.75} />
                  </span>
                  <span className="footer-mobile-quick-link__label">{label}</span>
                  <span className="footer-mobile-quick-link__chevron" aria-hidden="true">
                    &gt;
                  </span>
                </Link>
              ))}
            </div>
            <div className="footer-mobile-quick-col">
              {footerMobileQuickLinksRight.map(({ label, to, Icon }) => (
                <Link key={to} to={to} className="footer-mobile-quick-link">
                  <span className="footer-mobile-quick-link__icon">
                    <Icon aria-hidden stroke={1.75} />
                  </span>
                  <span className="footer-mobile-quick-link__label">{label}</span>
                  <span className="footer-mobile-quick-link__chevron" aria-hidden="true">
                    &gt;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="footer-mobile-section" id="contact" aria-label="Contact us">
          <FooterSectionTitle>Contact Us</FooterSectionTitle>
          <div className="footer-mobile-contact-grid">
            {contactCards.map(({ label, value, href, accent, Icon }) => (
              <article
                key={label}
                className={`footer-mobile-contact-card footer-mobile-contact-card--${accent}`}
              >
                <span className="footer-mobile-contact-card__icon">
                  <Icon aria-hidden stroke={1.75} />
                </span>
                <span className="footer-mobile-contact-card__label">{label}</span>
                <p className="footer-mobile-contact-card__value">
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="footer-mobile-credit" aria-label="Designed and developed by V.O.I.C.E. Venture Studio">
          <p className="footer-mobile-credit__heading">
            <span className="footer-mobile-credit__heading-line" aria-hidden="true" />
            <span>Proudly Designed &amp; Developed By</span>
            <span className="footer-mobile-credit__heading-line" aria-hidden="true" />
          </p>
          <img
            className="footer-mobile-credit__logo"
            src={voiceVentureStudioLogo}
            alt="V.O.I.C.E. Venture Studio — Digital, Design, Innovation"
            loading="lazy"
          />
        </div>

        <p className="footer-mobile-copyright">
          <IconShield aria-hidden stroke={1.75} />
          <span>© 2026 Stichting The V.O.I.C.E. NL. All rights reserved.</span>
        </p>
      </div>

      <div className="footer-main footer-desktop">
        <div className="footer-impact-strip">
          <div className="footer-impact-copy">
            <h2 className="footer-impact-title">Together, We Can</h2>
            <p className="footer-impact-subtitle">
              <span className="footer-impact-subtitle-blue">Create a </span>
              <span className="footer-impact-subtitle-green">Better Tomorrow.</span>
            </p>
          </div>

          <div
            className="footer-venture-credit footer-venture-credit--impact"
            aria-label="This website is designed and developed by V.O.I.C.E. Venture Studio"
          >
            <img
              className="footer-venture-logo"
              src={voiceVentureStudioLogo}
              alt="V.O.I.C.E. Venture Studio"
              loading="lazy"
            />
            <p className="footer-designed-by">
              This website is
              <br />
              designed &amp; developed by
              <br />
              V.O.I.C.E. Venture Studio
            </p>
          </div>

          <div className="footer-impact-donate">
            <a
              className="footer-impact-donate-btn footer-impact-whatsapp-btn"
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandWhatsapp aria-hidden stroke={1.75} />
              Join WhatsApp group
            </a>
          </div>
        </div>

        <div className="footer-columns footer-columns--main">
          <div className="footer-col footer-col-follow">
            <h3 className="footer-section-title">Follow us</h3>
            <div className="footer-social-list footer-social-list--footer">
              {socialLinks.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon aria-hidden stroke={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col footer-col-quick footer-col-links-legal">
            <h3 className="footer-section-title">Quick links</h3>
            <div className="footer-quick-grid footer-nav-grid">
              <ul className="footer-quick-row footer-nav-links">
                {footerSiteLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-col footer-col-contact">
            <h3 className="footer-section-title">Contact us</h3>
            <div className="footer-brand-details footer-brand-details--standalone">
              <p>
                <span className="footer-brand-details-label">KVK</span>
                <span className="footer-brand-details-value">92180213</span>
              </p>
              <p>
                <span className="footer-brand-details-label">Address</span>
                <span className="footer-brand-details-value">
                  Wengehout 30,
                  <br />
                  2719 KA Zoetermeer,
                  <br />
                  The Netherlands
                </span>
              </p>
              <p>
                <span className="footer-brand-details-label">Email</span>
                <a className="footer-brand-details-value footer-email" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
              <p>
                <span className="footer-brand-details-label">Office Phone</span>
                <span className="footer-brand-details-value">+31619032104</span>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-main-bottom">
          <p className="footer-tagline-celebrate">
            Together, we celebrate creativity, diversity, and harmony through art and culture.
          </p>
          <p className="footer-copyright">© 2026 Stichting The V.O.I.C.E. NL. All rights reserved.</p>
        </div>
      </div>

      {isChatOpen ? (
        <aside className="footer-whatsapp-widget" aria-label="WhatsApp chat">
          <div className="footer-whatsapp-header">
            <span>
              <IconBrandWhatsapp aria-hidden stroke={1.75} /> WhatsApp
            </span>
            <button type="button" onClick={() => setIsChatOpen(false)} aria-label="Close WhatsApp chat widget">
              <IconX aria-hidden stroke={1.75} />
            </button>
          </div>

          <div className="footer-whatsapp-body">
            <p>
              Hello <span aria-hidden>👋</span>
              <br />
              Can we help you?
            </p>
          </div>

          <a
            className="footer-whatsapp-open-chat"
            href={buildWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open WhatsApp chat"
          >
            Open chat
            <IconSend aria-hidden stroke={1.75} />
          </a>
        </aside>
      ) : (
        <button
          type="button"
          className="footer-whatsapp-fab"
          aria-label="Open WhatsApp chat widget"
          onClick={() => setIsChatOpen(true)}
        >
          <IconBrandWhatsapp aria-hidden stroke={1.75} />
        </button>
      )}
    </footer>
  );
}
