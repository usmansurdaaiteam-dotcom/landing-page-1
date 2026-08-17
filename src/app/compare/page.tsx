import type { Metadata } from "next";
import Link from "next/link";
import AssetImage from "@/components/AssetImage";
import Reveal from "@/components/Reveal";
import { CONCEPTS } from "@/lib/concepts";
import { getAsset, getProduct } from "@/lib/product";

export const metadata: Metadata = {
  title: "Compare the Five Concepts",
};

const THEME_LABEL: Record<string, string> = {
  dark: "Dark ink",
  cream: "Warm cream",
  paper: "Editorial paper",
  sage: "Light sage",
};

/** Lightweight comparison sheet: intent, interaction model and best use per concept. */
export default function ComparePage() {
  const product = getProduct();
  return (
    <div className="min-h-dvh bg-cream text-text-ink">
      <div className="mx-auto w-full max-w-[1100px] px-5 pb-16 pt-10 sm:px-8">
        <Reveal>
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-7">
            <div>
              <p className="kicker text-gold">Comparison Sheet</p>
              <h1 className="mt-2 font-serif text-[34px] sm:text-[42px]">
                Five ways to tell <em className="italic font-light">one story</em>
              </h1>
              <p className="mt-3 max-w-[56ch] text-[13.5px] leading-relaxed text-text-muted">
                Same product, same asset library, five different storytelling systems. Use this sheet
                to decide which direction to take forward — or which pair to A/B test.
              </p>
            </div>
            <Link href="/" className="kicker pb-1 text-text-muted transition-opacity hover:opacity-70">
              ← Hub
            </Link>
          </header>
        </Reveal>

        <div className="mt-8 space-y-4">
          {CONCEPTS.map((concept, i) => (
            <Reveal key={concept.slug} delay={0.04 * i}>
              <section className="grid overflow-hidden rounded-card bg-cream-soft shadow-soft ring-1 ring-hairline sm:grid-cols-[220px_1fr]">
                <Link href={concept.route} className="group relative block min-h-[150px]">
                  <AssetImage
                    asset={getAsset(product, concept.heroAssetId)}
                    fill
                    sizes="(max-width: 640px) 100vw, 220px"
                    className="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 font-serif text-[13px] text-white backdrop-blur-sm">
                    {concept.number}
                  </span>
                </Link>
                <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-6 sm:px-6">
                  <div>
                    <h2 className="font-serif text-[20px]">{concept.title}</h2>
                    <p className="kicker mt-1 text-gold">{concept.tagline}</p>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-text-muted">
                      {concept.description}
                    </p>
                  </div>
                  <div className="border-t border-hairline pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <p className="kicker mb-2 text-text-faint">Interaction model</p>
                    <ul className="space-y-1.5 text-[12px] leading-snug text-text-muted">
                      {concept.interaction.split(" · ").map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-green-deep" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-between gap-3 border-t border-hairline pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div>
                      <p className="kicker mb-2 text-text-faint">Best for</p>
                      <p className="text-[12px] leading-snug text-text-muted">{concept.bestFor}</p>
                      <p className="kicker mb-1 mt-3 text-text-faint">Theme</p>
                      <p className="text-[12px] text-text-muted">{THEME_LABEL[concept.theme]}</p>
                    </div>
                    <Link
                      href={concept.route}
                      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-deep px-4 py-2 text-[12px] font-medium text-cream transition-transform active:scale-95"
                    >
                      Open {concept.number}
                      <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden>
                        <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 border-t border-hairline pt-6 text-center text-[11px] tracking-[0.2em] uppercase text-text-faint">
            Daffy Studio · P14 Prototype · {new Date().getFullYear()}
          </p>
        </Reveal>
      </div>
    </div>
  );
}
