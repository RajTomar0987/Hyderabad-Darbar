import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../site";
import Reveal from "./Reveal";

export default function CateringCTA() {
  return (
    <section aria-label="Catering and events" className="grain relative overflow-hidden py-24 sm:py-32">
      <img
        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink-950/78" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-gold-300">
            Catering · Weddings · Functions
          </p>
          <h2 className="font-display mt-5 text-4xl leading-[1.02] font-medium text-balance sm:text-6xl">
            Make your next event taste like <span className="text-gold-300 italic">a celebration.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-cream-50/75">
            Biryani handis, live tandoor counters and curries that survive a buffet line — for
            20 guests or 400. Tell us the occasion, we'll bring the feast.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/catering"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300"
            >
              Enquire about catering
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center rounded-full border border-white/25 px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-cream-50 backdrop-blur transition hover:border-gold-300 hover:text-gold-300"
            >
              Call to plan
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
