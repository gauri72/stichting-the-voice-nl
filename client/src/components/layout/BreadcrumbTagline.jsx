import "../../styles/breadcrumb-tagline.css";

export default function BreadcrumbTagline() {
  return (
    <p
      className="breadcrumb-tagline"
      aria-label="The vision of international cultural exchange in the Netherlands"
    >
      <span className="breadcrumb-tagline__line">
        The Vision Of <span className="breadcrumb-tagline__accent">International</span>
      </span>
      <span className="breadcrumb-tagline__line">
        Cultural <span className="breadcrumb-tagline__accent">Exchange In</span>
      </span>
      <span className="breadcrumb-tagline__line">
        The <span className="breadcrumb-tagline__accent">Netherlands</span>
      </span>
    </p>
  );
}
