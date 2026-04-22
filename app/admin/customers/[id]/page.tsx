"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  Breadcrumb,
  Card,
  FilterBar,
  ShippingStatusPill,
  StatCard,
  Table,
} from "@/components/shared";
import { CustomerHeader } from "@/components/customers/CustomerHeader";
import type {
  DateRange,
  Order,
  ShippingStatus,
  TableColumn,
} from "@/components/type";
import {
  CUSTOMERS,
  ORDERS,
  SHIPPING_STATUS_OPTIONS,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";

export default function AdminCustomerDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.code === rawId),
    [rawId],
  );
  const notFound = rawId !== "" && !customer;

  useEffect(() => {
    if (notFound) router.replace("/admin/customers");
  }, [notFound, router]);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [status, setStatus] = useState("all");

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((o) => {
      if (q && !o.id.toLowerCase().includes(q)) return false;
      if (status !== "all" && o.shippingStatus !== (status as ShippingStatus))
        return false;
      if (dateRange.start && o.orderedDate < dateRange.start) return false;
      if (dateRange.end && o.orderedDate > dateRange.end) return false;
      return true;
    });
  }, [search, status, dateRange]);

  if (notFound || !customer) return null;

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
      headerClassName: "min-w-[120px] text-right",
      cellClassName: "text-right",
      key: "totalSales",
    },
    {
      header: "Commission Pool",
      headerClassName: "min-w-[140px] text-right",
      cellClassName: "text-right",
      key: "totalCommission",
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Customer", href: "/admin/customers" },
          { label: customer.name },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] md:text-[32px] font-medium leading-[1.1] tracking-[0.02em] text-[#222125]">
            {customer.name}
          </h1>
          <CustomerHeader customer={customer} />
        </div>

        {customer.referralMemberId ? (
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/affiliate/affiliates/${encodeURIComponent(
                  customer.referralMemberId,
                )}`,
              )
            }
            className="flex shrink-0 items-start justify-between gap-6 rounded-xl bg-[#222125] px-4 py-3 text-left text-white transition-opacity hover:opacity-90"
          >
            <div className="flex flex-col gap-1">
              <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-white/80">
                Referral Member :
              </p>
              <p className="text-[15px] font-semibold leading-[1.4] tracking-[0.02em]">
                {customer.referralMemberName}
              </p>
              <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-white/70">
                {customer.referralMemberId}
              </p>
            </div>
            <ArrowUpRight className="size-4 shrink-0" aria-hidden />
          </button>
        ) : null}
      </div>

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Order Period"
        onDateClick={setDateRange}
        dropdowns={[
          {
            label: "Shipping Status",
            value: status,
            onChange: setStatus,
            options: SHIPPING_STATUS_OPTIONS,
          },
        ]}
      />

      <Card className="flex flex-col gap-3 !bg-transparent !border-none">
        <div className="grid md:grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
          <StatCard
            label={
              <>
                Total
                <br />
                Orders
              </>
            }
            value={String(ORDERS.length)}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label={
              <>
                Total
                <br />
                Sales
              </>
            }
            value={customer.totalSales}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label={
              <>
                Total
                <br />
                Commission
              </>
            }
            value={customer.totalCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label={
              <>
                Pending
                <br />
                Commission
              </>
            }
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label={
              <>
                Commission
                <br />
                Confirmed
              </>
            }
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label={
              <>
                Referral&apos;s
                <br />
                Commission
              </>
            }
            value={customer.myCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>

      <Table
        variant="simple"
        data={filteredOrders}
        columns={columns}
        minWidth="min-w-[960px]"
      />
    </main>
  );
}
