import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || location.state?.from || '/account';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If already logged in, offer quick redirect
  React.useEffect(() => {
    if (isAuthenticated && !loading && !success) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, success, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      return 'Please enter a valid phone number.';
    }
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 8) return 'Password must be at least 8 characters long.';
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match. Please verify your confirmation password.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setSuccess('Account created successfully! Welcome to Hyderabad Darbar.');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-ink-950">
      {/* Subtle royal background atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-ember-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <ShieldCheck size={14} className="text-gold-400" />
            Hyderabad Darbar Privileges
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-cream-50 font-bold tracking-tight">
            Create Your Account
          </h1>
          <p className="text-cream-200/70 text-sm mt-2 max-w-sm mx-auto">
            Join the royal table. Track orders, book reservations, and experience authentic Hyderabadi hospitality.
          </p>
        </div>

        {/* Signup Box */}
        <div className="bg-ink-900/90 border border-ink-700/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 animate-fadeIn">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-3 animate-fadeIn">
              <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                Full Name <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                  <UserIcon size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ayesha Khan"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                />
              </div>
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                  Email Address <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                  Phone Number <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                    <Phone size={18} />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0412 345 678"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                Password <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-cream-200/90 mb-1.5">
                Confirm Password <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/60">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-ink-950/80 border border-ink-700 rounded-xl text-cream-50 placeholder-cream-200/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-cream-200/50 hover:text-gold-300 transition"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-950 font-extrabold uppercase tracking-widest text-sm shadow-[0_6px_20px_rgba(200,162,75,0.3)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-6 border-t border-ink-800/80 text-center">
            <p className="text-sm text-cream-200/70">
              Already have an account?{' '}
              <Link to="/login" state={{ from }} className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 decoration-gold-500/40 transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Royal Guarantee */}
        <p className="text-center text-xs text-cream-200/40 mt-6 tracking-wide">
          Protected with end-to-end encryption. Hyderabad Darbar Authentic Dining.
        </p>
      </div>
    </div>
  );
}
