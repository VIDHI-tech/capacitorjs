import { IonPage, IonContent } from "@ionic/react";
import { useCart } from "@/stores/cart";
import { useOrder } from "@/stores/order";
import { useNavigate } from "react-router-dom";
import { Geolocation } from "@capacitor/geolocation";

export default function OrdersPage() {
  const { items, inc, dec, remove, clear, total } = useCart();
  const placeOrder = useOrder((s) => s.placeOrder);
  const setCustomerLocation = useOrder((s) => s.setCustomerLocation);
  const navigate = useNavigate();

  const onCheckout = async () => {
    // Try to capture user's current location (permission prompt on device)
    let loc = null as { lat: number; lng: number } | null;
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setCustomerLocation(loc);
    } catch {
      // permission denied or not available – continue without location
    }

    const orderId = placeOrder(items, total(), loc);
    clear(); // empty cart after placing order
    navigate(`/order/${orderId}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="bg-white">
        <div className="bg-white min-h-full px-4 pb-24">
          <h1 className="py-3 text-lg font-semibold">Your Orders</h1>

          {items.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center gap-3 border rounded-lg p-3"
                  >
                    <img
                      src={i.img}
                      alt={i.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{i.name}</p>
                      <p className="text-sm text-gray-600">₹{i.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dec(i.id)}
                        className="w-7 h-7 rounded-full bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button
                        onClick={() => inc(i.id)}
                        className="w-7 h-7 rounded-full bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => remove(i.id)}
                      className="ml-2 text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 left-0 right-0 bg-white border-t mt-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">₹{total()}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={onCheckout}
                    className="flex-1 py-2 rounded-lg bg-black text-white font-semibold"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={clear}
                    className="px-4 py-2 rounded-lg bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
