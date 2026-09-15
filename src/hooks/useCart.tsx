import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Firearm } from "@/lib/fallbacks";
import { toast } from "sonner";

export interface CartItem {
  firearm: Firearm;
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (firearm: Firearm) => boolean;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalPrice: number;
  itemCount: number;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "armorer_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load from localStorage only on client after mount to prevent SSR hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore storage or JSON parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Synchronize to localStorage only after initial client load is complete
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, isLoaded]);

  const isInCart = (id: string) => items.some((item) => item.firearm.id === id);

  const addItem = (firearm: Firearm) => {
    if (isInCart(firearm.id)) {
      toast.info(`"${firearm.name}" is already in your acquisition cart.`);
      setIsOpen(true);
      return false;
    }

    const newItem: CartItem = {
      firearm,
      addedAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(`"${firearm.name}" added to cart.`, {
      description: "Ready for acquisition review.",
    });
    setIsOpen(true);
    return true;
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.firearm.id === id);
      if (target) {
        toast.info(`"${target.firearm.name}" removed from cart.`);
      }
      return prev.filter((item) => item.firearm.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const openCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const totalPrice = items.reduce((sum, item) => {
    const raw = item.firearm.price;
    if (typeof raw === "number") return sum + raw;
    if (typeof raw === "string") {
      const parsed = Number(raw.replace(/[^0-9.]/g, ""));
      return sum + (Number.isFinite(parsed) ? parsed : 0);
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        totalPrice,
        itemCount: items.length,
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout,
        closeCheckout,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
