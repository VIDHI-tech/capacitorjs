import { create } from "zustand";
import { Geolocation } from "@capacitor/geolocation";

export type LocationPermission = "unknown" | "granted" | "denied";

export interface LatLng {
  lat: number;
  lng: number;
}

type LocationState = {
  permission: LocationPermission;
  coords: LatLng | null;
  setCoords: (c: LatLng | null) => void;
  setPermission: (p: LocationPermission) => void;

  // one-shot ask at app open (respect "asked once" flag)
  bootstrapAskOnce: () => Promise<void>;
  // explicit ask (used on checkout if not granted)
  ensurePermissionNow: () => Promise<boolean>;
  // refresh current position if granted
  refreshPosition: () => Promise<void>;
};

const ASKED_KEY = "loc_asked_once";

export const useLocationStore = create<LocationState>((set, get) => ({
  permission: "unknown",
  coords: null,

  setCoords: (c) => set({ coords: c }),
  setPermission: (p) => set({ permission: p }),

  bootstrapAskOnce: async () => {
    try {
      const alreadyAsked = localStorage.getItem(ASKED_KEY) === "yes";

      if (!alreadyAsked) {
        // first time: politely ask
        const perm = await Geolocation.requestPermissions();
        const state = perm.location === "granted" ? "granted" : "denied";
        set({ permission: state });
        localStorage.setItem(ASKED_KEY, "yes");

        if (state === "granted") {
          const pos = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
          });
          set({
            coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
        }
      } else {
        // already asked before: just check current permission
        const perm = await Geolocation.checkPermissions();
        const state = perm.location === "granted" ? "granted" : "denied";
        set({ permission: state });
        if (state === "granted") {
          const pos = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
          });
          set({
            coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
        }
      }
    } catch {
      // treat as denied if any error
      set({ permission: "denied", coords: null });
    }
  },

  ensurePermissionNow: async () => {
    try {
      const perm = await Geolocation.requestPermissions();
      const ok = perm.location === "granted";
      set({ permission: ok ? "granted" : "denied" });
      if (ok) {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        set({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
      }
      return ok;
    } catch {
      set({ permission: "denied" });
      return false;
    }
  },

  refreshPosition: async () => {
    const { permission } = get();
    if (permission !== "granted") return;
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    set({ coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
  },
}));
