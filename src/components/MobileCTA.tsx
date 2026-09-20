import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../site";

export default function MobileCTA() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-[1fr_1.4fr] gap-2 md:hidden">
      <a
        href={SITE.phoneHref}
        className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-ink-950/90 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-cream-50 backdrop-blur"
      >
        <Phone size={15} aria-hidden="true" /> Call
      </a>
      <Link
        to="/order"
        className="flex items-center justify-center rounded-full bg-gold-500 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-950"
      >
        Order Online
      </Link>
    </div>
  );
}
