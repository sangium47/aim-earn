"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductMedia } from "./ProductInfoCard";

type ProductThumbnailProps = {
  media: ProductMedia[];
  /** Used for accessibility labels on the carousel wrapper. */
  name?: string;
  /** Fallback alt text when a media item doesn't provide its own. */
  imageAlt?: string;
  /**
   * Aspect ratio of the main viewer, as any valid CSS `aspect-ratio`
   * value (e.g. `"375/354"`, `"1/1"`, `"16/9"`). Defaults to 375/354.
   */
  aspectRatio?: string;
  className?: string;
};

/**
 * Product media carousel: main image/video viewer with prev/next arrows,
 * page-indicator dots, and a thumbnail selector strip below. Accepts a
 * mixed list of images and videos.
 */
export function ProductThumbnail({
  media,
  name,
  imageAlt,
  aspectRatio = "375/354",
  className = "",
}: ProductThumbnailProps) {
  const [index, setIndex] = useState(0);

  const total = media.length;
  const safeIndex = total === 0 ? 0 : Math.min(index, total - 1);
  const current = media[safeIndex];

  const goPrev = () =>
    setIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  const goNext = () => setIndex((i) => (total === 0 ? 0 : (i + 1) % total));

  return (
    <div
      id="product-thumbnail"
      className={`flex w-full shrink-0 flex-col gap-3 md:w-[375px] ${className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-[#cdcdcd]"
        style={{ aspectRatio }}
        onKeyDown={(e) => {
          if (total <= 1) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
        tabIndex={total > 1 ? 0 : -1}
        role={total > 1 ? "group" : undefined}
        aria-roledescription={total > 1 ? "carousel" : undefined}
        aria-label={total > 1 ? name : undefined}
      >
        {current ? (
          current.type === "image" ? (
            <Image
              src={current.url}
              alt={current.alt ?? imageAlt ?? name ?? ""}
              fill
              sizes="(min-width: 768px) 375px, 100vw"
              className="object-cover"
            />
          ) : (
            <video
              key={current.url}
              src={current.url}
              poster={current.poster}
              controls
              autoPlay
              muted
              loop
              className="absolute inset-0 size-full object-cover"
            />
          )
        ) : null}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-[#222125] shadow transition-colors hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-[#222125] shadow transition-colors hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1">
              {media.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === safeIndex}
                  className={`size-1.5 rounded-full transition-all ${
                    i === safeIndex ? "w-4 bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((m, i) => (
            <ThumbnailButton
              key={`${m.url}-${i}`}
              media={m}
              active={i === safeIndex}
              onClick={() => setIndex(i)}
              ariaLabel={`Show media ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ThumbnailButtonProps = {
  media: ProductMedia;
  active?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

function ThumbnailButton({
  media,
  active = false,
  onClick,
  ariaLabel,
}: ThumbnailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={[
        "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-[#e7e7e7] transition-colors",
        active ? "border-[#f8d237]" : "border-transparent",
      ].join(" ")}
    >
      {media.type === "image" ? (
        <Image
          src={media.url}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : media.poster ? (
        <Image
          src={media.poster}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-black text-[10px] font-semibold text-white">
          VIDEO
        </span>
      )}
    </button>
  );
}

export default ProductThumbnail;
