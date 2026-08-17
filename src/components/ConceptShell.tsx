import Link from "next/link";
import type { ReactNode } from "react";
import { CONCEPTS, getConcept } from "@/lib/concepts";

interface ConceptShellProps {
  slug: string;
  children: ReactNode;
  /** Dark chrome for dark-themed concepts. */
  dark?: boolean;
  /** Background class applied to the page column. */
  background: string;
}

/**
 * Shared chrome for concept pages: top hairline bar with back link + concept
 * index, mobile-first centered column, prev/next concept footer.
 */
export default function ConceptShell({ slug, children, dark = false, background }: ConceptShellProps) {
  const concept = getConcept(slug);
  const idx = CONCEPTS.findIndex((c) => c.slug === slug);
  const prev = CONCEPTS[(idx - 1 + CONCEPTS.length) % CONCEPTS.length];
  const next = CONCEPTS[(idx + 1) % CONCEPTS.length];

  const text = dark ? "text-text-cream" : "text-text-ink";
  const muted = dark ? "text-text-cream-muted" : "text-text-muted";
  const line = dark ? "border-hairline-dark" : "border-hairline";

  return (
    <div className={`min-h-dvh w-full ${background}`}>
      <div className={`mx-auto flex min-h-dvh w-full max-w-[480px] flex-col ${text}`}>
        <header
          className={`sticky top-0 z-40 flex items-center justify-between border-b ${line} px-5 py-3 backdrop-blur-md ${
            dark ? "bg-ink/85" : "bg-cream/85"
          }`}
        >
          <Link href="/" className={`kicker ${muted} transition-opacity hover:opacity-70`}>
            ← Hub
          </Link>
          <span className="kicker">
            Concept {concept?.number} <span className={muted}>/ 05</span>
          </span>
          <Link
            href={next.route}
            className={`kicker ${muted} transition-opacity hover:opacity-70`}
            aria-label={`Next concept: ${next.title}`}
          >
            Next →
          </Link>
        </header>

        <main className="flex-1">{children}</main>

        <footer className={`border-t ${line} px-5 py-6`}>
          <p className={`kicker mb-4 ${muted}`}>Review another direction</p>
          <div className="flex items-stretch gap-3">
            <Link
              href={prev.route}
              className={`flex-1 rounded-tile border ${line} px-4 py-3 transition-opacity hover:opacity-75`}
            >
              <span className={`kicker block ${muted}`}>← {prev.number}</span>
              <span className="mt-1 block font-serif text-sm">{prev.title}</span>
            </Link>
            <Link
              href={next.route}
              className={`flex-1 rounded-tile border ${line} px-4 py-3 text-right transition-opacity hover:opacity-75`}
            >
              <span className={`kicker block ${muted}`}>{next.number} →</span>
              <span className="mt-1 block font-serif text-sm">{next.title}</span>
            </Link>
          </div>
          <p className={`mt-6 text-center text-[11px] tracking-[0.2em] uppercase ${muted}`}>
            Daffy Studio · P14 Prototype
          </p>
        </footer>
      </div>
    </div>
  );
}
