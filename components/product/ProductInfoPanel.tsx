"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
  Button,
  Divider,
  Field,
  Input,
  SectionRow,
  Switch,
} from "@/components/shared";
import { XIcon } from "@/components/icons";
import { BRANDS, COUNTRY_NAMES } from "@/components/mock";
import type { Product } from "@/components/type";

type UploadedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  kind: "image" | "video";
};

type ProductInfoPanelProps = {
  product: Product;
};

const ACCEPTED_THUMBNAIL_TYPES = ["image/jpeg", "image/png"];
const MAX_THUMBNAIL_BYTES = 15 * 1024 * 1024;
const ACCEPTED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const brand = BRANDS.find((b) => b.name === product.brand);
  const brandCountries = brand?.countries ?? product.countries;

  // Editable product-info state
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(product.thumbnail);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [enabledCountries, setEnabledCountries] = useState<Set<string>>(
    () => new Set(product.countries),
  );
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailObjectUrlRef = useRef<string | null>(null);

  // Reset when product changes
  useEffect(() => {
    setName(product.name);
    setSku(product.sku);
    setPrice(product.price);
    setDescription("");
    setThumbnailUrl(product.thumbnail);
    setEnabledCountries(new Set(product.countries));
    setThumbnailError(null);
    setMedia((prev) => {
      prev.forEach((m) => URL.revokeObjectURL(m.previewUrl));
      return [];
    });
    setFileError(null);
  }, [product]);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (thumbnailObjectUrlRef.current)
        URL.revokeObjectURL(thumbnailObjectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    };
    // Only run on unmount — we revoke explicitly elsewhere when mutating.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleThumbnail = (next: File) => {
    if (!ACCEPTED_THUMBNAIL_TYPES.includes(next.type)) {
      setThumbnailError("Thumbnail must be a JPG or PNG image.");
      return;
    }
    if (next.size > MAX_THUMBNAIL_BYTES) {
      setThumbnailError("Thumbnail must be 15 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(next);
    if (thumbnailObjectUrlRef.current)
      URL.revokeObjectURL(thumbnailObjectUrlRef.current);
    thumbnailObjectUrlRef.current = url;
    setThumbnailUrl(url);
    setThumbnailError(null);
  };

  const handleFiles = (picked: FileList | File[]) => {
    const accepted: UploadedMedia[] = [];
    let rejection: string | null = null;

    Array.from(picked).forEach((next) => {
      if (!ACCEPTED_UPLOAD_TYPES.includes(next.type)) {
        rejection = "Supported file types: .jpg, .png, .webp, .mp4, .mov";
        return;
      }
      if (next.size > MAX_UPLOAD_BYTES) {
        rejection = "Each file must be 50 MB or smaller.";
        return;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: next,
        previewUrl: URL.createObjectURL(next),
        kind: next.type.startsWith("video/") ? "video" : "image",
      });
    });

    if (accepted.length > 0) setMedia((prev) => [...prev, ...accepted]);
    setFileError(rejection);
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((m) => m.id !== id);
    });
  };

  const toggleCountry = (code: string, next: boolean) => {
    setEnabledCountries((prev) => {
      const nextSet = new Set(prev);
      if (next) nextSet.add(code);
      else nextSet.delete(code);
      return nextSet;
    });
  };

  return (
    <section className="max-h-[calc(100vh-305px)] md:max-h-[calc(100vh-355px)] overflow-y-auto flex flex-col gap-4 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
      <SectionRow title="Thumbnail">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="size-[88px] md:size-[104px] shrink-0 overflow-hidden rounded-lg bg-[#cdcdcd]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={name}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
              Product Thumbnail
            </p>
            <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
              JPG or PNG | Max 15MB
            </p>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept={ACCEPTED_THUMBNAIL_TYPES.join(",")}
              className="hidden"
              onChange={(e) => {
                const picked = e.target.files?.[0];
                if (picked) handleThumbnail(picked);
                e.target.value = "";
              }}
            />
            <Button
              variant="outline"
              className="md:w-[140px]"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              Upload Image
            </Button>
            {thumbnailError ? (
              <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#d92d20]">
                {thumbnailError}
              </p>
            ) : null}
          </div>
        </div>
      </SectionRow>

      <Divider />

      <SectionRow title="Product Info">
        <div className="flex flex-col gap-3 md:gap-4 w-full">
          <Field label="Product Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
            />
          </Field>
          <Field label="SKU">
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU-XXXXXX-000"
            />
          </Field>
          <Field label="Description">
            <Input
              multiline
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product..."
              rows={4}
            />
          </Field>
          <Field label="Price">
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="$0.00"
            />
          </Field>
        </div>
      </SectionRow>

      <Divider />

      <SectionRow title="Brand Info">
        <div className="flex items-center gap-3">
          <div className="size-12 shrink-0 overflow-hidden rounded-full bg-[#cdcdcd]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                brand?.logoUrl ??
                `https://placehold.co/64x64?text=${encodeURIComponent(
                  product.brand.slice(0, 2).toUpperCase(),
                )}`
              }
              alt={product.brand}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
              {product.brand}
            </p>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#878787]">
              {brand ? stripProtocol(brand.website) : "shopwave.com"}
            </p>
          </div>
        </div>
      </SectionRow>

      <Divider />

      <SectionRow
        title="Country's Affiliates"
        hint="Toggle which of the brand's supported countries can sell this product."
      >
        <div className="grid grid-cols-3 gap-2 w-full">
          {brandCountries.length === 0 ? (
            <p className="text-[14px] font-medium text-[#878787]">
              This brand has no supported countries.
            </p>
          ) : (
            brandCountries.map((code) => {
              const enabled = enabledCountries.has(code);
              return (
                <div
                  key={code}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3"
                >
                  <span className="text-[15px] font-medium leading-[1.4] tracking-[0.02em] text-[#222125]">
                    {COUNTRY_NAMES[code] ?? code}
                  </span>
                  <Switch
                    checked={enabled}
                    onChange={(next) => toggleCountry(code, next)}
                    ariaLabel={`Toggle ${COUNTRY_NAMES[code] ?? code}`}
                  />
                </div>
              );
            })
          )}
        </div>
      </SectionRow>

      <Divider />

      <SectionRow title="Media Upload">
        <Field label="Media Upload">
          <div className="flex flex-col gap-3">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files?.length) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                dragActive
                  ? "border-[#796100] bg-[#fdf7e4]"
                  : "border-[#d9d9d9] bg-white hover:border-[#796100]/60 hover:bg-[#fdf7e4]/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <Upload className="size-5 text-[#222125]" aria-hidden />
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
                Click or Drag files to this area to upload
              </p>
              <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#878787]">
                Supported file types: .jpg, .png, .webp, .mp4, .mov
              </p>
            </label>

            {media.length > 0 ? (
              <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
                {media.map((item) => (
                  <li
                    key={item.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-[#f4f5f8]"
                  >
                    {item.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.previewUrl}
                        className="size-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(item.id)}
                      aria-label={`Remove ${item.file.name}`}
                      className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237]"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                    <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 py-1 text-[11px] font-medium text-white">
                      {item.file.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {fileError ? (
              <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#d92d20]">
                {fileError}
              </p>
            ) : null}
          </div>
        </Field>
      </SectionRow>
    </section>
  );
}
