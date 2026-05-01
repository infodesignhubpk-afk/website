import type { PortfolioItem } from "@/types";

export const portfolio: PortfolioItem[] = [
  {
    slug: "qissa-khwani-cafe-identity",
    title: "Qissa Khwani Café — Brand Identity",
    category: "branding",
    client: "Qissa Khwani Café",
    image: "/portfolio/qissa-khwani.jpg",
    summary:
      "Heritage-led identity for a café in the old city, balancing storytelling with everyday legibility.",
    description:
      "Naming, wordmark, menu system, packaging and signage for a café that wanted a heritage feel without becoming a museum. The mark draws from old printing-press type without slipping into pastiche.",
    year: 2025,
  },
  {
    slug: "khyber-realty-launch",
    title: "Khyber Realty — Project Launch Identity",
    category: "branding",
    client: "Khyber Realty",
    image: "/portfolio/khyber-realty.jpg",
    summary: "Identity, hoardings, brochure and vehicle livery for a Hayatabad housing launch.",
    description:
      "Full launch package: master logo, project sub-brand, site hoardings, sales-office signage, brochure, walk-in floor plan board and director vehicle livery.",
    year: 2025,
  },
  {
    slug: "saddar-bites-menu-refresh",
    title: "Saddar Bites — Menu & Packaging",
    category: "printing",
    client: "Saddar Bites",
    image: "/portfolio/saddar-bites.jpg",
    summary: "Seasonal menu redesign and printed packaging for a fast-growing Saddar food brand.",
    year: 2024,
  },
  {
    slug: "north-academy-admissions-2025",
    title: "North Academy — Admissions Campaign",
    category: "social",
    client: "North Academy",
    image: "/portfolio/north-academy.jpg",
    summary: "Admissions creative pack, Meta ads and printed prospectus for an O/A-Level academy.",
    year: 2025,
  },
  {
    slug: "frontier-clinic-wayfinding",
    title: "Frontier Clinic — Wayfinding & Reception",
    category: "signage",
    client: "Frontier Clinic",
    image: "/portfolio/frontier-clinic.jpg",
    summary: "Acrylic wayfinding system, reception logo wall and patient information panels.",
    year: 2024,
  },
  {
    slug: "hayatabad-flex-campaign",
    title: "Hayatabad Property Expo — Hoardings",
    category: "printing",
    client: "Hayatabad Property Expo",
    image: "/portfolio/hayatabad-expo.jpg",
    summary: "Citywide flex hoarding campaign with installation across Ring Road and University Road.",
    year: 2024,
  },
  {
    slug: "kp-logistics-fleet-wrap",
    title: "KP Logistics — Fleet Wrap",
    category: "vehicle",
    client: "KP Logistics",
    image: "/portfolio/kp-logistics.jpg",
    summary: "Twelve-vehicle delivery fleet wrap in cast vinyl, completed in a single sprint.",
    year: 2025,
  },
  {
    slug: "amna-couture-monogram",
    title: "Amna Couture — Monogram & Hangtags",
    category: "logo",
    client: "Amna Couture",
    image: "/portfolio/amna-couture.jpg",
    summary: "Hand-drawn monogram, foiled hangtags, garment labels and branded packaging.",
    year: 2024,
  },
  {
    slug: "peshawar-pharma-pack",
    title: "Peshawar Pharma — Catalogue System",
    category: "printing",
    client: "Peshawar Pharma",
    image: "/portfolio/peshawar-pharma.jpg",
    summary: "Sixty-page product catalogue with consistent typography across SKU pages.",
    year: 2024,
  },
  {
    slug: "ringroad-motors-showroom",
    title: "Ring Road Motors — Showroom Signage",
    category: "signage",
    client: "Ring Road Motors",
    image: "/portfolio/ringroad-motors.jpg",
    summary: "Illuminated 3D letter facade, monolith and service-bay wayfinding system.",
    year: 2025,
  },
  {
    slug: "shams-restaurant-launch",
    title: "Shams Restaurant — Launch Identity",
    category: "branding",
    client: "Shams Restaurant",
    image: "/portfolio/shams-restaurant.jpg",
    summary: "Full launch package: mark, menu, signage, uniforms and Insta launch campaign.",
    year: 2025,
  },
  {
    slug: "uni-road-tutors-logo",
    title: "Uni Road Tutors — Logo & Stationery",
    category: "logo",
    client: "Uni Road Tutors",
    image: "/portfolio/uni-road-tutors.jpg",
    summary: "Friendly, modern academy mark with full stationery and prospectus rollout.",
    year: 2024,
  },
];

export function getPortfolioByCategory(category?: string) {
  if (!category || category === "all") return portfolio;
  return portfolio.filter((p) => p.category === category);
}

export function getPortfolioItem(slug: string) {
  return portfolio.find((p) => p.slug === slug);
}
