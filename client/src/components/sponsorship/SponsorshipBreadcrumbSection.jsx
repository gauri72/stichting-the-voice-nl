import breadcrumbBgLight from "../../assets/Sponsorship/breadcrumb-bg-light.png";
import breadcrumbBgDark from "../../assets/Sponsorship/breadcrumb-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import "../../styles/sponsorship-breadcrumb-section.css";

export default function SponsorshipBreadcrumbSection() {
  return (
    <BreadcrumbPageHeader
      ariaLabel="Sponsorship"
      lightSrc={breadcrumbBgLight}
      darkSrc={breadcrumbBgDark}
      heroClassName="sponsorship-page-hero"
    />
  );
}
