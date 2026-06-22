type InkArtworkProps = {
  title: string;
  variant?: "moon" | "spring" | "tower" | "mountain";
  size?: "large" | "medium" | "small";
  zoomable?: boolean;
};

const variantClasses = {
  moon: "ink-art-moon",
  spring: "ink-art-spring",
  tower: "ink-art-tower",
  mountain: "ink-art-mountain",
};

const sizeClasses = {
  large: "ink-art-large",
  medium: "ink-art-medium",
  small: "ink-art-small",
};

export function InkArtwork({ title, variant = "moon", size = "medium", zoomable = false }: InkArtworkProps) {
  return (
    <div className={`ink-art ${variantClasses[variant]} ${sizeClasses[size]}`} aria-label={`${title} 水墨插图`} role="img">
      <span className="ink-moon" />
      <span className="ink-branch" />
      <span className="ink-house" />
      <span className="ink-tower" />
      {zoomable ? <span className="ink-zoom">⌕</span> : null}
    </div>
  );
}

export function artworkVariant(seed: string): InkArtworkProps["variant"] {
  const variants: NonNullable<InkArtworkProps["variant"]>[] = ["moon", "spring", "tower", "mountain"];
  const total = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return variants[total % variants.length];
}
