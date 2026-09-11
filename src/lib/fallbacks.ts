import heroImg from "@/assets/hero-vault.jpg";
import placeholderImg from "@/assets/placeholder-firearm.jpg";

export const PLACEHOLDER_IMAGE = placeholderImg;

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  tagline?: string;
  imageUrl: string;
  logoUrl?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  active?: boolean;
  displayOrder?: number;
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
  philosophy?: string;
  standards?: string;
}

export interface ContactContent {
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  note?: string;
}

export interface Firearm {
  id: string;
  name: string;
  maker: string;
  model: string;
  caliber: string;
  year: number | string;
  price?: number | string;
  description: string;
  history?: string;
  condition: string;
  category: string;
  status?: string;
  images: string[];
  featured?: boolean;
  serial?: string;
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
  heading: "An Atelier on the Shore of Flathead Lake",
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
  address: "Grand Avenue Atelier",
  city: "Bigfork, Montana 59911",
  phone: "(406) 555-0198",
  email: "archive@armorerfirearms.com",
  hours: "Private viewings by appointment · Tuesday through Saturday, 10am – 5pm MT",
  note: "All transfers are conducted in full compliance with federal and Montana state law through a licensed FFL.",
};

export const FALLBACK_FIREARMS: Firearm[] = [
  {
    id: "af-0001",
    name: "Winchester Model 1873 Deluxe Sporting Rifle",
    maker: "Winchester Repeating Arms",
    model: "1873 Deluxe",
    caliber: ".44-40 WCF",
    year: 1884,
    price: 18500,
    description:
      "A factory-engraved third model with checkered XXX walnut, pistol grip, and half-octagon barrel. Retains 70% original blue with vivid case colors on the lever.",
    history:
      "Shipped from New Haven in March 1884 to a Helena, Montana hardware concern per the Cody Firearms Museum letter. Descended through a single ranching family in the Gallatin Valley until 2019.",
    condition: "Fine",
    category: "Lever Action",
    status: "Available",
    images: [placeholderImg],
    featured: true,
    serial: "142XXX",
  },
  {
    id: "af-0002",
    name: "Colt Single Action Army, Cavalry Model",
    maker: "Colt's Patent Firearms",
    model: "Single Action Army",
    caliber: ".45 Colt",
    year: 1880,
    price: 32000,
    description:
      "US-marked Cavalry model with matching numbers, DFC sub-inspector cartouche, and untouched patina. Bore bright with strong rifling.",
    history:
      "Issued to the 2nd Cavalry, later altered to Artillery configuration and returned to original at the Springfield Armory. Accompanied by Colt archive letter.",
    condition: "Very Good",
    category: "Revolver",
    status: "Available",
    images: [placeholderImg],
    featured: true,
    serial: "58XXX",
  },
  {
    id: "af-0003",
    name: "Mauser C96 'Broomhandle' Pre-War Commercial",
    maker: "Waffenfabrik Mauser",
    model: "C96",
    caliber: "7.63×25mm Mauser",
    year: 1912,
    price: 6800,
    description:
      "Large ring hammer, matching wooden shoulder-stock holster, and crisp Oberndorf markings. Original straw colors on small parts.",
    history: "Sold through Von Lengerke & Detmold, New York, and used by a Montana geologist on Alaskan survey expeditions.",
    condition: "Excellent",
    category: "Pistol",
    status: "Available",
    images: [placeholderImg],
    featured: true,
    serial: "196XXX",
  },
  {
    id: "af-0004",
    name: "Sharps Model 1874 Sporting Rifle",
    maker: "Sharps Rifle Manufacturing Co.",
    model: "1874 Sporting",
    caliber: ".45-70 Government",
    year: 1876,
    price: 24000,
    description: "Heavy 30-inch octagon barrel, double set triggers, and vernier tang sight. A true buffalo-era rifle.",
    history: "Purchased by a Fort Benton outfitter in 1876; consistent with period ledgers held in the Montana Historical Society.",
    condition: "Good",
    category: "Single Shot",
    status: "Available",
    images: [placeholderImg],
    featured: true,
    serial: "C,54XXX",
  },
  {
    id: "af-0005",
    name: "Parker Brothers DHE Grade Side-by-Side",
    maker: "Parker Brothers",
    model: "DHE",
    caliber: "12 Gauge",
    year: 1922,
    price: 14500,
    description: "Titanic steel barrels, ejectors, and 90% case colors under decades of careful storage. Straight-grip English stock.",
    condition: "Excellent",
    category: "Shotgun",
    status: "Available",
    images: [placeholderImg],
    featured: false,
    serial: "204XXX",
  },
  {
    id: "af-0006",
    name: "Springfield M1903 Mark I",
    maker: "Springfield Armory",
    model: "M1903 Mk I",
    caliber: ".30-06 Springfield",
    year: 1919,
    price: 4200,
    description: "Pedersen Device cutout, correct Mk I sear and cutoff, and an unusually crisp SA/SPG cartouche.",
    condition: "Very Good",
    category: "Bolt Action",
    status: "Available",
    images: [placeholderImg],
    featured: false,
    serial: "1,08X,XXX",
  },
  {
    id: "af-0007",
    name: "Luger P.08 DWM 1917 Artillery",
    maker: "Deutsche Waffen- und Munitionsfabriken",
    model: "LP.08 Artillery",
    caliber: "9×19mm Parabellum",
    year: 1917,
    price: 9800,
    description: "Eight-inch barrel with adjustable tangent sight, matching magazine, and board stock. All matching numbers.",
    condition: "Fine",
    category: "Pistol",
    status: "Sold",
    images: [placeholderImg],
    featured: false,
    serial: "72XX",
  },
  {
    id: "af-0008",
    name: "Henry Rifle, New Haven Arms Co.",
    maker: "New Haven Arms Company",
    model: "Henry",
    caliber: ".44 Henry Rimfire",
    year: 1863,
    price: 68000,
    description: "Late production brass-frame Henry with sling swivels and a beautifully aged brass frame. Original walnut with military inspector's stamp.",
    history: "Carried by a Union volunteer in the 1st D.C. Cavalry; documented in the regimental armory register.",
    condition: "Good",
    category: "Lever Action",
    status: "On Hold",
    images: [placeholderImg],
    featured: true,
    serial: "9XXX",
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
