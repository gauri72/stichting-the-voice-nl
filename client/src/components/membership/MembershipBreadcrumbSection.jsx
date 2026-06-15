import breadcrumbBgLight from "../../assets/Membership/breadcrumb-bg-light.png";
import breadcrumbBgDark from "../../assets/Membership/breadcrumb-bg-dark.png";
import BreadcrumbPageHeader from "../layout/BreadcrumbPageHeader.jsx";
import "../../styles/membership-breadcrumb-section.css";

export default function MembershipBreadcrumbSection() {
  return (
    <BreadcrumbPageHeader
      ariaLabel="Membership"
      lightSrc={breadcrumbBgLight}
      darkSrc={breadcrumbBgDark}
      heroClassName="membership-page-hero"
    />
  );
}
