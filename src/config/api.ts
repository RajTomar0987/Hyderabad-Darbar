import { auth } from './firebase';

/**
 * Central API Base URL Configuration
 * 
 * - In production (Vercel): Reads dynamically from import.meta.env.VITE_API_URL
 * - In local development: Defaults to http://localhost:5000/api if VITE_API_URL is unset
 */
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return 'https://hyderabad-darbar.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: string;
  uid?: string;
  firebase_uid?: string;
  name: string;
  displayName?: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  badge?: string;
  spicy?: boolean;
  vegetarian?: boolean;
  image?: string;
}

export interface OrderItem {
  id: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface Order {
  id: string;
  orderId: string;
  userId?: string | null;
  firebaseUid?: string | null;
  customerName: string;
  email?: string;
  phone: string;
  orderType?: 'pickup' | 'delivery';
  address: string;
  pickupTime?: string;
  deliveryInstructions?: string;
  items: OrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'delivered' | 'cancelled';
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  reservationId: string;
  userId?: string | null;
  firebaseUid?: string | null;
  name: string;
  email?: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  userId?: string | null;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalReservations: number;
  confirmedReservations: number;
  totalMenuItems: number;
  totalReviews: number;
  totalMessages: number;
  totalCustomers?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  categories?: string[];
  averageRating?: number;
}

/**
 * Universal request wrapper for backend APIs with Firebase Auth
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let token: string | null = null;

  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch {
      token = null;
    }
  }

  if (!token) {
    token = localStorage.getItem('darbar_token') || sessionStorage.getItem('darbar_token');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

  if (!baseUrl && !endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    throw new Error(
      'Backend API URL is not configured. Please set the VITE_API_URL environment variable in your Vercel project settings.'
    );
  }

  let url: string;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    url = endpoint;
  } else {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      url = `${cleanBase}${cleanEndpoint.slice(4)}`;
    } else if (cleanBase.endsWith('/api') && cleanEndpoint === '/api') {
      url = cleanBase;
    } else {
      url = `${cleanBase}${cleanEndpoint}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: `HTTP error ${res.status}: ${res.statusText}`
    }));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    if (
      err instanceof TypeError && 
      (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))
    ) {
      if (import.meta.env.DEV) {
        throw new Error('Unable to connect to local backend server (http://localhost:5000). Please ensure your local Express backend is running.');
      }
      throw new Error('Unable to connect to the backend server. Please ensure the Render live backend service is running and accessible.');
    }
    throw err;
  }
}

// Central API helper methods
export const api = {
  // Auth APIs
  auth: {
    syncProfile: (data: { name?: string; phone?: string }) =>
      apiRequest<{ user: User }>('/api/auth/sync-profile', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    login: (data: { email?: string; password?: string }) =>
      apiRequest<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getMe: () => apiRequest<{ user: User }>('/api/auth/me')
  },

  // Admin APIs
  admin: {
    login: (data: { email?: string; password?: string }) =>
      apiRequest<{ user: User }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getMe: () => apiRequest<{ user: User }>('/api/admin/me'),
    getStats: () => apiRequest<DashboardStats>('/api/admin/stats'),
    getOrders: () => apiRequest<Order[]>('/api/admin/orders'),
    getReservations: () => apiRequest<Reservation[]>('/api/admin/reservations'),
    getUsers: () => apiRequest<User[]>('/api/admin/users')
  },

  // Customer personal data
  my: {
    getOrders: () => apiRequest<Order[]>('/api/my/orders'),
    getReservations: () => apiRequest<Reservation[]>('/api/my/reservations')
  },

  // Orders
  orders: {
    create: (data: {
      customerName: string;
      phone: string;
      email?: string;
      orderType?: 'pickup' | 'delivery';
      address?: string;
      pickupTime?: string;
      deliveryInstructions?: string;
      items: { id: string; name?: string; price?: number; quantity: number }[];
      totalAmount?: number;
    }) =>
      apiRequest<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getById: (id: string) => apiRequest<Order>(`/api/orders/${id}`),
    getAll: () => apiRequest<Order[]>('/api/orders'),
    updateStatus: (id: string, status: string) =>
      apiRequest<Order>(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
  },

  // Reservations
  reservations: {
    create: (data: {
      name: string;
      email?: string;
      phone: string;
      guests: number;
      date: string;
      time: string;
      message?: string;
    }) =>
      apiRequest<Reservation>('/api/reservations', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getAll: () => apiRequest<Reservation[]>('/api/reservations'),
    updateStatus: (id: string, status: string) =>
      apiRequest<Reservation>(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
  },

  // Menu
  menu: {
    getAll: (params?: { category?: string; vegetarian?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.vegetarian !== undefined) query.append('vegetarian', String(params.vegetarian));
      const qs = query.toString() ? `?${query.toString()}` : '';
      return apiRequest<{ items: MenuItem[]; grouped: Record<string, MenuItem[]> }>(`/api/menu${qs}`);
    },
    getById: (id: string) => apiRequest<MenuItem>(`/api/menu/${id}`),
    create: (item: Partial<MenuItem>) =>
      apiRequest<MenuItem>('/api/menu', {
        method: 'POST',
        body: JSON.stringify(item)
      }),
    update: (id: string, item: Partial<MenuItem>) =>
      apiRequest<MenuItem>(`/api/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
      }),
    delete: (id: string) =>
      apiRequest<MenuItem>(`/api/menu/${id}`, {
        method: 'DELETE'
      })
  },

  // Reviews
  reviews: {
    getAll: () => apiRequest<Review[]>('/api/reviews'),
    create: (data: { rating: number; comment: string; name?: string }) =>
      apiRequest<Review>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    delete: (id: string) =>
      apiRequest<Review>(`/api/reviews/${id}`, {
        method: 'DELETE'
      })
  },

  // Contact
  contact: {
    submit: (data: { name: string; email: string; phone: string; subject: string; message: string }) =>
      apiRequest<ContactMessage>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getAll: () => apiRequest<ContactMessage[]>('/api/contact'),
    delete: (id: string) =>
      apiRequest<ContactMessage>(`/api/contact/${id}`, {
        method: 'DELETE'
      })
  }
};
