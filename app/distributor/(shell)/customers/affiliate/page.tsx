"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailIcon } from "lucide-react";
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
  Customer,
  DateRange,
  EmailTemplate,
  TableColumn,
} from "@/components/type";
import { CUSTOMERS } from "@/components/mock";
import { formatDate } from "@/components/util";

export default function AffiliateCustomerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [rows] = useState(CUSTOMERS);
  const [selected, setSelected] = useState<Customer[]>([]);
  const [emailOpen, setEmailOpen] = useState(false);

  const columns: TableColumn<Customer>[] = [
    {
      header: "Customer Name",
      headerClassName: "min-w-[200px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">{item.name}</span>
          <span className="text-xs text-ink-secondary">{item.code}</span>
        </div>
      ),
    },
    {
      header: "Referral Member",
      headerClassName: "min-w-[200px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.referralMemberName}
          </span>
          <span className="text-xs text-ink-secondary">
            {item.referralMemberId}
          </span>
        </div>
      ),
    },
    {
      header: "Country",
      headerClassName: "w-[100px]",
      render: (item) => <CountryPill code={item.country} />,
    },
    {
      header: "Email",
      headerClassName: "min-w-[220px]",
      key: "email",
    },
    {
      header: "Phone Number",
      headerClassName: "min-w-[160px]",
      key: "phone",
    },
    {
      header: "Last Order Date",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDate(item.lastOrderDate),
    },
    {
      header: "Total Sales",
      headerClassName: "min-w-[120px]",
      key: "totalSales",
    },
    {
      header: "Total Commission",
      headerClassName: "min-w-[140px]",
      key: "totalCommission",
      borderRight: true,
    },
    {
      header: "My Commission",
      headerClassName: "min-w-[140px]",
      key: "myCommission",
    },
  ];

  const recipientCount = selected.length > 0 ? selected.length : rows.length;

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Customers" }, { label: "Affiliate Customers" }]}
      />

      <PageTitle
        title="Affiliate Customers"
        actions={
          <Button
            leading={<MailIcon className="size-4" />}
            onClick={() => setEmailOpen(true)}
          >
            Send Email
          </Button>
        }
      />
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by customer or email..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Order Period"
        onDateClick={setDateRange}
      />
      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1080px]"
        selectable
        onSelectionChange={(rows) => setSelected(rows)}
        onRowClick={(item) =>
          router.push(
            `/distributor/customers/affiliate/${encodeURIComponent(item.code)}`,
          )
        }
      />

      <Dialog
        width="max-w-lg"
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
      >
        <SendEmail
          recipientCount={recipientCount}
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
