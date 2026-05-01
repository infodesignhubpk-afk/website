export type ServiceCategory =
  | "logo"
  | "branding"
  | "signage"
  | "printing"
  | "vehicle"
  | "social";

export type ServiceFAQ = {
  question: string;
  answer: string;
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceBenefit = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  category: ServiceCategory;
  keyword: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    subheading: string;
    ctaText: string;
  };
  overview: string[];
  benefits: ServiceBenefit[];
  process: ServiceProcessStep[];
  useCases: string[];
  industries: string[];
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
};

export type PortfolioItem = {
  slug: string;
  title: string;
  category: ServiceCategory;
  client: string;
  image: string;
  summary: string;
  description?: string;
  year: number;
};

export type Testimonial = {
  name: string;
  business: string;
  role?: string;
  quote: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: ServiceCategory;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  image: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingMinutes: number;
  body: string[];
  image?: string;
};

export type Industry = {
  name: string;
  description: string;
};

export type SiteConfig = {
  name: string;
  legalName: string;
  shortDescription: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: { days: string; hours: string }[];
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  founded: number;
};
