import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GALLERY } from "../data/menu";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <section aria-label="Gallery" className="bg-ink-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Come hungry. Leave with photos."
          copy="Clay-oven smoke, saffron rice, low light and loud family tables — a glimpse inside Darbar."
        />

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY.slice(0, 5).map((g, i) => {
            return (
              <Reveal key={g.src + i} delay={i * 0.06} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="img-zoom group relative block h-full w-full overflow-hidden rounded-[6px] text-left"
                  aria-label={`Open photo: ${g.alt}`}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className={`w-full object-cover ${i === 0 ? "aspect-square md:aspect-auto md:h-full md:min-h-[480px]" : "aspect-square md:aspect-auto md:h-[232px]"}`}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-cream-50 opacity-0 transition group-hover:opacity-100">
                    {g.label} <Expand size={14} aria-hidden="true" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* marquee strip */}
        <div className="mt-10 overflow-hidden border-y border-white/10 py-4" aria-hidden="true">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, k) => (
              <p key={k} className="font-display text-xl text-cream-50/60 italic sm:text-2xl">
                Dum Biryani ✦ Tandoori Nights ✦ Family Feasts ✦ Mango Lassi ✦ Garlic Naan ✦ Hyderabadi Hospitality ✦&nbsp;
              </p>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4 backdrop-blur"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[active].alt}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close image"
              className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white"
            >
              <X size={20} />
            </button>
            <motion.img
              key={GALLERY[active].src}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={GALLERY[active].src}
              alt={GALLERY[active].alt}
              className="max-h-[82vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
