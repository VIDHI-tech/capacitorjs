import { useEffect } from "react";
import { useLocationStore } from "@/stores/location";

export default function LocationBootstrap() {
  const bootstrapAskOnce = useLocationStore((s) => s.bootstrapAskOnce);

  useEffect(() => {
    // on first app load, ask once (or just check if already asked)
    bootstrapAskOnce();
  }, [bootstrapAskOnce]);

  return null;
}
