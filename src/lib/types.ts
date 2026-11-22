// ---------------------------------------------------------------------------
// Types partagés entre le schéma Drizzle, les pages publiques et l'admin.
// Tout le contenu du site vit en base : une modification dans /admin est
// répercutée immédiatement sur le site public (rendu dynamique + revalidate).
// ---------------------------------------------------------------------------

export interface Slot {
  label: string;
  from: string; // "9h00"
  to: string; // "12h00"
}

export interface DayHours {
  day: string; // "Lundi" … "Dimanche"
  closed: boolean;
  rdvOnly: boolean; // ex : sur rendez-vous uniquement
  slots: Slot[];
  note: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteColors {
  brand: string;
  brandDeep: string;
  accent: string;
  page: string;
}

export interface SettingsData {
  siteName: string;
  personName: string; // "Marc"
  personFullName: string; // "Marc"
  initials: string; // "M"
  role: string; // "Encadrant technique d'insertion · Recycl'Aide"
  tagline: string; // "Collecte · Reconditionnement · Prix solidaire"
  location: string; // "Lachapelle-aux-Pots (Oise)"
  heroLead: string;
  logo: string;
  heroImage: string;
  heroAlt: string;
  statusMode: "auto" | "open" | "closed";
  statusOverride: string;
  email: string;
  phone: string;
  phoneHref: string;
  mobile: string;
  mobileHref: string;
  addressLines: string[];
  city: string;
  externalUrl: string;
  externalLabel: string;
  googleUrl: string;
  googleRating: string;
  googleReviewsCount: string;
  hours: DayHours[];
  ticker: string[];
  nav: NavItem[];
  colors: SiteColors;
  seo: { title: string; description: string };
  footerNote: string;
}

export type PageBlock =
  | { kind: "text"; title: string; paragraphs: string[] }
  | { kind: "list"; title: string; items: string[] }
  | {
      kind: "cards";
      title: string;
      intro: string;
      cards: { title: string; text: string; bullets: string[]; ctaLabel: string; ctaHref: string }[];
    }
  | { kind: "notice"; title: string; text: string }
  | { kind: "stats"; items: { value: string; label: string }[] }
  | {
      kind: "cta";
      title: string;
      text: string;
      primaryLabel: string;
      primaryHref: string;
      ghostLabel: string;
      ghostHref: string;
    }
  | { kind: "hours"; title: string }
  | { kind: "reviews"; title: string }
  | { kind: "topics"; title: string; intro: string }
  | { kind: "contact-cards"; title: string; intro: string }
  | { kind: "gallery"; title: string; intro: string }
  | { kind: "enterprises"; title: string; intro: string }
  | { kind: "form"; title: string; intro: string }
  | { kind: "raw"; html: string };

export interface PageRow {
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  blocks: PageBlock[];
}

export interface MissionCta {
  label: string;
  href: string;
  variant: "primary" | "ghost";
}

export interface MissionData {
  lead: string;
  ctas: MissionCta[];
  stats: { value: string; label: string }[];
  features: { icon: string; title: string; text: string }[];
  steps: { title: string; text: string }[];
  warning: { title: string; text: string };
  outro: { title: string; text: string };
}

export interface Mission {
  id: number;
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  published: boolean;
  order: number;
  data: MissionData;
}

export interface Photo {
  id: number;
  src: string;
  alt: string;
  caption: string;
  order: number;
}

export interface Album {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  photos: Photo[];
}

export interface EnterpriseData {
  id: number;
  name: string;
  tagline: string;
  location: string;
  photo: string;
  photoContain: boolean;
  logos: string[];
  highlight: boolean;
  order: number;
}

export interface ReviewData {
  id: number;
  author: string;
  meta: string;
  rating: number;
  dateText: string;
  text: string;
  visited: string;
  photosCount: number;
  isNew: boolean;
  color: string;
  order: number;
}

export interface TopicData {
  id: number;
  icon: string;
  title: string;
  kicker: string;
  heading: string;
  intro: string;
  steps: string[];
  warningTitle: string;
  warningText: string;
  ctaLabel: string;
  ctaHref: string;
  ctaNote: string;
  mailtoSubject: string;
  order: number;
}

export interface ContactCardData {
  id: number;
  label: string;
  person: string;
  description: string;
  email: string;
  phone: string;
  order: number;
}

export interface MessageData {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Employee {
  id: number;
  ref: string;
  nom: string;
  prenom: string;
  poste: string;
  validUntil: string; // "31/12/2026"
  photo: string; // URL ou "" (avatar à initiales)
  order: number;
}

export interface MediaItem {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface AdminContent {
  settings: SettingsData;
  pages: PageRow[];
  missions: Mission[];
  albums: Album[];
  enterprises: EnterpriseData[];
  reviews: ReviewData[];
  topics: TopicData[];
  contacts: ContactCardData[];
  messages: MessageData[];
  media: MediaItem[];
  employees: Employee[];
}

export interface SiteBundle {
  settings: SettingsData;
  pages: Record<string, PageRow>;
  missions: Mission[];
  albums: Album[];
  enterprises: EnterpriseData[];
  reviews: ReviewData[];
  topics: TopicData[];
  contacts: ContactCardData[];
}
