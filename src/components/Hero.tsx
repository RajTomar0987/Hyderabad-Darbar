import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../site";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

  return (
    <section ref={ref} aria-label="Welcome to Hyderabad Darbar" className="grain relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2000&auto=format&fit=crop"
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-20 sm:px-8 sm:pb-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-gold-300"
        >
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill="currentColor" aria-hidden="true" />
            ))}
          </span>
          <span className="hidden sm:inline">Loved across Dandenong · 4.8 rating</span>
          <span className="sm:hidden">4.8 · Dandenong</span>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-[12px] font-extrabold uppercase tracking-[0.5em] text-cream-50/70"
        >
          Hyderabad Darbar
        </motion.p>

        <h1 className="font-display mt-3 max-w-4xl text-[13vw] leading-[0.95] font-medium text-balance sm:text-7xl lg:text-[92px]">
          {["Authentic Flavours.", "Rich Traditions."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`block ${i === 1 ? "text-gold-300 italic" : "text-cream-50"}`}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-5 max-w-xl text-[16px] leading-relaxed text-cream-50/75"
        >
          Slow-steamed dum biryani, curries that simmer for hours, and naan blistered in a live
          clay oven — in the heart of Dandenong, Melbourne.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 rounded-full bg-cream-50 px-7 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300"
          >
            Explore Menu
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/order"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300"
          >
            Order Online
          </Link>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-2 py-3 text-[13px] font-bold uppercase tracking-[0.16em] text-cream-50/85 underline-offset-8 hover:text-gold-300 hover:underline"
          >
            <MapPin size={15} aria-hidden="true" /> Dandenong, VIC
          </a>
        </motion.div>

        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-white/15 border-y border-white/15"
        >
          {[
            ["25+", "Dishes on menu"],
            ["4.8★", "Guest rating"],
            ["11–10", "Open daily"],
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-4 first:pl-0">
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-2xl text-cream-50 sm:text-3xl">{v}</dd>
              <dd className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-50/55">{l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
