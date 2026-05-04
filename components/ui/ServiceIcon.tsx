import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { slug: string; size?: number };

export function ServiceIcon({ slug, size = 32, ...props }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none" as const,
    "aria-hidden": true,
    ...props,
  };

  switch (slug) {
    case "logo-design-peshawar":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16" cy="16" r="9" fill="currentColor" fillOpacity="0.08" />
          <path
            d="M11 21V11h3.4a2.6 2.6 0 0 1 2.6 2.6v1.8a2.6 2.6 0 0 1-2.6 2.6H11"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M19 21v-7l3 3.5L25 14v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="9.5" r="1.4" fill="var(--color-brand)" />
        </svg>
      );

    case "graphic-design-peshawar":
      return (
        <svg {...common}>
          <path
            d="M19 5.5 26.5 13 13.5 26H6v-7.5L19 5.5Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="m17 7.5 7.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 26h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="22.5" cy="9.5" r="2" fill="var(--color-brand)" />
        </svg>
      );

    case "branding-agency-peshawar":
      return (
        <svg {...common}>
          <path
            d="M16 4a12 12 0 1 0 12 12c0-2-1.6-3.4-3.6-3.4h-2.2a2.3 2.3 0 0 1-2.3-3.2l.5-1.4A2.3 2.3 0 0 0 18.3 4H16Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="14" r="1.6" fill="currentColor" />
          <circle cx="12" cy="9.5" r="1.6" fill="var(--color-brand)" />
          <circle cx="17.5" cy="8.5" r="1.6" fill="currentColor" />
          <circle cx="21.5" cy="19" r="1.6" fill="var(--color-cta)" />
        </svg>
      );

    case "printing-services-peshawar":
      return (
        <svg {...common}>
          <path d="M9 12V5h14v7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="4.5" y="12" width="23" height="11" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.6" />
          <rect x="9" y="18" width="14" height="9" rx="1.5" fill="white" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11.5 21h7M11.5 23.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="23.5" cy="15.5" r="1.2" fill="var(--color-brand)" />
        </svg>
      );

    case "flex-printing-peshawar":
      return (
        <svg {...common}>
          <path d="M3 6h26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3 26h26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="6" y="9" width="20" height="14" rx="1.6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 14h12M10 17.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="22" cy="19.5" r="1.6" fill="var(--color-cta)" />
        </svg>
      );

    case "signage-company-peshawar":
      return (
        <svg {...common}>
          <path d="M16 4v24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="5" y="6" width="17" height="8" rx="1.6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.6" />
          <rect x="9" y="17" width="17" height="8" rx="1.6" fill="white" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="10" r="1.4" fill="var(--color-brand)" />
          <circle cx="22" cy="21" r="1.4" fill="var(--color-cta)" />
        </svg>
      );

    case "acrylic-signage-peshawar":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="24" height="17" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.6" />
          <rect x="7" y="8" width="18" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
          <path d="M11 13.5h10M11 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M11 22v4M21 22v4M9 27h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="23" cy="11" r="1.4" fill="var(--color-brand)" />
        </svg>
      );

    case "vehicle-branding-peshawar":
      return (
        <svg {...common}>
          <path
            d="M4 19V13a1.4 1.4 0 0 1 1-1.4l5-1.4 2.7-4.3a1.4 1.4 0 0 1 1.2-.7h6.2a1.4 1.4 0 0 1 1.2.7l2.7 4.3 2.3.7a1.4 1.4 0 0 1 1 1.4V19a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 19Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M11 7.5h10l1.5 4H10L11 7.5Z" fill="var(--color-brand)" fillOpacity="0.5" />
          <circle cx="10.5" cy="22" r="2.6" fill="white" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="21.5" cy="22" r="2.6" fill="white" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="10.5" cy="22" r="1" fill="currentColor" />
          <circle cx="21.5" cy="22" r="1" fill="currentColor" />
        </svg>
      );

    case "social-media-marketing-peshawar":
      return (
        <svg {...common}>
          <path
            d="M16 27S5 21 5 13.5A6 6 0 0 1 16 9a6 6 0 0 1 11 4.5C27 21 16 27 16 27Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="m11 14 1.5 1.5L17 11" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="11" r="1.5" fill="var(--color-cta)" />
        </svg>
      );

    case "facebook-ads-agency-peshawar":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          {...props}
        >
          <defs>
            <linearGradient id="meta-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0081FB" />
              <stop offset="50%" stopColor="#0064E1" />
              <stop offset="100%" stopColor="#0046D6" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            fill="url(#meta-grad)"
            d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"
          />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="m11 16 3.5 3.5L21 13"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
