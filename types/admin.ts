import type { ServiceCategory } from "@/types";

export type SiteSettings = {
  name: string;
  legalName: string;
  shortDescription: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  whatsappChannel: string;
  logoUrl: string;
  logoWhiteUrl: string;
  faviconUrl: string;
};

export type SeoSettings = {
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  gscVerification: string;
  gaId: string;
  twitterHandle: string;
  keywords: string[];
};

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingMinutes: number;
  body: string;
  image?: string;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  order: number;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: string;
  categoryIds: string[];
  images: string[];
  inStock: boolean;
  published: boolean;
  features: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};

export type OrderStatus = "new" | "in_progress" | "fulfilled" | "cancelled";

export type DeliveryMethod = "pickup" | "peshawar" | "courier";
export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash" | "easypaisa";

export type DeliveryAddress = {
  street: string;
  city: string;
  postalCode?: string;
  landmark?: string;
};

export type AdminClient = {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl?: string;
  order: number;
};

export type AdminPortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  client: string;
  image: string;
  summary: string;
  description?: string;
  year: number;
  published: boolean;
};

export type Order = {
  id: string;
  reference: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerBusiness?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: DeliveryAddress;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  source: string;
};
