import manifestJson from "../../data/product-manifest.json";
import type {
  Asset,
  AssetCategory,
  BeforeAfterPair,
  Deliverable,
  Manifest,
  Product,
  Stage,
} from "./types";

const manifest = manifestJson as unknown as Manifest;

/** All products in the library (one today; the system scales by adding manifests). */
export function getProducts(): Product[] {
  return manifest.products;
}

export function getProduct(slug = "p14"): Product {
  const product = manifest.products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}

export function getAsset(product: Product, id: string): Asset {
  const asset = product.assets.find((a) => a.id === id);
  if (!asset) throw new Error(`Unknown asset: ${id}`);
  return asset;
}

/** Assets that have web derivatives (curated raws + all finals). */
export function getWebAssets(product: Product, category?: AssetCategory): Asset[] {
  return product.assets.filter(
    (a) => a.web !== null && (category ? a.category === category : true)
  );
}

export function getStageAssets(product: Product, stage: Stage): Asset[] {
  return product.assets.filter((a) => a.web !== null && stage.categories.includes(a.category));
}

export function getSceneAssets(product: Product, scene: string): Asset[] {
  return product.assets.filter((a) => a.web !== null && a.scene === scene);
}

export function getHero(product: Product, variant = "primary"): Asset {
  return getAsset(product, product.heroes[variant] ?? product.heroes.primary);
}

export function getBeforeAfterPairs(
  product: Product
): { before: Asset; after: Asset; label: string }[] {
  return product.beforeAfter.map((pair: BeforeAfterPair) => ({
    before: getAsset(product, pair.before),
    after: getAsset(product, pair.after),
    label: pair.label,
  }));
}

/** Deliverable definitions resolved against the asset library, counts included. */
export function getDeliverables(product: Product): Deliverable[] {
  return product.deliverables.map((def) => {
    const isVideo = def.filter.category === "video";
    const assets = isVideo
      ? []
      : product.assets.filter(
          (a) =>
            a.web !== null &&
            a.category === def.filter.category &&
            (!def.filter.crop || def.filter.crop.includes(a.crop))
        );
    return {
      key: def.key,
      index: def.index,
      label: def.label,
      copy: def.copy,
      count: isVideo ? 1 : assets.length,
      assets,
      isVideo,
    };
  });
}

/** Grand total of final deliverable assets (packshots + details + lifestyle + campaign + video). */
export function getTotalDeliverables(product: Product): number {
  return getDeliverables(product).reduce((sum, d) => sum + d.count, 0);
}

/** Count of every source capture, including non-curated raws. */
export function getRawCount(product: Product): number {
  return product.counts.raw;
}
