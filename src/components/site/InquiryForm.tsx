import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { submitInquiry } from "@/hooks/useArchive";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email."),
  phone: z.string().trim().optional(),
  firearmInterest: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)."),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function InquiryForm({
  firearmName,
  firearmId,
  compact,
  onDone,
}: {
  firearmName?: string | undefined;
  firearmId?: string | undefined;
  compact?: boolean | undefined;
  onDone?: () => void;
}) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    firearmInterest: firearmName ?? "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await submitInquiry({ ...parsed.data, firearmId });
      setSent(true);
      toast.success("Your inquiry has been received. We will be in touch shortly.");
      onDone?.();
    } catch {
      toast.error("We could not send your inquiry. Please try again or call the atelier.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-brass/50 bg-obsidian-3 p-8 text-center">
        <p className="eyebrow">Inquiry Received</p>
        <h3 className="mt-3 font-serif text-2xl text-ivory">Thank you.</h3>
        <p className="mt-2 text-sm text-parchment-dim">
          A curator will respond within two business days. Private viewings are arranged by appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("grid gap-5", compact ? "" : "sm:grid-cols-2")}>
      <Field label="Full Name" error={errors.name}>
        <input className="field" value={values.name} onChange={set("name")} autoComplete="name" placeholder="Your name" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input className="field" type="email" value={values.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Field label="Telephone (optional)" error={errors.phone}>
        <input className="field" type="tel" value={values.phone} onChange={set("phone")} autoComplete="tel" placeholder="(406) 555-0100" />
      </Field>
      <Field label="Piece of Interest" error={errors.firearmInterest}>
        <input
          className="field"
          value={values.firearmInterest}
          onChange={set("firearmInterest")}
          placeholder="e.g. Winchester 1873, or 'general inquiry'"
          readOnly={Boolean(firearmName)}
        />
      </Field>
      <Field label="Message" error={errors.message} className={compact ? "" : "sm:col-span-2"}>
        <textarea className="field min-h-32 resize-y" value={values.message} onChange={set("message")} placeholder="Tell us about your interest, collection focus, or the piece you are seeking." />
      </Field>
      {firearmId && <input type="hidden" name="firearmId" value={firearmId} />}
      <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", compact ? "" : "sm:col-span-2")}>
        <p className="text-xs text-parchment-dim">Your details are held in confidence and never shared.</p>
        <button
          type="submit"
          disabled={busy}
          className="bg-brass px-7 py-3 text-[0.72rem] tracking-[0.24em] uppercase text-obsidian transition-colors hover:bg-brass-light disabled:opacity-60"
        >
          {busy ? "Sending…" : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[0.62rem] tracking-[0.22em] uppercase text-parchment-dim">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
