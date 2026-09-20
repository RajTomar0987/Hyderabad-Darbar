import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { api, type Order } from '../config/api';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<Order | null>(() => {
    return location.state?.order || null;
  });
  const [loading, setLoading] = useState(!order);
  const [, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const res = await api.orders.getById(orderId);
          if (res.success && res.data) {
            setOrder(res.data);
          } else {
            setFetchError(res.message || 'Order details not found.');
          }
        } catch (err: any) {
          setFetchError(err.message || 'Failed to retrieve order confirmation.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderId]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-ink-950 text-cream-50 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-ink-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center relative z-10 mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-950/50">
              <CheckCircle2 size={42} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-2">
              <span>●</span> Order Confirmed
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-50">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/80 mt-2 max-w-md mx-auto">
              Thank you for ordering with Hyderabad Darbar. Our kitchen has received your order and started preparation.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-cream-200/50">
              <div className="w-8 h-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wider">Loading order receipt...</p>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              {/* Receipt Summary Card */}
              <div className="bg-ink-950/90 border border-ink-800 rounded-2xl p-5 sm:p-6 text-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-ink-800 pb-3">
                  <div>
                    <span className="text-cream-200/60 text-[11px] uppercase tracking-wider font-semibold">Order Number</span>
                    <div className="font-mono text-gold-400 text-base font-bold">
                      #{order?.orderId || order?.id || orderId}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-cream-200/60 text-[11px] uppercase tracking-wider font-semibold">Order Status</span>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-bold uppercase text-[10px]">
                        {order?.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-ink-800">
                  <div>
                    <span className="text-cream-200/60 text-[11px] uppercase tracking-wider font-semibold">Customer</span>
                    <p className="text-cream-50 font-bold mt-0.5">{order?.customerName || 'Valued Guest'}</p>
                    {order?.phone && <p className="text-cream-200/60 text-[11px]">{order.phone}</p>}
                  </div>

                  <div>
                    <span className="text-cream-200/60 text-[11px] uppercase tracking-wider font-semibold">Fulfillment Type</span>
                    <p className="text-gold-300 font-bold mt-0.5 capitalize">{order?.orderType || 'Pickup'}</p>
                    {order?.orderType === 'pickup' && order?.pickupTime && (
                      <p className="text-cream-200/70 text-[11px] flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-gold-400" />
                        Time: {order.pickupTime}
                      </p>
                    )}
                  </div>
                </div>

                <div className="py-2 border-b border-ink-800">
                  <span className="text-cream-200/60 text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
                    <MapPin size={12} className="text-gold-400" />
                    {order?.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                  </span>
                  <p className="text-cream-100">{order?.address || '52D Foster Street, Dandenong VIC 3175'}</p>
                  {order?.deliveryInstructions && (
                    <p className="text-cream-200/60 italic text-[11px] mt-1">
                      Notes: {order.deliveryInstructions}
                    </p>
                  )}
                </div>

                {/* Itemized List */}
                {order?.items && order.items.length > 0 && (
                  <div className="py-2 border-b border-ink-800 space-y-1.5">
                    <span className="text-cream-200/60 text-[11px] uppercase tracking-wider font-semibold block mb-1">
                      Dishes Ordered
                    </span>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-cream-100">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-mono text-cream-200/70">${(Number(it.price) * Number(it.quantity)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotals & Total */}
                <div className="space-y-1.5 pt-1">
                  {order?.subtotal !== undefined && (
                    <div className="flex justify-between text-cream-200/70">
                      <span>Subtotal</span>
                      <span className="font-mono">${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                  )}
                  {order?.deliveryFee !== undefined && order.deliveryFee > 0 && (
                    <div className="flex justify-between text-cream-200/70">
                      <span>Delivery Fee</span>
                      <span className="font-mono">${Number(order.deliveryFee).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold text-cream-50 pt-2 border-t border-ink-800">
                    <span>Total Amount</span>
                    <span className="font-mono text-gold-300 text-lg">
                      ${Number(order?.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-cream-200/50 pt-1">
                    <span>Payment Status</span>
                    <span className="uppercase font-semibold text-gold-400">
                      {order?.paymentStatus || 'unpaid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kitchen Preparation Note */}
              <div className="p-4 bg-ink-950/60 border border-ink-800 rounded-2xl flex items-center gap-3 text-xs text-cream-200/70">
                <Clock size={18} className="text-gold-400 shrink-0" />
                <span>Estimated preparation time: <strong>20–30 minutes</strong>. Our staff will contact you if needed.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/account"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-black uppercase tracking-wider transition shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>VIEW MY ORDERS</span>
                </Link>

                <Link
                  to="/order"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-ink-950 border border-ink-700 hover:border-gold-500/40 text-cream-200 hover:text-cream-50 text-xs font-bold uppercase tracking-wider transition text-center flex items-center justify-center gap-2"
                >
                  <UtensilsCrossed size={15} />
                  <span>BACK TO MENU</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
