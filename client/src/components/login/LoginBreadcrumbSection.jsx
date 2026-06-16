import heroBgLight from "../../assets/Home/hero-bg-light.png";
import heroBgDark from "../../assets/Home/hero-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import "../../styles/login-breadcrumb-section.css";

const HERO_COPY = {
  login: {
    titleLead: "Welcome Back!",
    titleAccent: "Sign in to your account",
    intro:
      "Access your memberships, donations, event registrations and update your account details.",
  },
  signup: {
    titleLead: "Join Us Today!",
    titleAccent: "Create your account",
    intro:
      "Create an account to manage memberships, donations, event registrations, and your profile.",
  },
  "forgot-password": {
    titleLead: "Forgot Password?",
    titleAccent: "We will help you reset it",
    intro: "Enter your email and we will send you a link to choose a new password.",
  },
};

export default function LoginBreadcrumbSection({ mode = "login" }) {
  const copy = HERO_COPY[mode] || HERO_COPY.login;

  return (
    <>
      <BreadcrumbPageHeader
        ariaLabel="Log in or sign up"
        lightSrc={heroBgLight}
        darkSrc={heroBgDark}
        heroClassName="login-page-hero"
        fetchPriority="high"
      />

      <section className="login-hero" aria-labelledby="login-hero-title">
        <div className="login-hero__copy">
          <h1 id="login-hero-title" className="login-hero__title">
            {copy.titleLead}{" "}
            <span className="login-grad-text">{copy.titleAccent}</span>
          </h1>
          <p className="login-hero__intro">{copy.intro}</p>
        </div>
      </section>
    </>
  );
}
