import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section aria-label="About Hyderabad Darbar" className="relative overflow-hidden bg-ink-900 py-20 sm:py-28">
      <p
        aria-hidden="true"
        className="font-display pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-[22vw] whitespace-nowrap text-white/[0.03] italic select-none lg:text-[180px]"
      >
        Hyderabad
      </p>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">
              <span aria-hidden="true" className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-current opacity-70" />
              About Hyderabad Darbar
            </p>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] font-medium text-balance sm:text-5xl">
              Recipes carried across oceans, cooked over open fire.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-cream-50/70">
              <p>
                Our kitchen began with a simple memory — Friday biryani in Hyderabad, the handi
                opened at the table, steam carrying saffron and ghee across the room.
              </p>
              <p>
                In Dandenong we cook the same way: onions browned low and slow, masalas pounded
                fresh, rice aged and layered by hand. Whether it's dinner for two or a wedding
                for two hundred, the fire stays the same.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                ["12+", "Spices ground in-house"],
                ["3hr", "Slow dum, every handi"],
                ["100%", "Halal kitchen"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl text-gold-300">{v}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-50/55">{l}</p>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.16em] transition hover:border-gold-500 hover:text-gold-300"
            >
              Our full story
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="img-zoom overflow-hidden rounded-[6px]">
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop"
                alt="Family dining together"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div className="mt-8 space-y-3">
              <div className="img-zoom overflow-hidden rounded-[6px]">
                <img
                  src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop"
                  alt="Slow-cooked curry in bowl"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="rounded-[6px] bg-gold-500 p-5 text-ink-950">
                <p className="font-display text-2xl leading-tight font-medium italic">
                  “Biryani is not fast food. It is patience you can taste.”
                </p>
                <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.22em]">— Head Chef</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
