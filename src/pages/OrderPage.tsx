import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, ArrowRight, 
  CheckCircle2, AlertCircle, Leaf, Flame, UtensilsCrossed,
  MapPin, Clock, ShieldCheck, X
} from 'lucide-react';
import { MENU, CATEGORIES, formatPrice, type Dish, type MenuCategory } from '../data/menu';
import { useAuth } from '../context/AuthContext';
import { api, type OrderItem } from '../config/api';

interface CartItem {
  dish: Dish;
  quantity: number;
}

export default function OrderPage() {
  const { user, firebaseUser, isAuthenticated } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<'All' | MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Checkout form state
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '52D Foster Street, Dandenong (Store Pickup)',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Sync user info into checkout form when modal opens or user loads
  React.useEffect(() => {
    const defaultName = user?.displayName || firebaseUser?.displayName || (user?.name && user.name !== 'Customer' ? user.name : '');
    const defaultEmail = user?.email || firebaseUser?.email || '';
    const defaultPhone = user?.phone || firebaseUser?.phoneNumber || '';

    setCheckoutForm(prev => ({
      ...prev,
      name: prev.name || defaultName || '',
      email: prev.email || defaultEmail || '',
      phone: prev.phone || defaultPhone || ''
    }));
  }, [user, firebaseUser]);

  // Update address default when toggling order type
  const handleOrderTypeChange = (type: 'pickup' | 'delivery') => {
    setOrderType(type);
    if (type === 'pickup') {
      setCheckoutForm(prev => ({
        ...prev,
        address: '52D Foster Street, Dandenong (Store Pickup)'
      }));
    } else {
      setCheckoutForm(prev => ({
        ...prev,
        address: prev.address === '52D Foster Street, Dandenong (Store Pickup)' ? '' : prev.address
      }));
    }
  };

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

  // Cart operations
  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart totals
  const totalItemsCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.dish.price * item.quantity, 0), [cart]);
  const deliveryFee = orderType === 'delivery' ? (subtotal > 60 ? 0 : 5) : 0;
  const grandTotal = subtotal + deliveryFee;

  // Submit Order to backend
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!checkoutForm.name.trim()) {
      setOrderError('Please provide your full name.');
      return;
    }
    if (!checkoutForm.phone.trim()) {
      setOrderError('Please provide a contact phone number.');
      return;
    }
    if (orderType === 'delivery' && !checkoutForm.address.trim()) {
      setOrderError('Please provide your delivery address.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    const orderPayloadItems: OrderItem[] = cart.map(item => ({
      id: item.dish.id,
      name: item.dish.name,
      price: item.dish.price,
      quantity: item.quantity
    }));

    const fullAddress = orderType === 'pickup' 
      ? `Store Pickup (Foster St, Dandenong)${checkoutForm.notes ? ` - Note: ${checkoutForm.notes}` : ''}`
      : `${checkoutForm.address.trim()}${checkoutForm.notes ? ` (Instructions: ${checkoutForm.notes})` : ''}`;

    try {
      const response = await api.orders.create({
        customerName: checkoutForm.name.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim() || undefined,
        address: fullAddress,
        items: orderPayloadItems,
        totalAmount: Number(grandTotal.toFixed(2))
      });

      if (response.success && response.data) {
        setPlacedOrder(response.data);
        clearCart();
        setShowCheckoutModal(false);
      } else {
        throw new Error(response.message || 'Failed to submit your order.');
      }
    } catch (err: any) {
      setOrderError(err.message || 'Failed to submit order. Please verify details and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              Order authentic Hyderabadi Dum Biryanis, sizzling tandoori grills, curries, and breads freshly prepared for pickup or express local delivery.
            </p>
          </div>
        </div>

        {/* Order Confirmed Screen if order was just placed */}
        {placedOrder && (
          <div className="mb-10 p-6 sm:p-10 bg-ink-900/90 border border-emerald-500/40 rounded-3xl shadow-2xl animate-fadeIn">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream-50 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-sm text-cream-200/80 mb-6">
                Thank you, <strong className="text-gold-300">{placedOrder.customerName}</strong>. Our kitchen has received your order and is preparing your meal.
              </p>
              
              <div className="bg-ink-950/80 border border-ink-700/80 rounded-2xl p-5 mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-ink-800 pb-2">
                  <span className="text-cream-200/60">Order Reference:</span>
                  <span className="font-mono text-gold-400 font-bold">#{placedOrder.orderId || placedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-ink-800 pb-2">
                  <span className="text-cream-200/60">Estimated Preparation:</span>
                  <span className="text-cream-100 font-medium">20–30 Minutes</span>
                </div>
                <div className="flex justify-between border-b border-ink-800 pb-2">
                  <span className="text-cream-200/60">Fulfillment:</span>
                  <span className="text-cream-100">{placedOrder.address}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-cream-100">Total Charged:</span>
                  <span className="text-gold-300 font-mono">${Number(placedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {isAuthenticated && (
                  <Link
                    to="/account"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-ink-800 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-wider hover:bg-ink-700 transition"
                  >
                    View in My Account
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setPlacedOrder(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gold-500 text-ink-950 text-xs font-extrabold uppercase tracking-wider hover:bg-gold-400 transition cursor-pointer"
                >
                  Order More Items
                </button>
              </div>
            </div>
          </div>
        )}

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
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold font-mono text-gold-300">{qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(dish.id, 1)}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-gold-300 hover:bg-gold-500 hover:text-ink-950 transition cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(dish)}
                              className="px-3 py-1 rounded-full bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-sm"
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
                  className="text-[11px] text-red-400 hover:text-red-300 transition uppercase tracking-wider"
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
                  <div className="flex justify-between">
                    <span>Fulfillment</span>
                    <span className="capitalize text-gold-300">{orderType}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-mono text-cream-50">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-ink-800 text-sm font-bold text-cream-50">
                    <span>Total</span>
                    <span className="font-mono text-gold-300 text-base">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 font-extrabold uppercase tracking-wider text-xs shadow-lg hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Bar for Mobile */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed inset-x-3 bottom-3 z-40 bg-ink-900 border border-gold-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 text-ink-950 flex items-center justify-center font-bold font-mono text-sm shadow">
              {totalItemsCount}
            </div>
            <div>
              <p className="text-[11px] text-cream-200/60 uppercase tracking-wider">Subtotal</p>
              <p className="font-mono font-bold text-gold-300 text-sm">${subtotal.toFixed(2)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCheckoutModal(true)}
            className="px-5 py-2.5 rounded-full bg-gold-500 text-ink-950 text-xs font-extrabold uppercase tracking-wider hover:bg-gold-400 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Review & Order</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-ink-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-cream-200/50 hover:text-cream-50"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-gold-400" size={20} />
              <h3 className="font-display text-2xl font-bold text-cream-50">
                Complete Your Order
              </h3>
            </div>
            <p className="text-xs text-cream-200/70 mb-5">
              Review your items and confirm contact details for kitchen fulfillment.
            </p>

            {orderError && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              {/* Pickup / Delivery Toggle */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-2">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOrderTypeChange('pickup')}
                    className={`py-2.5 px-4 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                      orderType === 'pickup'
                        ? 'bg-gold-500 text-ink-950 shadow'
                        : 'bg-ink-950 border border-ink-700 text-cream-200/70 hover:border-gold-500/40'
                    }`}
                  >
                    <Clock size={14} />
                    <span>Store Pickup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOrderTypeChange('delivery')}
                    className={`py-2.5 px-4 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                      orderType === 'delivery'
                        ? 'bg-gold-500 text-ink-950 shadow'
                        : 'bg-ink-950 border border-ink-700 text-cream-200/70 hover:border-gold-500/40'
                    }`}
                  >
                    <MapPin size={14} />
                    <span>Delivery</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                    Your Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Tariq Khan"
                    className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                    Phone Number <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0412 345 678"
                    className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                  Email Address (for confirmation)
                </label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Delivery Address or Pickup Location */}
              {orderType === 'delivery' ? (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                    Delivery Address <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street number, street name, suburb (Dandenong area)"
                    className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="p-3 bg-ink-950/80 border border-ink-800 rounded-xl text-cream-200/80 flex items-center gap-2">
                  <MapPin size={16} className="text-gold-400 shrink-0" />
                  <span>Pickup Location: <strong>52D Foster Street, Dandenong VIC 3175</strong></span>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                  Kitchen Notes / Dietary Requests
                </label>
                <textarea
                  rows={2}
                  value={checkoutForm.notes}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Mild spice, extra raita, gate code, etc."
                  className="w-full px-3.5 py-2 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Order Summary Recap */}
              <div className="bg-ink-950 p-4 rounded-xl border border-ink-800 space-y-2">
                <div className="flex justify-between font-semibold text-cream-100">
                  <span>Total Payable:</span>
                  <span className="font-mono text-gold-300 text-sm">${grandTotal.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-cream-200/50">
                  Payment Method: <strong>Pay at Counter / Cash on Delivery</strong> (Online Card checkout can be linked).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-3 rounded-full border border-ink-700 text-cream-200 font-bold uppercase tracking-wider hover:bg-ink-800 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-full bg-gold-500 text-ink-950 font-extrabold uppercase tracking-wider hover:bg-gold-400 transition disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
