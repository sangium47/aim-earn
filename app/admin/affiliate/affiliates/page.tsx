"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryList,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import {
  AFFILIATES,
  COUNTRY_OPTIONS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
} from "@/components/mock";
import type { DateRange, Distributor, TableColumn } from "@/components/type";

const columns: TableColumn<Distributor>[] = [
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
  {
    header: "Inviter",
    headerClassName: "min-w-[180px]",
    render: (item) =>
      item.inviter ? (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.inviter.name}
          </span>
          <span className="text-xs text-ink-secondary">
            {item.inviter.code}
          </span>
        </div>
      ) : (
        <span className="text-xs text-ink-tertiary">—</span>
      ),
  },
  {
    header: "Distributor",
    headerClassName: "min-w-[180px]",
    render: (item) =>
      item.distributor ? (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.distributor.name}
          </span>
          <span className="text-xs text-ink-secondary">
            {item.distributor.code}
          </span>
        </div>
      ) : (
        <span className="text-xs text-ink-tertiary">—</span>
      ),
  },
  {
    header: "Country",
    headerClassName: "min-w-[140px]",
    render: (item) => <CountryList codes={item.countries} max={2} />,
  },
  {
    header: "Total Affiliates",
    headerClassName: "min-w-[140px]",
    render: (item) => item.affiliateMembers.toLocaleString(),
  },
  {
    header: "Registered Date",
    key: "joined",
    headerClassName: "min-w-[140px]",
    borderRight: true,
  },
  {
    header: "Total Orders",
    headerClassName: "min-w-[120px]",
    render: (item) => item.totalOrders.toLocaleString(),
  },
  {
    header: "Total Sales",
    key: "totalSales",
    headerClassName: "min-w-[120px]",
  },
  {
    header: "Commission Pool",
    key: "commissionPool",
    headerClassName: "min-w-[140px]",
    borderRight: true,
  },
  {
    header: "Direct Commission",
    key: "directCommission",
    headerClassName: "min-w-[140px]",
  },
  {
    header: "Indirect Commission",
    key: "indirectCommission",
    headerClassName: "min-w-[140px]",
  },
  {
    header: "Total Earnings",
    key: "totalEarnings",
    headerClassName: "min-w-[140px]",
  },
  {
    header: "Status",
    headerClassName: "min-w-[120px]",
    render: (item) => (
      <StatusPill {...DISTRIBUTOR_STATUS_CONFIG[item.status]} />
    ),
  },
];

export default function AdminAffiliatesListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Affiliate Users" }, { label: "Affiliates" }]}
      />

      <PageTitle
        title="Affiliate Member"
        actions={
          <Button leading={<Link className="size-4" />} className="w-full">
            Generate Link
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name, email, or code..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Registered Date"
        onDateClick={setDateRange}
        dropdowns={[
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: COUNTRY_OPTIONS,
          },
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: DISTRIBUTOR_STATUS_OPTIONS,
          },
        ]}
      />

      <Table
        variant="simple"
        data={AFFILIATES}
        columns={columns}
        minWidth="min-w-[1680px]"
        onRowClick={(item) =>
          router.push(
            `/admin/affiliate/affiliates/${encodeURIComponent(item.id)}`,
          )
        }
      />
    </main>
  );
}
