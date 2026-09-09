import About from "../components/About";
import Features from "../components/Features";
import Reveal from "../components/Reveal";

export default function AboutPage() {
  return (
    <main id="main" className="bg-ink-950">
      <section className="mx-auto max-w-3xl px-5 pt-36 pb-10 text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-300">About Us</p>
          <h1 className="font-display mt-4 text-5xl font-medium text-balance sm:text-6xl">
            Hyderabad on a plate, <span className="text-gold-300 italic">Dandenong at heart.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream-50/70">
            A family-run kitchen obsessed with dum, smoke and hospitality. We keep our menu
            focused so every dish gets the time it deserves.
          </p>
        </Reveal>
      </section>
      <About />
      <Features />
    </main>
  );
}
