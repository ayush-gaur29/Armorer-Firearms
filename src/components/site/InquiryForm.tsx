import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { submitInquiry } from "@/hooks/useArchive";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional(),
  firearmInterest: z.string().trim().optional(),
  message: z.string().trim().min(10, "Please provide at least 10 characters regarding your inquiry."),
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
      toast.success("Your inquiry has been received. A curator will respond shortly.");
      onDone?.();
    } catch {
      toast.error("We could not send your inquiry. Please try again or telephone the armory.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-brass/60 bg-obsidian-2/90 p-8 sm:p-10 text-center shadow-2xl">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-brass/40 bg-brass/10 text-brass">
          <CheckCircle2 className="size-6" />
        </div>
        <p className="mt-4 font-mono text-[0.65rem] tracking-[0.24em] uppercase text-brass">INQUIRY RECEIVED</p>
        <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-ivory">Thank you for your correspondence.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-parchment-dim">
          A curator will review your message and respond within two business days. Private viewings are arranged strictly by appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("grid gap-6", compact ? "" : "sm:grid-cols-2")}>
      <Field label="Full Name *" error={errors.name}>
        <input
          className="w-full rounded-none border border-brass-border/70 bg-obsidian-2/90 px-4 py-3 text-sm text-ivory placeholder:text-parchment-dim/40 transition-colors focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
          value={values.name}
          onChange={set("name")}
          autoComplete="name"
          placeholder="e.g. Eleanor Vance"
          aria-required="true"
        />
      </Field>

      <Field label="Email Address *" error={errors.email}>
        <input
          className="w-full rounded-none border border-brass-border/70 bg-obsidian-2/90 px-4 py-3 text-sm text-ivory placeholder:text-parchment-dim/40 transition-colors focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
          type="email"
          value={values.email}
          onChange={set("email")}
          autoComplete="email"
          placeholder="you@example.com"
          aria-required="true"
        />
      </Field>

      <Field label="Telephone (Optional)" error={errors.phone}>
        <input
          className="w-full rounded-none border border-brass-border/70 bg-obsidian-2/90 px-4 py-3 text-sm text-ivory placeholder:text-parchment-dim/40 transition-colors focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
          type="tel"
          value={values.phone}
          onChange={set("phone")}
          autoComplete="tel"
          placeholder="(406) 555-0100"
        />
      </Field>

      <Field label="Piece of Interest" error={errors.firearmInterest}>
        <input
          className="w-full rounded-none border border-brass-border/70 bg-obsidian-2/90 px-4 py-3 text-sm text-ivory placeholder:text-parchment-dim/40 transition-colors focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass read-only:opacity-75"
          value={values.firearmInterest}
          onChange={set("firearmInterest")}
          placeholder="e.g. Winchester Model 1873, or 'General Inquiry'"
          readOnly={Boolean(firearmName)}
        />
      </Field>

      <Field label="Message *" error={errors.message} className={compact ? "" : "sm:col-span-2"}>
        <textarea
          className="w-full min-h-36 resize-y rounded-none border border-brass-border/70 bg-obsidian-2/90 p-4 text-sm leading-relaxed text-ivory placeholder:text-parchment-dim/40 transition-colors focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
          value={values.message}
          onChange={set("message")}
          placeholder="Please describe your acquisition interest, collection focus, or private viewing request."
          aria-required="true"
        />
      </Field>

      {firearmId && <input type="hidden" name="firearmId" value={firearmId} />}

      <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", compact ? "" : "sm:col-span-2")}>
        <p className="font-mono text-[0.65rem] tracking-[0.12em] text-parchment-dim/70">
          Your correspondence is held in strict confidence and never shared.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="group inline-flex items-center justify-center gap-3 rounded-none border border-brass bg-brass px-8 py-4 font-mono text-[0.72rem] font-semibold tracking-[0.24em] uppercase text-obsidian transition-all duration-300 hover:bg-brass-light hover:border-brass-light hover:shadow-lg hover:shadow-brass/20 disabled:opacity-50 cursor-pointer"
        >
          <span>{busy ? "TRANSMITTING…" : "SUBMIT INQUIRY"}</span>
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
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
      <span className="mb-2 block font-mono text-[0.62rem] font-medium tracking-[0.22em] uppercase text-parchment-dim">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-2 flex items-center gap-1.5 text-xs text-[#E05252]">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          <span>{error}</span>
        </span>
      )}
    </label>
  );
}
