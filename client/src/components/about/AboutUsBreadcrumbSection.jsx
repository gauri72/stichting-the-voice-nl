import heroBgLight from "../../assets/Home/hero-bg-light.png";
import heroBgDark from "../../assets/Home/hero-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import "../../styles/about-us-breadcrumb-section.css";

export default function AboutUsBreadcrumbSection() {
  return (
    <BreadcrumbPageHeader
      ariaLabel="About Us"
      lightSrc={heroBgLight}
      darkSrc={heroBgDark}
      heroClassName="about-us-page-hero"
      fetchPriority="high"
    />
  );
}
