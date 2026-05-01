import type { Industry } from "@/types";

export const industries: Industry[] = [
  { name: "Retail & Boutiques", description: "Storefronts, hangtags, packaging and seasonal campaigns for shops along Saddar, University Road and Hayatabad." },
  { name: "Restaurants & Cafés", description: "Menus, signage, delivery boxes and Insta-ready food photography for Peshawar's growing food scene." },
  { name: "Real Estate", description: "Project boards, brochures, vehicle branding and lead-gen ads for builders and societies across KP." },
  { name: "Education", description: "Schools, academies and tuition centres — admissions campaigns, prospectuses, banners and uniforms branding." },
  { name: "Healthcare", description: "Clinics, hospitals and pharmacies — wayfinding signage, patient brochures, prescription pads and digital presence." },
  { name: "Automotive", description: "Showrooms and workshops — vehicle wraps, dealer signage, service-package flyers and offer banners." },
  { name: "Manufacturing & B2B", description: "Catalogues, trade-fair stalls, factory signage and corporate identity for industrial clients in Hayatabad and Industrial Estate." },
  { name: "Hospitality", description: "Hotels, guest houses and event venues — wayfinding, in-room collateral and branded uniforms." },
];

export const industryNames: string[] = industries.map((i) => i.name);
