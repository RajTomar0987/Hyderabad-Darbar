import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/menu';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount, isCartOpen, closeCart } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-ink-950/98 border-l border-gold-500/30 text-cream-50 h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-ink-800 flex items-center justify-between bg-ink-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-cream-50">Your Cart</h2>
              <p className="text-[11px] text-cream-200/60">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-red-400 hover:text-red-300 transition uppercase tracking-wider px-2 py-1 rounded hover:bg-red-950/40 cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full text-cream-200/50 hover:text-cream-50 hover:bg-ink-800 transition cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-cream-200/50">
              <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-ink-800 flex items-center justify-center mb-4 text-gold-500/40">
                <UtensilsCrossed size={32} />
              </div>
              <h3 className="font-display text-base font-bold text-cream-100 mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-cream-200/40 max-w-[220px] mb-6">
                Explore our authentic Hyderabadi Dum Biryanis, kebabs, and curries.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-ink-950 text-xs font-extrabold uppercase tracking-wider hover:bg-gold-400 transition cursor-pointer shadow-md"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const itemTotal = item.dish.price * item.quantity;
                return (
                  <div
                    key={item.dish.id}
                    className="flex gap-3 bg-ink-900/70 border border-ink-800 rounded-2xl p-3 sm:p-3.5 transition hover:border-gold-500/30"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-ink-950 shrink-0 border border-ink-800">
                      <img
                        src={item.dish.image}
                        alt={item.dish.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-xs sm:text-sm font-bold text-cream-50 leading-snug truncate">
                          {item.dish.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.dish.id)}
                          className="text-cream-200/40 hover:text-red-400 transition p-0.5 cursor-pointer shrink-0"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-ink-800/80">
                        <span className="font-mono text-xs text-gold-300 font-bold">
                          {formatPrice(item.dish.price)}
                        </span>

                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 bg-ink-950 border border-ink-700 rounded-full px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.dish.id, -1)}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-cream-200 hover:text-gold-300 transition cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold font-mono text-cream-50 min-w-3 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.dish.id, 1)}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-cream-200 hover:text-gold-300 transition cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <span className="font-mono font-bold text-xs text-cream-50 min-w-[50px] text-right">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-ink-800 bg-ink-900/90 space-y-3">
            <div className="space-y-1.5 text-xs text-cream-200/70">
              <div className="flex justify-between items-center text-sm font-bold text-cream-50 pt-1">
                <span>Subtotal</span>
                <span className="font-mono text-gold-300 text-base">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-cream-200/40">
                Taxes and delivery fee calculated at checkout.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 font-extrabold uppercase tracking-wider text-xs shadow-lg hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="w-full py-2.5 rounded-full border border-ink-700 hover:border-gold-500/40 text-cream-200 hover:text-cream-50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
