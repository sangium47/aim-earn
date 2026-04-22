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
  COUNTRY_OPTIONS,
  DISTRIBUTORS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
} from "@/components/mock";
import type {
  DateRange,
  Distributor,
  EmailTemplate,
  TableColumn,
} from "@/components/type";

const columns: TableColumn<Distributor>[] = [
  {
    header: "Distributor",
    headerClassName: "min-w-[180px]",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-ink">{item.name}</span>
        <span className="text-xs text-ink-secondary">{item.id}</span>
      </div>
    ),
  },
  {
    header: "Country",
    headerClassName: "min-w-[140px]",
    render: (item) => <CountryList codes={item.countries} max={2} />,
  },
  {
    header: "Affiliate Member",
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

export default function AdminDistributorListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Affiliate Users" }, { label: "Distributor" }]}
      />

      <PageTitle
        title="Distributors"
        actions={
          <Button leading={<Link className="size-4" />} className="w-full">
            Generate Link
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name, company, or email..."
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
        data={DISTRIBUTORS}
        columns={columns}
        minWidth="min-w-[1440px]"
        onRowClick={(item) =>
          router.push(
            `/admin/affiliate/distributor/${encodeURIComponent(item.id)}`,
          )
        }
      />
    </main>
  );
}
