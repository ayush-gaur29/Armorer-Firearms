import heroImg from "@/assets/hero-vault.jpg";
import placeholderImg from "@/assets/placeholder-firearm.jpg";

export const PLACEHOLDER_IMAGE = placeholderImg;

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  tagline?: string | undefined;
  imageUrl: string;
  logoUrl?: string | undefined;
  ctaPrimary?: string | undefined;
  ctaSecondary?: string | undefined;
  active?: boolean | undefined;
  displayOrder?: number | undefined;
}

export interface CollectionIntro {
  heading: string;
  text: string;
}

export interface AboutContent {
  heading: string;
  story: string;
  history: string;
  founded: string | number;
  location: string;
  philosophy?: string | undefined;
  standards?: string | undefined;
}

export interface ContactContent {
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  note?: string | undefined;
}

export interface Firearm {
  id: string;
  name: string;
  maker: string;
  model: string;
  caliber: string;
  year: number | string;
  price?: number | string | undefined;
  description: string;
  history?: string | undefined;
  condition: string;
  category: string;
  status?: string | undefined;
  images: string[];
  featured?: boolean | undefined;
  serial?: string | undefined;
  notes?: string | undefined;
}

export const FALLBACK_HERO: HeroSection = {
  id: "fallback",
  title: "A Private Archive of Historic Arms",
  subtitle:
    "Curated in the Montana armory since 1998 — estate acquisitions, museum-grade conservation, and provenance you can trace to the hand that made it.",
  tagline: "Armorer Firearms · Bigfork, Montana",
  imageUrl: heroImg,
  ctaPrimary: "Explore The Archive",
  ctaSecondary: "Private Acquisition Inquiry",
  active: true,
  displayOrder: 0,
};

export const FALLBACK_INTRO: CollectionIntro = {
  heading: "Curated Collection Highlights",
  text: "Each piece in the archive is examined, documented, and conserved in our Bigfork workshop before it is offered to collectors. What follows is a selection from the current catalog.",
};

export const FALLBACK_ABOUT: AboutContent = {
  heading: "About Armorer Firearms",
  founded: 1998,
  location: "Bigfork, Montana",
  story:
    "Armorer Firearms began in 1998 as a single workbench in Bigfork, Montana, restoring family heirlooms for neighbors along Flathead Lake. Over the decades that bench grew into a private archive: a working armory where historically significant arms are researched, conserved, and placed with collectors who understand what they hold.",
  history:
    "Our acquisitions come almost entirely from estates, private museums, and multi-generational family collections. We favor pieces with an unbroken paper trail — factory letters, regimental markings, period photographs — and we decline far more than we accept.",
  philosophy:
    "Conservation, not restoration. We stabilize, document, and protect. Original finish, original wood, and honest wear are the record of an object's life; we do not erase that record to make it prettier.",
  standards:
    "Every piece is inspected against factory records where they survive, measured, photographed under raking light, and assigned an accession number that follows it for as long as it remains in our archive.",
};

export const FALLBACK_CONTACT: ContactContent = {
  address: "119 Jewel Basin Ct",
  city: "Bigfork, Montana 59911",
  phone: "(406) 555-0142",
  email: "ArmorerFirearms@outlook.com",
  hours: "Monday – Friday, 9:00 AM – 5:00 PM MT · Appointments recommended for collection viewings",
  note: "All transfers are conducted in full compliance with federal and Montana state law through a licensed FFL.",
};


import Chiappa_1874 from "@/assets/firearms/Chiappa_1874.jpeg";
import Kimber_Model from "@/assets/firearms/Kimber_Model_84_Super.jpeg";
import Thompson_Model from "@/assets/firearms/Thompson_Model_1927_Chicago.jpeg";
import Winchester_1873 from "@/assets/firearms/winchester_1873.jpg";
import Browning_Hi_Power from "@/assets/firearms/browning_hi_power.jpg";

export const FALLBACK_FIREARMS: Firearm[] = [
  {
    id: "f6t2atkw",
    name: "Chiappa 1874 Sharps Sporting Rifle",
    maker: "Chiappa Firearms",
    model: "1874 Sharps Sporting",
    caliber: ".45-70 Government",
    year: 1874,
    price: 1895,
    description:
      "Precision Model 1874 Sharps falling block rifle with 34-inch full octagon blued barrel, color case-hardened receiver, double set triggers, and oil-finished walnut stock.",
    history:
      "Faithfully crafted after the historic Sharps Rifle Co. Hartford patterns of 1874. Preserved in archival case with complete inspection dossier from the Bigfork atelier.",
    condition: "Fine",
    category: "Rifle",
    status: "Available",
    images: [Chiappa_1874, Winchester_1873],
    featured: true,
    serial: "174XXXA",
  },
  {
    id: "2hp63s9v",
    name: "Kimber Model 84 Super America Rifle 6x47-1",
    maker: "Kimber of Oregon",
    model: "Model 84 Super America",
    caliber: "6x47 Rem",
    year: 1984,
    price: 2450,
    description:
      "Classic Kimber of Oregon Model 84 Super America rifle featuring select exhibition-grade Claro walnut stock with beaded cheekpiece, wrap-around 24 LPI hand checkering, ebony forend tip, and satin rust-blued barreled action.",
    history:
      "Original Clackamas, Oregon production. Preserved in private collector's climate-controlled vault with original factory proof target and inspection card.",
    condition: "Excellent",
    category: "Rifle",
    status: "Available",
    images: [Kimber_Model, Winchester_1873],
    featured: true,
    serial: "SA-084X",
  },
  {
    id: "v5zvn6dp",
    name: "Thompson Model 1927 A1 'Chicago Typewriter'",
    maker: "Auto-Ordnance",
    model: "Model 1927 A1 Deluxe",
    caliber: ".45 ACP",
    year: 1927,
    price: 2850,
    description:
      "Iconic Model 1927 A1 carbine featuring genuine American walnut furniture with vertical foregrip, finned 16.5-inch barrel with Cutts compensator, and authentic 50-round drum magazine.",
    history:
      "Documented tribute piece to the Roaring Twenties. Preserved in custom fitted hard travel case with commemorative manual and certificate.",
    condition: "Fine",
    category: "Rifle",
    status: "Available",
    images: [Thompson_Model, Browning_Hi_Power],
    featured: true,
    serial: "KU2812",
    notes: "Receiver roll-marked Model of 1927 A1, Serial KU2812. Complete with authentic drum magazine and presentation box.",
  },
];

export function accessionNo(id: string) {
  const clean = id.replace(/^af-?/i, "").toUpperCase();
  return `AF-${clean.slice(0, 8)}`;
}

export function formatPrice(price?: number | string) {
  if (price === undefined || price === null || price === "") return "Price on request";
  const n = typeof price === "string" ? Number(price.replace(/[^0-9.]/g, "")) : price;
  if (!Number.isFinite(n) || n <= 0) return String(price);
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
