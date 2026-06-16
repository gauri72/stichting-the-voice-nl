import { Link } from "react-router-dom";
import { FaHandshake, FaStar } from "react-icons/fa";
import ctaLogo from "../../assets/Dashboard/logo.png";
import "../../styles/login-cta-section.css";

export default function LoginCtaSection() {
  return (
    <section className="login-cta-section" aria-labelledby="login-cta-title">
      <div className="login-cta-section__inner">
        <div className="login-cta">
          <img className="login-cta__logo logo-glow" src={ctaLogo} alt="" decoding="async" />

          <div className="login-cta__copy">
            <h2 id="login-cta-title" className="login-cta__title">
              <span className="login-cta__title-row">Make an Even</span>
              <span className="login-cta__title-row login-cta__title-row--accent login-grad-text">
                Bigger Impact
              </span>
            </h2>
            <p className="login-cta__text">
              Join our community or upgrade your membership to unlock more opportunities and make a
              difference.
            </p>
          </div>

          <div className="login-cta__actions">
            <Link className="login-cta__btn login-cta__btn--primary" to="/membership">
              <FaStar aria-hidden />
              Upgrade Membership
            </Link>
            <Link className="login-cta__btn login-cta__btn--secondary" to="/sponsorship">
              <FaHandshake aria-hidden />
              Become a Sponsor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
