# Armorer Firearms

Build the redesigned Armorer Firearms website: a high-end private collection and museum archive experience with an Obsidian & Brass aesthetic inspired by the provided reference, completely preserving the real Firebase / Firestore dynamic integrations and routes from the live application.

1. BRAND & VISUAL SYSTEM (Obsidian & Brass Archive):
- Palette: Deep obsidian (#0C0D0E, #121314, #141618), subtle brass/bronze borders (#2E2B24, #3E382D), antique brass accents (#C5A869, #DFCA8D, #9D8147), warm ivory & parchment text (#F8F6F0, #E5E1D8, #A39E93).
- Typography: Cormorant Garamond or Playfair Display for editorial serif headings, Plus Jakarta Sans for body copy and technical archive metadata, tracked uppercase labels for accession tags and eyebrows.
- Visual Language: Historic gunsmithing atelier meets museum vault. Hairline brass dividers, accession tags (e.g., "ACCESSION NO. AF-"), crisp metadata chips, museum catalog card layouts, subtle image hover zoom (1.02-1.04x).

2. FIREBASE & FIRESTORE INTEGRATION (Preserve exact live config and collections):
- Firebase Config:
  apiKey: "AIzaSyDoHnNZU2zdR63bwhbl07EBPbHtbATo8K0"
  authDomain: "highland-firearms.firebaseapp.com"
  projectId: "highland-firearms"
  storageBucket: "highland-firearms.firebasestorage.app"
  messagingSenderId: "960225337027"
  appId: "1:960225337027:web:0c3e9e44bb1294b1910c76"
  measurementId: "G-BLQV544D7L"
- Connect to Firestore in real-time with comprehensive fallback defaults so the site renders instantly even if network/offline:
  * "hero_sections" (collection): query docs ordered by displayOrder, take active/first. Fallback to Armorer Firearms hero banner and logo.
  * "site_content" doc "collection_intro": intro heading and text for collection section.
  * "site_content" doc "about": story, history, founded year (1998, Bigfork Montana).
  * "site_content" doc "contact": address (Bigfork, MT), phone, email, private viewing hours.
  * "firearms" (collection): real-time list of firearms with fields (name, maker, model, caliber, year, price, description, history, condition, category, status, images, featured).
  * "inquiries" (collection): submit private acquisition/inquiry forms with name, email, phone, firearm interest, message, timestamp.
  * Firebase Auth: support Login, Signup, Logout, and User Profile.

3. ROUTES & PAGES:
- Header: Sticky obsidian navigation with hairline brass border on scroll, Armorer Firearms brand mark, links to Collection, Archive Highlights, About, Contact, plus Private Inquiry CTA button and Collector Login/Profile. Mobile slide-out drawer with identical links.
- Home ("/"):
  * Hero: Cinematic composition with dynamic hero data, accession tag, editorial serif headline, live background image with subtle overlay, dual CTAs ("Explore The Archive", "Private Acquisition Inquiry"), and curatorial metrics bar (120+ Curated Pieces, 1860–1945 Historical Span, Montana Atelier).
  * Curated Collection Highlights: Dynamic featured firearms rendered as museum archival cards with image aspect ratio, accession number, maker, year, caliber, condition tag, subtle brass hover border.
  * Collection Intro / Atelier Story teaser: Editorial asymmetric composition.
  * Curatorial Inquiries CTA banner.
- Collection Catalog ("/collection"):
  * Dynamic search & filter bar (Category, Maker, Caliber, Condition, Sort by Year/Price/Name).
  * Results counter and active filter reset.
  * Archive grid of dynamic firearms cards with full responsive breakpoints (1 col mobile, 2 col tablet, 3-4 col desktop).
- Firearm Detail View ("/collection/:id"):
  * Dynamic loader fetching doc from "firearms/:id".
  * Editorial gallery with thumbnail switcher.
  * Complete archival dossier: Maker, Model, Year of Manufacture, Serial/Accession No, Caliber, Condition grade, Historical Provenance narrative.
  * "Inquire on This Piece" modal/form pre-filled with firearm name and ID.
  * Related pieces from same category.
- About Heritage Page ("/about"):
  * Dynamic copy from "site_content/about".
  * Editorial narrative: History of the Bigfork Montana atelier, estate acquisitions, preservation philosophy, standards of authenticity.
- Contact & Inquiries Page ("/contact"):
  * Dynamic details from "site_content/contact".
  * Private viewing by appointment information.
  * Interactive acquisition inquiry form saving to Firestore "inquiries" with validation and brass focus styling.
- Auth Pages ("/login", "/signup", "/profile"):
  * Elegant dark modal/card layout for collector portal authentication.
- Footer:
  * Refined editorial footer with brand heritage mark, navigation columns, Bigfork MT coordinates, legal disclaimers, and subtle copyright.

4. RESPONSIVENESS & POLISH:
- Flawless across 320px mobile to 1920px+ ultra-wide desktop.
- No horizontal scrollbars, robust image aspect-ratios with object-cover and graceful fallback images if an image fails to load.
- Accessible contrast, smooth transitions, prefers-reduced-motion compliance.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4e46a869-64dd-4293-9bbc-e717aa9c2cb5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
