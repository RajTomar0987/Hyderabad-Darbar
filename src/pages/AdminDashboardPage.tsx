import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Calendar, Utensils, Star, MessageSquare, 
  LogOut, Plus, Edit2, Trash2, CheckCircle2, DollarSign, RefreshCw, 
  Search, ShieldAlert, X, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  api, 
  type DashboardStats, 
  type MenuItem, 
  type Order, 
  type Reservation, 
  type Review, 
  type ContactMessage 
} from '../config/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'reservations' | 'menu' | 'reviews' | 'contact'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Search/Filter states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [menuFilterCat, setMenuFilterCat] = useState<string>('all');

  // Menu item modal state (Add / Edit)
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: 'Mains',
    price: '',
    description: '',
    badge: '',
    spicy: false,
    vegetarian: false,
    image: '/images/biryani-chicken.jpg'
  });
  const [savingMenu, setSavingMenu] = useState(false);

  // Contact Message Viewer Modal
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, ordersRes, resvRes, menuRes, revRes, contactRes] = await Promise.all([
        api.admin.getStats().catch(() => ({ success: false, data: null })),
        api.orders.getAll().catch(() => ({ success: false, data: [] as Order[] })),
        api.reservations.getAll().catch(() => ({ success: false, data: [] as Reservation[] })),
        api.menu.getAll().catch(() => ({ success: false, data: { items: [] as MenuItem[], grouped: {} } })),
        api.reviews.getAll().catch(() => ({ success: false, data: [] as Review[] })),
        api.contact.getAll().catch(() => ({ success: false, data: [] as ContactMessage[] }))
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
      if (resvRes.success && resvRes.data) setReservations(resvRes.data);
      if (menuRes.success && menuRes.data) setMenuItems(menuRes.data.items || []);
      if (revRes.success && revRes.data) setReviews(revRes.data);
      if (contactRes.success && contactRes.data) setContactMessages(contactRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to sync admin data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Status updates
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.orders.updateStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order #${orderId} marked as ${newStatus}`);
        setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus as any } : o));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleReservationStatusChange = async (resvId: string, newStatus: string) => {
    try {
      const res = await api.reservations.updateStatus(resvId, newStatus);
      if (res.success) {
        showToast(`Reservation #${resvId} marked as ${newStatus}`);
        setReservations(prev => prev.map(r => (r.id === resvId || r.reservationId === resvId) ? { ...r, status: newStatus as any } : r));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update reservation status', 'error');
    }
  };

  // Menu item CRUD
  const openAddMenuModal = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      category: 'Mains',
      price: '',
      description: '',
      badge: '',
      spicy: false,
      vegetarian: false,
      image: '/images/biryani-chicken.jpg'
    });
    setShowMenuModal(true);
  };

  const openEditMenuModal = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description || '',
      badge: item.badge || '',
      spicy: !!item.spicy,
      vegetarian: !!item.vegetarian,
      image: item.image || '/images/biryani-chicken.jpg'
    });
    setShowMenuModal(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMenu(true);

    try {
      const payload = {
        name: menuFormData.name,
        category: menuFormData.category,
        price: Number(menuFormData.price),
        description: menuFormData.description,
        badge: menuFormData.badge,
        spicy: menuFormData.spicy,
        vegetarian: menuFormData.vegetarian,
        image: menuFormData.image
      };

      if (editingMenuItem) {
        const res = await api.menu.update(editingMenuItem.id, payload);
        if (res.success) {
          showToast(`Updated "${payload.name}" successfully`);
        }
      } else {
        const res = await api.menu.create(payload);
        if (res.success) {
          showToast(`Added "${payload.name}" to menu`);
        }
      }
      setShowMenuModal(false);
      await fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save menu item', 'error');
    } finally {
      setSavingMenu(false);
    }
  };

  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;
    try {
      const res = await api.menu.delete(id);
      if (res.success) {
        showToast(`Deleted "${name}"`);
        setMenuItems(prev => prev.filter(m => m.id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete menu item', 'error');
    }
  };

  // Delete review
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      const res = await api.reviews.delete(id);
      if (res.success) {
        showToast('Review removed');
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  // Delete contact message
  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await api.contact.delete(id);
      if (res.success) {
        showToast('Message deleted');
        setContactMessages(prev => prev.filter(c => c.id !== id));
        if (viewingMessage?.id === id) setViewingMessage(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete contact message', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = menuFilterCat === 'all' || item.category === menuFilterCat;
    return matchesSearch && matchesCat;
  });

  const menuCategories = Array.from(new Set(menuItems.map(m => m.category)));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-ink-950 text-cream-50">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-sm animate-fadeIn ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
            : 'bg-red-950/90 border-red-500/40 text-red-200'
        }`}>
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="bg-ink-900/90 border border-gold-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert size={12} />
                  Admin Console
                </span>
                <span className="text-xs text-cream-200/50">
                  Hyderabad Darbar Executive
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-cream-50 font-bold">
                Restaurant Administration
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchAllData}
                disabled={refreshing}
                title="Refresh All Records"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-ink-700 bg-ink-950/80 text-xs font-semibold text-cream-200 hover:text-gold-300 hover:border-gold-500/40 transition cursor-pointer"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-ink-800 pb-3 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
            { id: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length },
            { id: 'menu', label: 'Menu Items', icon: Utensils, count: menuItems.length },
            { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
            { id: 'contact', label: 'Inquiries', icon: MessageSquare, count: contactMessages.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 shadow-lg shadow-gold-500/20'
                    : 'bg-ink-900/70 text-cream-200/70 hover:text-cream-50 hover:bg-ink-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-ink-950/20 text-ink-950 font-black' : 'bg-ink-800 text-cream-200/80'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-ink-900/80 border border-ink-800 hover:border-gold-500/40 rounded-2xl p-5 shadow-xl transition">
                <div className="flex items-center justify-between text-cream-200/70 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
                  <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-cream-50">
                  ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0).toFixed(2)}
                </div>
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                  <span>●</span> Lifetime digital sales
                </p>
              </div>

              <div className="bg-ink-900/80 border border-ink-800 hover:border-gold-500/40 rounded-2xl p-5 shadow-xl transition">
                <div className="flex items-center justify-between text-cream-200/70 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Total Orders</span>
                  <div className="p-2.5 rounded-xl bg-ember-500/10 text-ember-400">
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-cream-50">
                  {orders.length}
                </div>
                <p className="text-xs text-cream-200/60 mt-2">
                  {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length} active in kitchen
                </p>
              </div>

              <div className="bg-ink-900/80 border border-ink-800 hover:border-gold-500/40 rounded-2xl p-5 shadow-xl transition">
                <div className="flex items-center justify-between text-cream-200/70 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Table Bookings</span>
                  <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
                    <Calendar size={20} />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-cream-50">
                  {reservations.length}
                </div>
                <p className="text-xs text-cream-200/60 mt-2">
                  {reservations.filter(r => r.status === 'confirmed').length} confirmed tables
                </p>
              </div>

              <div className="bg-ink-900/80 border border-ink-800 hover:border-gold-500/40 rounded-2xl p-5 shadow-xl transition">
                <div className="flex items-center justify-between text-cream-200/70 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Active Menu Dishes</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Utensils size={20} />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-cream-50">
                  {menuItems.length}
                </div>
                <p className="text-xs text-cream-200/60 mt-2">
                  Across {menuCategories.length} culinary categories
                </p>
              </div>
            </div>

            {/* Quick Dual View: Recent Orders & Recent Reservations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-ink-900/80 border border-ink-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-cream-50 font-bold">Recent Orders</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-gold-400 hover:text-gold-300 font-semibold cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id || o.orderId} className="flex items-center justify-between p-3 rounded-xl bg-ink-950/60 border border-ink-800">
                      <div>
                        <div className="text-xs font-mono text-gold-400 font-semibold">#{o.orderId}</div>
                        <div className="text-sm font-bold text-cream-50">{o.customerName}</div>
                        <div className="text-[11px] text-cream-200/50">{o.items?.length || 0} items • ${(o.totalAmount || 0).toFixed(2)}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                        o.status === 'cancelled' ? 'bg-red-950 text-red-300 border border-red-500/30' :
                        'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-xs text-cream-200/40 text-center py-6">No orders yet.</p>
                  )}
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="bg-ink-900/80 border border-ink-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-cream-50 font-bold">Recent Reservations</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-gold-400 hover:text-gold-300 font-semibold cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {reservations.slice(0, 4).map(r => (
                    <div key={r.id || r.reservationId} className="flex items-center justify-between p-3 rounded-xl bg-ink-950/60 border border-ink-800">
                      <div>
                        <div className="text-xs font-mono text-gold-400 font-semibold">#{r.reservationId}</div>
                        <div className="text-sm font-bold text-cream-50">{r.name}</div>
                        <div className="text-[11px] text-cream-200/50">{r.date} at {r.time} ({r.guests} guests)</div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                        r.status === 'cancelled' ? 'bg-red-950 text-red-300 border border-red-500/30' :
                        'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                  {reservations.length === 0 && (
                    <p className="text-xs text-cream-200/40 text-center py-6">No reservations booked yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-ink-900/80 border border-ink-800 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl text-cream-50 font-bold">Customer Orders</h2>
                <p className="text-xs text-cream-200/60">Live dispatch stream & kitchen status management</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-cream-200/70 font-semibold">Filter:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-1.5 bg-ink-950 border border-ink-700 rounded-xl text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink-800 text-cream-200/60 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Delivery Address</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/60">
                  {filteredOrders.map(order => (
                    <tr key={order.id || order.orderId} className="hover:bg-ink-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-gold-400">
                        #{order.orderId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cream-50">{order.customerName}</div>
                        <div className="text-cream-200/50 text-[11px]">{order.phone}</div>
                        {order.email && <div className="text-cream-200/40 text-[10px]">{order.email}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="max-w-[200px] truncate text-cream-200">
                          {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-cream-50">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 max-w-[180px] truncate text-cream-200/70">
                        {order.address}
                      </td>
                      <td className="py-3.5 px-4 text-cream-200/50 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id || order.orderId, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-ink-950 border border-ink-700 text-xs font-semibold focus:border-gold-500 focus:outline-none text-gold-300"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-cream-200/40">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="bg-ink-900/80 border border-ink-800 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl text-cream-50 font-bold">Table Reservations</h2>
                <p className="text-xs text-cream-200/60">Dine-in table bookings for Hyderabad Darbar</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink-800 text-cream-200/60 uppercase tracking-wider">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Phone / Email</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Party Size</th>
                    <th className="py-3 px-4">Special Requests</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/60">
                  {reservations.map(resv => (
                    <tr key={resv.id || resv.reservationId} className="hover:bg-ink-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-gold-400">
                        #{resv.reservationId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-cream-50">
                        {resv.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-cream-200">{resv.phone}</div>
                        {resv.email && <div className="text-cream-200/50 text-[11px]">{resv.email}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-cream-100 whitespace-nowrap">
                        {resv.date} @ {resv.time}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-cream-50">
                        {resv.guests} Guests
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] truncate text-cream-200/70 italic">
                        {resv.message || 'None'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={resv.status}
                          onChange={(e) => handleReservationStatusChange(resv.id || resv.reservationId, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-ink-950 border border-ink-700 text-xs font-semibold focus:border-gold-500 focus:outline-none text-gold-300"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-cream-200/40">
                        No table bookings recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="bg-ink-900/80 border border-ink-800 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl text-cream-50 font-bold">Menu Management</h2>
                <p className="text-xs text-cream-200/60">Add, modify, or archive royal culinary dishes</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-200/40" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className="pl-8 pr-3 py-1.5 bg-ink-950 border border-ink-700 rounded-xl text-xs text-cream-100 placeholder-cream-200/30 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <select
                  value={menuFilterCat}
                  onChange={(e) => setMenuFilterCat(e.target.value)}
                  className="px-3 py-1.5 bg-ink-950 border border-ink-700 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="all">All Categories</option>
                  {menuCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={openAddMenuModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 text-ink-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Dish</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenu.map(item => (
                <div
                  key={item.id}
                  className="bg-ink-950/80 border border-ink-800 rounded-2xl p-4 flex flex-col justify-between hover:border-gold-500/40 transition group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-ink-800 text-gold-300">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-ember-950 text-ember-300 border border-ember-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="font-display font-bold text-gold-400 text-base">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-cream-50 group-hover:text-gold-300 transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-cream-200/60 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-cream-200/50">
                      {item.vegetarian && <span className="text-emerald-400">🌱 Vegetarian</span>}
                      {item.spicy && <span className="text-red-400">🌶️ Spicy</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-ink-800/80">
                    <button
                      type="button"
                      onClick={() => openEditMenuModal(item)}
                      className="p-2 rounded-lg bg-ink-800 hover:bg-gold-500 hover:text-ink-950 text-cream-200 text-xs transition cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMenuItem(item.id, item.name)}
                      className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs transition cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-ink-900/80 border border-ink-800 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl text-cream-50 font-bold">Customer Testimonials & Reviews</h2>
                <p className="text-xs text-cream-200/60">Manage dining feedback published on the website</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(rev => (
                <div
                  key={rev.id}
                  className="bg-ink-950/80 border border-ink-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rev.rating ? 'text-gold-400 fill-gold-400' : 'text-ink-800'}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-cream-200/40">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-cream-100 italic my-2">
                      "{rev.comment}"
                    </p>
                    <h4 className="text-xs font-bold text-gold-300">
                      — {rev.name}
                    </h4>
                  </div>

                  <div className="flex justify-end pt-3 mt-2 border-t border-ink-800">
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Remove Review</span>
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="col-span-2 text-center py-10 text-cream-200/40">No reviews found.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT INQUIRIES */}
        {activeTab === 'contact' && (
          <div className="bg-ink-900/80 border border-ink-800 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl text-cream-50 font-bold">Inquiries & Catering Requests</h2>
                <p className="text-xs text-cream-200/60">Submissions from the public Contact page</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink-800 text-cream-200/60 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message Snippet</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/60">
                  {contactMessages.map(msg => (
                    <tr key={msg.id} className="hover:bg-ink-800/40 transition">
                      <td className="py-3.5 px-4 text-cream-200/50 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cream-50">{msg.name}</div>
                        <div className="text-cream-200/60 text-[11px]">{msg.email}</div>
                        <div className="text-cream-200/40 text-[10px]">{msg.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gold-300">
                        {msg.subject}
                      </td>
                      <td className="py-3.5 px-4 max-w-[260px] truncate text-cream-200/70">
                        {msg.message}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewingMessage(msg)}
                          className="px-2.5 py-1 rounded-lg bg-ink-800 hover:bg-gold-500 hover:text-ink-950 text-cream-200 text-xs font-semibold mr-2 transition cursor-pointer"
                        >
                          <Eye size={12} className="inline mr-1" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(msg.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold transition cursor-pointer"
                        >
                          <Trash2 size={12} className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {contactMessages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-cream-200/40">
                        No contact inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-ink-900 border border-gold-500/30 rounded-3xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowMenuModal(false)}
              className="absolute top-5 right-5 text-cream-200/50 hover:text-cream-50"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-2xl text-cream-50 font-bold mb-1">
              {editingMenuItem ? 'Edit Menu Dish' : 'Add New Royal Dish'}
            </h3>
            <p className="text-xs text-cream-200/70 mb-5">
              Configure dish pricing, category classification and culinary notes.
            </p>

            <form onSubmit={handleSaveMenuItem} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                  Dish Title *
                </label>
                <input
                  type="text"
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Gosht Dum Biryani"
                  className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                    Category *
                  </label>
                  <select
                    value={menuFormData.category}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                  >
                    <option value="Mains">Mains</option>
                    <option value="Starters">Starters</option>
                    <option value="Breads">Breads</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Accompaniments">Accompaniments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                    Price (AUD $) *
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={menuFormData.price}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    placeholder="21.90"
                    className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ingredients, marinade, cooking style..."
                  className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                  Promotional Badge
                </label>
                <input
                  type="text"
                  value={menuFormData.badge}
                  onChange={(e) => setMenuFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. Signature, Royal Feast, Chef's Special"
                  className="w-full px-3.5 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream-100">
                  <input
                    type="checkbox"
                    checked={menuFormData.vegetarian}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, vegetarian: e.target.checked }))}
                    className="accent-gold-500 w-4 h-4"
                  />
                  <span>🌱 Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream-100">
                  <input
                    type="checkbox"
                    checked={menuFormData.spicy}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, spicy: e.target.checked }))}
                    className="accent-gold-500 w-4 h-4"
                  />
                  <span>🌶️ Spicy Flag</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMenuModal(false)}
                  className="flex-1 py-3 rounded-full border border-ink-700 text-cream-200 text-xs font-semibold uppercase tracking-wider hover:bg-ink-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMenu}
                  className="flex-1 py-3 rounded-full bg-gold-500 text-ink-950 font-bold text-xs font-extrabold uppercase tracking-wider hover:bg-gold-400 transition disabled:opacity-50 cursor-pointer"
                >
                  {savingMenu ? 'Saving...' : (editingMenuItem ? 'Save Modifications' : 'Add to Menu')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contact Message Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-ink-900 border border-gold-500/30 rounded-2xl p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setViewingMessage(null)}
              className="absolute top-4 right-4 text-cream-200/50 hover:text-cream-50"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400">
              Inquiry Details
            </span>
            <h3 className="font-display text-xl text-cream-50 font-bold mt-1 mb-3">
              {viewingMessage.subject}
            </h3>

            <div className="space-y-2 text-xs text-cream-200/80 mb-4 bg-ink-950/60 p-3 rounded-xl border border-ink-800">
              <div><strong>Name:</strong> {viewingMessage.name}</div>
              <div><strong>Email:</strong> {viewingMessage.email}</div>
              <div><strong>Phone:</strong> {viewingMessage.phone}</div>
              <div><strong>Date:</strong> {new Date(viewingMessage.createdAt).toLocaleString()}</div>
            </div>

            <div className="text-xs text-cream-100 bg-ink-950 p-4 rounded-xl border border-ink-800 whitespace-pre-wrap leading-relaxed">
              {viewingMessage.message}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingMessage(null)}
                className="px-5 py-2 rounded-full bg-gold-500 text-ink-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
