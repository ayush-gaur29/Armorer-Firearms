import { useCart } from "@/hooks/useCart";
import { formatPrice, accessionNo } from "@/lib/fallbacks";
import { ArchiveImage } from "./FirearmCard";
import { X, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, totalPrice, openCheckout } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeCart();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-brass-border bg-[#131518] shadow-2xl text-parchment"
        aria-label="Acquisition Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brass-border/70 px-6 py-5">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.24em] uppercase text-brass">
              ACQUISITION DOCKET
            </p>
            <h2 className="mt-0.5 font-serif text-2xl text-ivory">
              Your Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="flex size-10 items-center justify-center border border-brass-border/60 text-parchment hover:text-ivory hover:border-brass transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-brass-border/60 bg-obsidian text-parchment-dim">
                <ShoppingBag className="size-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-ivory">Cart is Empty</h3>
              <p className="mt-2 text-xs leading-relaxed text-parchment-dim max-w-xs mx-auto">
                No firearms currently selected for acquisition. Explore the archive to reserve historic pieces.
              </p>
              <div className="mt-6">
                <Link
                  to="/collection"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 border border-brass bg-brass/10 px-6 py-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-brass hover:bg-brass hover:text-obsidian transition-colors"
                >
                  Browse Collection
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ firearm }) => (
                <div
                  key={firearm.id}
                  className="flex gap-4 border border-brass-border/60 bg-obsidian-2/70 p-3.5 transition-all hover:border-brass-border-strong"
                >
                  {/* Item thumbnail */}
                  <div className="relative size-20 shrink-0 overflow-hidden border border-brass-border/40 bg-obsidian-3 shadow-sm">
                    <ArchiveImage
                      src={firearm.images[0]}
                      alt={firearm.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[0.65rem] tracking-wider uppercase text-brass truncate">
                          {accessionNo(firearm.id)}
                        </span>
                        <button
                          onClick={() => removeItem(firearm.id)}
                          className="text-parchment-dim/60 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                          aria-label={`Remove ${firearm.name} from cart`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <h4 className="font-serif text-sm font-medium text-ivory truncate mt-0.5">
                        {firearm.name}
                      </h4>
                      <p className="text-[0.7rem] text-parchment-dim truncate">
                        {[firearm.maker, firearm.caliber].filter(Boolean).join(" · ")}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-sans font-semibold text-sm text-brass">
                        {formatPrice(firearm.price)}
                      </span>
                      <Link
                        to="/collection/$id"
                        params={{ id: firearm.id }}
                        onClick={closeCart}
                        className="text-[0.68rem] font-mono tracking-wider uppercase text-parchment-dim hover:text-brass"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-brass-border/80 bg-obsidian px-6 py-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-parchment-dim">
                Acquisition Subtotal
              </span>
              <span className="font-serif text-2xl font-normal text-brass">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="text-[0.7rem] text-parchment-dim/80 leading-normal">
              State &amp; federal compliance checks verified prior to final transfer.
            </p>

            <button
              onClick={openCheckout}
              className="flex w-full items-center justify-center gap-3 bg-brass py-4 font-mono text-xs font-semibold tracking-[0.22em] uppercase text-obsidian transition-colors hover:bg-brass-light cursor-pointer active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
