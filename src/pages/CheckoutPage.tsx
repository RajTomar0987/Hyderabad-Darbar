import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, ShieldCheck, MapPin, Clock, ArrowRight, 
  AlertCircle, CheckCircle2, User, Phone, Mail, 
  LogIn, UserPlus, ChevronLeft, UtensilsCrossed, Trash2, Plus, Minus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api, type OrderItem } from '../config/api';
import { formatPrice } from '../data/menu';

const PICKUP_TIMES = [
  'ASAP (20–30 mins)',
  'In 45 minutes',
  'In 1 hour',
  'In 1.5 hours',
  'Specific Time (Add in notes)'
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, firebaseUser, isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount } = useCart();

  // Form State
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupTime, setPickupTime] = useState<string>('ASAP (20–30 mins)');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    streetAddress: '',
    suburb: 'Dandenong',
    postcode: '3175',
    instructions: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync user profile when loaded or authenticated
  useEffect(() => {
    const defaultName = 
      user?.displayName || 
      firebaseUser?.displayName || 
      (user?.name && user.name !== 'Customer' ? user.name : '');
    const defaultEmail = user?.email || firebaseUser?.email || '';
    const defaultPhone = user?.phone || firebaseUser?.phoneNumber || '';

    setFormData(prev => ({
      ...prev,
      name: prev.name || defaultName || '',
      email: prev.email || defaultEmail || '',
      phone: prev.phone || defaultPhone || ''
    }));
  }, [user, firebaseUser]);

  // Delivery fee calculation
  const deliveryFee = orderType === 'delivery' ? (subtotal > 60 ? 0 : 5) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // 1. If not authenticated, require authentication before order submission
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // 2. Validate customer contact info
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }

    // 3. Validate delivery fields if delivery is selected
    if (orderType === 'delivery') {
      if (!formData.streetAddress.trim()) {
        setErrorMessage('Please enter your street address for delivery.');
        return;
      }
      if (!formData.suburb.trim()) {
        setErrorMessage('Please enter your suburb/city for delivery.');
        return;
      }
      if (!formData.postcode.trim()) {
        setErrorMessage('Please enter your postal code.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Build order items payload
    const orderItems: OrderItem[] = cart.map(item => ({
      id: item.dish.id,
      name: item.dish.name,
      price: item.dish.price,
      quantity: item.quantity
    }));

    const completeDeliveryAddress = orderType === 'delivery'
      ? `${formData.streetAddress.trim()}, ${formData.suburb.trim()} VIC ${formData.postcode.trim()}`
      : '52D Foster Street, Dandenong VIC 3175 (Store Pickup)';

    const completeInstructions = [
      formData.instructions.trim() ? `Delivery: ${formData.instructions.trim()}` : null,
      formData.notes.trim() ? `Kitchen: ${formData.notes.trim()}` : null
    ].filter(Boolean).join(' | ');

    try {
      const response = await api.orders.create({
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        orderType,
        address: completeDeliveryAddress,
        pickupTime: orderType === 'pickup' ? pickupTime : undefined,
        deliveryInstructions: completeInstructions || undefined,
        items: orderItems,
        totalAmount: Number(grandTotal.toFixed(2))
      });

      if (response.success && response.data) {
        const orderId = response.data.orderId || response.data.id;
        clearCart();
        navigate(`/order/success/${orderId}`, { state: { order: response.data } });
      } else {
        throw new Error(response.message || 'Failed to complete order.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit your order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-ink-950 text-cream-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-ink-900/80 border border-ink-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-4">
            <ShoppingBag size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-cream-50 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-cream-200/60 mb-6 leading-relaxed">
            Please add your favorite Hyderabadi Dum Biryani or grill dishes before proceeding to checkout.
          </p>
          <Link
            to="/order"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-black uppercase tracking-wider transition shadow-lg"
          >
            <UtensilsCrossed size={16} />
            <span>Browse Restaurant Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-ink-950 text-cream-50">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cream-200/60 hover:text-gold-300 transition"
          >
            <ChevronLeft size={16} />
            <span>Back to Menu</span>
          </Link>
          <span className="text-xs font-mono text-gold-400 font-bold">
            Checkout • {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
            Order Checkout
          </h1>
          <p className="text-sm text-cream-200/60 mt-1">
            Review your dishes and select your fulfillment preferences.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-3 animate-fadeIn">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left Column: Fulfillment & Details */}
            <div className="space-y-6">
              {/* Step 1: Fulfillment Type */}
              <div className="bg-ink-900/85 border border-ink-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-gold-400">
                  <Clock size={20} />
                  <h2 className="font-display text-lg font-bold text-cream-50">
                    1. Fulfillment Method
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-3.5 px-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                      orderType === 'pickup'
                        ? 'bg-gold-500 text-ink-950 shadow-md shadow-gold-500/20 font-black'
                        : 'bg-ink-950 border border-ink-700 text-cream-200/70 hover:border-gold-500/40'
                    }`}
                  >
                    <Clock size={16} />
                    <span>Store Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-3.5 px-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                      orderType === 'delivery'
                        ? 'bg-gold-500 text-ink-950 shadow-md shadow-gold-500/20 font-black'
                        : 'bg-ink-950 border border-ink-700 text-cream-200/70 hover:border-gold-500/40'
                    }`}
                  >
                    <MapPin size={16} />
                    <span>Local Delivery</span>
                  </button>
                </div>

                {/* Pickup Details */}
                {orderType === 'pickup' && (
                  <div className="pt-3 space-y-3 border-t border-ink-800">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                        Preferred Pickup Time
                      </label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                      >
                        {PICKUP_TIMES.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-4 bg-ink-950/80 border border-ink-800 rounded-2xl flex items-start gap-3">
                      <MapPin size={18} className="text-gold-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-cream-200/80 leading-relaxed">
                        <strong className="text-cream-50">Hyderabad Darbar Dandenong</strong>
                        <p>52D Foster Street, Dandenong VIC 3175</p>
                        <p className="text-cream-200/50 mt-1">Contact: (03) 9792 2288</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Details */}
                {orderType === 'delivery' && (
                  <div className="pt-3 space-y-3 border-t border-ink-800">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                        Street Address <span className="text-gold-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Unit, house number and street name"
                        required={orderType === 'delivery'}
                        className="w-full px-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs placeholder-cream-200/30 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                          Suburb / City <span className="text-gold-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="suburb"
                          value={formData.suburb}
                          onChange={handleInputChange}
                          placeholder="e.g. Dandenong"
                          required={orderType === 'delivery'}
                          className="w-full px-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs placeholder-cream-200/30 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                          Postcode <span className="text-gold-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          placeholder="e.g. 3175"
                          required={orderType === 'delivery'}
                          className="w-full px-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs placeholder-cream-200/30 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                        Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        placeholder="Leave at porch, call on arrival, gate code..."
                        className="w-full px-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs placeholder-cream-200/30 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Customer Contact Information */}
              <div className="bg-ink-900/85 border border-ink-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gold-400">
                    <User size={20} />
                    <h2 className="font-display text-lg font-bold text-cream-50">
                      2. Customer Information
                    </h2>
                  </div>
                  {isAuthenticated && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                      <CheckCircle2 size={13} /> Logged In
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                      Full Name <span className="text-gold-400">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/50" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                      Phone Number <span className="text-gold-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/50" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0412 345 678"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                    Email Address (for order receipt)
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                    Special Kitchen Notes / Dietary Requests
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Mild spicy, extra mint chutney, cutlery required..."
                    className="w-full p-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs placeholder-cream-200/30 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order Button */}
            <div className="sticky top-28 bg-ink-900/90 border border-ink-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-ink-800 pb-3">
                <div className="flex items-center gap-2 text-gold-400">
                  <ShoppingBag size={18} />
                  <h2 className="font-display text-base font-bold text-cream-50">
                    Order Summary
                  </h2>
                </div>
                <span className="text-xs font-mono text-cream-200/60 font-semibold">
                  {totalItemsCount} items
                </span>
              </div>

              {/* Itemized list */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 text-xs">
                {cart.map((item) => (
                  <div
                    key={item.dish.id}
                    className="flex items-center justify-between gap-2 border-b border-ink-800/60 pb-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-cream-50 truncate">{item.dish.name}</p>
                      <p className="font-mono text-gold-400 text-[11px]">
                        {formatPrice(item.dish.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 bg-ink-950 border border-ink-800 rounded-full px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.dish.id, -1)}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-cream-200 hover:text-gold-300"
                        >
                          <Minus size={9} />
                        </button>
                        <span className="font-mono font-bold text-[11px] min-w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.dish.id, 1)}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-cream-200 hover:text-gold-300"
                        >
                          <Plus size={9} />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-cream-50 text-right min-w-[50px]">
                        ${(item.dish.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.dish.id)}
                        className="text-cream-200/40 hover:text-red-400 transition"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-ink-800 text-xs text-cream-200/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-cream-50">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Fulfillment</span>
                  <span className="capitalize text-gold-300 font-semibold">{orderType}</span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-mono text-cream-50">
                      {deliveryFee === 0 ? 'FREE (over $60)' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-ink-800 text-sm font-bold text-cream-50">
                  <span>Grand Total</span>
                  <span className="font-mono text-gold-300 text-base">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-ink-950/80 border border-ink-800 rounded-xl text-[11px] text-cream-200/60 leading-relaxed">
                <p>
                  Payment Status: <strong className="text-gold-400">Unpaid</strong> (Pay at Counter / Cash on Delivery).
                </p>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 font-black uppercase tracking-wider text-xs shadow-xl hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Unauthenticated Login Prompt Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-ink-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 relative shadow-2xl text-center">
            <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 rounded-2xl flex items-center justify-center text-gold-400 mx-auto mb-4">
              <ShieldCheck size={28} />
            </div>

            <h3 className="font-display text-2xl font-bold text-cream-50 mb-2">
              Authentication Required
            </h3>
            <p className="text-xs text-cream-200/70 mb-6 leading-relaxed">
              Please sign in or create an account to place your order. Your cart and checkout information will be preserved.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/login', { state: { from: '/checkout' } });
                }}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-ink-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/signup', { state: { from: '/checkout' } });
                }}
                className="w-full py-3 rounded-full bg-ink-950 border border-gold-500/40 text-gold-300 font-bold text-xs uppercase tracking-wider hover:bg-ink-800 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-cream-200/50 hover:text-cream-50 transition pt-2"
              >
                Cancel and return to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
