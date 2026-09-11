import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase";
import {
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

function normalizeFirearm(id: string, d: Record<string, unknown>): Firearm {
  const rawImages = d.images;
  const images = Array.isArray(rawImages)
    ? rawImages.filter((x): x is string => typeof x === "string" && x.length > 0)
    : typeof d.image === "string"
      ? [d.image]
      : [];
  return {
    id,
    name: String(d.name ?? "Untitled Piece"),
    maker: String(d.maker ?? ""),
    model: String(d.model ?? ""),
    caliber: String(d.caliber ?? ""),
    year: (d.year as number | string) ?? "",
    price: d.price as number | string | undefined,
    description: String(d.description ?? ""),
    history: d.history ? String(d.history) : undefined,
    condition: String(d.condition ?? ""),
    category: String(d.category ?? "Uncategorized"),
    status: d.status ? String(d.status) : undefined,
    images: images.length ? images : [PLACEHOLDER_IMAGE],
    featured: Boolean(d.featured),
    serial: d.serial ? String(d.serial) : undefined,
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
            const docs = snap.docs.map((s) => ({ id: s.id, ...(s.data() as Record<string, unknown>) }));
            const pick = (docs.find((x) => x.active !== false) ?? docs[0]) as Record<string, unknown> | undefined;
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
  const [firearms, setFirearms] = useState<Firearm[]>(FALLBACK_FIREARMS);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.collection(db, "firearms"),
          (snap) => {
            if (snap.empty) return;
            setFirearms(snap.docs.map((s) => normalizeFirearm(s.id, s.data() as Record<string, unknown>)));
            setLive(true);
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
  return { firearms, live };
}

export function useFirearm(id: string) {
  const [firearm, setFirearm] = useState<Firearm | null | undefined>(
    () => FALLBACK_FIREARMS.find((f) => f.id === id) ?? undefined,
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.doc(db, "firearms", id),
          (snap) => {
            if (snap.exists()) setFirearm(normalizeFirearm(snap.id, snap.data() as Record<string, unknown>));
            else setFirearm((prev) => prev ?? null);
            setLoading(false);
          },
          () => setLoading(false),
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
  phone?: string;
  firearmInterest?: string;
  firearmId?: string;
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
