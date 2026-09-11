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
}

export const FALLBACK_HERO: HeroSection = {
  id: "fallback",
  title: "A Private Archive of Historic Arms",
  subtitle:
    "Curated in the Montana atelier since 1998 — estate acquisitions, museum-grade conservation, and provenance you can trace to the hand that made it.",
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
    "Armorer Firearms began in 1998 as a single workbench in Bigfork, Montana, restoring family heirlooms for neighbors along Flathead Lake. Over the decades that bench grew into a private archive: a working atelier where historically significant arms are researched, conserved, and placed with collectors who understand what they hold.",
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

import remingtonImg from "@/assets/firearms/remington_870_wingmaster.jpg";
import sigImg from "@/assets/firearms/sig_sauer_p226.jpg";
import winchesterImg from "@/assets/firearms/winchester_1873.jpg";
import coltImg from "@/assets/firearms/colt_single_action_army.jpg";
import browningImg from "@/assets/firearms/browning_hi_power.jpg";

export const FALLBACK_FIREARMS: Firearm[] = [
  {
    id: "23vst4q1",
    name: "Remington Model 870 Wingmaster",
    maker: "Remington Arms",
    model: "870 Wingmaster",
    caliber: "12 Gauge",
    year: 1950,
    price: 1550,
    description:
      "Early production Wingmaster featuring high-gloss American walnut stock with custom checkering, vibra-honed action, and mirror-polished blued receiver. Bore mirror bright with clean modified choke.",
    history:
      "Acquired from a private estate in Missoula, Montana. Documented in original dealer ledger and preserved in a climate-controlled gun cabinet for over five decades.",
    condition: "Fine",
    category: "Shotguns",
    status: "Reserved",
    images: [remingtonImg],
    featured: true,
    serial: "S194XXXV",
  },
  {
    id: "2ip1yvuw",
    name: "Sig Sauer P226",
    maker: "Sig Sauer",
    model: "P226",
    caliber: "9mm Luger",
    year: 1986,
    price: 1550,
    description:
      "West German triple-matching serial proofed P226 with stamped carbon steel slide, internal extractor, and original stippled polymer grips. Superb double/single action trigger pull.",
    history:
      "Imported through Tyson's Corner, Virginia in 1986. Preserved in factory box with matching test target and period paperwork from original owner.",
    condition: "Fine",
    category: "Modern Sporting",
    status: "Available",
    images: [sigImg],
    featured: true,
    serial: "U142XXX",
  },
  {
    id: "f6t2atkw",
    name: "Winchester Model 1873",
    maker: "Winchester Repeating Arms",
    model: "Model 1873",
    caliber: ".44-40 Win",
    year: 1884,
    price: 1575,
    description:
      "Third Model rifle with full octagon 24-inch barrel, full magazine, and crescent steel buttplate. Retains smooth pewter patina with original untouched walnut stock and clean bore.",
    history:
      "Shipped to the Helena, Montana territory in October 1884. Preserved with Cody Firearms Museum archival certification sheet.",
    condition: "Fine",
    category: "Lever-Action Rifles",
    status: "Available",
    images: [winchesterImg],
    featured: true,
    serial: "174XXXA",
  },
  {
    id: "2hp63s9v",
    name: "Colt Single Action Army",
    maker: "Colt's Patent Firearms",
    model: "Single Action Army",
    caliber: ".45 Colt",
    year: 1880,
    price: 975,
    description:
      "First Generation Frontier Six-Shooter configuration with 4.75-inch barrel, two-line patent address, and smooth oil-finished walnut grips. Mechanically tight four-click action.",
    history:
      "Purchased through a Miles City, Montana outfitter in 1882. Accompanied by historical letter from Colt Archive Properties.",
    condition: "Very Good",
    category: "Revolvers",
    status: "Available",
    images: [coltImg],
    featured: true,
    serial: "62XXX",
  },
  {
    id: "v5zvn6dp",
    name: "Browning Hi-Power",
    maker: "Fabrique Nationale / Browning",
    model: "Hi-Power (P-35)",
    caliber: "9mm Luger",
    year: 1954,
    price: 1575,
    description:
      "Commercial FN production 'thumb-print' slide model with internal extractor, high-polish rust bluing, and checkered French walnut grips with brass medallion.",
    history:
      "Acquired from the personal collection of an arms historian in Bozeman, Montana. Includes period green canvas case and spare factory magazine.",
    condition: "Fine",
    category: "Pistols",
    status: "Available",
    images: [browningImg],
    featured: true,
    serial: "58XXX",
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
