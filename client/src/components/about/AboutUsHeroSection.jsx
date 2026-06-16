import { ABOUT_HERO } from "../../data/aboutUsDisplay.js";

export default function AboutUsHeroSection() {
  return (
    <section className="about-us-hero" aria-labelledby="about-us-hero-title">
      <div className="about-us-hero__copy">
        <h1 id="about-us-hero-title" className="about-us-hero__title">
          {ABOUT_HERO.titleLead} <span className="about-us-accent">{ABOUT_HERO.titleAccent}</span>
        </h1>
        <p className="about-us-hero__tagline">
          {ABOUT_HERO.taglineLead}{" "}
          <span className="about-us-accent">{ABOUT_HERO.taglineAccent}</span>
        </p>
        <p className="about-us-hero__description">{ABOUT_HERO.description}</p>
      </div>
    </section>
  );
}
