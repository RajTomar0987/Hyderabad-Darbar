import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Intro() {
  return (
    <section aria-label="Restaurant introduction" className="relative bg-ink-950 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="relative">
          <Reveal>
            <div className="img-zoom relative overflow-hidden rounded-[4px]">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1400&auto=format&fit=crop"
                alt="Elegant dining table at Hyderabad Darbar"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="absolute -right-3 -bottom-8 w-[46%] sm:-right-8">
            <div className="img-zoom overflow-hidden rounded-[4px] border-4 border-ink-950 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop"
                alt="Tandoori skewers fresh from the clay oven"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="absolute -top-5 -left-2 rounded-full bg-gold-500 px-5 py-3 text-ink-950 shadow-xl sm:left-6" aria-hidden="true">
            <p className="font-display text-2xl leading-none font-semibold">Since</p>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em]">Dandenong</p>
          </div>
        </div>

        <div className="pt-10 lg:pt-0">
          <SectionHeading
            eyebrow="Our Story"
            title="A little Hyderabad, in the heart of Dandenong."
            copy="We cook the way Hyderabad taught us — biryani sealed on dum, masalas pounded fresh each morning, breads slapped to the wall of a screaming-hot tandoor. No shortcuts, no pre-mixes. Just patience, fire and hospitality."
          />
          <Reveal delay={0.1}>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">Cuisine</dt>
                <dd className="font-display mt-2 text-xl text-cream-50">Hyderabadi · Mughlai</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">Philosophy</dt>
                <dd className="font-display mt-2 text-xl text-cream-50">Fresh. Slow. Generous.</dd>
              </div>
            </dl>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.2em] text-gold-300 hover:text-gold-500"
            >
              <span className="gold-underline pb-1">Discover our story</span>
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
