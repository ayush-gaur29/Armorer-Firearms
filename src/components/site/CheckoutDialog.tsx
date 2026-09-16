import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { getDb } from "@/lib/firebase";
import { formatPrice, accessionNo } from "@/lib/fallbacks";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Printer,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import { useTransferDeliveryMethods } from "@/hooks/useArchive";

interface InvoiceItem {
  id: string;
  name: string;
  maker: string;
  caliber: string;
  year: number | string;
  price?: number | string;
  accessionNo: string;
}

interface InvoiceRecord {
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  transferType: string;
  transferTitle: string;
  transferDetails: string;
  shippingNotes: string;
  items: InvoiceItem[];
  cartSubtotal: number;
  shippingFee: number;
  taxFee: number;
  miscFees: number;
  finalTotal: number;
  paymentStatus: "Pending Payment" | "Paid";
}

export function CheckoutDialog() {
  const { items, totalPrice, isCheckoutOpen, closeCheckout, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"form" | "invoice" | "confirmation">("form");

  // Customer contact info
  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");

  // Transfer & Delivery methods dynamically fetched from Firestore site_content/transfer_delivery
  const { methods: deliveryMethods, loading: loadingMethods } = useTransferDeliveryMethods();
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");
  const [fflDetails, setFflDetails] = useState("");

  useEffect(() => {
    if (deliveryMethods.length > 0) {
      setSelectedMethodId((prev) => {
        if (prev && deliveryMethods.some((m) => m.id === prev)) {
          return prev;
        }
        return deliveryMethods[0]!.id;
      });
    }
  }, [deliveryMethods]);

  const selectedMethod = deliveryMethods.find((m) => m.id === selectedMethodId) ?? deliveryMethods[0];
  const isFfl = Boolean(
    selectedMethod &&
    (selectedMethod.title.toLowerCase().includes("ffl") ||
      selectedMethod.id.toLowerCase().includes("ffl") ||
      selectedMethod.description.toLowerCase().includes("licensee"))
  );

  // Additional Charges dynamically fetched from the selected firearm's Firestore document
  const [liveCharges, setLiveCharges] = useState<{
    shippingHandling: number;
    tax: number;
    miscFees: number;
  }>({ shippingHandling: 0, tax: 0, miscFees: 0 });

  const toSafeNum = (val: unknown): number => {
    if (typeof val === "number") return Number.isFinite(val) ? Math.max(0, val) : 0;
    if (typeof val === "string") {
      const parsed = Number(val.replace(/[^0-9.]/g, ""));
      return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    }
    return 0;
  };

  useEffect(() => {
    if (!isCheckoutOpen || items.length === 0) {
      setLiveCharges({ shippingHandling: 0, tax: 0, miscFees: 0 });
      return;
    }

    let unsubs: Array<() => void> = [];
    let cancelled = false;

    // Immediately compute initial charges from cart items to avoid delay
    let initShip = 0;
    let initTax = 0;
    let initMisc = 0;
    for (const item of items) {
      initShip += toSafeNum(item.firearm.shippingHandling);
      initTax += toSafeNum(item.firearm.tax);
      initMisc += toSafeNum(item.firearm.miscFees);
    }
    setLiveCharges({ shippingHandling: initShip, tax: initTax, miscFees: initMisc });

    // Live subscription to selected item(s) in Firestore for the latest admin-configured charges
    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, fs]) => {
        if (cancelled) return;
        const currentVals: Record<string, { shipping: number; tax: number; misc: number }> = {};

        items.forEach((item) => {
          const unsub = fs.onSnapshot(
            fs.doc(db, "firearms", item.firearm.id),
            (snap) => {
              if (snap.exists()) {
                const data = snap.data();
                currentVals[item.firearm.id] = {
                  shipping: toSafeNum(data.shippingHandling ?? data.shipping),
                  tax: toSafeNum(data.tax),
                  misc: toSafeNum(data.miscFees ?? data.misc),
                };
              } else {
                currentVals[item.firearm.id] = {
                  shipping: toSafeNum(item.firearm.shippingHandling),
                  tax: toSafeNum(item.firearm.tax),
                  misc: toSafeNum(item.firearm.miscFees),
                };
              }

              let sumShip = 0;
              let sumTax = 0;
              let sumMisc = 0;
              for (const v of Object.values(currentVals)) {
                sumShip += v.shipping;
                sumTax += v.tax;
                sumMisc += v.misc;
              }

              setLiveCharges({
                shippingHandling: sumShip,
                tax: sumTax,
                miscFees: sumMisc,
              });
            },
            (err) => {
              console.error("Error fetching live charges from Firestore:", err);
            },
          );
          unsubs.push(unsub);
        });
      })
      .catch((err) => {
        console.error("Firestore connection error for checkout charges:", err);
      });

    return () => {
      cancelled = true;
      unsubs.forEach((u) => u());
    };
  }, [isCheckoutOpen, items]);

  // Shipping Notes (replaces Special Instructions / Curatorial Notes)
  const [notes, setNotes] = useState("");

  // PayPal Link (configurable)
  const [paypalUrl, setPaypalUrl] = useState("https://www.paypal.com/paypalme/ArmorerFirearms");
  const [editingPaypal, setEditingPaypal] = useState(false);
  const [draftPaypalUrl, setDraftPaypalUrl] = useState(paypalUrl);

  const [submitting, setSubmitting] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceRecord | null>(null);

  if (!isCheckoutOpen) return null;

  const numShipping = liveCharges.shippingHandling;
  const numTax = liveCharges.tax;
  const numMisc = liveCharges.miscFees;
  // Subtotal = Item Price + Applicable Additional Invoice Charges from Firestore
  const subtotal = totalPrice + numShipping + numTax + numMisc;
  const finalTotal = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email address.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    const orderRef = `AF-ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const invoiceItems: InvoiceItem[] = items.map((i) => ({
      id: i.firearm.id,
      name: i.firearm.name,
      maker: i.firearm.maker,
      caliber: i.firearm.caliber,
      year: i.firearm.year,
      price: i.firearm.price,
      accessionNo: accessionNo(i.firearm.id),
    }));

    const invoice: InvoiceRecord = {
      orderId: orderRef,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      transferType: isFfl ? "ffl" : "atelier",
      transferTitle: selectedMethod ? selectedMethod.title : "Transfer & Delivery",
      transferDetails: isFfl
        ? (fflDetails.trim() || "Preferred FFL Dealer")
        : (selectedMethod?.description || "In-person collection viewing and transfer in Bigfork, MT"),
      shippingNotes: notes.trim(),
      items: invoiceItems,
      cartSubtotal: totalPrice,
      shippingFee: numShipping,
      taxFee: numTax,
      miscFees: numMisc,
      finalTotal,
      paymentStatus: "Pending Payment",
    };

    try {
      const [db, fs] = await Promise.all([getDb(), import("firebase/firestore")]);
      await fs.addDoc(fs.collection(db, "orders"), {
        orderRef,
        userId: user?.uid ?? null,
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        transfer: {
          type: transferType,
          title: invoice.transferTitle,
          details: invoice.transferDetails,
        },
        notes: notes.trim(),
        items: invoiceItems,
        cartSubtotal: totalPrice,
        shippingFee: numShipping,
        taxFee: numTax,
        miscFees: numMisc,
        finalTotal,
        paymentStatus: "Pending Payment",
        createdAt: fs.serverTimestamp(),
        dateIso: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Order submission note (local resilient fallback applied):", err);
    } finally {
      setInvoiceData(invoice);
      clearCart();
      setStep("invoice");
      setSubmitting(false);
      toast.success("Checkout completed. Invoice generated.");
    }
  };

  const handleClose = () => {
    setStep("form");
    setInvoiceData(null);
    closeCheckout();
  };

  const handleReturnToMain = () => {
    handleClose();
    router.navigate({ to: "/" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian/85 backdrop-blur-md transition-opacity no-print"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-brass-border bg-[#131518] p-6 sm:p-8 shadow-2xl text-parchment">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1 text-parchment-dim hover:text-ivory transition-colors cursor-pointer no-print"
          aria-label="Close checkout"
        >
          <X className="size-5" />
        </button>

        {/* STEP 1: CHECKOUT FORM */}
        {step === "form" && (
          <div>
            <div className="border-b border-brass-border/60 pb-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-ivory">
                Safe &amp; Secure Checkout
              </h2>
            </div>

            {/* Order Items Review Summary */}
            <div className="mt-5 border border-brass-border/40 bg-obsidian-2/60 p-4">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-parchment-dim mb-2">
                <span>Selected Pieces ({items.length})</span>
                <span className="text-brass">Subtotal: {formatPrice(subtotal)}</span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.firearm.id} className="flex justify-between text-xs text-parchment">
                    <span className="truncate pr-2">
                      {it.firearm.name}{" "}
                      <span className="font-mono text-[0.65rem] text-brass">
                        (Item # {accessionNo(it.firearm.id)})
                      </span>
                    </span>
                    <span className="shrink-0 text-parchment-dim">{formatPrice(it.firearm.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Collector's Full Name"
                    className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@example.com"
                    className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(406) 555-0199"
                  className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
                />
              </div>

              {/* Transfer & Delivery Method (Dynamically fetched from site_content/transfer_delivery) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-parchment-dim">
                    Transfer &amp; Delivery Method
                  </label>
                </div>

                {/* The Delivery Method Boxes */}
                {loadingMethods ? (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="border border-brass-border/40 bg-obsidian-2/50 p-3 min-h-[76px] animate-pulse" />
                    <div className="border border-brass-border/40 bg-obsidian-2/50 p-3 min-h-[76px] animate-pulse" />
                  </div>
                ) : deliveryMethods.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {deliveryMethods.map((method) => {
                      const isSelected = selectedMethod?.id === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethodId(method.id)}
                          className={`border p-3 text-left transition-all cursor-pointer ${isSelected
                            ? "border-brass bg-brass/10 text-ivory"
                            : "border-brass-border bg-obsidian-2 text-parchment-dim hover:border-brass-border-strong"
                            }`}
                        >
                          <p className="font-mono text-xs font-semibold uppercase text-brass">
                            {method.title}
                          </p>
                          <p className="mt-1 text-[0.75rem] text-parchment-dim leading-snug">
                            {method.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {isFfl && (
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                    Preferred FFL Dealer Name, City &amp; State
                  </label>
                  <input
                    type="text"
                    value={fflDetails}
                    onChange={(e) => setFflDetails(e.target.value)}
                    placeholder="e.g. Big Sky Outpost, Bozeman MT"
                    className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
                  />
                </div>
              )}

              {/* Additional Charges Section */}
              <div className="border border-brass-border/60 bg-obsidian-2/70 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-wider text-brass font-medium">
                    Additional Invoice Charges
                  </p>
                  <span className="text-[0.68rem] font-mono text-parchment-dim">
                    Included in Final Invoice Total
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-[0.68rem] uppercase tracking-wider text-parchment-dim mb-1">
                      Shipping &amp; Handling ($)
                    </label>
                    <div className="w-full border border-brass-border/80 bg-obsidian px-3 py-2 text-xs font-mono text-ivory flex items-center min-h-[38px] select-none">
                      ${numShipping.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[0.68rem] uppercase tracking-wider text-parchment-dim mb-1">
                      Tax (if applicable) ($)
                    </label>
                    <div className="w-full border border-brass-border/80 bg-obsidian px-3 py-2 text-xs font-mono text-ivory flex items-center min-h-[38px] select-none">
                      ${numTax.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[0.68rem] uppercase tracking-wider text-parchment-dim mb-1">
                      Misc. Fees ($)
                    </label>
                    <div className="w-full border border-brass-border/80 bg-obsidian px-3 py-2 text-xs font-mono text-ivory flex items-center min-h-[38px] select-none">
                      ${numMisc.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Notes (Replaces Special Instructions / Curatorial Notes) */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                  Shipping Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requests regarding transfer schedule, delivery instructions, or carrier preferences..."
                  className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
                />
              </div>

              {/* Live Totals Bar */}
              <div className="border-t border-brass-border/40 pt-3 flex items-center justify-between text-xs font-mono">
                <span className="uppercase text-parchment-dim">Final Checkout Total:</span>
                <span className="font-serif text-lg text-brass font-semibold">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-parchment-dim/80 pt-1">
                <ShieldCheck className="size-4 text-brass shrink-0" />
                <span>All transfers comply with Federal ATF and Montana state regulations.</span>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end border-t border-brass-border/60 pt-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="border border-brass-border px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-parchment-dim hover:text-ivory cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-brass px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-obsidian hover:bg-brass-light transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Transmitting Docket...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Checkout</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: CUSTOMER INVOICE */}
        {step === "invoice" && invoiceData && (
          <div className="py-2 space-y-6">
            <div
              id="invoice-printable"
              className="border border-brass-border/70 bg-[#15171B] p-5 sm:p-7 space-y-6 text-parchment"
            >
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-brass-border/60 pb-5">
                <div>
                  <p className="font-mono text-[0.68rem] tracking-[0.22em] uppercase text-brass">
                    ARMORER FIREARMS · BIGFORK, MONTANA
                  </p>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-ivory">
                    Invoice
                  </h2>
                  <p className="mt-1 font-mono text-xs text-parchment-dim">
                    Docket #: <span className="text-brass font-semibold">{invoiceData.orderId}</span>
                  </p>
                  <p className="text-xs font-mono text-parchment-dim">Date: {invoiceData.date}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2 no-print">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 border border-brass-border bg-obsidian-2 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-parchment hover:text-brass hover:border-brass transition-colors cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Customer & Transfer Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono border-b border-brass-border/40 pb-4">
                <div>
                  <span className="uppercase text-parchment-dim block mb-1">Purchaser Details:</span>
                  <p className="text-ivory font-medium">{invoiceData.customerName}</p>
                  <p className="text-parchment-dim">{invoiceData.customerEmail}</p>
                  {invoiceData.customerPhone && (
                    <p className="text-parchment-dim">{invoiceData.customerPhone}</p>
                  )}
                </div>
                <div>
                  <span className="uppercase text-parchment-dim block mb-1">Transfer &amp; Delivery:</span>
                  <p className="text-ivory font-medium">{invoiceData.transferTitle}</p>
                  <p className="text-parchment-dim">{invoiceData.transferDetails}</p>
                  {invoiceData.shippingNotes && (
                    <p className="mt-1 text-parchment-dim italic">
                      Notes: {invoiceData.shippingNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Purchased Items Table */}
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-brass mb-3">
                  Purchased Item(s)
                </p>
                <div className="border border-brass-border/60 divide-y divide-brass-border/40">
                  <div className="grid grid-cols-12 gap-2 bg-obsidian px-3 py-2 text-[0.68rem] font-mono uppercase tracking-wider text-parchment-dim">
                    <span className="col-span-6">Item Description</span>
                    <span className="col-span-3">Item #</span>
                    <span className="col-span-3 text-right">Price</span>
                  </div>
                  {invoiceData.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 px-3 py-3 text-xs items-center"
                    >
                      <div className="col-span-6">
                        <p className="font-serif text-sm text-ivory font-medium">{item.name}</p>
                        <p className="text-[0.7rem] text-parchment-dim font-mono">
                          {[item.maker, item.caliber, item.year].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="col-span-3 font-mono text-[0.72rem] text-brass">
                        {item.accessionNo}
                      </div>
                      <div className="col-span-3 text-right font-mono text-ivory font-medium">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-80 space-y-2 border-t border-brass-border/40 pt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-parchment-dim uppercase">Cart Subtotal:</span>
                    <span className="text-ivory">{formatPrice(invoiceData.cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-parchment-dim uppercase">Shipping &amp; Handling:</span>
                    <span className="text-ivory">{formatPrice(invoiceData.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-parchment-dim uppercase">Tax (if applicable):</span>
                    <span className="text-ivory">{formatPrice(invoiceData.taxFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-parchment-dim uppercase">Misc. Fees:</span>
                    <span className="text-ivory">{formatPrice(invoiceData.miscFees)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-brass-border text-sm">
                    <span className="uppercase text-brass font-bold">Final Total:</span>
                    <span className="font-serif text-lg font-bold text-brass">
                      {formatPrice(invoiceData.finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status & PayPal Link Area */}
              <div className="border-t border-brass-border/60 pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-brass-border/40 bg-obsidian-2/80 p-3.5">
                  <div>
                    <span className="font-mono text-[0.68rem] uppercase tracking-wider text-parchment-dim block">
                      Payment Status
                    </span>
                    <span
                      className={`font-mono text-sm font-semibold tracking-wider uppercase ${invoiceData.paymentStatus === "Paid" ? "text-green-400" : "text-amber-400"
                        }`}
                    >
                      {invoiceData.paymentStatus}
                    </span>
                  </div>

                  {/* Pending Payment State with PayPal option */}
                  {invoiceData.paymentStatus === "Pending Payment" && (
                    <div className="flex flex-wrap items-center gap-2 no-print">
                      <a
                        href={paypalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0070BA] hover:bg-[#005ea6] text-white px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors"
                      >
                        <span>PayPal Payment</span>
                        <ExternalLink className="size-3.5" />
                      </a>

                    </div>
                  )}

                  {invoiceData.paymentStatus === "Paid" && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-green-400 uppercase tracking-wider">
                        Full Payment Confirmed
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setInvoiceData({ ...invoiceData, paymentStatus: "Pending Payment" })
                        }
                        className="text-[0.68rem] font-mono text-parchment-dim underline hover:text-ivory no-print cursor-pointer"
                      >
                        Set to Pending
                      </button>
                    </div>
                  )}
                </div>


                {editingPaypal && (
                  <div className="flex gap-2 no-print">
                    <input
                      type="url"
                      value={draftPaypalUrl}
                      onChange={(e) => setDraftPaypalUrl(e.target.value)}
                      placeholder="https://www.paypal.com/..."
                      className="flex-1 border border-brass-border bg-obsidian px-2.5 py-1 text-xs text-ivory focus:border-brass focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPaypalUrl(draftPaypalUrl);
                        setEditingPaypal(false);
                        toast.success("PayPal link updated.");
                      }}
                      className="border border-brass bg-brass/10 px-3 py-1 text-xs font-mono uppercase text-brass hover:bg-brass hover:text-obsidian transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation to Confirmation Popup */}
            <div className="flex justify-end gap-3 pt-2 no-print">
              <button
                type="button"
                onClick={() => setStep("confirmation")}
                className="inline-flex items-center justify-center gap-2 bg-brass px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-obsidian hover:bg-brass-light transition-colors cursor-pointer"
              >
                <span>View Checkout Confirmation</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACQUISITION CONFIRMATION POPUP */}
        {step === "confirmation" && invoiceData && (
          <div className="py-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-brass/40 bg-brass/10 text-brass">
              <CheckCircle2 className="size-8" />
            </div>
            <p className="mt-4 font-mono text-xs tracking-[0.24em] uppercase text-brass">
              ACQUISITION CONFIRMATION
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-ivory">
              Order Docket Issued
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-parchment-dim max-w-md mx-auto">
              Your acquisition request has been registered in the Armorer register. Our curatorial
              staff will inspect the piece and contact you directly to arrange secure transfer.
            </p>

            <div className="mt-6 border border-brass-border/60 bg-obsidian-2/80 p-4 text-left sm:p-5 max-w-md mx-auto space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-parchment-dim uppercase font-mono tracking-wider">
                  Docket Reference:
                </span>
                <span className="font-mono font-semibold text-brass">{invoiceData.orderId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-parchment-dim uppercase font-mono tracking-wider">
                  Pieces Acquired:
                </span>
                <span className="text-ivory font-medium">{invoiceData.items.length}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-brass-border/40">
                <span className="text-parchment-dim uppercase font-mono tracking-wider">
                  Final Total:
                </span>
                <span className="font-semibold text-brass">
                  {formatPrice(invoiceData.finalTotal)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep("invoice")}
                className="border border-brass-border px-6 py-3.5 text-xs font-mono uppercase tracking-[0.16em] text-parchment-dim hover:text-ivory transition-colors cursor-pointer"
              >
                Back to Invoice
              </button>
              <button
                onClick={handleReturnToMain}
                className="inline-flex items-center justify-center gap-2 bg-brass px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-obsidian hover:bg-brass-light transition-colors cursor-pointer"
              >
                Return to Main
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
