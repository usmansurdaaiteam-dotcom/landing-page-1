import type { Metadata } from "next";
import Link from "next/link";
import AssetImage from "@/components/AssetImage";
import Reveal from "@/components/Reveal";
import { CONCEPTS } from "@/lib/concepts";
import { getAsset, getProduct, getTotalDeliverables } from "@/lib/product";

export const metadata: Metadata = {
  title: "Daffy Studio — P14 Prototype Review Hub",
};

const THEME_SWATCH: Record<string, string> = {
  dark: "bg-ink",
  cream: "bg-cream-soft ring-1 ring-hairline",
  paper: "bg-paper ring-1 ring-hairline",
  sage: "bg-sage-bg ring-1 ring-hairline",
};

export default function HubPage() {
  const product = getProduct();
  const total = getTotalDeliverables(product);

  const pipeline = [
    { label: "Raw Source", count: product.counts.raw, assetId: "raw-1330" },
    { label: "Studio", count: product.counts.studio, assetId: "studio-white-1" },
    { label: "Lifestyle", count: product.counts.lifestyle, assetId: "scene-veranda-1" },
    { label: "Campaign + Film", count: product.counts.campaign + 1, assetId: "campaign-3" },
  ];

  return (
    <div className="min-h-dvh bg-cream text-text-ink">
      <div className="mx-auto w-full max-w-[1100px] px-5 pb-16 pt-10 sm:px-8">
        {/* Masthead */}
        <Reveal>
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-8">
            <div>
              <p className="kicker text-gold">Prototype Review Hub</p>
              <h1 className="mt-3 font-serif text-[42px] leading-[1.02] sm:text-[56px]">
                Daffy <em className="italic font-light">Studio</em>
              </h1>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-text-muted">
                Five mobile-first concepts telling one true story: how {product.counts.raw} raw
                warehouse captures of the <strong className="font-medium text-text-ink">{product.title}</strong>{" "}
                become {total} campaign-ready assets — packshots, material studies, lifestyle worlds
                and motion.
              </p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="font-serif text-3xl">{product.counts.raw}</p>
                <p className="kicker mt-1 text-text-faint">raw inputs</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-green-deep">{total}</p>
                <p className="kicker mt-1 text-text-faint">final assets</p>
              </div>
            </div>
          </header>
        </Reveal>

        {/* Pipeline strip */}
        <Reveal delay={0.08}>
          <section className="mt-8">
            <p className="kicker text-text-faint">The production pipeline</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pipeline.map((step, i) => (
                <div
                  key={step.label}
                  className="relative overflow-hidden rounded-card bg-cream-soft shadow-soft ring-1 ring-hairline"
                >
                  <div className="relative aspect-[5/4]">
                    <AssetImage
                      asset={getAsset(product, step.assetId)}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[12px] font-medium">{step.label}</span>
                    <span className="font-serif text-[15px] text-green-deep">{step.count}</span>
                  </div>
                  {i < pipeline.length - 1 && (
                    <span className="absolute right-2 top-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  {i === pipeline.length - 1 && (
                    <span className="absolute right-2 top-2 rounded-full bg-green-deep px-2 py-0.5 text-[10px] text-cream">
                      04
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Concepts */}
        <section className="mt-12">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <p className="kicker text-text-faint">Five directions</p>
                <h2 className="mt-2 font-serif text-[28px]">Pick a concept to review</h2>
              </div>
              <Link
                href="/compare"
                className="hidden rounded-full border border-hairline px-4 py-2 text-[12px] font-medium text-text-muted transition-colors hover:text-text-ink sm:block"
              >
                Compare all →
              </Link>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((concept, i) => (
              <Reveal key={concept.slug} delay={0.05 * i}>
                <Link
                  href={concept.route}
                  className="group block overflow-hidden rounded-card bg-cream-soft shadow-soft ring-1 ring-hairline transition-shadow duration-300 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <AssetImage
                      asset={getAsset(product, concept.heroAssetId)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/40 py-1 pl-1.5 pr-3 text-[11px] font-medium text-white backdrop-blur-sm">
                      <span className={`h-4 w-4 rounded-full ${THEME_SWATCH[concept.theme]}`} />
                      Concept {concept.number}
                    </span>
                  </div>
                  <div className="px-5 py-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-[20px]">{concept.title}</h3>
                      <span className="kicker shrink-0 text-gold">{concept.tagline}</span>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-text-muted">
                      {concept.description}
                    </p>
                    <p className="mt-3 border-t border-hairline pt-3 text-[11px] tracking-wide text-text-faint">
                      {concept.interaction}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-green-deep">
                      Open concept
                      <svg width="13" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                        <path
                          d="M9 1l4 4-4 4M13 5H1"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}

            {/* Compare card */}
            <Reveal delay={0.25}>
              <Link
                href="/compare"
                className="flex h-full min-h-[220px] flex-col justify-between rounded-card bg-green-deep p-6 text-cream shadow-soft transition-shadow hover:shadow-lift"
              >
                <div>
                  <p className="kicker text-cream/60">Side by side</p>
                  <h3 className="mt-2 font-serif text-[22px]">Compare the five directions</h3>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-cream/70">
                    Intent, interaction model and best use for each concept — on one page, ready for
                    an A/B discussion.
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium">
                  Open comparison
                  <svg width="13" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                    <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Architecture note */}
        <Reveal>
          <footer className="mt-14 grid gap-6 border-t border-hairline pt-8 text-[12.5px] leading-relaxed text-text-muted sm:grid-cols-3">
            <div>
              <p className="kicker mb-2 text-text-faint">Built on real assets</p>
              All imagery is the actual P14 production library — {product.counts.raw} raw captures,{" "}
              {product.counts.studio} studio outputs, {product.counts.lifestyle} lifestyle scenes,{" "}
              {product.counts.campaign} campaign heroes and a motion study.
            </div>
            <div>
              <p className="kicker mb-2 text-text-faint">One content system</p>
              Every concept reads from the same classified asset manifest. New products drop in as
              data — no page rebuilds.
            </div>
            <div>
              <p className="kicker mb-2 text-text-faint">Review tips</p>
              Best experienced at mobile width. Open a concept, then use the header to hop to the
              next direction without returning here.
            </div>
          </footer>
        </Reveal>
      </div>
    </div>
  );
}
