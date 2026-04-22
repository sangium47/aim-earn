"use client";

import { useMemo, useState } from "react";
import {
  Card,
  FilterBar,
  StatCard,
  StatusPill,
  Table,
} from "@/components/shared";
import { ORDERS, SHIPPING_STATUS_CONFIG } from "@/components/mock";
import type { DateRange, Order, TableColumn } from "@/components/type";

export function SellingPanel() {
  const [search, setSearch] = useState("");
  const [orderPeriod, setOrderPeriod] = useState<DateRange>({
    start: "",
    end: "",
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((r) => {
      if (
        q &&
        !r.id.toLowerCase().includes(q) &&
        !r.customerName.toLowerCase().includes(q) &&
        !r.customerId.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (orderPeriod.start && r.orderedDate < orderPeriod.start) return false;
      if (orderPeriod.end && r.orderedDate > orderPeriod.end) return false;
      return true;
    });
  }, [search, orderPeriod]);

  const columns: TableColumn<Order>[] = [
    {
      header: "Order ID",
      headerClassName: "min-w-[140px]",
      key: "id",
    },
    {
      header: "Ordered Date",
      headerClassName: "min-w-[140px]",
      key: "orderedDate",
    },
    {
      header: "Customer",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.customerName}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">
            {item.customerId}
          </span>
        </div>
      ),
    },
    {
      header: "Order Items",
      headerClassName: "w-[110px]",
      render: (item) => item.orderItems.toLocaleString(),
    },
    {
      header: "Total Sales",
      key: "totalSales",
      headerClassName: "min-w-[120px]",
    },
    {
      header: "Commission Pool",
      key: "totalCommission",
      headerClassName: "min-w-[140px]",
      borderRight: true,
    },
    {
      header: "Direct Commission",
      key: "commission",
      headerClassName: "min-w-[140px]",
    },
    {
      header: "Shipping Status",
      headerClassName: "min-w-[140px]",
      render: (item) => (
        <StatusPill {...SHIPPING_STATUS_CONFIG[item.shippingStatus]} />
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-3 md:gap-4">
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by order ID or customer..."
        onSearchChange={setSearch}
        dateRanges={[
          {
            label: "Order Period",
            value: orderPeriod,
            onChange: setOrderPeriod,
          },
        ]}
      />

      <Card className="flex flex-col gap-3 !bg-transparent !border-none">
        <div className="grid md:grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
          <StatCard
            label="Total Orders"
            value={ORDERS.length.toLocaleString()}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value="$22,350"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Commission Pool"
            value="$4,250"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Pending Commission"
            value="$1,120"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Commission Confirmed"
            value="$3,130"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Member Commission"
            value="$2,125"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>

      <Table
        data={rows}
        columns={columns}
        minWidth="min-w-[1200px]"
        variant="simple"
      />
    </section>
  );
}
