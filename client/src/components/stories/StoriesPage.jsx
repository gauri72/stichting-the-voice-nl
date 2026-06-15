import heroBgLight from "../../assets/Stories/hero-bg-light.png";
import heroBgDark from "../../assets/Stories/hero-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import StoriesPillarSection from "./StoriesPillarSection";
import { STORIES_PILLARS } from "../../data/storiesDisplay.js";
import "../../styles/stories-page.css";

export default function StoriesPage() {
  return (
    <div id="stories-navbar-top" className="stories-page-shell">
      <BreadcrumbPageHeader
        ariaLabel="Stories"
        lightSrc={heroBgLight}
        darkSrc={heroBgDark}
        heroClassName="stories-hero"
        fetchPriority="high"
      />
      {STORIES_PILLARS.map((pillar) => (
        <StoriesPillarSection key={pillar.id} pillar={pillar} />
      ))}
    </div>
  );
}