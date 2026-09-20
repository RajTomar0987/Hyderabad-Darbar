import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, ArrowRight, 
  Leaf, Flame, UtensilsCrossed, X
} from 'lucide-react';
import { MENU, CATEGORIES, formatPrice, type MenuCategory } from '../data/menu';
import { useCart } from '../context/CartContext';

export default function OrderPage() {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItemsCount, subtotal, openCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<'All' | MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered menu items
  const filteredDishes = useMemo(() => {
    let list = selectedCategory === 'All' ? MENU : MENU.filter(d => d.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-ink-950 text-cream-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 border border-gold-500/30 p-6 sm:p-10 shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <UtensilsCrossed size={14} className="text-gold-400" />
              Direct Kitchen Online Ordering
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-cream-50 tracking-tight">
              Order Online
            </h1>
            <p className="mt-3 text-sm sm:text-base text-cream-200/70 leading-relaxed">
              Authentic Hyderabadi Dum Biryanis, sizzling charcoal tandoori grills, curries, and fresh breads prepared for pickup or express local delivery in Dandenong.
            </p>
          </div>
        </div>

        {/* Main Grid: Menu Browser + Desktop Sticky Cart */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Menu Catalog Section */}
          <div className="space-y-6">
            {/* Search & Category Pills */}
            <div className="bg-ink-900/80 border border-ink-700/80 backdrop-blur rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-200/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search biryanis, tandoori, curries, naan..."
                  className="w-full pl-11 pr-10 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 text-sm focus:border-gold-500 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-200/50 hover:text-cream-50"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gold-500 text-ink-950 shadow-md shadow-gold-500/20'
                        : 'bg-ink-950 border border-ink-700 text-cream-200/70 hover:border-gold-500/40 hover:text-gold-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Listing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDishes.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-ink-900/40 border border-ink-800 rounded-2xl">
                  <UtensilsCrossed size={36} className="text-gold-500/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-cream-100">No dishes match your search.</p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="mt-3 text-xs text-gold-400 underline hover:text-gold-300"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredDishes.map((dish) => {
                  const cartItem = cart.find(item => item.dish.id === dish.id);
                  const qty = cartItem ? cartItem.quantity : 0;

                  return (
                    <div
                      key={dish.id}
                      className="group bg-ink-900/70 border border-ink-700/70 hover:border-gold-500/40 rounded-2xl p-4 flex gap-4 transition shadow-lg relative"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-ink-950 shrink-0 relative">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {dish.signature && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold-500 text-ink-950 text-[9px] font-extrabold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-base font-bold text-cream-50 leading-snug truncate">
                              {dish.name}
                            </h3>
                            <span className="font-mono text-sm font-bold text-gold-300 shrink-0">
                              {formatPrice(dish.price)}
                            </span>
                          </div>
                          <p className="text-xs text-cream-200/60 line-clamp-2 mt-1 leading-relaxed">
                            {dish.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-ink-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] text-cream-200/50">
                            {dish.vegetarian && (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                <Leaf size={12} /> Veg
                              </span>
                            )}
                            {dish.spicy ? (
                              <span className="inline-flex items-center text-amber-500 font-semibold">
                                {Array.from({ length: dish.spicy }).map((_, i) => (
                                  <Flame key={i} size={11} fill="currentColor" />
                                ))}
                              </span>
                            ) : null}
                          </div>

                          {qty > 0 ? (
                            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/40 rounded-full px-2 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(dish.id, -1)}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-gold-300 hover:bg-gold-500 hover:text-ink-950 transition cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold font-mono text-gold-300">{qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(dish.id, 1)}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-gold-300 hover:bg-gold-500 hover:text-ink-950 transition cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(dish)}
                              className="px-3.5 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-sm"
                            >
                              Add +
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Desktop Order Summary Sidebar */}
          <div className="hidden lg:block sticky top-28 bg-ink-900/90 border border-ink-700/80 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-gold-400" size={20} />
                <h2 className="font-display text-lg font-bold text-cream-50">Your Order</h2>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-red-400 hover:text-red-300 transition uppercase tracking-wider cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-cream-200/50">
                <ShoppingBag size={36} className="mx-auto text-gold-500/30 mb-3" />
                <p className="text-xs uppercase tracking-wider font-semibold">Your cart is empty</p>
                <p className="text-[11px] text-cream-200/40 mt-1 max-w-[200px] mx-auto">
                  Click "+ Add" on any dish to start your order.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.dish.id} className="flex items-center justify-between gap-2 text-xs border-b border-ink-800/60 pb-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-cream-50 truncate">{item.dish.name}</p>
                        <p className="font-mono text-gold-400 text-[11px]">
                          ${item.dish.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.dish.id, -1)}
                          className="w-5 h-5 rounded-full border border-ink-700 flex items-center justify-center text-cream-200 hover:text-gold-300 hover:border-gold-500 transition cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="font-mono font-bold text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.dish.id, 1)}
                          className="w-5 h-5 rounded-full border border-ink-700 flex items-center justify-center text-cream-200 hover:text-gold-300 hover:border-gold-500 transition cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                        <span className="font-mono font-bold text-cream-50 w-12 text-right">
                          ${(item.dish.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.dish.id)}
                          className="text-cream-200/40 hover:text-red-400 transition p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 pt-2 text-xs text-cream-200/70 border-t border-ink-800">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItemsCount} items)</span>
                    <span className="font-mono text-cream-50">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-cream-200/40">
                    Pickup & delivery options selected at checkout.
                  </p>
                  <div className="flex justify-between pt-2 border-t border-ink-800 text-sm font-bold text-cream-50">
                    <span>Subtotal</span>
                    <span className="font-mono text-gold-300 text-base">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 font-black uppercase tracking-wider text-xs shadow-lg hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Sticky Cart Button / Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-fadeIn">
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 shadow-2xl hover:brightness-110 transition active:scale-95 cursor-pointer border border-gold-300/40"
            aria-label="Open cart drawer"
          >
            <div className="relative">
              <ShoppingBag size={20} className="stroke-[2.5]" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-ink-950 text-gold-300 text-[10px] font-black rounded-full flex items-center justify-center border border-gold-400">
                {totalItemsCount}
              </span>
            </div>
            <div className="text-left font-sans">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-ink-900/80 leading-none">
                Cart Total
              </div>
              <div className="font-mono font-bold text-sm leading-tight text-ink-950">
                ${subtotal.toFixed(2)}
              </div>
            </div>
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
