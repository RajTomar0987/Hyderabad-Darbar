import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect to dashboard
  if (isAuthenticated && isAdmin) {
    navigate('/admin', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Administrative email and secure key are required.');
      return;
    }

    setLoading(true);

    try {
      await adminLogin(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Administrative authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-ink-950">
      {/* Dark luxury background accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 right-10 w-[350px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Admin Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-400/40 bg-ink-900/90 text-gold-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
            <ShieldAlert size={14} className="text-gold-400" />
            Restricted Staff Access
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-cream-50 font-bold tracking-tight">
            Darbar Management
          </h1>
          <p className="text-cream-200/60 text-xs sm:text-sm mt-2">
            Secure portal for kitchen dispatch, table allocations, and menu control.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-ink-900/95 border border-gold-500/30 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gold-500 text-ink-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
            <Sparkles size={11} />
            Administrator Level
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/70">
                  <Mail size={18} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="yuvrajsinghtomar0987@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/70">
                  <Lock size={18} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-cream-200/50 hover:text-gold-300 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-ink-950 font-black uppercase tracking-widest text-sm shadow-[0_8px_25px_rgba(200,162,75,0.35)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-ink-800 text-center">
            <p className="text-[11px] text-cream-200/50">
              Customer accounts cannot access this area. Switch to{' '}
              <a href="/login" className="text-gold-400 hover:underline">
                Customer Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
