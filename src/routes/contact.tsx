import { createFileRoute } from "@tanstack/react-router";
import { useContactContent } from "@/hooks/useArchive";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PageIntro } from "@/components/site/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Private Inquiries — Armorer Firearms" },
      { name: "description", content: "Arrange a private viewing at the Bigfork, Montana atelier or submit an acquisition inquiry to the Armorer Firearms archive." },
      { property: "og:title", content: "Contact & Private Inquiries — Armorer Firearms" },
      { property: "og:description", content: "Private viewings by appointment. Acquisition inquiries answered in confidence." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const c = useContactContent();
  return (
    <>
      <PageIntro
        eyebrow="Contact & Inquiries"
        title="Begin a conversation in confidence."
        text="Whether you are seeking a specific piece, placing an estate, or simply wish to view the archive, we welcome your inquiry."
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="divide-y divide-brass-border border-y border-brass-border">
              <Row label="Atelier">{c.address}<br />{c.city}</Row>
              <Row label="Telephone"><a href={`tel:${c.phone}`} className="hover:text-brass">{c.phone}</a></Row>
              <Row label="Email"><a href={`mailto:${c.email}`} className="break-all hover:text-brass">{c.email}</a></Row>
              <Row label="Private Viewings">{c.hours}</Row>
            </dl>
            {c.note && <p className="mt-6 text-xs leading-relaxed text-parchment-dim/80">{c.note}</p>}
          </aside>
          <div className="border border-brass-border bg-obsidian-2 p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <p className="eyebrow">Acquisition Inquiry</p>
            <h2 className="mt-3 mb-8 font-serif text-3xl text-ivory">Tell us what you are seeking.</h2>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-5">
      <dt className="text-[0.62rem] tracking-[0.24em] uppercase text-brass">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-parchment">{children}</dd>
    </div>
  );
}
