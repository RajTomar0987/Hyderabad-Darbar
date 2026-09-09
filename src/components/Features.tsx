import { Award, Flame, Leaf, Users } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const FEATURES = [
  {
    icon: Flame,
    title: "Authentic Cuisine",
    copy: "Dum technique, stone-ground masalas and a live tandoor — Hyderabadi recipes kept honest.",
  },
  {
    icon: Leaf,
    title: "Fresh, Daily",
    copy: "Vegetables each morning, meat from trusted local suppliers, breads rolled to order.",
  },
  {
    icon: Users,
    title: "Made for Family",
    copy: "Big tables, generous handis, kids welcome. Feasts built for sharing, not for show.",
  },
  {
    icon: Award,
    title: "Catering & Events",
    copy: "Weddings, engagements, office lunches — biryani handis and live counters at your venue.",
  },
];

export default function Features() {
  return (
    <section aria-label="Why choose us" className="bg-cream-50 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          dark
          align="center"
          eyebrow="Why Darbar"
          title="Not fancy. Just deeply good."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[8px] bg-ink-950/10 ring-1 ring-ink-950/10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07} className="bg-cream-50">
              <div className="group h-full p-8 transition hover:bg-ink-950 hover:text-cream-50">
                <f.icon size={26} className="text-gold-600 transition group-hover:text-gold-300" aria-hidden="true" />
                <h3 className="font-display mt-5 text-2xl font-medium">{f.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed opacity-70">{f.copy}</p>
                <p className="font-display mt-6 text-sm opacity-30 italic">0{i + 1}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
