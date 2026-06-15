import breadcrumbBgLight from "../../assets/Impact/breadcrumb-bg-light.png";
import breadcrumbBgDark from "../../assets/Impact/breadcrumb-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import ImpactHerBeatsSection from "./ImpactHerBeatsSection";
import ImpactHighlightSection from "./ImpactHighlightSection";
import ImpactAreasSection from "./ImpactAreasSection";
import "../../styles/impact-page.css";

export default function ImpactPage() {
  return (
    <div id="impact-navbar-top" className="impact-page-shell">
      <BreadcrumbPageHeader
        ariaLabel="Impact"
        lightSrc={breadcrumbBgLight}
        darkSrc={breadcrumbBgDark}
        heroClassName="impact-hero"
        fetchPriority="high"
      />
      <ImpactHerBeatsSection />
      <ImpactHighlightSection />
      <ImpactAreasSection />
    </div>
  );
}
