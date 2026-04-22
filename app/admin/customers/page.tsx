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
import { formatDateShort as formatDate } from "@/components/util";

const templates: EmailTemplate[] = [
  { id: "welcome", name: "Welcome & Onboarding" },
  { id: "promo-spring", name: "Spring Promotion" },
  { id: "monthly-digest", name: "Monthly Newsletter Digest" },
  { id: "cart-abandon", name: "Abandoned Cart Reminder" },
];

export default function AdminCustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [rows] = useState(CUSTOMERS);
  const [selected, setSelected] = useState<Customer[]>([]);
  const [emailOpen, setEmailOpen] = useState(false);

  const columns: TableColumn<Customer>[] = [
    {
      header: "Customer",
      headerClassName: "min-w-[200px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base font-medium text-ink">
            {item.name}
          </span>
          <span className="text-xs md:text-sm text-ink-secondary">
            {item.code}
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
      header: "Last Order",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.lastOrderDate),
    },
    {
      header: "Total Sales",
      headerClassName: "min-w-[120px]",
      cellClassName: "text-right",
      key: "totalSales",
    },
    {
      header: "Commission Pool",
      headerClassName: "min-w-[140px]",
      cellClassName: "text-right",
      key: "totalCommission",
    },
  ];

  const recipientCount = selected.length > 0 ? selected.length : rows.length;

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Customer" }]} />

      <PageTitle
        title="Customer"
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
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Order Period"
        onDateClick={setDateRange}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1200px]"
        selectable
        onSelectionChange={(next) => setSelected(next)}
        onRowClick={(item) =>
          router.push(`/admin/customers/${encodeURIComponent(item.code)}`)
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
