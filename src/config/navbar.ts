import { Home, User, ArrowLeftRight } from "lucide-react";
import PollingSidebarIcon from "@/assets/sidebarpoll.png"; // sidebar version
import PollingBottomIcon from "@/assets/poll.png"; // glowing PNG

export interface NavItem {
  label?: string;
  to: string;
  icon?: React.ComponentType<{ className?: string }>;
  // ✅ differentiate per placement
  sidebarImgSrc?: string;
  bottomImgSrc?: string;
  isSpecial?: boolean;
  isCustomSvg?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Offers", to: "/offers", isCustomSvg: true },
  {
    label: "Delivery",
    to: "/delivery",
    sidebarImgSrc: PollingSidebarIcon, // flat/text PNG
    bottomImgSrc: PollingBottomIcon, // glowing PNG
    isSpecial: true,
  },
  { label: "Dining", to: "/dining", icon: ArrowLeftRight },
  { label: "Orders", to: "/orders", icon: User },
];
