"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Card,
  FilterBar,
  PageTitle,
  StatCard,
  ShippingStatusPill,
  Table,
} from "@/components/shared";
import type {
  DateRange,
  Order,
  TableColumn,
} from "@/components/type";
import {
  CUSTOMERS,
  ORDERS,
  SHIPPING_STATUS_OPTIONS,
} from "@/components/mock";
import { formatDate } from "@/components/util";
import { CustomerHeader } from "@/components/customers/CustomerHeader";

export default function DirectCustomerDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.code === rawId),
    [rawId],
  );
  const notFound = rawId !== "" && !customer;

  useEffect(() => {
    if (notFound) router.replace("/distributor/customers/direct");
  }, [notFound, router]);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [status, setStatus] = useState("all");

  const columns: TableColumn<Order>[] = [
    { header: "Order ID", headerClassName: "min-w-[140px]", key: "id" },
    {
      header: "Ordered Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.orderedDate),
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
      borderRight: true,
    },
    {
      header: "My Commission",
      headerClassName: "min-w-[140px]",
      key: "commission",
    },
  ];

  if (notFound || !customer) return null;

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Customers" },
          {
            label: "Direct Customers",
            href: "/distributor/customers/direct",
          },
          { label: customer.name },
        ]}
      />

      <PageTitle
        title={customer.name}
        description={<CustomerHeader customer={customer} />}
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by order ID..."
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
            value={String(ORDERS.length)}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value={customer.totalSales}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Pending Commission"
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Confirmed Commission"
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Commission"
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="My Commission"
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>

      <Table
        variant="simple"
        data={ORDERS}
        columns={columns}
        minWidth="min-w-[960px]"
      />
    </main>
  );
}
