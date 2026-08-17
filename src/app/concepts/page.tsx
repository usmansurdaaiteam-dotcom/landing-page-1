import type { Metadata } from "next";
import Link from "next/link";
import AssetImage from "@/components/AssetImage";
import Reveal from "@/components/Reveal";
import { CONCEPTS } from "@/lib/concepts";
import { getAsset, getProduct } from "@/lib/product";

export const metadata: Metadata = {
  title: "Concepts — Switcher",
};

/** Compact concept switcher: a fast list for hopping between the five directions. */
export default function ConceptsPage() {
  const product = getProduct();
  return (
    <div className="min-h-dvh bg-cream text-text-ink">
      <div className="mx-auto w-full max-w-[480px] px-5 pb-14 pt-8">
        <Reveal>
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="kicker text-gold">Concept Switcher</p>
              <h1 className="mt-2 font-serif text-[30px]">Five directions</h1>
            </div>
            <Link href="/" className="kicker pb-1 text-text-muted transition-opacity hover:opacity-70">
              ← Hub
            </Link>
          </div>
        </Reveal>

        <div className="space-y-3">
          {CONCEPTS.map((concept, i) => (
            <Reveal key={concept.slug} delay={0.05 * i}>
              <Link
                href={concept.route}
                className="group flex items-center gap-4 rounded-card bg-cream-soft p-3 pr-5 shadow-soft ring-1 ring-hairline transition-shadow hover:shadow-lift"
              >
                <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-tile">
                  <AssetImage
                    asset={getAsset(product, concept.heroAssetId)}
                    fill
                    sizes="76px"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="kicker text-text-faint">
                    {concept.number} · {concept.tagline}
                  </p>
                  <h2 className="mt-1 truncate font-serif text-[18px]">{concept.title}</h2>
                  <p className="mt-1 truncate text-[11.5px] text-text-muted">{concept.interaction}</p>
                </div>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="shrink-0 text-green-deep" aria-hidden>
                  <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <Link
            href="/compare"
            className="mt-5 block rounded-card border border-dashed border-text-ink/25 px-5 py-4 text-center text-[12.5px] font-medium text-text-muted transition-colors hover:text-text-ink"
          >
            Or compare all five side by side →
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
