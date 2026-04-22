"use client";

import { useEffect, useRef, useState } from "react";
import { MailIcon, MoreVerticalIcon } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryPill,
  Dialog,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import { SendEmail } from "@/components/affiliate-list/SendEmail";
import { COUNTRY_OPTIONS } from "@/components/mock";
import type { DateRange, EmailTemplate, TableColumn } from "@/components/type";

type SuspendStatus = "suspended" | "banned";

const SUSPEND_STATUS_CONFIG: Record<
  SuspendStatus,
  { label: string; dotColor: string }
> = {
  suspended: { label: "Suspended", dotColor: "#FFC300" },
  banned: { label: "Banned", dotColor: "#FF0000" },
};

type SuspendedMember = {
  id: string;
  name: string;
  email: string;
  country: string;
  suspendedDate: string;
  inviter: { name: string; code: string };
  distributor: { name: string; code: string };
  status: SuspendStatus;
};

const INITIAL_SUSPENDED: SuspendedMember[] = [
  {
    id: "#AG8932",
    name: "Sarah Chen",
    email: "sarah.chen@aimearn.com",
    country: "SG",
    suspendedDate: "2026-03-18",
    inviter: { name: "Alexa Microsoft", code: "#BB5252" },
    distributor: { name: "Dana Wong", code: "#DS1024" },
    status: "suspended",
  },
  {
    id: "#AG3761",
    name: "Anan Suksan",
    email: "anan.suksan@aimearn.com",
    country: "TH",
    suspendedDate: "2026-03-22",
    inviter: { name: "Alexa Microsoft", code: "#BB5252" },
    distributor: { name: "Marcus Lim", code: "#DS0871" },
    status: "banned",
  },
  {
    id: "#AG6145",
    name: "Nur Aisyah",
    email: "nur.aisyah@aimearn.com",
    country: "MY",
    suspendedDate: "2026-04-02",
    inviter: { name: "Alexa Microsoft", code: "#BB5252" },
    distributor: { name: "Priya Shah", code: "#DS0612" },
    status: "suspended",
  },
  {
    id: "#AG9892",
    name: "Wei Ming",
    email: "wei.ming@aimearn.com",
    country: "SG",
    suspendedDate: "2026-04-04",
    inviter: { name: "Alexa Microsoft", code: "#BB5252" },
    distributor: { name: "Haruto Sato", code: "#DS0455" },
    status: "suspended",
  },
];

const templates: EmailTemplate[] = [
  { id: "welcome", name: "Welcome & Onboarding" },
  { id: "promo-spring", name: "Spring Promotion" },
  { id: "monthly-digest", name: "Monthly Newsletter Digest" },
  { id: "cart-abandon", name: "Abandoned Cart Reminder" },
];

export default function AdminSuspendPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [country, setCountry] = useState("all");
  const [emailOpen, setEmailOpen] = useState(false);
  const [rows, setRows] = useState<SuspendedMember[]>(INITIAL_SUSPENDED);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const confirmTarget = rows.find((r) => r.id === confirmId) ?? null;

  const reactivate = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const columns: TableColumn<SuspendedMember>[] = [
    {
      header: "Name",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">{item.name}</span>
          <span className="text-xs text-ink-secondary">{item.id}</span>
        </div>
      ),
    },
    {
      header: "Inviter",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.inviter.name}
          </span>
          <span className="text-xs text-ink-secondary">
            {item.inviter.code}
          </span>
        </div>
      ),
    },
    {
      header: "Distributor",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.distributor.name}
          </span>
          <span className="text-xs text-ink-secondary">
            {item.distributor.code}
          </span>
        </div>
      ),
    },
    {
      header: "Country",
      headerClassName: "min-w-[100px]",
      render: (item) => <CountryPill code={item.country} />,
    },
    {
      header: "Suspended Date",
      key: "suspendedDate",
      headerClassName: "min-w-[140px]",
    },
    {
      header: "Action",
      headerClassName: "w-[96px]",
      render: (item) => (
        <ActionMenu onReactivate={() => setConfirmId(item.id)} />
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Affiliate" }, { label: "Suspend" }]} />

      <PageTitle
        title="Suspended Members"
        actions={
          <Button
            leading={<MailIcon className="size-4" />}
            onClick={() => setEmailOpen(true)}
            className="w-full"
          >
            Send Email
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name or email..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Suspended Date"
        onDateClick={setDateRange}
        dropdowns={[
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: COUNTRY_OPTIONS,
          },
        ]}
      />

      <Table data={rows} columns={columns} minWidth="min-w-[1120px]" />

      <Dialog
        width="max-w-lg"
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
      >
        <SendEmail
          recipientCount={rows.length}
          templates={templates}
          onCancel={() => setEmailOpen(false)}
          onSend={() => setEmailOpen(false)}
        />
      </Dialog>

      <Dialog
        width="max-w-md"
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
      >
        {confirmTarget ? (
          <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                Reactivate Member?
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                <span className="font-semibold text-[#222125]">
                  {confirmTarget.name}
                </span>{" "}
                ({confirmTarget.id}) will regain access to the platform and
                return to the active affiliates list.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmId(null)}
                className="md:w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  reactivate(confirmTarget.id);
                  setConfirmId(null);
                }}
                className="md:w-[140px]"
              >
                Reactivate
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}

function ActionMenu({ onReactivate }: { onReactivate: () => void }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Row actions"
        className="inline-flex size-9 items-center justify-center text-[#222125] transition-colors hover:bg-[#f4f5f8]"
      >
        <MoreVerticalIcon className="size-4" />
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-[160px] overflow-hidden rounded-xl border border-line bg-white p-1 shadow-lg"
        >
          <li>
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onReactivate();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-[#f4f5f8]"
            >
              Reactivate
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
