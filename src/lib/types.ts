/** Shared content types. All UI reads from these — see src/lib/product.ts. */

export type AssetCategory = "raw" | "studio" | "lifestyle" | "campaign" | "video";
export type AssetSetting = "warehouse" | "studio" | "indoor" | "outdoor";
export type AssetCrop = "full" | "close" | "macro";
export type AssetTier = "hero" | "large" | "thumb";

export interface WebImage {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export interface Asset {
  id: string;
  original: string;
  category: AssetCategory;
  scene: string;
  setting: AssetSetting;
  crop: AssetCrop;
  tier: AssetTier;
  curated?: boolean;
  note?: string;
  originalMeta: {
    width: number;
    height: number;
    aspect: number;
    orientation: "portrait" | "landscape" | "square";
    bytes: number;
  };
  web: WebImage | null;
}

export interface ProductVideo {
  id: string;
  src: string;
  poster: string;
  durationSeconds: number;
  derived: boolean;
  derivedFrom: string[];
  note: string;
}

export type StageKey = "source" | "studio" | "lifestyle" | "campaign";

export interface Stage {
  key: StageKey;
  index: number;
  label: string;
  heading: string;
  copy: string;
  categories: AssetCategory[];
}

export interface DeliverableDef {
  key: string;
  index: number;
  label: string;
  copy: string;
  filter: { category: AssetCategory; crop?: AssetCrop[] };
}

export interface SceneFamily {
  key: string;
  label: string;
  setting: "indoor" | "outdoor";
}

export interface BeforeAfterPair {
  before: string;
  after: string;
  label: string;
}

export interface Product {
  slug: string;
  name: string;
  collection: string;
  title: string;
  subtitle: string;
  materialLine: string;
  story: string;
  heroes: Record<string, string>;
  beforeAfter: BeforeAfterPair[];
  counts: Record<AssetCategory, number>;
  video: ProductVideo;
  stages: Stage[];
  deliverables: DeliverableDef[];
  sceneFamilies: SceneFamily[];
  assets: Asset[];
}

export interface Manifest {
  generatedAt: string;
  products: Product[];
}

/** A deliverable resolved against the asset library. */
export interface Deliverable extends Omit<DeliverableDef, "filter"> {
  count: number;
  assets: Asset[];
  isVideo: boolean;
}
