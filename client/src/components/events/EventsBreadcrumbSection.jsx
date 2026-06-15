import breadcrumbBgLight from "../../assets/Events/breadcrumb-bg-light.png";
import breadcrumbBgDark from "../../assets/Events/breadcrumb-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import "../../styles/events-breadcrumb-section.css";

export default function EventsBreadcrumbSection() {
  return (
    <BreadcrumbPageHeader
      ariaLabel="Experience"
      lightSrc={breadcrumbBgLight}
      darkSrc={breadcrumbBgDark}
      heroClassName="events-page-hero"
      fetchPriority="high"
    />
  );
}
