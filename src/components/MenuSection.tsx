import { AnimatePresence, motion } from "framer-motion";
import { Flame, Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, MENU, formatPrice, type MenuCategory } from "../data/menu";
import { SITE } from "../site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function MenuSection({ compact = false }: { compact?: boolean }) {
  const [cat, setCat] = useState<"All" | MenuCategory>("All");
  const items = useMemo(() => {
    const list = cat === "All" ? MENU : MENU.filter((d) => d.category === cat);
    return compact ? list.slice(0, 6) : list;
  }, [cat, compact]);

  return (
    <section aria-label="Menu" id="menu" className="relative bg-ink-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="The Menu"
          title="Built for cravings, priced for family."
          copy="Pick a craving — biryani, tandoor, curry — and we'll handle the rest. Everything is made fresh through the day."
        />

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Menu categories"
            className="mt-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center"
          >
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.16em] transition ${
                    active
                      ? "bg-gold-500 text-ink-950"
                      : "border border-white/15 text-cream-50/75 hover:border-gold-500/60 hover:text-gold-300"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {items.map((d) => (
              <motion.article
                layout
                key={d.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group flex gap-4 rounded-[6px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:border-gold-500/40 hover:bg-white/[0.06]"
              >
                <div className="img-zoom h-24 w-24 shrink-0 overflow-hidden rounded-[4px] sm:h-28 sm:w-28">
                  <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[18px] leading-snug font-medium text-cream-50">
                      {d.name}
                    </h3>
                    <p className="shrink-0 text-[15px] font-extrabold text-gold-300">{formatPrice(d.price)}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-cream-50/60">
                    {d.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-50/50">
                      <span className="text-gold-400">{d.category}</span>
                      {d.vegetarian && (
                        <span className="inline-flex items-center gap-1 text-green-400">
                          <Leaf size={12} aria-hidden="true" /> Veg
                        </span>
                      )}
                      {d.spicy ? (
                        <span className="inline-flex items-center gap-0.5" aria-label={`Spice ${d.spicy}/3`}>
                          {Array.from({ length: d.spicy }).map((_, i) => (
                            <Flame key={i} size={11} className="text-ember-500" fill="currentColor" aria-hidden="true" />
                          ))}
                        </span>
                      ) : null}
                    </span>
                    <a
                      href={SITE.orderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-gold-500/40 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold-300 transition group-hover:bg-gold-500 group-hover:text-ink-950"
                    >
                      Add +
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {compact && (
          <Reveal className="mt-10 text-center">
            <a
              href="/menu"
              className="inline-block rounded-full bg-gold-500 px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300"
            >
              View complete menu
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
