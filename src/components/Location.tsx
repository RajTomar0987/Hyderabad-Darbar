import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Location() {
  return (
    <section aria-label="Location and contact" id="visit" className="bg-cream-50 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          dark
          align="center"
          eyebrow="Find Us"
          title="Visit Hyderabad Darbar."
        />
        <div className="mt-12 grid overflow-hidden rounded-[10px] ring-1 ring-ink-950/10 lg:grid-cols-2">
          <div className="relative min-h-[320px]">
            <iframe
              title="Map — Hyderabad Darbar, 52D Foster Street Dandenong"
              src="https://www.google.com/maps?q=52D+Foster+Street+Dandenong+VIC+3175&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[35%] contrast-[1.05]"
            />
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.16em] text-cream-50 shadow-xl transition hover:bg-gold-500 hover:text-ink-950"
            >
              <Navigation size={14} aria-hidden="true" /> Get Directions
            </a>
          </div>
          <div className="bg-ink-950 p-8 text-cream-50 sm:p-12">
            <Reveal>
              <h3 className="font-display text-3xl font-medium">52D Foster Street</h3>
              <p className="mt-1 flex items-center gap-2 text-cream-50/70">
                <MapPin size={15} className="text-gold-400" aria-hidden="true" />
                Dandenong VIC 3175 · 2 min from station
              </p>
            </Reveal>
            <div className="mt-8 space-y-5 border-t border-white/10 pt-8">
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">Opening hours</p>
                  <p className="mt-1 text-[15px]">Mon–Thu · 11:00 AM – 10:00 PM</p>
                  <p className="text-[15px]">Fri–Sun · 11:00 AM – 10:30 PM</p>
                  <p className="mt-1 inline-block rounded-full bg-green-500/15 px-3 py-1 text-[12px] font-bold text-green-300">
                    ● Open today
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">Call us</p>
                  <a href={SITE.phoneHref} className="font-display mt-1 block text-2xl hover:text-gold-300">
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/order"
                className="flex-1 rounded-full bg-gold-500 px-6 py-3.5 text-center text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink-950 transition hover:bg-gold-300"
              >
                Order Online
              </Link>
              <a
                href={SITE.phoneHref}
                className="flex-1 rounded-full border border-white/20 px-6 py-3.5 text-center text-[13px] font-extrabold uppercase tracking-[0.16em] transition hover:border-gold-400 hover:text-gold-300"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
