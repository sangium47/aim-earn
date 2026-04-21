"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import {
  Breadcrumb,
  Card,
  FilterBar,
  PageTitle,
  StatCard,
  Table,
  type DateRange,
  type TableColumn,
} from "@/components/shared";
import { MONTHS } from "../../../products/mock";
import {
  ORDERS,
  SHIPPING_STATUS_CONFIG,
  SHIPPING_STATUS_OPTIONS,
  type Order,
  type ShippingStatus,
} from "../../../orders/mock";
import { COUNTRY_NAMES, CUSTOMERS } from "../../mock";

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
    if (notFound) router.replace("/affiliate/customers/direct");
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
            href: "/affiliate/customers/direct",
          },
          { label: customer.name },
        ]}
      />

      <PageTitle
        title={customer.name}
        description={
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
              <span className="inline-flex items-center gap-1.5">
                {customer.code}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-4 text-[#878787]" aria-hidden />
                {customer.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-4 text-[#878787]" aria-hidden />
                {customer.phone}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5">
              {COUNTRY_NAMES[customer.country] ?? customer.country}
            </span>
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
