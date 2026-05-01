"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: string;
  productSlug: string;
  productName: string;
  unitPrice: number;
  currency: string;
  image?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  currency: string;
  hydrated: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dh.cart.v1";

function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartLine =>
        typeof item === "object" && item !== null &&
        typeof (item as CartLine).productId === "string" &&
        typeof (item as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage might be unavailable; ignore
    }
  }, [items, hydrated]);

  const add = useCallback<CartContextValue["add"]>((line, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === line.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === line.productId ? { ...p, quantity: p.quantity + quantity } : p,
        );
      }
      return [...prev, { ...line, quantity }];
    });
  }, []);

  const setQuantity = useCallback<CartContextValue["setQuantity"]>((productId, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((p) => p.productId !== productId)
        : prev.map((p) => (p.productId === productId ? { ...p, quantity } : p)),
    );
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((productId) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const clear = useCallback<CartContextValue["clear"]>(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
    const currency = items[0]?.currency ?? "PKR";
    return { items, itemCount, subtotal, currency, hydrated, add, setQuantity, remove, clear };
  }, [items, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function useCartLine(productId: string): CartLine | undefined {
  const { items } = useCart();
  return items.find((p) => p.productId === productId);
}
