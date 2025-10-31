import { useEffect, useState } from "react";
export function formatTimeLeft(expireAt: string | null | undefined): string {
  if (!expireAt) return "";

  const now = new Date();
  const target = new Date(expireAt);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired";

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}d ${hours}h left`;
}

export function useCountdown(expireAt?: string | null) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(expireAt));

  useEffect(() => {
    if (!expireAt) return;

    const interval = setInterval(() => {
      setTimeLeft(formatTimeLeft(expireAt));
    }, 60 * 1000); // refresh every minute

    return () => clearInterval(interval);
  }, [expireAt]);

  return timeLeft;
}
