import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
  totalItems: () => number;
  getQty: (id: string) => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item) =>
    set((s) => {
      const idx = s.items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = [...s.items];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return { items: copy };
      }
      return { items: [...s.items, { ...item, qty: 1 }] };
    }),
  inc: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    })),
  dec: (id) =>
    set((s) => ({
      items: s.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((a, b) => a + b.price * b.qty, 0),
  totalItems: () => get().items.reduce((a, b) => a + b.qty, 0),
  getQty: (id) => get().items.find((i) => i.id === id)?.qty ?? 0,
}));
