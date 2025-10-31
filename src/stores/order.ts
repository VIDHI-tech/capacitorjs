import { create } from "zustand";
import { nanoid } from "nanoid";
import type { CartItem } from "@/stores/cart";

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "PICKED_UP"
  | "NEARBY"
  | "DELIVERED";

export type LatLng = { lat: number; lng: number };

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerLocation?: LatLng | null;
  driverLocation?: LatLng | null;
  startedAt: number;
}

type OrderState = {
  current?: Order;
  history: Order[];
  placeOrder: (
    items: CartItem[],
    total: number,
    customerLocation?: LatLng | null
  ) => string;
  setCustomerLocation: (loc: LatLng | null) => void;
  advanceStatus: () => void;
  setDriverLocation: (loc: LatLng) => void;
  clearCurrent: () => void;
};

const STATUS_FLOW: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "PICKED_UP",
  "NEARBY",
  "DELIVERED",
];

export const useOrder = create<OrderState>((set, get) => ({
  current: undefined,
  history: [],
  placeOrder: (items, total, customerLocation) => {
    const id = nanoid(10);
    const start: Order = {
      id,
      items,
      total,
      status: "PLACED",
      customerLocation: customerLocation ?? null,
      driverLocation: { lat: 17.4401, lng: 78.3489 }, // seed (e.g., Hyderabad)
      startedAt: Date.now(),
    };
    set({ current: start, history: [start, ...get().history] });

    // Simulate status progression every ~10s
    let idx = 0;
    const tick = () => {
      const cur = get().current;
      if (!cur) return;
      idx = STATUS_FLOW.indexOf(cur.status);
      if (idx < STATUS_FLOW.length - 1) {
        const next = STATUS_FLOW[idx + 1];
        set({ current: { ...cur, status: next } });
        if (next !== "DELIVERED") setTimeout(tick, 10000);
      }
    };
    setTimeout(tick, 8000);

    return id;
  },
  setCustomerLocation: (loc) =>
    set((s) =>
      s.current ? { current: { ...s.current, customerLocation: loc } } : s
    ),
  advanceStatus: () =>
    set((s) => {
      if (!s.current) return s;
      const idx = STATUS_FLOW.indexOf(s.current.status);
      if (idx < STATUS_FLOW.length - 1) {
        return { current: { ...s.current, status: STATUS_FLOW[idx + 1] } };
      }
      return s;
    }),
  setDriverLocation: (loc) =>
    set((s) =>
      s.current ? { current: { ...s.current, driverLocation: loc } } : s
    ),
  clearCurrent: () => set({ current: undefined }),
}));
