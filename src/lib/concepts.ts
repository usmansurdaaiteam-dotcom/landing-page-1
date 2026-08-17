/** Registry of the five prototype concepts — drives the hub, switcher and compare pages. */

export interface ConceptMeta {
  slug: string;
  number: string;
  route: string;
  title: string;
  tagline: string;
  description: string;
  interaction: string;
  theme: "dark" | "cream" | "paper" | "sage";
  bestFor: string;
  heroAssetId: string;
}

export const CONCEPTS: ConceptMeta[] = [
  {
    slug: "01",
    number: "01",
    route: "/concepts/01",
    title: "Transformation Pipeline",
    tagline: "The block system",
    description:
      "A dark, modular explore view. Each block is a station in the pipeline — raw inputs, studio outputs, lifestyle worlds — closing on a transformation index that maps the full workflow.",
    interaction: "Stacked mosaic blocks · tap-to-zoom lightbox · animated flow index",
    theme: "dark",
    bestFor: "Explaining the full workflow at a glance",
    heroAssetId: "campaign-1",
  },
  {
    slug: "02",
    number: "02",
    route: "/concepts/02",
    title: "Deliverables Breakdown",
    tagline: "The client summary",
    description:
      "A calm, client-facing project summary. One hero, five numbered deliverable rows with live counts, and a final tally — the language of a delivered production.",
    interaction: "Expanding rows · animated counters · video modal",
    theme: "cream",
    bestFor: "Client hand-off and review",
    heroAssetId: "scene-gallery-1",
  },
  {
    slug: "03",
    number: "03",
    route: "/concepts/03",
    title: "From Source to Story",
    tagline: "The editorial timeline",
    description:
      "A narrative scroll — four chapters on a timeline whose progress line fills as you read. Raw capture becomes studio reconstruction, then worlds, then motion.",
    interaction: "Scroll-linked progress line · before/after slider · chapter crossfades",
    theme: "paper",
    bestFor: "Storytelling and brand pitch",
    heroAssetId: "campaign-3",
  },
  {
    slug: "04",
    number: "04",
    route: "/concepts/04",
    title: "Stage-Based Story",
    tagline: "The guided journey",
    description:
      "A guided walk through four stages with a living stepper spine. Each stage carries its own visual treatment, from rough warehouse frames to full-bleed worlds.",
    interaction: "Stage stepper navigation · swipeable stage galleries · sticky CTA",
    theme: "sage",
    bestFor: "Guided demos and conversion",
    heroAssetId: "studio-white-1",
  },
  {
    slug: "05",
    number: "05",
    route: "/concepts/05",
    title: "Category Explorer",
    tagline: "The asset library",
    description:
      "A browsable production library. Source, studio, lifestyle and video open as rich accordions with featured editorial cards, full grids and scene filters — built to scale to many products.",
    interaction: "Layout-animated accordions · scene filter chips · expandable grids",
    theme: "cream",
    bestFor: "Browsing and scaling to a catalogue",
    heroAssetId: "scene-veranda-1",
  },
];

export function getConcept(slug: string): ConceptMeta | undefined {
  return CONCEPTS.find((c) => c.slug === slug);
}
