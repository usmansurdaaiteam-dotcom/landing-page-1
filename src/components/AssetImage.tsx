import Image from "next/image";
import type { Asset } from "@/lib/types";

interface AssetImageProps {
  asset: Asset;
  /** Fill the parent (parent must be positioned + sized). */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  quality?: number;
}

/**
 * next/image bound to a manifest asset: correct intrinsic size, blur placeholder,
 * no layout shift. All imagery in the prototype flows through this component.
 */
export default function AssetImage({
  asset,
  fill = false,
  sizes = "100vw",
  priority = false,
  className,
  quality = 78,
}: AssetImageProps) {
  if (!asset.web) return null;
  const alt = `${asset.category} — ${asset.note || asset.id}`;
  if (fill) {
    return (
      <Image
        src={asset.web.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={asset.web.blurDataURL}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src={asset.web.src}
      alt={alt}
      width={asset.web.width}
      height={asset.web.height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={asset.web.blurDataURL}
      className={className}
    />
  );
}
