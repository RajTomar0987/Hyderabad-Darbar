import Reveal from "./Reveal";

interface Props {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export default function SectionHeading({ eyebrow, title, copy, align = "left", dark = false }: Props) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "text-center mx-auto" : "text-left"} max-w-2xl`}>
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.32em] ${
          dark ? "text-gold-600" : "text-gold-400"
        }`}
      >
        <span aria-hidden="true" className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-current opacity-70" />
        {eyebrow}
      </p>
      <h2 className="font-display mt-4 text-4xl leading-[1.05] font-medium text-balance sm:text-5xl">
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 text-base leading-relaxed ${dark ? "text-stone-600" : "text-cream-50/70"}`}>
          {copy}
        </p>
      )}
    </Reveal>
  );
}
