import MenuSection from "../components/MenuSection";
import Reveal from "../components/Reveal";
import { SITE } from "../site";

export default function MenuPage() {
  return (
    <main id="main" className="bg-ink-950">
      <section className="relative overflow-hidden pt-36 pb-14 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-300">Our Menu</p>
            <h1 className="font-display mt-4 text-5xl font-medium text-balance sm:text-6xl">
              Fire, patience & <span className="text-gold-300 italic">big flavour.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-cream-50/70">
              Everything below is cooked fresh daily. Order online via our NextOrder store or
              call <a className="text-gold-300 underline" href={SITE.phoneHref}>{SITE.phoneDisplay}</a> for
              large takeaway orders.
            </p>
          </Reveal>
        </div>
      </section>
      <MenuSection />
    </main>
  );
}
