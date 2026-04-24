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

export default function AffiliateCustomerDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.code === rawId),
    [rawId],
  );
  const notFound = rawId !== "" && !customer;

  useEffect(() => {
    if (notFound) router.replace("/distributor/customers/affiliate");
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
            label: "Affiliate Customers",
            href: "/distributor/customers/affiliate",
          },
          { label: customer.name },
        ]}
      />

      <PageTitle
        title={customer.name}
        description={<CustomerHeader customer={customer} />}
        actions={
          <div className="w-full md:w-[240px] inline-flex flex-col items-start justify-center md:gap-1 rounded-lg bg-[#434343] px-4 py-2 shadow-[0_1px_4px_0_rgba(12,12,13,0.1),0_1px_4px_0_rgba(12,12,13,0.05)]">
            <p className="text-[10px] md:text-[12px] font-medium text-[#fff]">
              Inviter :
            </p>
            <div className="flex flex-col">
              <p className="text-[12px] md:text-[14px] font-medium text-[#fff]">
                {customer.referralMemberName}
              </p>
              <p className="text-[10px] md:text-[12px] font-medium text-[#fff]">
                {customer.referralMemberId}
              </p>
            </div>
          </div>
        }
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
            label="Total Affiliate Members"
            value="1"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
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
            label="Total Commission Pool"
            value={customer.totalCommission}
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
