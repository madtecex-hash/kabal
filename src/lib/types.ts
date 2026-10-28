export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  comparePrice: number | null;
  image: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  colors: string[];
  gallery: string[];
  bgColor: string;
  badge: string;
  rating: number;
  stock: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  sortOrder: number;
};

export type OrderItem = { id: number; name: string; price: number; qty: number; color?: string };

export type Order = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

export type Settings = {
  storeName: string;
  tagline: string;
  logoUrl: string;
  whatsappNumber: string;
  currencySymbol: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  announcement: string;
  announcementActive: boolean;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  heroCta: string;
  orderGreeting: string;
  orderFooter: string;
  whatsappFloatMessage: string;
  thankYouMessage: string;
  shippingCost: number;
  freeShippingFrom: number;
  paymentMethods: string;
  email: string;
  address: string;
  schedule: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  legalPrivacy: string;
  legalCookies: string;
  legalTerms: string;
  legalReturns: string;
};
