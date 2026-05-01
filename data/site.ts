import type { SiteConfig } from "@/types";

const env = process.env;

export const siteConfig: SiteConfig = {
  name: "Design Hub",
  legalName: "Design Hub Peshawar",
  shortDescription:
    "Branding, printing, signage and digital marketing agency in Peshawar.",
  url: env.NEXT_PUBLIC_SITE_URL ?? "https://designhub.pk",
  phone: env.NEXT_PUBLIC_PHONE ?? "+923001234567",
  phoneDisplay: "+92 300 123 4567",
  whatsappNumber: env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567",
  email: env.NEXT_PUBLIC_EMAIL ?? "hello@designhub.pk",
  address: {
    street: "Office 12, University Road",
    locality: "Peshawar",
    region: "Khyber Pakhtunkhwa",
    postalCode: "25000",
    country: "PK",
  },
  geo: {
    latitude: 34.0151,
    longitude: 71.5249,
  },
  openingHours: [
    { days: "Mon–Sat", hours: "9:30 AM – 8:00 PM" },
    { days: "Sun", hours: "Closed" },
  ],
  social: {
    facebook: "https://facebook.com/designhubpeshawar",
    instagram: "https://instagram.com/designhubpeshawar",
    linkedin: "https://linkedin.com/company/designhub-peshawar",
  },
  founded: 2018,
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Shop" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const trustStats = [
  { value: "500+", label: "Projects delivered" },
  { value: "200+", label: "Happy clients" },
  { value: "7+", label: "Years in Peshawar" },
] as const;
