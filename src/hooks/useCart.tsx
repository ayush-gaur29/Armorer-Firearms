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
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "armorer_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

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
