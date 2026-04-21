"use client";

import { useState } from "react";
import {
  Breadcrumb,
  FilterBar,
  PageTitle,
  StatCard,
  Card,
  Table,
  type DateRange,
  type TableColumn,
} from "@/components/shared";
import { MONTHS } from "../../products/mock";
import {
  ORDERS,
  SHIPPING_STATUS_CONFIG,
  SHIPPING_STATUS_OPTIONS,
  type Order,
  type ShippingStatus,
} from "../mock";

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]} ${y}`;
}

function ShippingStatusPill({ status }: { status: ShippingStatus }) {
  return (
    <span className="text-[14px] font-medium text-[#222125]">
      {SHIPPING_STATUS_CONFIG[status].label}
    </span>
  );
}

export default function DirectOrdersPage() {
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
      header: "Ordered Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.orderedDate),
    },
    {
      header: "Customer",
      headerClassName: "min-w-[160px]",
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
      header: "Order Items",
      headerClassName: "w-[110px]",
      key: "orderItems",
    },
    {
      header: "Shipping Status",
      headerClassName: "min-w-[160px]",
      render: (item) => <ShippingStatusPill status={item.shippingStatus} />,
    },
    {
      header: "Total Sales",
      headerClassName: "min-w-[120px]",
      key: "totalSales",
    },
    {
      header: "Total Commission",
      headerClassName: "min-w-[120px]",
      key: "totalCommission",
      borderRight: true,
    },
    {
      header: "My Commission",
      headerClassName: "min-w-[120px]",
      key: "commission",
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
            value={"200"}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value={"$40,000"}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Pending Commission"
            value={"$4,000"}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Confirmed Commission"
            value={"$4,000"}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="My Commission"
            value={"$4,000"}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>
      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1080px]"
      />
    </main>
  );
}
