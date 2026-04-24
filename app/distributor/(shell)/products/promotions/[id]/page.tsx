"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dialog,
  Divider,
  Dropdown,
  Input,
  PageTitle,
  SectionRow,
} from "@/components/shared";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { UploadIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TrashIcon, XIcon } from "@/components/icons";
import {
  COUNTRY_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
  PRODUCTS,
  PROMOTIONS,
  STATUS_CONFIG,
} from "@/components/mock";
import type {
  DiscountType,
  ProductPromotion,
  PromotionStatus,
} from "@/components/type";

type PromotionForm = {
  productId: string;
  thumbnail: string;
  thumbnailName: string;
  thumbnailSize: string;
  name: string;
  description: string;
  period: { start: string; end: string };
  country: string;
  discountType: DiscountType;
  discountValue: string;
};

const EMPTY_FORM: PromotionForm = {
  productId: "",
  thumbnail: "",
  thumbnailName: "",
  thumbnailSize: "",
  name: "",
  description: "",
  period: { start: "", end: "" },
  country: "",
  discountType: "percentage",
  discountValue: "",
};

function formFromPromotion(p: ProductPromotion): PromotionForm {
  return {
    productId: p.productId,
    thumbnail: p.thumbnail,
    thumbnailName: p.thumbnailName,
    thumbnailSize: p.thumbnailSize,
    name: p.name,
    description: p.description,
    period: { start: p.periodStart, end: p.periodEnd },
    country: p.country,
    discountType: p.discountType,
    discountValue: String(p.discountValue),
  };
}

const ACCEPTED_THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

export default function PromotionDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");
  const id = rawId === "new" ? "New Promotion" : rawId;

  const match = useMemo(
    () =>
      rawId && rawId !== "new"
        ? PROMOTIONS.find((p) => p.id === rawId)
        : undefined,
    [rawId],
  );

  const notFound = rawId !== "" && rawId !== "new" && !match;

  useEffect(() => {
    if (notFound) {
      router.replace("/distributor/products/promotions");
    }
  }, [notFound, router]);

  const [form, setForm] = useState<PromotionForm>(EMPTY_FORM);

  useEffect(() => {
    if (rawId === "new" || !match) {
      setForm(EMPTY_FORM);
      return;
    }
    setForm(formFromPromotion(match));
  }, [rawId, match]);

  const [status, setStatus] = useState<PromotionStatus | null>(null);
  useEffect(() => {
    setStatus(match?.status ?? null);
  }, [match]);
  const editable = rawId === "new" || status === "draft";

  const productObj = useMemo(
    () => PRODUCTS.find((p) => p.sku === form.productId),
    [form.productId],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "cancelSubmission" | "cancelScheduled" | "delete" | null
  >(null);

  const confirmCopy = {
    cancelSubmission: {
      title: "Cancel Submission?",
      description:
        "This promotion will be moved back to Draft and will no longer be under admin review.",
      confirmLabel: "Confirm",
    },
    cancelScheduled: {
      title: "Cancel Scheduled Promotion?",
      description:
        "This promotion will not be published on the scheduled date and will be moved back to Draft.",
      confirmLabel: "Confirm",
    },
    delete: {
      title: "Delete Promotion?",
      description: "This action will remove the promotion from the system.",
      confirmLabel: "Delete",
    },
  } as const;

  const acceptThumbnail = async (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_THUMBNAIL_TYPES.includes(file.type)) {
      setThumbnailError("Only JPG, PNG, or WEBP files are allowed.");
      return;
    }
    if (file.size > MAX_THUMBNAIL_BYTES) {
      setThumbnailError("File is larger than the 10 MB limit.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({
        ...prev,
        thumbnail: dataUrl,
        thumbnailName: file.name,
        thumbnailSize: formatBytes(file.size),
      }));
      setThumbnailError(null);
    } catch {
      setThumbnailError("Couldn't read the file. Try again.");
    }
  };

  const productOptions = useMemo(
    () => PRODUCTS.map((p) => ({ label: p.name, value: p.sku })),
    [],
  );

  if (notFound) return null;

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Product" },
          { label: "Promotions", href: "/distributor/products/promotions" },
          { label: id },
        ]}
      />
      <PageTitle
        title={
          <span className="inline-flex items-center gap-3">
            <span>{match?.name || "Promotions"}</span>
            {status ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e7e7e7] bg-white px-2 py-0.5 text-[12px] font-medium leading-[1.4] tracking-[0.02em] text-[#222125]"
                style={{ color: STATUS_CONFIG[status].dotColor }}
              >
                <span
                  aria-hidden
                  className="inline-block size-1.5 rounded-full"
                  style={{ backgroundColor: STATUS_CONFIG[status].dotColor }}
                />
                <span className="text-[#222125]">
                  {STATUS_CONFIG[status].label}
                </span>
              </span>
            ) : null}
          </span>
        }
      />
      <div
        id="promotion-container"
        className={`${status === "published" ? "" : "max-h-[calc(100vh-225px)] md:max-h-[calc(100vh-295px)] overflow-y-auto"} w-full bg-white rounded-2xl p-3 md:p-6 flex flex-col gap-3 md:gap-6 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]`}
      >
        <SectionRow title="Product">
          <div className="flex flex-col gap-2 items-start w-full">
            {editable ? (
              <Dropdown
                label={"Product"}
                value={form.productId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, productId: value }))
                }
                options={productOptions}
                fullWidth
                placeholder={"Select Product"}
              />
            ) : null}
            {productObj ? (
              <div
                id="product-preview"
                className="relative mt-1 flex items-center gap-4 px-4 h-[117px] w-full overflow-hidden rounded-2xl border border-[#e7e7e7]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productObj.thumbnail}
                  alt={productObj.name}
                  className="w-[87px] h-[87px] aspect-square object-cover rounded-md"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
                    {productObj.name}
                  </p>
                  <div className="flex items-center gap-2 text-[13px] font-medium leading-[1.4] tracking-[0.26px] text-[#5f5f5f]">
                    <span>{productObj.brand}</span>
                    <span
                      aria-hidden
                      className="inline-block size-1 rounded-full bg-[#5f5f5f]"
                    />
                    <span className="truncate">{productObj.sku}</span>
                  </div>
                  <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#1e1e1e]">
                    {productObj.price}
                  </p>
                </div>
                {editable ? (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, productId: "" }))
                    }
                    aria-label="Remove product"
                    className="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-md text-[#5f5f5f] transition-colors hover:bg-[#f4f5f8] hover:text-[#222125]"
                  >
                    <XIcon />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </SectionRow>
        <Divider />
        <SectionRow title="Thumbnail">
          <div className="w-full flex flex-col gap-2 items-start">
            {form.thumbnail ? (
              <div className="relative flex items-center gap-4 px-4 h-[117px] w-full overflow-hidden rounded-2xl border border-[#e7e7e7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.thumbnail}
                  alt={form.name}
                  className="w-[87px] h-[87px] aspect-square object-cover rounded-md"
                />
                <div
                  id="thumbnail-info"
                  className="flex min-w-0 flex-1 flex-col gap-1"
                >
                  <p className="truncate text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
                    {form.thumbnailName}
                  </p>
                  <p className="text-[12px] leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                    {form.thumbnailSize}
                  </p>
                </div>
                {editable ? (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        thumbnail: "",
                        thumbnailName: "",
                        thumbnailSize: "",
                      }))
                    }
                    aria-label="Remove thumbnail"
                    className="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-md text-[#5f5f5f] transition-colors hover:bg-[#f4f5f8] hover:text-[#222125]"
                  >
                    <XIcon />
                  </button>
                ) : null}
              </div>
            ) : editable ? (
              <div className="flex w-full flex-col gap-2 md:w-[430px]">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_THUMBNAIL_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    acceptThumbnail(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    acceptThumbnail(e.dataTransfer.files?.[0]);
                  }}
                  className={`border border-dashed flex flex-col items-center justify-center h-[147px] w-full md:px-6 md:py-8 rounded-2xl cursor-pointer transition ${
                    isDragging
                      ? "border-[#f8d237] bg-[#fff9e0]"
                      : "border-[#c1c1c1] hover:bg-[#fafbfc]"
                  }`}
                >
                  <div className="w-full flex flex-col gap-4 items-center">
                    <UploadIcon />
                    <div className="flex flex-col gap-2 items-center whitespace-nowrap font-medium">
                      <p className="text-[15px] leading-none tracking-[0.3px] text-[#222125]">
                        Click or Drag file to this area to upload
                      </p>
                      <p className="text-[12px] leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                        Supported file types: JPG, PNG or WEBP | Max 10 MB
                      </p>
                    </div>
                  </div>
                </button>
                {thumbnailError ? (
                  <p className="text-[12px] font-medium leading-[1.4] text-[#ef4444]">
                    {thumbnailError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </SectionRow>
        <Divider />
        <SectionRow title="Promotion Information">
          <div className="flex flex-col gap-8 items-start w-full">
            <div className="flex flex-col gap-2 items-start w-full">
              <FieldLabel>Title</FieldLabel>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={!editable}
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <FieldLabel>Description</FieldLabel>
              <Input
                multiline
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                disabled={!editable}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start w-full">
              <div className="flex flex-col gap-2 items-start w-full md:w-[220px]">
                <FieldLabel>Discount Type</FieldLabel>
                <Dropdown
                  value={form.discountType}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      discountType: value as DiscountType,
                    }))
                  }
                  options={DISCOUNT_TYPE_OPTIONS}
                  fullWidth
                  disabled={!editable}
                />
              </div>
              <div className="flex flex-col gap-2 items-start flex-1 w-full">
                <FieldLabel>Discount Value</FieldLabel>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountValue: e.target.value,
                    }))
                  }
                  disabled={!editable}
                  trailing={
                    <span className="text-[13px] font-medium text-ink-secondary">
                      {form.discountType === "percentage" ? "%" : "$"}
                    </span>
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 items-start w-full">
              <DateRangePicker
                label={"Promotion Period"}
                dateValue={form.period}
                onDateClick={(range) =>
                  setForm((prev) => ({ ...prev, period: range }))
                }
                disabled={!editable}
              />
            </div>
            <Dropdown
              label={"Country"}
              value={form.country}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, country: value }))
              }
              position="top"
              options={COUNTRY_OPTIONS}
              fullWidth
              placeholder={"Select Country"}
              disabled={!editable}
            />
          </div>
        </SectionRow>
      </div>
      {status !== "published" && (
        <div
          id="promotion-footer"
          className="flex border border-line justify-between w-full absolute -ml-4 md:-ml-8 bottom-0 px-4 md:px-8 py-2 md:py-4"
        >
          {!status ? (
            <div className="flex-1 flex justify-end">
              <Button className="w-[100px]" onClick={() => {}}>
                Save
              </Button>
            </div>
          ) : status === "under_review" ? (
            <div className="flex-1 flex justify-end">
              <Button
                className="w-[160px]"
                onClick={() => setConfirmAction("cancelSubmission")}
              >
                Cancel Submission
              </Button>
            </div>
          ) : status === "approved" ? (
            <div className="flex-1 flex justify-end">
              <Button
                className="w-[160px]"
                onClick={() => setConfirmAction("cancelScheduled")}
              >
                Cancel Scheduled
              </Button>
            </div>
          ) : status === "rejected" ? (
            <div className="flex-1 flex justify-end">
              <Button className="w-[160px]" onClick={() => setStatus("draft")}>
                Resubmit
              </Button>
            </div>
          ) : status === "draft" ? (
            <>
              <Button
                leading={<TrashIcon />}
                className="p-0 bg-transparent"
                onClick={() => setConfirmAction("delete")}
              >
                Delete
              </Button>
              <div className="flex-1 flex justify-end gap-2 md:gap-4">
                <Button
                  className="p-0 bg-transparent border border-line"
                  onClick={() => {}}
                >
                  Save Draft
                </Button>
                <Button className="w-[120px]" onClick={() => {}}>
                  Submit
                </Button>
              </div>
            </>
          ) : null}
        </div>
      )}

      <Dialog
        width="max-w-md"
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
      >
        {confirmAction ? (
          <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                {confirmCopy[confirmAction].title}
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                {confirmCopy[confirmAction].description}
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
                className="md:w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setConfirmAction(null)}
                className="md:w-[100px]"
              >
                {confirmCopy[confirmAction].confirmLabel}
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}


function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className={`text-[15px] font-medium leading-[1.4] text-[#222125]`}>
      {children}
    </label>
  );
}
