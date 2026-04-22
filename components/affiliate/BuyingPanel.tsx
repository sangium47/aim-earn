"use client";

import { useMemo, useState } from "react";
import { Package, Wallet } from "lucide-react";
import {
  FilterBar,
  StatusPill,
  SummaryCard,
  Table,
} from "@/components/shared";
import { ORDERS, SHIPPING_STATUS_CONFIG } from "@/components/mock";
import type { DateRange, Order, TableColumn } from "@/components/type";

export function BuyingPanel() {
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
        !r.customerId.toLowerCase().includes(q) &&
        !r.referralMemberName.toLowerCase().includes(q)
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
      header: "Inviter",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.referralMemberName}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">
            {item.referralMemberId}
          </span>
        </div>
      ),
    },
    {
      header: "Shipping Status",
      headerClassName: "min-w-[140px]",
      render: (item) => (
        <StatusPill {...SHIPPING_STATUS_CONFIG[item.shippingStatus]} />
      ),
    },
    {
      header: "Order Amount",
      key: "totalSales",
      headerClassName: "min-w-[140px]",
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <SummaryCard
          Icon={Package}
          label="Total Orders"
          value={ORDERS.length.toLocaleString()}
        />
        <SummaryCard Icon={Wallet} label="Purchase Amount" value="$22,350" />
      </div>

      <Table
        data={rows}
        columns={columns}
        minWidth="min-w-[1080px]"
        variant="simple"
      />
    </section>
  );
}
