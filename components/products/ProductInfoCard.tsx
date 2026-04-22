"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { ProductThumbnail } from "./ProductThumbnail";
import type { ProductInfo, ProductMedia } from "@/components/type";

type ProductInfoCardProps = {
  product: ProductInfo;
  /** Character count at which the "Read More" toggle appears. */
  descriptionClampChars?: number;
};

function getMedia(product: ProductInfo): ProductMedia[] {
  if (product.media && product.media.length > 0) return product.media;
  if (product.imageUrl) {
    return [{ type: "image", url: product.imageUrl, alt: product.imageAlt }];
  }
  return [];
}

/**
 * Top half of the product details page: media carousel on the left,
 * metadata + description + file download on the right.
 */
export function ProductInfoCard({
  product,
  descriptionClampChars = 320,
}: ProductInfoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const media = getMedia(product);

  const needsClamp = product.description.length > descriptionClampChars;
  const shown =
    !needsClamp || expanded
      ? product.description
      : `${product.description.slice(0, descriptionClampChars).trimEnd()}…`;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <ProductThumbnail
        media={media}
        name={product.name}
        imageAlt={product.imageAlt}
      />

      <div className="flex flex-1 min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-[24px] font-medium leading-[1.2] tracking-[0.48px] text-[#1e1e1e]">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 pt-1 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
              <span>{product.id}</span>
              <span
                aria-hidden="true"
                className="inline-block size-1 rounded-full bg-[#5f5f5f]"
              />
              <span>{product.sku}</span>
            </div>
          </div>
          <p className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
            {product.price}
          </p>
        </div>

        <div className="flex items-center gap-6 text-[16px] font-medium leading-[1.4] tracking-[0.32px]">
          <span className="text-[15px] text-[#1e1e1e]">Brand</span>
          <span className="flex-1 text-[#5f5f5f]">{product.brand}</span>
        </div>

        <div className="flex flex-col text-[14px] font-medium leading-[1.4] tracking-[0.28px]">
          <p className="text-[#5f5f5f]">{shown}</p>
          {needsClamp && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="self-start text-left text-[#222125] hover:underline"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        {product.downloadUrl && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-[15px] font-medium leading-none tracking-[0.3px] text-[#1e1e1e]">
              File Download:
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                const link = document.createElement("a");
                link.href = product.downloadUrl!;
                link.download = "";
                link.click();
              }}
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfoCard;
