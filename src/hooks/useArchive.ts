import { useEffect, useMemo, useState } from "react";
import { getDb } from "@/lib/firebase";
import {
  accessionNo,
  FALLBACK_CONTACT,
  FALLBACK_INTRO,
  PLACEHOLDER_IMAGE,
  type AboutContent,
  type CollectionIntro,
  type ContactContent,
  type Firearm,
  type HeroSection,
  type TransferDeliveryMethod,
} from "@/lib/fallbacks";

export type { TransferDeliveryMethod };

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
  buttonLink?: any;
  backgroundImageUrl?: any;
  brandTitle?: any;
  brandSubtitle?: any;
  armoryTitle?: any;
  armorySubtitle?: any;
  collectionFocusTitle?: any;
  collectionFocusSubtitle?: any;
  location?: any;
  tagline?: any;
  displayOrder?: any;
  shippingHandling?: any;
  shipping?: any;
  tax?: any;
  miscFees?: any;
  misc?: any;
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
    category: typeof d.category === "string" ? d.category.trim() : d.category ? String(d.category).trim() : "",
    status: d.status ? String(d.status) : undefined,
    images,
    featured: Boolean(d.featured ?? false),
    serial: d.serial ? String(d.serial) : undefined,
    notes: d.notes ? String(d.notes) : undefined,
    shippingHandling: (d.shippingHandling as number | string | undefined) ?? (d.shipping as number | string | undefined) ?? 0,
    tax: (d.tax as number | string | undefined) ?? 0,
    miscFees: (d.miscFees as number | string | undefined) ?? (d.misc as number | string | undefined) ?? 0,
  };
}

let cachedHero: HeroSection | null = null;
const heroSubscribers = new Set<(hero: HeroSection) => void>();
let heroSubscriptionStarted = false;

function ensureHeroSubscription() {
  if (heroSubscriptionStarted) return;
  heroSubscriptionStarted = true;

  Promise.all([getDb(), import("firebase/firestore")])
    .then(([db, fs]) => {
      const q = fs.query(fs.collection(db, "hero_sections"), fs.orderBy("displayOrder", "asc"));
      fs.onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            cachedHero = { id: "", loading: false };
            heroSubscribers.forEach((fn) => fn(cachedHero!));
            return;
          }
          const docs = snap.docs.map((s) => ({ id: s.id, ...(s.data() as AnyDoc) }));
          const pick = (docs.find((x) => x.status === "active" || x.active !== false) ?? docs[0]) as AnyDoc | undefined;
          if (!pick) {
            cachedHero = { id: "", loading: false };
            heroSubscribers.forEach((fn) => fn(cachedHero!));
            return;
          }

          const brandTitle = pick.brandTitle ? replaceAtelier(String(pick.brandTitle)) : undefined;
          const brandSubtitle = pick.brandSubtitle ? replaceAtelier(String(pick.brandSubtitle)) : undefined;
          const armoryTitle = pick.armoryTitle ? replaceAtelier(String(pick.armoryTitle)) : undefined;
          const armorySubtitle = pick.armorySubtitle ? replaceAtelier(String(pick.armorySubtitle)) : undefined;
          const collectionFocusTitle = pick.collectionFocusTitle ? replaceAtelier(String(pick.collectionFocusTitle)) : undefined;
          const collectionFocusSubtitle = pick.collectionFocusSubtitle ? replaceAtelier(String(pick.collectionFocusSubtitle)) : undefined;
          const buttonText = pick.buttonText ? replaceAtelier(String(pick.buttonText)) : undefined;
          const buttonLink = pick.buttonLink ? String(pick.buttonLink) : undefined;
          const backgroundImageUrl = (pick.backgroundImageUrl ?? pick.imageUrl ?? pick.image ?? pick.backgroundImage)
            ? String(pick.backgroundImageUrl ?? pick.imageUrl ?? pick.image ?? pick.backgroundImage)
            : undefined;
          const logoUrl = pick.logoUrl ? String(pick.logoUrl) : undefined;
          const location = pick.location ? replaceAtelier(String(pick.location)) : undefined;
          const status = pick.status ? String(pick.status) : undefined;
          const displayOrder = typeof pick.displayOrder === "number" ? pick.displayOrder : undefined;

          cachedHero = {
            id: String(pick.id),
            brandTitle,
            brandSubtitle,
            armoryTitle,
            armorySubtitle,
            collectionFocusTitle,
            collectionFocusSubtitle,
            buttonText,
            buttonLink,
            backgroundImageUrl,
            logoUrl,
            location,
            status,
            displayOrder,
            // Backward compatibility aliases
            title: brandTitle ?? (pick.title ? replaceAtelier(String(pick.title)) : undefined),
            subtitle: brandSubtitle ?? (pick.subtitle ? replaceAtelier(String(pick.subtitle)) : undefined),
            tagline: pick.tagline ? replaceAtelier(String(pick.tagline)) : undefined,
            imageUrl: backgroundImageUrl,
            ctaPrimary: buttonText ?? (pick.ctaPrimary ? replaceAtelier(String(pick.ctaPrimary)) : undefined),
            ctaSecondary: pick.ctaSecondary ? replaceAtelier(String(pick.ctaSecondary)) : undefined,
            active: pick.status ? pick.status === "active" : pick.active !== false,
            loading: false,
          };
          heroSubscribers.forEach((fn) => fn(cachedHero!));
        },
        (err) => {
          console.error("Firestore hero_sections snapshot error:", err);
          if (cachedHero) {
            cachedHero = { ...cachedHero, loading: false };
            heroSubscribers.forEach((fn) => fn(cachedHero!));
          }
        },
      );
    })
    .catch((err) => {
      console.error("Firestore connection error for hero:", err);
      heroSubscriptionStarted = false;
      if (cachedHero) {
        cachedHero = { ...cachedHero, loading: false };
        heroSubscribers.forEach((fn) => fn(cachedHero!));
      }
    });
}

export function useHero() {
  const [hero, setHero] = useState<HeroSection>(() => cachedHero ?? {
    id: "",
    loading: true,
  });

  useEffect(() => {
    heroSubscribers.add(setHero);
    if (cachedHero) {
      setHero(cachedHero);
    }
    ensureHeroSubscription();
    return () => {
      heroSubscribers.delete(setHero);
    };
  }, []);

  return hero;
}

export function useWebsiteLogo(): { logoUrl: string | undefined; loading: boolean } {
  const hero = useHero();
  return { logoUrl: hero.logoUrl, loading: hero.loading ?? false };
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

export function useAboutContent(): AboutContent {
  const [about, setAbout] = useState<AboutContent>({
    heading: "",
    story: "",
    imageUrl: "",
    location: "",
    founded: "",
    loading: true,
  });

  useEffect(() => {
    let unsub = () => { };
    let cancelled = false;
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.doc(db, "site_content", "about"),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data() as Record<string, any>;
              setAbout({
                heading: replaceAtelier(String(data.heading ?? data.title ?? "")),
                title: replaceAtelier(String(data.title ?? data.heading ?? "")),
                story: replaceAtelier(String(data.story ?? data.description ?? "")),
                description: replaceAtelier(String(data.description ?? data.story ?? "")),
                imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
                location: replaceAtelier(String(data.location ?? data.locationText ?? "")),
                locationText: replaceAtelier(String(data.locationText ?? data.location ?? "")),
                founded: String(data.year ?? data.sinceText ?? ""),
                year: String(data.year ?? data.sinceText ?? ""),
                sinceText: String(data.sinceText ?? data.year ?? ""),
                deleted: Boolean(data.deleted),
                loading: false,
              });
            } else {
              setAbout((prev) => ({ ...prev, loading: false }));
            }
          },
          (err) => {
            console.error("Firestore about snapshot error:", err);
            setAbout((prev) => ({ ...prev, loading: false }));
          },
        );
      })
      .catch((err) => {
        console.error("Firestore connection error for about:", err);
        setAbout((prev) => ({ ...prev, loading: false }));
      });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return about;
}

export const useContactContent = () => useSiteDoc<ContactContent>("contact", FALLBACK_CONTACT);

export function useTransferDeliveryMethods() {
  const [methods, setMethods] = useState<TransferDeliveryMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => { };
    let cancelled = false;

    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.doc(db, "site_content", "transfer_delivery"),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              let rawList: any[] = [];
              if (Array.isArray(data.methods)) {
                rawList = data.methods;
              } else if (data.methods && typeof data.methods === "object") {
                rawList = Object.values(data.methods);
              } else if (Array.isArray(data)) {
                rawList = data;
              }

              const activeMethods: TransferDeliveryMethod[] = rawList
                .filter((m: any) => m && typeof m === "object" && String(m.status ?? "active").toLowerCase() === "active")
                .map((m: any, idx: number) => ({
                  id: String(m.id ?? `method-${idx}`),
                  title: String(m.title ?? "").trim(),
                  description: String(m.description ?? "").trim(),
                  order: typeof m.order === "number" ? m.order : idx + 1,
                  status: String(m.status ?? "active"),
                  createdAt: m.createdAt,
                  updatedAt: m.updatedAt,
                }))
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

              setMethods(activeMethods);
            } else {
              setMethods([]);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Firestore transfer_delivery snapshot error:", err);
            setLoading(false);
          },
        );
      })
      .catch((err) => {
        console.error("Firestore connection error for transfer_delivery:", err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return { methods, loading };
}

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

/**
 * Dynamically extracts unique, valid firearm category names directly from Firestore records.
 * - Deduplicates category values
 * - Ignores empty, null, undefined, or whitespace-only values
 * - Preserves Firestore capitalization
 * - Sorts categories alphabetically
 */
export function extractCategories(firearms: Firearm[]): string[] {
  const categoryMap = new Map<string, string>();
  for (const f of firearms) {
    if (typeof f.category === "string") {
      const trimmed = f.category.trim();
      if (trimmed && trimmed.toLowerCase() !== "uncategorized") {
        const key = trimmed.toLowerCase();
        if (!categoryMap.has(key)) {
          categoryMap.set(key, trimmed);
        }
      }
    }
  }
  return Array.from(categoryMap.values()).sort((a, b) => a.localeCompare(b));
}

export interface CategoryDoc {
  id: string;
  name: string;
  order?: number | undefined;
}

/**
 * Hook to fetch firearm categories directly from the Firestore `categories` collection.
 * - Single source of truth for categories
 * - Reads `name` from each document
 * - Preserves existing Firestore ordering (or explicit order/sortOrder/displayOrder if defined)
 * - Returns both string category names and full category document metadata
 */
export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryDocs, setCategoryDocs] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;

    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        unsub = fs.onSnapshot(
          fs.collection(db, "categories"),
          (snap) => {
            if (snap.empty) {
              setCategoryDocs([]);
              setCategories([]);
              setLoading(false);
              return;
            }

            const docsList: CategoryDoc[] = [];
            snap.docs.forEach((docSnap) => {
              const data = docSnap.data() as AnyDoc;
              const rawName = data.name ?? data.title;
              if (typeof rawName === "string") {
                const trimmed = rawName.trim();
                if (trimmed.length > 0) {
                  docsList.push({
                    id: docSnap.id,
                    name: trimmed,
                    order:
                      typeof (data.order ?? data.sortOrder ?? data.displayOrder) === "number"
                        ? (data.order ?? data.sortOrder ?? data.displayOrder)
                        : undefined,
                  });
                }
              }
            });

            // Preserve Firestore category order if an ordering field exists
            const hasOrder = docsList.some((d) => typeof d.order === "number");
            if (hasOrder) {
              docsList.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
            }

            setCategoryDocs(docsList);
            setCategories(docsList.map((d) => d.name));
            setLoading(false);
          },
          (err) => {
            console.error("Firestore categories snapshot error:", err);
            setLoading(false);
          },
        );
      })
      .catch((err) => {
        console.error("Firestore categories connection error:", err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return { categories, categoryDocs, loading };
}

export function useFirearmCategories() {
  const { firearms, loading, live } = useFirearms();
  const categories = useMemo(() => extractCategories(firearms), [firearms]);
  return { categories, firearms, loading, live };
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

