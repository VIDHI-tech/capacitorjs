import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrder } from "@/stores/order";
import { Geolocation } from "@capacitor/geolocation";

// Leaflet (no API key)
import L, { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

// default icons fix for Leaflet with bundlers
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Order placed",
  CONFIRMED: "Restaurant confirmed",
  PREPARING: "Preparing your food",
  PICKED_UP: "Picked up by rider",
  NEARBY: "Rider is nearby",
  DELIVERED: "Delivered",
};

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const current = useOrder((s) => s.current);
  const setDriverLocation = useOrder((s) => s.setDriverLocation);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(
    current?.customerLocation ?? null
  );

  // Map refs
  const mapRef = useRef<LeafletMap | null>(null);
  const riderMarkerRef = useRef<Marker | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const mapEl = useRef<HTMLDivElement | null>(null);

  // Ask/refresh user location (mobile prompt only once usually)
  useEffect(() => {
    (async () => {
      try {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
      } catch {
        // ignore; user may block permission
      }
    })();
  }, []);

  // Init map once
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    mapRef.current = L.map(mapEl.current, {
      center: [17.4401, 78.3489], // fallback center
      zoom: 13,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapRef.current);
  }, []);

  // Place/update markers and fit bounds
  const fitBounds = () => {
    const m = mapRef.current;
    if (!m) return;
    const pts: L.LatLngExpression[] = [];
    if (riderMarkerRef.current) pts.push(riderMarkerRef.current.getLatLng());
    if (userMarkerRef.current) pts.push(userMarkerRef.current.getLatLng());
    if (pts.length >= 2)
      m.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
    else if (pts.length === 1) m.setView(pts[0], 15);
  };

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    // user pin
    if (userLoc) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng])
          .addTo(m)
          .bindPopup("You");
      } else {
        userMarkerRef.current.setLatLng([userLoc.lat, userLoc.lng]);
      }
    }

    // rider pin
    if (current?.driverLocation) {
      if (!riderMarkerRef.current) {
        riderMarkerRef.current = L.marker([
          current.driverLocation.lat,
          current.driverLocation.lng,
        ])
          .addTo(m)
          .bindPopup("Rider");
      } else {
        riderMarkerRef.current.setLatLng([
          current.driverLocation.lat,
          current.driverLocation.lng,
        ]);
      }
    }

    fitBounds();
  }, [current?.driverLocation, userLoc]);

  // Simulate driver moving towards user every 3s
  useEffect(() => {
    if (!current) return;
    const int = setInterval(() => {
      const rider = current.driverLocation;
      const target = userLoc;
      if (!rider || !target) return;

      const step = 0.0015; // ~150m per tick (tweak)
      const dx = target.lat - rider.lat;
      const dy = target.lng - rider.lng;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.0008) return; // near enough

      const nx = rider.lat + (dx / dist) * step;
      const ny = rider.lng + (dy / dist) * step;
      setDriverLocation({ lat: nx, lng: ny });
    }, 3000);
    return () => clearInterval(int);
  }, [current, userLoc, setDriverLocation]);

  const steps = useMemo(
    () => [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "PICKED_UP",
      "NEARBY",
      "DELIVERED",
    ],
    []
  );

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-lg font-semibold">Order Tracking</h1>
      <p className="text-sm text-gray-600 mt-1">Order #{id}</p>

      {/* Status Steps */}
      <div className="mt-4">
        <ol className="relative border-s border-gray-200 ml-3">
          {steps.map((s) => {
            const active = current?.status === s;
            const done =
              steps.indexOf(s) < (current ? steps.indexOf(current.status) : -1);
            return (
              <li key={s} className="mb-6 ms-6">
                <span
                  className={[
                    "absolute -start-3 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white",
                    done
                      ? "bg-green-500"
                      : active
                      ? "bg-blue-500"
                      : "bg-gray-300",
                  ].join(" ")}
                />
                <h3 className="font-medium">{STATUS_LABELS[s]}</h3>
                {active && (
                  <p className="text-xs text-gray-500 mt-1">In progress…</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Map */}
      <div
        className="mt-4 h-64 rounded-xl overflow-hidden border"
        ref={mapEl}
      />

      {/* Footer actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="py-2 rounded-lg bg-gray-100">Call Rider</button>
        <button className="py-2 rounded-lg bg-black text-white">Support</button>
      </div>

      {/* ETA / info */}
      <p className="mt-3 text-sm text-gray-600">
        {current?.status === "DELIVERED"
          ? "Delivered. Enjoy your meal!"
          : "Your order is on the way. We’ll update ETA as the rider moves."}
      </p>
    </div>
  );
}
