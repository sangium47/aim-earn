"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Globe } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Dialog,
  Divider,
  Field,
  Input,
  PageTitle,
  SectionRow,
} from "@/components/shared";
import type { ApprovalStatus } from "@/components/type";
import {
  APPROVAL_PROMOTIONS,
  APPROVAL_STATUS_CONFIG,
  COUNTRY_NAMES,
  MONTHS,
  PRODUCTS,
} from "@/components/mock";

function formatDayMonthYear(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]},${y}`;
}

function StatusChip({ status }: { status: ApprovalStatus }) {
  const cfg = APPROVAL_STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e7e7e7] bg-white px-2 py-0.5 text-[12px] font-medium leading-[1.4] tracking-[0.02em]">
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full"
        style={{ backgroundColor: cfg.dotColor }}
      />
      <span className="text-[#222125]">{cfg.label}</span>
    </span>
  );
}

export default function PromotionApprovalDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const match = useMemo(
    () => APPROVAL_PROMOTIONS.find((p) => p.id === rawId),
    [rawId],
  );
  const notFound = rawId !== "" && !match;

  useEffect(() => {
    if (notFound) router.replace("/admin/approval/promotions");
  }, [notFound, router]);

  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  useEffect(() => {
    setStatus(match?.status ?? null);
  }, [match]);

  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (notFound || !match) return null;

  const product = PRODUCTS.find((p) => p.sku === match.productId);
  const isPending = status === "pending";

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Approval" },
          { label: "Promotions", href: "/admin/approval/promotions" },
          { label: match.name },
        ]}
      />

      <PageTitle
        title={
          <span className="inline-flex items-center gap-3">
            <span>{match.name}</span>
            {status ? <StatusChip status={status} /> : null}
          </span>
        }
        description={
          <span className="text-[13px] font-medium leading-[1.4] tracking-[0.26px] text-[#5f5f5f]">
            Requested Date : {formatDayMonthYear(match.requestedDate)}
          </span>
        }
      />

      <div
        id="approval-container"
        className={`${
          isPending
            ? "max-h-[calc(100vh-255px)] md:max-h-[calc(100vh-325px)] overflow-y-auto"
            : ""
        } w-full bg-white rounded-2xl p-3 md:p-6 flex flex-col gap-3 md:gap-6 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]`}
      >
        {/* Product */}
        <SectionRow title="Product">
          {product ? (
            <div className="relative flex items-center gap-4 px-4 h-[117px] w-full overflow-hidden rounded-2xl border border-[#e7e7e7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-[87px] h-[87px] aspect-square object-cover rounded-md"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 text-[13px] font-medium leading-[1.4] tracking-[0.26px] text-[#5f5f5f]">
                  <span>{product.brand}</span>
                  <span
                    aria-hidden
                    className="inline-block size-1 rounded-full bg-[#5f5f5f]"
                  />
                  <span className="truncate">{product.sku}</span>
                </div>
                <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#1e1e1e]">
                  {product.price}
                </p>
              </div>
            </div>
          ) : (
            <FallbackLine>
              {match.productName} ({match.productId})
            </FallbackLine>
          )}
        </SectionRow>

        <Divider />

        {/* Thumbnail */}
        <SectionRow title="Thumbnail">
          <div className="relative flex items-center gap-4 px-4 h-[117px] w-full overflow-hidden rounded-2xl border border-[#e7e7e7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.thumbnail}
              alt={match.name}
              className="w-[87px] h-[87px] aspect-square object-cover rounded-md"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
                {match.thumbnailName}
              </p>
              <p className="text-[12px] leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                {match.thumbnailSize}
              </p>
            </div>
          </div>
        </SectionRow>

        <Divider />

        {/* Content */}
        <SectionRow title="Content">
          <div className="flex flex-col gap-3 md:gap-6 items-start w-full">
            <div className="space-y-2">
              <h4 className="text-[16px] md:text-[20px] font-medium leading-[1.2] tracking-[0.02em] text-[#222125]">
                {match.name}
              </h4>
              <p className="whitespace-pre-wrap text-[14px] md:text-[16px] font-medium leading-[1.5] text-ink-secondary">
                {match.description}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
              <Field
                label="Discount Type"
                variant="display"
                className="md:w-[220px]"
              >
                {match.discountType === "percentage"
                  ? "Percentage (%)"
                  : "Amount ($)"}
              </Field>
              <Field
                label="Discount Value"
                variant="display"
                className="flex-1"
              >
                {match.discountType === "percentage"
                  ? `${match.discountValue}%`
                  : `$${match.discountValue.toLocaleString()}`}
              </Field>
            </div>
            <Field
              label="Promotion Period"
              icon={<Calendar className="size-4" aria-hidden />}
            >
              {formatDayMonthYear(match.periodStart)} -{" "}
              {formatDayMonthYear(match.periodEnd)}
            </Field>
            <Field
              label="Country"
              icon={<Globe className="size-4" aria-hidden />}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {match.countries.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(248,210,55,0.35)] px-2 py-0.5 text-[13px] font-medium leading-[1.4] tracking-[0.02em] text-[#222125]"
                  >
                    {COUNTRY_NAMES[c] ?? c}
                  </span>
                ))}
              </div>
            </Field>
          </div>
        </SectionRow>

        <Divider />

        {/* Requested By */}
        <SectionRow title="Requested By">
          <div className="flex flex-col gap-0.5">
            <p className="text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
              {match.requester.name}
            </p>
            <p className="text-[13px] font-medium leading-[1.4] tracking-[0.26px] text-[#5f5f5f]">
              {match.requester.code}
            </p>
          </div>
        </SectionRow>
      </div>

      {/* Review info — shown when not pending */}
      {!isPending && match.reviewer ? (
        <div
          id="review-info"
          className="w-full rounded-2xl flex flex-col gap-1 md:gap-3 pb-3 md:pb-8 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]"
        >
          <h3 className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
            Review Information
          </h3>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
            <Field
              label="Review by"
              variant="display"
              className="md:w-[320px]"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
                  {match.reviewer.name}
                </span>
                <span className="text-[13px] font-medium leading-[1.4] tracking-[0.26px] text-[#5f5f5f]">
                  {match.reviewer.code}
                </span>
              </div>
            </Field>
            <Field
              label="Reviewed Date"
              variant="display"
              className="flex-1"
            >
              {match.reviewedDate ? formatDayMonthYear(match.reviewedDate) : ""}
            </Field>
          </div>
          {status === "rejected" && match.rejectionReason ? (
            <Field label="Reason for rejection" variant="display">
              <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.5] text-[#222125]">
                {match.rejectionReason}
              </p>
            </Field>
          ) : null}
        </div>
      ) : null}

      {/* Footer — Reject + Approve when pending */}
      {isPending ? (
        <div
          id="approval-footer"
          className="flex border border-line justify-end gap-2 md:gap-4 w-full absolute -ml-4 md:-ml-8 bottom-0 px-4 md:px-8 py-2 md:py-4 bg-white"
        >
          <Button
            variant="outline"
            className="md:w-[140px]"
            onClick={() => setConfirmAction("reject")}
          >
            Reject
          </Button>
          <Button
            className="md:w-[140px]"
            onClick={() => setConfirmAction("approve")}
          >
            Approve
          </Button>
        </div>
      ) : null}

      <Dialog
        width="max-w-md"
        open={confirmAction !== null}
        onClose={() => {
          setConfirmAction(null);
          setRejectionReason("");
        }}
      >
        {confirmAction ? (
          <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                {confirmAction === "approve"
                  ? "Approve Promotion?"
                  : "Reject Promotion?"}
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                {confirmAction === "approve" ? (
                  <>
                    This promotion will be scheduled and published on{" "}
                    <span className="font-semibold text-[#222125]">
                      {formatDayMonthYear(match.periodStart)}
                    </span>
                    .
                  </>
                ) : (
                  "Please provide a reason for rejecting this promotion. This feedback will be shared with the Affiliate so they can revise and resubmit."
                )}
              </p>
            </div>
            {confirmAction === "reject" ? (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="rejection-reason"
                  className="text-[14px] font-medium leading-[1.4] text-[#222125]"
                >
                  Reason for rejection
                </label>
                <Input
                  multiline
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain what needs to change…"
                  className="min-h-[120px]"
                />
              </div>
            ) : null}
            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmAction(null);
                  setRejectionReason("");
                }}
                className="md:w-[100px]"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  confirmAction === "reject" && rejectionReason.trim() === ""
                }
                onClick={() => {
                  setStatus(
                    confirmAction === "approve" ? "approved" : "rejected",
                  );
                  setConfirmAction(null);
                }}
                className={
                  confirmAction === "reject" ? "md:w-[180px]" : "md:w-[120px]"
                }
              >
                {confirmAction === "approve" ? "Approve" : "Reject Promotion"}
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}

function FallbackLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
      {children}
    </p>
  );
}
