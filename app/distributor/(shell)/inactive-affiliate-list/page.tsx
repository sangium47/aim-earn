"use client";

import { useState } from "react";
import { Flag, MailIcon } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryPill,
  Dialog,
  FilterBar,
  PageTitle,
  Table,
} from "@/components/shared";

import { SendEmail } from "@/components/affiliate-list/SendEmail";
import type {
  DateRange,
  EmailTemplate,
  TableColumn,
} from "@/components/type";

type Affiliate = {
  id: string;
  name: string;
  email: string;
  country: string;
  joined: string;
  inviter: string;
  inviterId: string;
  sales: string;
  commissionPool: string;
  directCommission: string;
  indirectCommission: string;
  totalEarning: string;
  commission: string;
};

const AFFILIATES: Affiliate[] = [
  {
    id: "#AG8932",
    name: "Sarah Chen",
    email: "test@aimearn.com",
    country: "SG",
    joined: "2026-01-12",
    inviter: "Alexa Microsoft",
    inviterId: "#BB5252",
    sales: "$42,781",
    commissionPool: "$4,278",
    directCommission: "$200",
    indirectCommission: "$200",
    totalEarning: "$200",
    commission: "$200",
  },
  {
    id: "#AG3761",
    name: "Anan Suksan",
    email: "test@aimearn.com",
    country: "TH",
    joined: "2026-01-22",
    inviter: "Alexa Microsoft",
    inviterId: "#BB5252",
    sales: "$31,200",
    commissionPool: "$3,120",
    directCommission: "$200",
    indirectCommission: "$200",
    totalEarning: "$200",
    commission: "$200",
  },
  {
    id: "#AG6145",
    name: "Nur Aisyah",
    email: "test@aimearn.com",
    country: "MY",
    joined: "2026-02-03",
    inviter: "Alexa Microsoft",
    inviterId: "#BB5252",
    sales: "$22,400",
    commissionPool: "$2,240",
    directCommission: "$200",
    indirectCommission: "$200",
    totalEarning: "$200",
    commission: "$200",
  },
  {
    id: "#AG9892",
    name: "Wei Ming",
    email: "test@aimearn.com",
    country: "SG",
    joined: "2026-02-18",
    inviter: "Alexa Microsoft",
    inviterId: "#BB5252",
    sales: "$19,800",
    commissionPool: "$1,980",
    directCommission: "$200",
    indirectCommission: "$200",
    totalEarning: "$200",
    commission: "$200",
  },
  {
    id: "#AG9735",
    name: "Zhi Hao",
    email: "test@aimearn.com",
    country: "SG",
    joined: "2026-03-01",
    inviter: "Alexa Microsoft",
    inviterId: "#BB5252",
    sales: "$18,450",
    commissionPool: "$1,845",
    directCommission: "$200",
    indirectCommission: "$200",
    totalEarning: "$200",
    commission: "$200",
  },
];

const columns: TableColumn<Affiliate>[] = [
  {
    header: "Affiliate Member",
    headerClassName: "min-w-[140px]",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-ink">{item.name}</span>
        <span className="text-xs text-ink-secondary">{item.id}</span>
      </div>
    ),
  },
  { header: "Email", key: "email", headerClassName: "min-w-[140px]" },
  {
    header: "Country",
    render: (item) => <CountryPill code={item.country} />,
  },
  {
    header: "Inviter",
    headerClassName: "min-w-[140px]",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-ink">{item.inviter}</span>
        <span className="text-xs text-ink-secondary">{item.inviterId}</span>
      </div>
    ),
  },
  {
    header: "Last Email Sent",
    key: "joined",
    headerClassName: "min-w-[140px]",
  },
  {
    header: "Report",
    headerClassName: "w-[90px]",
    render: (item) => (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          // eslint-disable-next-line no-console
          console.log("report", item.id);
        }}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#c1c1c1] bg-white px-3 text-sm font-medium text-[#222125] transition-colors hover:bg-[#f4f5f8]"
      >
        <Flag className="size-4" />
      </button>
    ),
  },
];

export default function InactiveAffiliatePage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [emailOpen, setEmailOpen] = useState(false);

  return (
    <main className="flex flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Affiliate" }, { label: "Inactive Affiliates" }]}
      />

      <PageTitle
        title="Inactive Affiliates Members"
        actions={
          <>
            <Button
              leading={<MailIcon className="size-4" />}
              onClick={() => setEmailOpen(true)}
              className="w-full"
            >
              Send Email
            </Button>
          </>
        }
      />
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name or email..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Last Email Sent"
        onDateClick={setDateRange}
      />
      <Table
        data={AFFILIATES}
        columns={columns}
        minWidth="min-w-[960px]"
        selectable
      />

      <Dialog
        width="max-w-lg"
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
      >
        <SendEmail
          recipientCount={56}
          templates={templates}
          onCancel={() => setEmailOpen(false)}
          onSend={() => setEmailOpen(false)}
        />
      </Dialog>
    </main>
  );
}

const templates: EmailTemplate[] = [
  { id: "welcome", name: "Welcome & Onboarding" },
  { id: "promo-spring", name: "Spring Promotion" },
  { id: "monthly-digest", name: "Monthly Newsletter Digest" },
  { id: "cart-abandon", name: "Abandoned Cart Reminder" },
];
