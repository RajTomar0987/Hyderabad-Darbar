import { Check, Phone } from "lucide-react";
import { useState } from "react";
import CateringCTA from "../components/CateringCTA";
import Reveal from "../components/Reveal";
import { SITE } from "../site";

const PACKAGES = [
  {
    name: "Family Handi",
    price: "from $149",
    desc: "Feeds 8–10. Two biryani handis, curry, naan basket, raita & gulab jamun.",
    points: ["Chicken + veg biryani", "Naan & raita included", "Ready in 45 min"],
  },
  {
    name: "Celebration",
    price: "from $29 / guest",
    desc: "For engagements, birthdays & office parties. Buffet-style with live naan.",
    points: ["3 curries + 2 biryanis", "Live tandoor counter", "Staff & setup"],
    highlight: true,
  },
  {
    name: "Wedding Darbar",
    price: "Custom quote",
    desc: "200+ guests. Multi-course Hyderabadi menu, dessert tables & chai station.",
    points: ["Tasting session", "Full-service crew", "Decor coordination"],
  },
];

export default function CateringPage() {
  const [sent, setSent] = useState(false);

  return (
    <main id="main" className="bg-ink-950">
      <section className="mx-auto max-w-3xl px-5 pt-36 pb-10 text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-300">Catering & Events</p>
          <h1 className="font-display mt-4 text-5xl font-medium text-balance sm:text-6xl">
            Big occasions deserve <span className="text-gold-300 italic">big handis.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream-50/70">
            Tell us your date, guest count and venue — we'll shape a menu and quote within
            24 hours. No backend needed: enquiries go straight to our team.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" aria-label="Catering packages">
        <div className="grid gap-5 md:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <article
                className={`h-full rounded-[8px] p-7 ${
                  p.highlight
                    ? "bg-gold-500 text-ink-950"
                    : "border border-white/12 bg-white/[0.04] text-cream-50"
                }`}
              >
                <h2 className="font-display text-2xl font-medium">{p.name}</h2>
                <p className={`mt-1 text-sm font-extrabold ${p.highlight ? "" : "text-gold-300"}`}>{p.price}</p>
                <p className={`mt-3 text-[14px] leading-relaxed ${p.highlight ? "text-ink-950/75" : "text-cream-50/65"}`}>
                  {p.desc}
                </p>
                <ul className="mt-5 space-y-2 text-[14px] font-semibold">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <Check size={15} aria-hidden="true" /> {pt}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8" aria-label="Enquire">
        <Reveal>
          <form
            className="rounded-[8px] border border-white/12 bg-white/[0.04] p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div role="status" className="py-8 text-center">
                <p className="font-display text-3xl text-gold-300">Shukriya! We'll be in touch.</p>
                <p className="mt-3 text-cream-50/70">
                  For urgent dates, call us directly on{" "}
                  <a className="text-gold-300 underline" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl font-medium">Request a quote</h2>
                <p className="mt-2 text-sm text-cream-50/60">
                  Frontend-only demo — connect this to email / Google Forms at launch.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Name</label>
                    <input id="c-name" required autoComplete="name" placeholder="Your name" className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3 text-[15px] placeholder:text-cream-50/30" />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Phone</label>
                    <input id="c-phone" required autoComplete="tel" inputMode="tel" placeholder="04xx xxx xxx" className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3 text-[15px] placeholder:text-cream-50/30" />
                  </div>
                  <div>
                    <label htmlFor="c-date" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Event date</label>
                    <input id="c-date" type="date" required className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3 text-[15px] [color-scheme:dark]" />
                  </div>
                  <div>
                    <label htmlFor="c-guests" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Guests</label>
                    <input id="c-guests" type="number" min={10} required placeholder="e.g. 80" className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3 text-[15px] placeholder:text-cream-50/30" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="c-msg" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Details</label>
                    <textarea id="c-msg" rows={4} placeholder="Venue, veg/non-veg mix, budget…" className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3 text-[15px] placeholder:text-cream-50/30" />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="submit" className="flex-1 rounded-full bg-gold-500 px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300">
                    Send enquiry
                  </button>
                  <a href={SITE.phoneHref} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] hover:border-gold-400 hover:text-gold-300">
                    <Phone size={15} aria-hidden="true" /> {SITE.phoneDisplay}
                  </a>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </section>
      <CateringCTA />
    </main>
  );
}
