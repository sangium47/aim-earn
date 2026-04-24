"use client";

import { useState } from "react";
import { MailIcon } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Card,
  CountryPill,
  Dialog,
  FilterBar,
  PageTitle,
  ReferalUrlCard,
  StatCard,
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
    inviter: "Alexa",
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
    inviter: "Alexa",
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
    inviter: "Alexa",
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
    inviter: "Alexa",
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
    inviter: "Alexa",
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
    headerClassName: "min-w-[180px]",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-ink">{item.name}</span>
        <span className="text-xs text-ink-secondary">{item.id}</span>
      </div>
    ),
  },
  { header: "Email", key: "email", headerClassName: "min-w-[180px]" },
  {
    header: "Country",
    render: (item) => <CountryPill code={item.country} />,
  },
  {
    header: "Registered Date",
    key: "joined",
    headerClassName: "min-w-[140px]",
  },
  { header: "Inviter", key: "inviter", borderRight: true },
  { header: "Total Sales", key: "sales", headerClassName: "min-w-[120px]" },
  {
    header: "Commission Pool",
    key: "commissionPool",
    headerClassName: "min-w-[120px]",
    borderRight: true,
  },
  {
    header: "Direct Commission",
    key: "directCommission",
    headerClassName: "min-w-[120px]",
  },
  {
    header: "Indirect Commission",
    key: "indirectCommission",
    headerClassName: "min-w-[120px]",
  },
  {
    header: "Total Earnings",
    key: "totalEarning",
    headerClassName: "min-w-[120px]",
    borderRight: true,
  },
  {
    header: "My Commission",
    key: "commission",
    headerClassName: "min-w-[120px]",
  },
];

export default function AffiliatePage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [emailOpen, setEmailOpen] = useState(false);

  const affiliateUrl = "sg.getbrainspoke.com?code=xxxxxx";
  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Affiliate" }, { label: "Own Affiliates" }]}
      />

      <PageTitle
        title="Own Affiliates Members"
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
      <ReferalUrlCard label="Affiliate URL" url={affiliateUrl} />
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name or email..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        onDateClick={setDateRange}
      />
      <Card className="flex flex-col gap-3 !bg-transparent !border-none">
        <div className="grid md:grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
          <StatCard
            label="Total Affiliate Members"
            value="1,248"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Orders"
            value="1,102"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value="146"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Commission Pool"
            value="32"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="My Commission"
            value="32"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>
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
