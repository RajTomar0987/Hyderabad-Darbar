import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { TESTIMONIALS } from "../data/menu";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIdx((p) => (p + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const t = TESTIMONIALS[idx];

  return (
    <section aria-label="Testimonials" className="bg-ink-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Reviews"
              title="Word on Foster Street."
              copy="Unfiltered words from regulars — the families, students and night-shift crews who keep our tandoor busy."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition hover:border-gold-500 hover:text-gold-300"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-ink-950 transition hover:bg-gold-300"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative min-h-[300px] overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
              <Quote size={40} className="text-gold-500/40" aria-hidden="true" />
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure
                  key={idx}
                  initial={{ opacity: 0, x: 40 * dir }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 * dir }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mt-4 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < t.rating ? "text-gold-400" : "text-white/20"}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="font-display mt-4 text-2xl leading-snug font-normal text-balance sm:text-[28px]">
                    “{t.text}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm font-bold tracking-wide">
                    {t.name} <span className="font-normal text-cream-50/55">· {t.suburb}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
              <div className="mt-8 flex gap-2" role="tablist" aria-label="Choose review">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={`Review ${i + 1}`}
                    onClick={() => {
                      setDir(i > idx ? 1 : -1);
                      setIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold-500" : "w-4 bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
