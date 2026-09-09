import Location from "../components/Location";
import Reveal from "../components/Reveal";
import { SITE } from "../site";

export default function ContactPage() {
  return (
    <main id="main" className="bg-ink-950">
      <section className="mx-auto max-w-3xl px-5 pt-36 pb-8 text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-300">Contact</p>
          <h1 className="font-display mt-4 text-5xl font-medium sm:text-6xl">
            Come say <span className="text-gold-300 italic">salaam.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream-50/70">
            {SITE.address} · <a className="text-gold-300 underline" href={SITE.phoneHref}>{SITE.phoneDisplay}</a> · {SITE.email}
          </p>
        </Reveal>
      </section>
      <Location />
      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8" aria-label="Quick message">
        <Reveal>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-[8px] border border-white/12 bg-white/[0.04] p-6 sm:p-8"
          >
            <h2 className="font-display text-2xl font-medium">Quick message</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="q-name" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Name</label>
                <input id="q-name" required autoComplete="name" className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3" />
              </div>
              <div>
                <label htmlFor="q-phone" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Phone</label>
                <input id="q-phone" required autoComplete="tel" className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="q-msg" className="text-[12px] font-bold uppercase tracking-widest text-cream-50/70">Message</label>
                <textarea id="q-msg" rows={4} required className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-4 py-3" />
              </div>
            </div>
            <button type="submit" className="mt-5 w-full rounded-full bg-gold-500 px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 hover:bg-gold-300">
              Send message
            </button>
            <p className="mt-3 text-center text-[13px] text-cream-50/50">Demo form — wire to email at launch.</p>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
