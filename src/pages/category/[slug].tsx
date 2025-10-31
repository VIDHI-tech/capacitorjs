import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/stores/cart";
import { DISHES } from "@/config/dish";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  // selectors (hooks at top level only)
  const add = useCart((s) => s.add);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const getQty = useCart((s) => s.getQty);
  const totalAmount = useCart((s) => s.total()); // <- number
  const totalItems = useCart((s) => s.totalItems()); // <- number

  const dishes = useMemo(() => DISHES[slug] ?? [], [slug]);
  const title = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Category";

  useEffect(() => {
    if (slug) sessionStorage.setItem("lastCategory", slug);
  }, [slug]);
  return (
    <div className="bg-white min-h-full px-4 pb-28">
      <div className="sticky top-0 bg-white py-3 text-lg font-semibold">
        {title}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dishes.map((d) => {
          const qty = getQty(d.id); // safe to call (not a hook)
          return (
            <div
              key={d.id}
              className="rounded-xl border overflow-hidden shadow-sm"
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-gray-600">₹{d.price}</p>
                </div>

                <AnimatePresence mode="popLayout">
                  {qty === 0 ? (
                    <motion.button
                      key="add"
                      onClick={() =>
                        add({
                          id: d.id,
                          name: d.name,
                          price: d.price,
                          img: d.img,
                        })
                      }
                      className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500 text-white"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      Add
                    </motion.button>
                  ) : (
                    <motion.div
                      key="qty"
                      className="flex items-center gap-2 bg-emerald-50 rounded-full px-2 py-1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <button
                        onClick={() => dec(d.id)}
                        className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-lg leading-none"
                      >
                        –
                      </button>
                      <span className="min-w-6 text-center font-semibold">
                        {qty}
                      </span>
                      <button
                        onClick={() => inc(d.id)}
                        className="w-8 h-8 rounded-full bg-emerald-600 text-white text-lg leading-none"
                      >
                        +
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating "View Cart" pill */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            onClick={() => navigate("/orders")}
            className="fixed left-1/2 -translate-x-1/2 bottom-24 z-30 px-5 py-2 rounded-full shadow-lg bg-black text-white font-semibold"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
          >
            View cart • {totalItems} item{totalItems > 1 ? "s" : ""} • ₹
            {totalAmount}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
