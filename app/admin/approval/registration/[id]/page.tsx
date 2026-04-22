"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Dialog,
  Divider,
  Field as SharedField,
  Input,
  PageTitle,
  Table,
} from "@/components/shared";
import type {
  ApprovalStatus,
  RegistrationApproval,
  TableColumn,
} from "@/components/type";
import {
  APPROVAL_STATUS_CONFIG,
  COUNTRY_NAMES,
  MONTHS,
  REGISTRATION_APPROVALS,
} from "@/components/mock";

function formatDayMonthYear(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]},${y}`;
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString()}`;
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

function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function RegistrationApprovalDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const match = useMemo(
    () => REGISTRATION_APPROVALS.find((r) => r.id === rawId),
    [rawId],
  );
  const notFound = rawId !== "" && !match;

  useEffect(() => {
    if (notFound) router.replace("/admin/approval/registration");
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

  const isPending = status === "pending";

  const subtotal = match.countryPricing.reduce((sum, r) => sum + r.price, 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  const summaryColumns: TableColumn<
    RegistrationApproval["countryPricing"][0]
  >[] = [
    {
      header: "Country",
      render: (item) => COUNTRY_NAMES[item.country] ?? item.country,
    },
    {
      header: "Price",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (item) => formatCurrency(item.price),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Approval" },
          { label: "Registration", href: "/admin/approval/registration" },
          { label: match.distributor.name },
        ]}
      />

      <PageTitle
        title={
          <span className="inline-flex items-center gap-3">
            <span>{match.distributor.name}</span>
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
        className={`${
          isPending
            ? "max-h-[calc(100vh-255px)] md:max-h-[calc(100vh-325px)] overflow-y-auto"
            : ""
        } flex flex-col gap-3 md:gap-6`}
      >
        {/* Sections */}
        <div
          id="registration-container"
          className={` w-full bg-white rounded-2xl p-3 md:p-6 flex flex-col gap-4 md:gap-6 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]`}
        >
          {/* Distributor Details */}
          <ColumnSection title="Distributor Details">
            <Field label="Name">{match.distributor.name}</Field>
            <Field label="Company/Trading Name">{match.companyName}</Field>
            <Field label="Email">{match.email}</Field>
            <Field label="Tax ID">{match.taxId}</Field>
            {match.currentCountries && match.currentCountries.length > 0 ? (
              <Field label="Current Countries" className="md:col-span-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {match.currentCountries.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(248,210,55,0.35)] px-2 py-0.5 text-[13px] font-medium leading-[1.4] tracking-[0.02em] text-[#222125]"
                    >
                      {COUNTRY_NAMES[c] ?? c}
                    </span>
                  ))}
                </div>
              </Field>
            ) : null}
          </ColumnSection>

          <Divider />

          {/* Bank Details */}
          <ColumnSection title="Bank Details">
            <Field label="Bank Name">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={match.bank.logoUrl}
                  alt={`${match.bank.name} logo`}
                  className="h-6 w-6 rounded-md bg-white object-cover aspect-square"
                />
                <span>{match.bank.name}</span>
              </div>
            </Field>
            <Field label="SWIFT">{match.bank.swift}</Field>
            <Field label="Account Name">{match.bank.accountName}</Field>
            <Field label="Account Number">{match.bank.accountNumber}</Field>
            <Field label="Payment Slip" className="md:col-span-2">
              <div className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-[#e7e7e7] px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={match.paymentSlipUrl}
                  alt={match.paymentSlipName}
                  className="h-[72px] w-[72px] shrink-0 rounded-md object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
                    {match.paymentSlipName}
                  </p>
                  <p className="text-[12px] leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                    {match.paymentSlipSize}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    downloadFile(match.paymentSlipUrl, match.paymentSlipName)
                  }
                  aria-label={`Download ${match.paymentSlipName}`}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#e7e7e7] text-[#222125] transition-colors hover:bg-[#f4f5f8]"
                >
                  <Download className="size-4" aria-hidden />
                </button>
              </div>
            </Field>
          </ColumnSection>
        </div>

        {/* Summary */}
        <div
          id="summary-container"
          className="w-full bg-white rounded-2xl p-3 md:p-6 flex flex-col gap-3 md:gap-4 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]"
        >
          <h3 className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
            Summary
          </h3>
          <Table
            data={match.countryPricing}
            columns={summaryColumns}
            minWidth="min-w-[320px]"
            pagination={false}
          />
          <div className="ml-auto flex w-full max-w-[360px] flex-col gap-2 pr-6">
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
            <SummaryRow label="VAT 10%" value={formatCurrency(vat)} />
            <div className="border-t border-[#e7e7e7] pt-2">
              <SummaryRow
                label="Total Amount"
                value={formatCurrency(total)}
                emphasized
              />
            </div>
          </div>
        </div>

        {/* Review info — shown when not pending */}
        {!isPending && match.reviewer ? (
          <div
            id="review-info"
            className="w-full bg-white rounded-2xl p-3 md:p-6 flex flex-col gap-3 md:gap-6 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]"
          >
            <h3 className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
              Review Information
            </h3>
            <div className="flex gap-2 md:gap-6 w-full">
              <Field
                label="Review by"
                className="w-fit flex-none border-r border-line pr-6 md:pr-12"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
                    {match.reviewer.name}
                  </span>
                </div>
              </Field>
              <Field label="Reviewed Date" className="flex-auto">
                {match.reviewedDate
                  ? formatDayMonthYear(match.reviewedDate)
                  : ""}
              </Field>
            </div>
            {status === "rejected" && match.rejectionReason ? (
              <Field label="Reason for rejection">
                <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.5] text-[#222125]">
                  {match.rejectionReason}
                </p>
              </Field>
            ) : null}
          </div>
        ) : null}
      </div>

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
                  ? "Approve Application?"
                  : "Reject User Application?"}
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                {confirmAction === "approve"
                  ? "Are you sure you want to approve this membership application? Once approved, the user will be able to access the platform immediately."
                  : "Please provide the reason for rejecting this application.This message will be sent to the user."}
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
                  rows={3}
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain what needs to change…"
                  className="min-h-[80px]"
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
                  confirmAction === "reject" ? "md:w-[140px]" : "md:w-[140px]"
                }
              >
                {confirmAction === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}

function ColumnSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-3 md:gap-4">
      <h3 className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
        {title}
      </h3>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SharedField
      label={label}
      variant="display"
      className={className}
      labelClassName="text-[13px] font-medium leading-[1.4] text-[#5f5f5f]"
    >
      {children}
    </SharedField>
  );
}

function SummaryRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          emphasized
            ? "text-[15px] font-semibold text-[#222125]"
            : "text-[14px] font-medium text-[#5f5f5f]"
        }
      >
        {label}
      </span>
      <span
        className={
          emphasized
            ? "text-[18px] font-semibold text-[#222125]"
            : "text-[14px] font-medium text-[#222125]"
        }
      >
        {value}
      </span>
    </div>
  );
}
