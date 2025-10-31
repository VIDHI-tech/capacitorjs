// import { useNavigate, Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { CSSProperties } from "react";
// import { endpoints } from "@/api/endpoints";
// import { Loader2, Mail } from "lucide-react";

// export default function AuthLanding() {
//   const navigate = useNavigate();
//   const { user, isLoading } = useAuth();

//   const handleEmail = () => navigate("/login");
//   const handleGoogleLogin = () => {
//     const returnTo = encodeURIComponent(
//       import.meta.env.VITE_CLIENT_URL + "/disclaimer"
//     );
//     window.location.href = `${import.meta.env.VITE_BACKEND_URL}${
//       endpoints.auth.oauthGoogle
//     }?returnTo=${returnTo}`;
//   };
//   const handleTwitterLogin = () => {
//     const returnTo = encodeURIComponent(
//       import.meta.env.VITE_CLIENT_URL + "/disclaimer"
//     );
//     window.location.href = `${import.meta.env.VITE_BACKEND_URL}${
//       endpoints.auth.oauthTwitter
//     }?returnTo=${returnTo}`;
//     console.log(
//       "reaching in handleTwitterLogin",
//       `${import.meta.env.VITE_BACKEND_URL}
//     ${endpoints.auth.oauthTwitter}?returnTo=${returnTo}`
//     );
//   };
//   const glassPanelStyle: CSSProperties = {
//     background:
//       "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.84) 126.84%)",
//     boxShadow: "0px 4px 4px 0px #00000040, inset 1px 1px 5.5px 1px #FFFFFF33",
//     borderRadius: 20,
//   };

//   const glassButtonStyle: CSSProperties = {
//     background: "#FFFFFF82",
//     boxShadow: "0px 4px 4px 0px #00000040, inset 1px 1px 5.5px 1px #FFFFFF33",
//     borderRadius: 999,
//   };

//   if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;
//   if (user) return <Navigate to="/home" replace />;

//   return (
//     <div className="relative h-full overflow-hidden">
//       {/* Background */}

//       {/* CONTENT */}
//       <div className="relative z-10 flex min-h-screen flex-col items-center lg:justify-center">
//         <div
//           className="
//             fixed left-1/2 bottom-[max(1rem,env(safe-area-inset-bottom))]
//             w-[92%] md:w-[70%] -translate-x-1/2
//             supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-200
//             lg:static lg:translate-x-0 lg:w-auto lg:max-w-[500px]
//           "
//           style={glassPanelStyle}
//         >
//           <div className="px-2 py-4 lg:px-5 lg:py-7 rounded-sm">
//             {/* Continue with E-mail */}
//             <button
//               onClick={handleEmail}
//               style={glassButtonStyle}
//               className="mb-3 flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-gray-900
//                          transition hover:brightness-105 lg:mb-4 w-full lg:w-[450px] justify-center"
//             >
//               <section className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600/90 text-white">
//                 <Mail className="w-4 h-4" />
//               </section>
//               Continue with E-mail
//             </button>

//             {/* Google + X row */}
//             <div className="grid grid-cols-2 gap-3 lg:gap-4">
//               <button
//                 onClick={handleGoogleLogin}
//                 style={glassButtonStyle}
//                 className="flex items-center justify-center gap-1 px-2 py-4 text-[10px] lg:text-[12px] font-medium text-gray-800 transition hover:brightness-105"
//               >
//                 {/* Google G */}
//                 Continue with Google
//               </button>

//               <button
//                 onClick={handleTwitterLogin}
//                 style={glassButtonStyle}
//                 className="flex items-center justify-center gap-1 px-2 py-4 text-[10px] lg:text-[12px] font-medium text-gray-800 transition hover:brightness-105"
//               >
//                 Continue with X
//               </button>
//             </div>

//             <p className="mt-3 text-center text-[13px] text-white lg:mt-4">
//               Don’t have an account?{" "}
//               <a
//                 href="/signup"
//                 className="font-semibold underline underline-offset-2"
//               >
//                 Sign up
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { categories, quickFilters } from "@/config/category";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { lastCategory?: string } };
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const fromState = location.state?.lastCategory ?? null;
    const fromSession = sessionStorage.getItem("lastCategory");
    setActive(fromState || fromSession);
    // clear history state so future navigations don't stale-highlight
    if (location.state?.lastCategory) {
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleOpen = (slug: string) => {
    setActive(slug);
    sessionStorage.setItem("lastCategory", slug);
    navigate(`/category/${slug}`, { state: { lastCategory: slug } });
  };

  return (
    <div className="bg-white min-h-full">
      <section className="px-4 pt-4 pb-2 bg-white">
        <div className="flex items-center gap-2 text-gray-900">
          <MapPin className="w-4 h-4 shrink-0" />
          <p className="font-semibold text-sm truncate">
            25-B, Anonymous Nagar
          </p>
        </div>

        <div className="mt-2 flex items-center bg-gray-100 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="ml-2 flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
            placeholder="Search for restaurant or a dish…"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white">
            Delivery
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
            Self Pickup
          </button>
        </div>
      </section>

      <motion.section
        className="px-4 mt-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="rounded-2xl overflow-hidden shadow">
          <img
            src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8MzAlMjUlMjBvZmZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500"
            alt="Hot Deals"
            className="w-full h-52 object-fill"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {quickFilters.map((f) => (
            <button
              key={f}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {f}
            </button>
          ))}
        </div>
      </motion.section>

      <section className="px-4 mt-5 pb-24">
        <h2 className="font-semibold text-lg mb-3">Eat what makes you happy</h2>

        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const isActive = active === cat.slug;
            return (
              <motion.button
                type="button"
                key={cat.slug}
                onClick={() => handleOpen(cat.slug)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.22 }}
                className="flex flex-col items-center"
              >
                <div
                  className={[
                    "w-16 h-16 rounded-full overflow-hidden border",
                    isActive
                      ? "border-red-500 ring-2 ring-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                  />
                </div>
                <p
                  className={[
                    "mt-2 text-[11px] text-center leading-tight",
                    isActive ? "text-red-600 font-semibold" : "text-gray-800",
                  ].join(" ")}
                >
                  {cat.name}
                </p>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Landing;
