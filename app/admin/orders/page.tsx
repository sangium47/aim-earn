"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  FilterBar,
  PageTitle,
  StatCard,
  Card,
  ShippingStatusPill,
  Table,
} from "@/components/shared";
import type { DateRange, Order, TableColumn } from "@/components/type";
import { MONTHS, ORDERS, SHIPPING_STATUS_OPTIONS } from "@/components/mock";
import { formatDate } from "@/components/util";

export default function DirectOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [status, setStatus] = useState("all");
  const [rows] = useState(ORDERS);

  const columns: TableColumn<Order>[] = [
    {
      header: "Order ID",
      headerClassName: "min-w-[140px]",
      key: "id",
    },
    {
      header: "Order Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.orderedDate),
    },
    {
      header: "Customer",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.customerName}
          </span>
          <span className="text-xs text-ink-secondary">{item.customerId}</span>
        </div>
      ),
    },
    {
      header: "Referral Member",
      headerClassName: "min-w-[180px]",
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
      header: "Order Items",
      headerClassName: "w-[110px]",
      key: "orderItems",
    },
    {
      header: "Total Sales",
      headerClassName: "min-w-[120px]",
      key: "totalSales",
    },
    {
      header: "Commission Pool",
      headerClassName: "min-w-[140px]",
      key: "totalCommission",
    },
    {
      header: "Shipping Status",
      headerClassName: "min-w-[160px]",
      render: (item) => <ShippingStatusPill status={item.shippingStatus} />,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Orders" }, { label: "Direct Orders" }]} />

      <PageTitle title="Direct Orders" />
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by customer or order ID..."
        onSearchChange={setSearch}
        dropdowns={[
          {
            label: "Shipping Status",
            value: status,
            onChange: setStatus,
            options: SHIPPING_STATUS_OPTIONS,
          },
        ]}
        dateValue={dateRange}
        dateLabel="Order Period"
        onDateClick={setDateRange}
      />
      <Card className="flex flex-col gap-3 !bg-transparent !border-none">
        <div className="grid md:grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
          <StatCard
            label="Total Orders"
            value="20"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value="$2000"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Commission Pool"
            value="$200"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Pending Commission"
            value="$400"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Commission Confirmed"
            value="$400"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>
      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1080px]"
        onRowClick={(item) =>
          router.push(`/admin/orders/${encodeURIComponent(item.id)}`)
        }
      />
    </main>
  );
}
