import Gallery from "../components/Gallery";
import Reveal from "../components/Reveal";

export default function GalleryPage() {
  return (
    <main id="main" className="bg-ink-950">
      <section className="mx-auto max-w-3xl px-5 pt-36 pb-4 text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-300">Gallery</p>
          <h1 className="font-display mt-4 text-5xl font-medium sm:text-6xl">
            A feast for the <span className="text-gold-300 italic">eyes first.</span>
          </h1>
        </Reveal>
      </section>
      <Gallery />
    </main>
  );
}
