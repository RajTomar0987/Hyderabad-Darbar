import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { api, type User } from '../config/api';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  role: 'customer' | 'admin' | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'darbar_token';
const ROLE_KEY = 'darbar_user_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  });
  const [role, setRole] = useState<'customer' | 'admin' | null>(() => {
    return (localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY)) as any || null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync backend user profile whenever Firebase auth changes
  const fetchBackendUser = async (fbUser: FirebaseUser) => {
    try {
      const idToken = await fbUser.getIdToken();
      setToken(idToken);
      localStorage.setItem(TOKEN_KEY, idToken);

      // Fetch verified user details from backend
      const res = await api.auth.getMe();
      if (res.success && res.data?.user) {
        const u = res.data.user;
        const resolvedName = fbUser.displayName || (u.name && u.name !== 'Customer' ? u.name : '') || '';
        const userObj: User = {
          ...u,
          name: resolvedName,
          displayName: fbUser.displayName || (u.displayName && u.displayName !== 'Customer' ? u.displayName : '') || resolvedName
        };
        setUser(userObj);
        setRole(u.role);
        localStorage.setItem(ROLE_KEY, u.role);
      } else {
        // Construct fallback user object
        const fallbackUser: User = {
          id: fbUser.uid,
          uid: fbUser.uid,
          name: fbUser.displayName || '',
          displayName: fbUser.displayName || '',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          role: 'customer'
        };
        setUser(fallbackUser);
        setRole('customer');
        localStorage.setItem(ROLE_KEY, 'customer');
      }
    } catch (err) {
      console.warn('[AuthContext] Backend profile sync failed:', err);
      const fallbackUser: User = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || '',
        displayName: fbUser.displayName || '',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '',
        role: 'customer'
      };
      setUser(fallbackUser);
    }
  };

  // Real-time Firebase Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await fetchBackendUser(fbUser);
      } else {
        setUser(null);
        setRole(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ROLE_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Customer Signup with Firebase Auth
  const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      const trimmedName = data.name.trim();
      const trimmedEmail = data.email.trim();
      const trimmedPhone = data.phone.trim();

      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        data.password
      );

      // 2. Update Display Name in Firebase Auth immediately
      if (trimmedName) {
        await updateProfile(userCredential.user, {
          displayName: trimmedName
        });
        // Reload Firebase user to refresh local profile state
        await userCredential.user.reload();
      }

      // Update active firebaseUser state
      const activeUser = auth.currentUser || userCredential.user;
      setFirebaseUser(activeUser);

      // 3. Sync profile with backend
      const idToken = await activeUser.getIdToken(true);
      setToken(idToken);
      localStorage.setItem(TOKEN_KEY, idToken);
      
      try {
        await api.auth.syncProfile({
          name: trimmedName,
          phone: trimmedPhone
        });
      } catch (syncErr) {
        console.warn('[AuthContext] Profile sync notice:', syncErr);
      }

      await fetchBackendUser(activeUser);
    } catch (error: any) {
      let message = error.message || 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 8 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please provide a valid email address.';
      }
      throw new Error(message);
    }
  };

  // Customer Login with Firebase Auth
  const login = async (email: string, password: string, rememberMe = true) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await userCredential.user.getIdToken();

      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, idToken);
      } else {
        sessionStorage.setItem(TOKEN_KEY, idToken);
      }

      await fetchBackendUser(userCredential.user);
    } catch (error: any) {
      let message = 'Invalid email or password. Please verify and try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Access temporarily disabled due to multiple failed login attempts. Please try again later.';
      }
      throw new Error(message);
    }
  };

  // Admin Login with Firebase Auth & Backend Role Validation
  const adminLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await userCredential.user.getIdToken(true);
      localStorage.setItem(TOKEN_KEY, idToken);

      // Verify admin role with backend
      const res = await api.admin.getMe();
      if (!res.success || res.data?.user?.role !== 'admin') {
        // Sign out if not an admin
        await signOut(auth);
        setUser(null);
        setRole(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ROLE_KEY);
        throw new Error('Access denied: You do not have administrative privileges.');
      }

      setUser(res.data.user);
      setRole('admin');
      localStorage.setItem(ROLE_KEY, 'admin');
    } catch (error: any) {
      let message = error.message || 'Administrative authentication failed.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-login-credentials'
      ) {
        message = 'Invalid administrative email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Access temporarily disabled due to multiple failed login attempts. Please try again later.';
      }
      throw new Error(message);
    }
  };

  // Real Logout using Firebase signOut()
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('[AuthContext] Sign out warning:', err);
    } finally {
      setUser(null);
      setFirebaseUser(null);
      setToken(null);
      setRole(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(ROLE_KEY);
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setFirebaseUser(auth.currentUser);
      await fetchBackendUser(auth.currentUser);
    }
  };

  const value: AuthContextType = {
    user,
    currentUser: user,
    firebaseUser,
    token,
    role,
    isAuthenticated: !!user || !!firebaseUser,
    isAdmin: role === 'admin' || user?.role === 'admin',
    loading,
    login,
    signup,
    adminLogin,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
