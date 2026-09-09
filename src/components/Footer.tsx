import { Clock, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { NAV_LINKS, SITE } from "../site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-cream-50">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display grid h-11 w-11 place-items-center rounded-full border border-gold-500/40 bg-white/5 text-lg text-gold-300">
                HD
              </span>
              <div>
                <p className="font-display text-xl font-semibold tracking-wide">HYDERABAD DARBAR</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400">
                  Authentic • Hyderabadi • Family
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream-50/65">
              Dum biryanis, slow curries and tandoor fresh from the clay oven — served with
              Hyderabadi hospitality in the heart of Dandenong.
            </p>
            <a
              href={SITE.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300"
            >
              Order Online
            </a>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-gold-400">Explore</h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[15px] text-cream-50/75 transition hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-gold-400">Visit Us</h3>
            <ul className="mt-5 space-y-4 text-[15px] text-cream-50/75">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-500" aria-hidden="true" />
                <span>{SITE.address}</span>
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex gap-3 hover:text-gold-300">
                  <Phone size={18} className="mt-0.5 shrink-0 text-gold-500" aria-hidden="true" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-gold-500" aria-hidden="true" />
                <span>
                  Mon–Thu · 11am–10pm
                  <br />
                  Fri–Sun · 11am–10:30pm
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-gold-400">Follow</h3>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition hover:border-gold-500 hover:text-gold-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition hover:border-gold-500 hover:text-gold-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-cream-50/55">
              Tag <span className="text-gold-300">#HyderabadDarbar</span> — we repost our favourite
              biryani shots every Friday.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-cream-50/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Hyderabad Darbar. All rights reserved.</p>
          <p>
            Order via{" "}
            <a href={SITE.orderUrl} target="_blank" rel="noreferrer" className="underline hover:text-gold-300">
              NextOrder
            </a>{" "}
            · Dandenong, Melbourne
          </p>
        </div>
      </div>
    </footer>
  );
}
