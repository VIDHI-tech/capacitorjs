import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NavItem } from "@/config/navbar";
import { endpoints } from "@/api/endpoints";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useMemo } from "react";
import xlogo from "@/assets/logo.png";
import xOctopus from "@/assets/sidebar.png";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion"; // ⬅️ added

const containerVariants = cva("", {
  variants: {
    variant: {
      light: "bg-white text-gray-800",
      dark: "bg-dark-bg text-white",
      accent: "bg-brand text-white",
    },
  },
  defaultVariants: { variant: "dark" },
});

// ⬅️ added framer-motion variants
const sidebarVariants = {
  hidden: { x: -40, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};
const bottomVariants = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};
const containerMotion = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export interface LogoConfig {
  src: string;
  alt?: string;
  href?: string;
}

export interface UserConfig {
  name: string;
  imgSrc: string;
  href?: string;
}

export interface ResponsiveNavProps
  extends VariantProps<typeof containerVariants> {
  items: NavItem[];
  logo?: LogoConfig;
  user?: UserConfig;
  className?: string;
  mobileContent?: React.ReactNode;
  showSidebar?: boolean;
  showTopBar?: boolean;
  showBottomBar?: boolean;
}

export default function ResponsiveNav({
  items,
  variant,
  logo,
  className,
  mobileContent,
  showSidebar = true,
  showTopBar = true,
  showBottomBar = true,
}: ResponsiveNavProps) {
  const { data: meData } = useApiQuery(endpoints.profile.me);
  const filteredmeData = useMemo(
    () => meData?.data?.data?.profile ?? [],
    [meData]
  );
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile");
  };
  const location = useLocation();

  const sidebar = showSidebar ? (
    <aside
      className={cn(
        containerVariants({ variant }),
        "hidden lg:flex flex-col justify-between items-start w-40 h-full bg-[#25FBEC] text-black",
        className
      )}
      aria-label="Sidebar"
    >
      <section className="space-y-10">
        <section
          className="relative flex flex-col space-y-2 cursor-pointer"
          onClick={goToProfile}
        >
          <div className="relative pt-2">
            <img
              src={filteredmeData?.apps?.xpoll?.avatar?.imageUrl ?? logo}
              alt={filteredmeData?.apps?.xpoll?.username}
              className="w-14 h-14 rounded-full object-cover object-top border-2 border-white"
            />
          </div>
        </section>

        {/* ⬅️ animated sidebar nav */}
        <motion.nav
          className="flex flex-col gap-2"
          variants={containerMotion}
          initial="hidden"
          animate="show"
        >
          {items
            .filter((i) => i.label !== "Profile")
            .sort((a, b) => {
              const order = ["Home", "Offers", "Dining", "Orders"];
              const aKey =
                a.label === "Offers"
                  ? "Offers"
                  : a.label === "Dining"
                  ? "Dining"
                  : a.label === "Home"
                  ? "Home"
                  : a.sidebarImgSrc
                  ? "Delivery"
                  : a.label || "";
              const bKey =
                b.label === "Offers"
                  ? "Offers"
                  : b.label === "Dining"
                  ? "Dining"
                  : b.label === "Home"
                  ? "Home"
                  : b.sidebarImgSrc
                  ? "Delivery"
                  : b.label || "";
              return order.indexOf(aKey) - order.indexOf(bKey);
            })
            .map(({ label, to, icon: Icon, isCustomSvg, sidebarImgSrc }) => (
              <motion.div key={to} variants={sidebarVariants}>
                {sidebarImgSrc ? (
                  <Link to={to} className="flex justify-center">
                    <img
                      src={sidebarImgSrc}
                      alt={label}
                      className="h-16 w-auto"
                    />
                  </Link>
                ) : isCustomSvg ? (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 text-sm font-medium",
                        isActive
                          ? "bg-[#22c7bc] text-black"
                          : "hover:bg-[#22c7bca9] text-[#0000004D]"
                      )
                    }
                  >
                    {/* same Add Polls SVG */}
                    <svg
                      viewBox="0 0 21 21"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                    >
                      <path d="M9.33813 5.26872V17.2286C9.33813 17.7022 8.96094 18.0843 8.49935 18.0843H6.90092C6.43669 18.0843 6.06213 17.6995 6.06213 17.2286V5.26872C6.06213 4.79517 6.43932 4.41309 6.90092 4.41309H8.49935C8.96358 4.41309 9.33813 4.79517 9.33813 5.26872ZM2.64633 8.82038H0.749913C0.367457 8.82038 0.0588379 9.13518 0.0588379 9.52534V17.382C0.0588379 17.7722 0.36744 18.087 0.749913 18.087H2.64633C3.02878 18.087 3.3374 17.7722 3.3374 17.382V9.52534C3.3374 9.1352 3.02615 8.82038 2.64633 8.82038ZM14.5712 6.56557H12.8357C12.4111 6.56557 12.0655 6.91805 12.0655 7.35124V17.2986C12.0655 17.7318 12.4111 18.0843 12.8357 18.0843H14.5712C14.9959 18.0843 15.3414 17.7318 15.3414 17.2986V7.354C15.3414 6.91812 14.9959 6.56557 14.5712 6.56557Z" />
                      <path d="M17.1822 7.02707C16.9601 7.02707 16.7801 6.84701 16.7801 6.62489V0.994459C16.7801 0.772345 16.9601 0.592285 17.1822 0.592285H18.0048C18.2269 0.592285 18.4069 0.772345 18.4069 0.994459V6.62489C18.4069 6.84701 18.2269 7.02707 18.0048 7.02707H17.1822ZM14.7783 4.62311C14.5562 4.62311 14.3761 4.44305 14.3761 4.22094V3.39841C14.3761 3.1763 14.5562 2.99624 14.7783 2.99624H20.4087C20.6308 2.99624 20.8109 3.1763 20.8109 3.39841V4.22094C20.8109 4.44305 20.6308 4.62311 20.4087 4.62311H14.7783Z" />
                    </svg>
                    <span>{label}</span>
                  </NavLink>
                ) : Icon ? (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 text-sm font-medium",
                        isActive
                          ? "bg-[#22c7bc]"
                          : "hover:bg-[#22c7bc50] text-[#0000004D]"
                      )
                    }
                  >
                    <Icon className="h-6 w-6" />
                    <span>{label}</span>
                  </NavLink>
                ) : null}
              </motion.div>
            ))}
        </motion.nav>
      </section>

      <img
        src={xOctopus}
        alt="Octopus Tactical"
        className="absolute bottom-0 left-5 h-60 xl:h-80 object-contain mix-blend-screen"
      />

      <a href={"/"} className="relative h-12 w-auto z-10" aria-label="Home">
        <img src={xlogo} alt="logo" className="h-full w-full object-contain" />
      </a>
    </aside>
  ) : null;

  const topBar = showTopBar ? (
    <main
      className={cn(
        containerVariants({ variant }),
        "lg:hidden w-full h-fit bg-[#F2F3F5] rounded-t-xl",
        className
      )}
      aria-label="Top navigation"
    >
      <section className="flex items-center justify-between px-6 py-3">
        <section
          className="relative flex items-center space-x-3 cursor-pointer"
          onClick={goToProfile}
        >
          <div className="relative">
            <img
              src={filteredmeData?.apps?.xpoll?.avatar?.imageUrl ?? logo}
              alt={filteredmeData?.apps?.xpoll?.username}
              className="w-10 h-10 rounded-full object-cover object-top border-2 border-white"
            />
          </div>
          <section className="flex flex-col gap-1">
            <section className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-4 h-4 shrink-0" />
              <p className="font-semibold text-sm truncate">
                25-B, Anonymous Nagar
              </p>
            </section>
            <section className="flex items-center bg-white/50 rounded-full px-3 py-1.5 text-sm">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                className="ml-2 flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
                placeholder="Search for restaurant or a dish…"
              />
            </section>
          </section>
        </section>

        {/* Right: App Icon */}
        <figure className="h-8 w-8">
          <img
            src={xlogo}
            className="w-full h-full object-contain"
            alt="logo"
          />
        </figure>
      </section>
    </main>
  ) : null;

  const bottomBar = showBottomBar ? (
    <motion.nav
      className={cn(
        containerVariants({ variant }),
        "lg:hidden w-full max-h-[3.75rem] p-2 bg-[#25FBEC] flex justify-evenly items-center ",
        className
      )}
      aria-label="Bottom navigation"
      variants={containerMotion}
      initial="hidden"
      animate="show"
    >
      {items.map((item, idx) => {
        const isActive = location.pathname === item.to;
        return (
          <motion.div key={idx} variants={bottomVariants}>
            {item.isSpecial && item.bottomImgSrc ? (
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center",
                  item.isSpecial
                    ? "relative text-neutral-900 -mt-5 md:-mt-7"
                    : isActive
                    ? "text-neutral-900 scale-110"
                    : "text-[#1AB0A5]"
                )}
              >
                <img
                  src={item.bottomImgSrc}
                  alt={item.label || "Delivery"}
                  className={cn(
                    "h-16",
                    item.isSpecial ? "h-20 md:h-24" : isActive && "scale-110"
                  )}
                />
                {item.label && (
                  <span
                    className={cn(
                      "text-xs mt-1",
                      item.isSpecial
                        ? "-mt-4 md:-mt-6"
                        : isActive && "scale-110"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            ) : item.isCustomSvg ? (
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center",
                  isActive ? "text-black scale-110" : "text-[#1AB0A5]"
                )}
              >
                <svg
                  viewBox="0 0 21 21"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path d="M9.33813 5.26872V17.2286C9.33813 17.7022 8.96094 18.0843 8.49935 18.0843H6.90092C6.43669 18.0843 6.06213 17.6995 6.06213 17.2286V5.26872C6.06213 4.79517 6.43932 4.41309 6.90092 4.41309H8.49935C8.96358 4.41309 9.33813 4.79517 9.33813 5.26872ZM2.64633 8.82038H0.749913C0.367457 8.82038 0.0588379 9.13518 0.0588379 9.52534V17.382C0.0588379 17.7722 0.36744 18.087 0.749913 18.087H2.64633C3.02878 18.087 3.3374 17.7722 3.3374 17.382V9.52534C3.3374 9.1352 3.02615 8.82038 2.64633 8.82038ZM14.5712 6.56557H12.8357C12.4111 6.56557 12.0655 6.91805 12.0655 7.35124V17.2986C12.0655 17.7318 12.4111 18.0843 12.8357 18.0843H14.5712C14.9959 18.0843 15.3414 17.7318 15.3414 17.2986V7.354C15.3414 6.91812 14.9959 6.56557 14.5712 6.56557Z" />
                  <path d="M17.1822 7.02707C16.9601 7.02707 16.7801 6.84701 16.7801 6.62489V0.994459C16.7801 0.772345 16.9601 0.592285 17.1822 0.592285H18.0048C18.2269 0.592285 18.4069 0.772345 18.4069 0.994459V6.62489C18.4069 6.84701 18.2269 7.02707 18.0048 7.02707H17.1822ZM14.7783 4.62311C14.5562 4.62311 14.3761 4.44305 14.3761 4.22094V3.39841C14.3761 3.1763 14.5562 2.99624 14.7783 2.99624H20.4087C20.6308 2.99624 20.8109 3.1763 20.8109 3.39841V4.22094C20.8109 4.44305 20.6308 4.62311 20.4087 4.62311H14.7783Z" />
                </svg>
                <span className="text-xs mt-1">Offers</span>
              </Link>
            ) : item.icon ? (
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center",
                  isActive ? "text-black scale-110" : "text-[#1AB0A5]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label && (
                  <span className="text-xs mt-1">{item.label}</span>
                )}
              </Link>
            ) : null}
          </motion.div>
        );
      })}
    </motion.nav>
  ) : null;

  return (
    <>
      {sidebar}
      <div className="flex w-full flex-1 flex-col lg:hidden overflow-hidden">
        {topBar}
        <div className="flex-1 h-full min-h-0 overflow-y-auto">
          {mobileContent}
        </div>
        {bottomBar}
      </div>
    </>
  );
}
