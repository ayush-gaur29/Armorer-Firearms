import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import {
  accessionNo,
  FALLBACK_ABOUT,
  FALLBACK_CONTACT,
  FALLBACK_FIREARMS,
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
  name?: any;
  maker?: any;
  model?: any;
  caliber?: any;
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
  imageUrl?: any;
  backgroundImage?: any;
  logoUrl?: any;
  ctaPrimary?: any;
  ctaSecondary?: any;
  buttonText?: any;
  tagline?: any;
  displayOrder?: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function normalizeFirearm(id: string, d: AnyDoc): Firearm {
  const localMatch = FALLBACK_FIREARMS.find(
    (f) =>
      f.id === id ||
      accessionNo(f.id) === accessionNo(id) ||
      f.name.toLowerCase().includes(String(d.name ?? "").toLowerCase()) ||
      String(d.name ?? "").toLowerCase().includes(f.name.toLowerCase()),
  );

  // Authoritative images: The newly configured museum photography from localMatch
  // takes strict precedence over stale remote Firestore image URLs.
  // This completely eliminates the 1-second image blink/swap when Firestore data resolves.
  const rawImages = d.images;
  const remoteImages = Array.isArray(rawImages)
    ? rawImages.filter((x): x is string => typeof x === "string" && x.length > 0)
    : typeof d.image === "string"
      ? [d.image]
      : [];

  const authoritativeImages =
    localMatch?.images && localMatch.images.length > 0
      ? localMatch.images
      : remoteImages.length > 0
        ? remoteImages
        : [PLACEHOLDER_IMAGE];

  return {
    id,
    name: String(d.name ?? localMatch?.name ?? "Untitled Piece"),
    maker: String(d.maker ?? localMatch?.maker ?? ""),
    model: String(d.model ?? localMatch?.model ?? ""),
    caliber: String(d.caliber ?? localMatch?.caliber ?? ""),
    year: (d.year as number | string) ?? localMatch?.year ?? "",
    price: (d.price as number | string | undefined) ?? localMatch?.price,
    description: String(d.description ?? localMatch?.description ?? ""),
    history: d.history ? String(d.history) : d.provenance ? String(d.provenance) : localMatch?.history,
    condition: String(d.condition ?? localMatch?.condition ?? ""),
    category: String(d.category ?? localMatch?.category ?? "Uncategorized"),
    status: d.status ? String(d.status) : localMatch?.status,
    images: authoritativeImages,
    featured: Boolean(d.featured ?? localMatch?.featured),
    serial: d.serial ? String(d.serial) : localMatch?.serial,
    notes: d.notes ? String(d.notes) : localMatch?.notes,
  };
}

export function useHero() {
  const [hero, setHero] = useState<HeroSection>(FALLBACK_HERO);
  useEffect(() => {
    let unsub = () => {};
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
              title: String(pick.title ?? pick.heading ?? FALLBACK_HERO.title),
              subtitle: String(pick.subtitle ?? pick.text ?? pick.description ?? FALLBACK_HERO.subtitle),
              tagline: pick.tagline ? String(pick.tagline) : FALLBACK_HERO.tagline,
              imageUrl: String(pick.imageUrl ?? pick.image ?? pick.backgroundImage ?? FALLBACK_HERO.imageUrl),
              logoUrl: pick.logoUrl ? String(pick.logoUrl) : undefined,
              ctaPrimary: String(pick.ctaPrimary ?? pick.buttonText ?? FALLBACK_HERO.ctaPrimary),
              ctaSecondary: String(pick.ctaSecondary ?? FALLBACK_HERO.ctaSecondary),
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
    let unsub = () => {};
    let cancelled = false;
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.doc(db, "site_content", docId),
          (snap) => {
            if (snap.exists()) setData({ ...fallback, ...(snap.data() as Partial<T>) });
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
  return { firearms: FALLBACK_FIREARMS, live: false };
}

export function useFirearm(id: string) {
  const [firearm, setFirearm] = useState<Firearm | null | undefined>(
    () => FALLBACK_FIREARMS.find((f) => f.id === id || accessionNo(f.id) === accessionNo(id)) ?? undefined,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const item = FALLBACK_FIREARMS.find((f) => f.id === id || accessionNo(f.id) === accessionNo(id));
    setFirearm(item ?? null);
    setLoading(false);
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
  await fs.addDoc(fs.collection(db, "inquiries"), {
    ...input,
    status: "new",
    timestamp: fs.serverTimestamp(),
    createdAt: new Date().toISOString(),
  });
}
