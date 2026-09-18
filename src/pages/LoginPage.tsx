import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const successMessageFromNav = location.state?.successMessage;
  const initialEmail = location.state?.email || '';
  const from = location.state?.from?.pathname || '/account';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus('A password reset link has been dispatched to your email address (Simulated).');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotStatus(null);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div className="min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-ink-950">
      {/* Royal ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-ember-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <ShieldCheck size={14} className="text-gold-400" />
            Customer Portal
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-cream-50 font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-cream-200/70 text-sm mt-2">
            Sign in to manage your orders, reservations and dining privileges.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-ink-900/90 border border-ink-700/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          {successMessageFromNav && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-3">
              <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessageFromNav}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 animate-fadeIn">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="you@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-gold-400 hover:text-gold-300 transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-cream-200/80">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-ink-700 bg-ink-950 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 accent-gold-500"
                />
                <span>Remember login state</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 font-extrabold uppercase tracking-widest text-sm shadow-[0_6px_20px_rgba(200,162,75,0.3)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-ink-800/80 text-center">
            <p className="text-sm text-cream-200/70">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 decoration-gold-500/40 transition">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Link Notice */}
        <div className="mt-6 text-center">
          <Link to="/admin/login" className="text-xs text-cream-200/40 hover:text-gold-400/80 transition tracking-wider uppercase">
            Staff & Manager Portal &rarr;
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-ink-900 border border-gold-500/30 rounded-2xl p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-cream-200/50 hover:text-cream-50"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-xl text-cream-50 font-bold mb-2">
              Reset Your Password
            </h3>
            <p className="text-xs text-cream-200/70 mb-4">
              Enter your registered email and we'll send you instructions to securely reset your credentials.
            </p>

            {forgotStatus ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>{forgotStatus}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full px-4 py-2.5 bg-ink-950 border border-ink-700 rounded-xl text-cream-50 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-gold-500 text-ink-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
