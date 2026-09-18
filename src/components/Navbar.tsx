import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, User as UserIcon, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV_LINKS, SITE } from "../site";
import { useAuth } from "../context/AuthContext";

function linkCls(isActive: boolean, scrolled: boolean) {
  return `relative text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${
    isActive
      ? "text-gold-300"
      : scrolled
        ? "text-ink-950 hover:text-gold-600"
        : "text-cream-50/85 hover:text-gold-300"
  }`;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink-950/10 bg-cream-50/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            : "border-b-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <Link to="/" className="group flex items-center gap-3" aria-label="Hyderabad Darbar home">
            <img
              src="/logo.svg"
              alt="Hyderabad Darbar logo"
              className="h-10 w-10 rounded-md object-cover ring-1 ring-black/10"
            />
            <span className="leading-tight">
              <span
                className={`font-display block text-[17px] font-semibold tracking-wide ${
                  scrolled ? "text-ink-950" : "text-cream-50"
                }`}
              >
                HYDERABAD DARBAR
              </span>
              <span
                className={`block text-[10px] font-bold uppercase tracking-[0.3em] ${
                  scrolled ? "text-gold-600" : "text-gold-300"
                }`}
              >
                Dandenong • Est. Flavour
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => linkCls(isActive, scrolled)}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-gold-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 xl:gap-4 lg:flex">
            <a
              href={SITE.phoneHref}
              className={`flex items-center gap-2 text-sm font-semibold transition ${
                scrolled ? "text-ink-950 hover:text-gold-600" : "text-cream-50/90 hover:text-gold-300"
              }`}
            >
              <Phone size={16} className="text-gold-500" aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>

            {/* Customer / Admin Auth Button */}
            {isAuthenticated ? (
              isAdmin ? (
                <Link
                  to="/admin"
                  className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] transition active:scale-[0.98] ${
                    scrolled
                      ? "border-red-600/40 bg-red-950/10 text-red-700 hover:bg-red-950/20"
                      : "border-gold-400/50 bg-ink-900/80 text-gold-300 hover:bg-ink-800"
                  }`}
                >
                  <Shield size={14} className="text-gold-400" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  to="/account"
                  className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] transition active:scale-[0.98] ${
                    scrolled
                      ? "border-ink-950/20 bg-ink-950/5 text-ink-950 hover:border-gold-500"
                      : "border-gold-500/40 bg-ink-900/80 text-cream-100 hover:border-gold-400 hover:text-gold-300"
                  }`}
                >
                  <UserIcon size={14} className="text-gold-400" />
                  <span>Account</span>
                </Link>
              )
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] transition active:scale-[0.98] ${
                  scrolled
                    ? "border-gold-600/80 bg-gold-600/10 text-ink-950 hover:bg-gold-500 hover:border-gold-500 hover:text-ink-950"
                    : "border-gold-400/80 bg-ink-950/40 text-cream-50 backdrop-blur-sm hover:bg-gold-500 hover:border-gold-500 hover:text-ink-950"
                }`}
              >
                Sign In
              </Link>
            )}

            <a
              href={SITE.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-950 transition hover:bg-gold-300 active:scale-[0.98]"
            >
              Order Online
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className={`grid h-11 w-11 place-items-center rounded-full border lg:hidden ${
              scrolled ? "border-ink-950/15 text-ink-950" : "border-white/20 text-cream-50"
            }`}
          >
            <Menu size={20} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink-950/98 backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <span className="flex items-center gap-3">
                <img
                  src="/logo.svg"
                  alt="Hyderabad Darbar logo"
                  className="h-9 w-9 rounded-md object-cover"
                />
                <span className="font-display text-lg tracking-wide text-cream-50">HYDERABAD DARBAR</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-cream-50"
              >
                <X size={20} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-8">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `font-display block border-b border-white/10 py-3.5 text-3xl ${
                        isActive ? "text-gold-300 italic" : "text-cream-50"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}

              {/* Mobile Auth Item */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * (NAV_LINKS.length + 1) }}
              >
                {isAuthenticated ? (
                  <NavLink
                    to={isAdmin ? "/admin" : "/account"}
                    className="font-display block border-b border-white/10 py-3.5 text-3xl text-gold-400"
                  >
                    {isAdmin ? "Admin Console" : "My Account"}
                  </NavLink>
                ) : (
                  <NavLink
                    to="/login"
                    className="font-display block border-b border-white/10 py-3.5 text-3xl text-gold-300"
                  >
                    Sign In / Register
                  </NavLink>
                )}
              </motion.div>
            </nav>
            <div className="space-y-3 p-6">
              <a
                href={SITE.orderUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-full bg-gold-500 py-4 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-ink-950"
              >
                Order Online
              </a>
              <a
                href={SITE.phoneHref}
                className="block rounded-full border border-white/20 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-cream-50"
              >
                Call {SITE.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
