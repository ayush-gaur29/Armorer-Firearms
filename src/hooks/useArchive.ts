import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import {
  accessionNo,
  FALLBACK_ABOUT,
  FALLBACK_CONTACT,
  FALLBACK_HERO,
  FALLBACK_INTRO,
  PLACEHOLDER_IMAGE,
  type AboutContent,
  type CollectionIntro,
  type ContactContent,
  type Firearm,
  type HeroSection,
} from "@/lib/fallbacks";

// Loose shape for raw Firestore documents; every field is optional/unknown.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface AnyDoc {
  id?: any;
  images?: any;
  image?: any;
  imageUrl?: any;
  photos?: any;
  photo?: any;
  name?: any;
  manufacturer?: any;
  maker?: any;
  model?: any;
  caliber?: any;
  circa?: any;
  year?: any;
  price?: any;
  description?: any;
  history?: any;
  provenance?: any;
  notes?: any;
  condition?: any;
  category?: any;
  status?: any;
  featured?: any;
  serial?: any;
  active?: any;
  title?: any;
  heading?: any;
  subtitle?: any;
  text?: any;
  backgroundImage?: any;
  logoUrl?: any;
  ctaPrimary?: any;
  ctaSecondary?: any;
  buttonText?: any;
  tagline?: any;
  displayOrder?: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function replaceAtelier(val: any): any {
  if (typeof val === "string") {
    return val
      .replace(/\bTHE ATELIER\b/g, "THE ARMORY")
      .replace(/\bThe Atelier\b/g, "The Armory")
      .replace(/\bATELIER\b/g, "ARMORY")
      .replace(/\bAtelier\b/g, "Armory")
      .replace(/\batelier\b/g, "armory");
  }
  if (Array.isArray(val)) {
    return val.map(replaceAtelier);
  }
  if (val && typeof val === "object") {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = replaceAtelier(v);
    }
    return res;
  }
  return val;
}

function normalizeFirearm(id: string, d: AnyDoc): Firearm {
  // Aggregate all remote images from Firestore document fields (images, photos, photoUrls, gallery, image, imageUrl, photo)
  const collected: string[] = [];
  const addCandidates = (val: any) => {
    if (!val) return;
    if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === "string" && item.trim().length > 0) {
          collected.push(item.trim());
        }
      }
    } else if (typeof val === "string" && val.trim().length > 0) {
      collected.push(val.trim());
    }
  };
  addCandidates(d.images);
  addCandidates(d.photos);
  addCandidates(d.photoUrls);
  addCandidates(d.gallery);
  addCandidates(d.image);
  addCandidates(d.imageUrl);
  addCandidates(d.photo);
  const remoteImages = Array.from(new Set(collected));

  const images = remoteImages.length > 0 ? remoteImages : [PLACEHOLDER_IMAGE];

  return {
    id: id || String(d.id ?? ""),
    name: replaceAtelier(String(d.name ?? "Untitled Piece")),
    maker: String(d.manufacturer ?? d.maker ?? ""),
    model: String(d.model ?? ""),
    caliber: String(d.caliber ?? ""),
    year: (d.circa as number | string) ?? (d.year as number | string) ?? "",
    price: (d.price as number | string | undefined),
    description: replaceAtelier(String(d.description ?? "")),
    history: replaceAtelier(d.history ? String(d.history) : d.provenance ? String(d.provenance) : ""),
    condition: String(d.condition ?? ""),
    category: String(d.category ?? "Uncategorized"),
    status: d.status ? String(d.status) : undefined,
    images,
    featured: Boolean(d.featured ?? false),
    serial: d.serial ? String(d.serial) : undefined,
    notes: d.notes ? String(d.notes) : undefined,
  };
}

export function useHero() {
  const [hero, setHero] = useState<HeroSection>(FALLBACK_HERO);
  useEffect(() => {
    let unsub = () => { };
    let cancelled = false;
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        const q = fs.query(fs.collection(db, "hero_sections"), fs.orderBy("displayOrder", "asc"));
        unsub = fs.onSnapshot(
          q,
          (snap) => {
            const docs = snap.docs.map((s) => ({ id: s.id, ...(s.data() as AnyDoc) }));
            const pick = (docs.find((x) => x.active !== false) ?? docs[0]) as AnyDoc | undefined;
            if (!pick) return;
            setHero({
              id: String(pick.id),
              title: replaceAtelier(String(pick.title ?? pick.heading ?? FALLBACK_HERO.title)),
              subtitle: replaceAtelier(String(pick.subtitle ?? pick.text ?? pick.description ?? FALLBACK_HERO.subtitle)),
              tagline: replaceAtelier(pick.tagline ? String(pick.tagline) : FALLBACK_HERO.tagline),
              imageUrl: String(pick.imageUrl ?? pick.image ?? pick.backgroundImage ?? FALLBACK_HERO.imageUrl),
              logoUrl: pick.logoUrl ? String(pick.logoUrl) : undefined,
              ctaPrimary: replaceAtelier(String(pick.ctaPrimary ?? pick.buttonText ?? FALLBACK_HERO.ctaPrimary)),
              ctaSecondary: replaceAtelier(String(pick.ctaSecondary ?? FALLBACK_HERO.ctaSecondary)),
            });
          },
          () => undefined,
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);
  return hero;
}

function useSiteDoc<T extends object>(docId: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);
  useEffect(() => {
    let unsub = () => { };
    let cancelled = false;
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.doc(db, "site_content", docId),
          (snap) => {
            if (snap.exists()) setData({ ...fallback, ...replaceAtelier(snap.data() as Partial<T>) });
          },
          () => undefined,
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);
  return data;
}

export const useCollectionIntro = () => useSiteDoc<CollectionIntro>("collection_intro", FALLBACK_INTRO);
export const useAboutContent = () => useSiteDoc<AboutContent>("about", FALLBACK_ABOUT);
export const useContactContent = () => useSiteDoc<ContactContent>("contact", FALLBACK_CONTACT);

export function useFirearms() {
  const [firearms, setFirearms] = useState<Firearm[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => { };
    let cancelled = false;

    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.collection(db, "firearms"),
          (snap) => {
            if (snap.empty) {
              setLoading(false);
              return;
            }
            const items = snap.docs.map((s) => normalizeFirearm(s.id, s.data() as AnyDoc));
            setFirearms(items);
            setLive(true);
            setLoading(false);
          },
          (err) => {
            console.error("Firestore firearms snapshot error:", err);
            setLoading(false);
          },
        );
      })
      .catch((err) => {
        console.error("Firestore connection error:", err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return { firearms, live, loading };
}

export function useFirearm(id: string) {
  const [firearm, setFirearm] = useState<Firearm | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => { };
    let cancelled = false;

    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.doc(db, "firearms", id),
          (snap) => {
            if (snap.exists()) {
              setFirearm(normalizeFirearm(snap.id, snap.data() as AnyDoc));
            } else {
              setFirearm(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Firestore firearm doc error:", err);
            setLoading(false);
          },
        );
      })
      .catch(() => setLoading(false));

    return () => {
      cancelled = true;
      unsub();
    };
  }, [id]);

  return { firearm, loading };
}

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string | undefined;
  firearmInterest?: string | undefined;
  firearmId?: string | undefined;
  message: string;
}

export async function submitInquiry(input: InquiryInput) {
  const [db, fs] = await Promise.all([getDb(), import("firebase/firestore")]);

  // Firestore rejects `undefined` field values — only include fields that are
  // actually defined so optional fields (firearmId, phone, firearmInterest)
  // don't cause a "Unsupported field value: undefined" error.
  const payload: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    message: input.message,
    status: "new",
    timestamp: fs.serverTimestamp(),
    createdAt: new Date().toISOString(),
  };
  if (input.phone) payload.phone = input.phone;
  if (input.firearmInterest) payload.firearmInterest = input.firearmInterest;
  if (input.firearmId) payload.firearmId = input.firearmId;

  await fs.addDoc(fs.collection(db, "inquirys"), payload);
}

