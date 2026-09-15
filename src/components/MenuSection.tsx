import { AnimatePresence, motion } from "framer-motion";
import { Flame, Leaf, Search, Utensils, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, MENU, formatPrice, type MenuCategory } from "../data/menu";
import { SITE } from "../site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function MenuSection({ compact = false }: { compact?: boolean }) {
  const [cat, setCat] = useState<"All" | MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MENU.length };
    MENU.forEach((dish) => {
      counts[dish.category] = (counts[dish.category] || 0) + 1;
    });
    return counts;
  }, []);

  const items = useMemo(() => {
    let list = cat === "All" ? MENU : MENU.filter((d) => d.category === cat);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return compact ? list.slice(0, 8) : list;
  }, [cat, searchQuery, compact]);

  return (
    <section aria-label="Menu" id="menu" className="relative bg-ink-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="The Menu"
          title="Authentic Hyderabad Darbar Delicacies"
          copy="Explore our complete menu featuring traditional dum biryanis, sizzling tandoori kebabs, rich curries, mandi platters, and catering deals."
        />

        {/* Search Bar */}
        {!compact && (
          <Reveal delay={0.05}>
            <div className="mx-auto mt-8 max-w-md">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-cream-50/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 150+ dishes, biryanis, curries..."
                  className="w-full rounded-full border border-white/15 bg-white/[0.05] py-3 pr-10 pl-11 text-[14px] text-cream-50 placeholder-cream-50/40 outline-none backdrop-blur transition focus:border-gold-400 focus:bg-white/[0.08]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3.5 text-cream-50/50 hover:text-cream-50 transition"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* Categories Bar */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Menu categories"
            className="mt-8 flex gap-2 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center"
          >
            {CATEGORIES.map((c) => {
              const active = cat === c;
              const count = categoryCounts[c] || 0;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c)}
                  className={`group shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-gold-500 text-ink-950 shadow-md shadow-gold-500/20"
                      : "border border-white/15 bg-white/[0.02] text-cream-50/75 hover:border-gold-500/60 hover:text-gold-300"
                  }`}
                >
                  <span>{c}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active ? "bg-ink-950/20 text-ink-950" : "bg-white/10 text-cream-50/50 group-hover:text-gold-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Search / Category Results Counter */}
        <div className="mt-4 flex items-center justify-between text-[13px] text-cream-50/50">
          <p>
            Showing <strong className="text-gold-300 font-semibold">{items.length}</strong> {items.length === 1 ? "dish" : "dishes"}
            {cat !== "All" && <span> in <strong className="text-cream-50">{cat}</strong></span>}
            {searchQuery && <span> matching "<strong className="text-cream-50">{searchQuery}</strong>"</span>}
          </p>
          {(cat !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setCat("All");
                setSearchQuery("");
              }}
              className="text-[12px] font-bold text-gold-400 hover:text-gold-300 underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Dishes Grid */}
        {items.length === 0 ? (
          <div className="mt-14 text-center py-16 border border-white/10 rounded-2xl bg-white/[0.02]">
            <Utensils size={40} className="mx-auto text-gold-400/50 mb-3" />
            <h3 className="font-display text-xl text-cream-50 font-medium">No dishes found</h3>
            <p className="mt-1 text-sm text-cream-50/60 max-w-sm mx-auto">
              We couldn't find anything matching your search. Try adjusting the category or search keywords.
            </p>
            <button
              onClick={() => {
                setCat("All");
                setSearchQuery("");
              }}
              className="mt-5 inline-block rounded-full bg-gold-500 px-6 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-400"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {items.map((d) => (
                <motion.article
                  key={d.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="group flex gap-4 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:border-gold-500/40 hover:bg-white/[0.06]"
                >
                  <div className="img-zoom h-24 w-24 shrink-0 overflow-hidden rounded-[6px] bg-ink-950 sm:h-28 sm:w-28 relative">
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback placeholder if image link times out
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=900&auto=format&fit=crop";
                      }}
                      className="h-full w-full object-cover"
                    />
                    {d.signature && (
                      <span className="absolute top-1.5 left-1.5 rounded-full bg-gold-500/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-ink-950">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-[17px] leading-snug font-medium text-cream-50">
                          {d.name}
                        </h3>
                        <p className="shrink-0 text-[15px] font-extrabold text-gold-300">{formatPrice(d.price)}</p>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-cream-50/65">
                        {d.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-50/50">
                        <span className="text-gold-400/90">{d.category}</span>
                        {d.vegetarian && (
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <Leaf size={12} aria-hidden="true" /> Veg
                          </span>
                        )}
                        {d.spicy ? (
                          <span className="inline-flex items-center gap-0.5" aria-label={`Spice ${d.spicy}/3`}>
                            {Array.from({ length: d.spicy }).map((_, i) => (
                              <Flame key={i} size={11} className="text-amber-500" fill="currentColor" aria-hidden="true" />
                            ))}
                          </span>
                        ) : null}
                      </span>
                      <a
                        href={SITE.orderUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-gold-500/40 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold-300 transition group-hover:bg-gold-500 group-hover:text-ink-950"
                      >
                        Add +
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {compact && (
          <Reveal className="mt-12 text-center">
            <a
              href="/menu"
              className="inline-block rounded-full bg-gold-500 px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-400 shadow-lg shadow-gold-500/20"
            >
              View complete menu ({MENU.length} items)
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
