import { ArrowRight, Flame, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { FEATURED_IDS, MENU, formatPrice } from "../data/menu";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function Spice({ level = 0 }: { level?: number }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center gap-0.5" title={`Spice level ${level}/3`} aria-label={`Spice level ${level} of 3`}>
      {Array.from({ length: level }).map((_, i) => (
        <Flame key={i} size={12} className="text-ember-500" fill="currentColor" aria-hidden="true" />
      ))}
    </span>
  );
}

export default function FeaturedDishes() {
  const dishes = FEATURED_IDS.map((id) => MENU.find((d) => d.id === id)!).filter(Boolean);
  return (
    <section aria-label="Featured dishes" className="bg-cream-50 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            dark
            eyebrow="Signatures"
            title="Dishes Dandenong keeps coming back for."
          />
          <Reveal delay={0.1}>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-ink-950/15 px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.16em] transition hover:border-ink-950 hover:bg-ink-950 hover:text-cream-50"
            >
              Full menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.08}>
              <article className="card-lift img-zoom group relative overflow-hidden rounded-[6px] bg-white ring-1 ring-ink-950/8">
                <div className="relative overflow-hidden">
                  <img src={d.image} alt={d.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" aria-hidden="true" />
                  <p className="absolute top-3 left-3 rounded-full bg-ink-950/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-300 backdrop-blur">
                    {d.category}
                  </p>
                  <p className="absolute top-3 right-3 rounded-full bg-cream-50 px-3 py-1 text-[13px] font-extrabold">
                    {formatPrice(d.price)}
                  </p>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[21px] leading-tight font-medium">{d.name}</h3>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-stone-600">{d.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink-950/10 pt-4">
                    <span className="flex items-center gap-2">
                      {d.vegetarian && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-700">
                          <Leaf size={13} aria-hidden="true" /> Veg
                        </span>
                      )}
                      <Spice level={d.spicy} />
                    </span>
                    <Link
                      to="/order"
                      aria-label={`Order ${d.name} online`}
                      className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-gold-600 underline-offset-4 hover:underline"
                    >
                      Order +
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
