import breadcrumbBgLight from "../../assets/Sponsorship/breadcrumb-bg-light.png";
import breadcrumbBgDark from "../../assets/Sponsorship/breadcrumb-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import "../../styles/donate-breadcrumb-section.css";

export default function DonateBreadcrumbSection() {
  return (
    <BreadcrumbPageHeader
      ariaLabel="Donate"
      lightSrc={breadcrumbBgLight}
      darkSrc={breadcrumbBgDark}
      heroClassName="donate-page-hero"
    />
  );
}
