import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { slug: string; size?: number };

export function ServiceIcon({ slug, size = 28, ...props }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  switch (slug) {
    case "logo-design-peshawar":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path
            d="M8.5 15V9h2.2a2.3 2.3 0 0 1 2.3 2.3v1.4A2.3 2.3 0 0 1 10.7 15H8.5Zm5.5 0V9h3"
            stroke="currentColor"
          />
          <path d="M14 12.2h2" stroke="currentColor" />
        </svg>
      );

    case "graphic-design-peshawar":
      return (
        <svg {...common}>
          <path
            d="M14.5 4.2 19.8 9.5 8.5 20.8H3.2v-5.3L14.5 4.2Z"
            stroke="currentColor"
          />
          <path d="m13 5.7 5.3 5.3" stroke="currentColor" />
          <path d="M3.2 20.8h17.6" stroke="currentColor" />
        </svg>
      );

    case "branding-agency-peshawar":
      return (
        <svg {...common}>
          <path
            d="M12 3a9 9 0 1 0 9 9c0-1.5-1.2-2.5-2.7-2.5h-1.6a1.7 1.7 0 0 1-1.7-2.4l.4-1.1A1.7 1.7 0 0 0 13.7 3H12Z"
            stroke="currentColor"
          />
          <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
          <circle cx="9.5" cy="7.5" r="1.2" fill="currentColor" />
          <circle cx="13.5" cy="7" r="1.2" fill="currentColor" />
          <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" />
        </svg>
      );

    case "printing-services-peshawar":
      return (
        <svg {...common}>
          <path d="M7 9V4h10v5" stroke="currentColor" />
          <rect x="3.5" y="9" width="17" height="8" rx="1.5" stroke="currentColor" />
          <rect x="7" y="14" width="10" height="6" rx="1" stroke="currentColor" />
          <circle cx="17.5" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );

    case "flex-printing-peshawar":
      return (
        <svg {...common}>
          <path d="M3 5h18" stroke="currentColor" />
          <path d="M3 19h18" stroke="currentColor" />
          <rect x="5" y="7.5" width="14" height="9" rx="1.2" stroke="currentColor" />
          <path d="M8 11h8M8 13.5h5" stroke="currentColor" />
        </svg>
      );

    case "signage-company-peshawar":
      return (
        <svg {...common}>
          <path d="M12 3v18" stroke="currentColor" />
          <rect x="4" y="5" width="13" height="6" rx="1" stroke="currentColor" />
          <rect x="7" y="13" width="13" height="6" rx="1" stroke="currentColor" />
        </svg>
      );

    case "acrylic-signage-peshawar":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="13" rx="1.5" stroke="currentColor" />
          <path d="M7.5 8.5h9M7.5 11.5h6" stroke="currentColor" />
          <path d="M9 17v3M15 17v3M7 20h10" stroke="currentColor" />
        </svg>
      );

    case "vehicle-branding-peshawar":
      return (
        <svg {...common}>
          <path
            d="M3.5 14.5V9.8a1 1 0 0 1 .7-1l3.7-1 2-3.2a1 1 0 0 1 .9-.5h4.6a1 1 0 0 1 .9.5l2 3.2 1.7.5a1 1 0 0 1 .8 1v4.7a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1.5Z"
            stroke="currentColor"
          />
          <circle cx="8" cy="16.5" r="1.8" stroke="currentColor" />
          <circle cx="16.5" cy="16.5" r="1.8" stroke="currentColor" />
        </svg>
      );

    case "social-media-marketing-peshawar":
      return (
        <svg {...common}>
          <path
            d="M12 20s-7-4.3-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.7 12 20 12 20Z"
            stroke="currentColor"
          />
          <path d="M9 11h2v3M13 11h2" stroke="currentColor" />
        </svg>
      );

    case "facebook-ads-agency-peshawar":
      return (
        <svg {...common}>
          <path
            d="M3 10.5v3a1 1 0 0 0 1 1h2.2L13 19V5L6.2 9.5H4a1 1 0 0 0-1 1Z"
            stroke="currentColor"
          />
          <path d="M16 9.5c1.5 1 1.5 4 0 5" stroke="currentColor" />
          <path d="M18.5 7c2.7 1.7 2.7 8.3 0 10" stroke="currentColor" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" />
        </svg>
      );
  }
}
