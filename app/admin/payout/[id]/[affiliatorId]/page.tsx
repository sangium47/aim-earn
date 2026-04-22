"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Card,
  FilterBar,
  ShippingStatusPill,
  StatCard,
  Table,
} from "@/components/shared";
import type {
  DateRange,
  PayoutOrderRow,
  TableColumn,
} from "@/components/type";
import {
  COUNTRY_NAMES,
  PAYOUT_AFFILIATES,
  PAYOUTS,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";

export default function AdminPayoutAffiliateDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string; affiliatorId?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");
  const rawAffiliatorId = decodeURIComponent(params?.affiliatorId ?? "");

  const payout = useMemo(() => PAYOUTS.find((p) => p.id === rawId), [rawId]);
  const affiliate =
    PAYOUT_AFFILIATES[rawAffiliatorId] ??
    PAYOUT_AFFILIATES["#AG8932"] ??
    null;

  const notFound = rawId !== "" && !payout;

  useEffect(() => {
    if (notFound) router.replace("/admin/payout");
  }, [notFound, router]);

  const [search, setSearch] = useState("");
  const [orderPeriod, setOrderPeriod] = useState<DateRange>({
    start: "",
    end: "",
  });

  const filtered = useMemo(() => {
    if (!affiliate) return [];
    const q = search.trim().toLowerCase();
    return affiliate.orders.filter((o) => {
      if (
        q &&
        !o.id.toLowerCase().includes(q) &&
        !o.customerName.toLowerCase().includes(q) &&
        !o.brandName.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (orderPeriod.start && o.orderedDate < orderPeriod.start) return false;
      if (orderPeriod.end && o.orderedDate > orderPeriod.end) return false;
      return true;
    });
  }, [affiliate, search, orderPeriod]);

  if (notFound || !payout || !affiliate) return null;

  const columns: TableColumn<PayoutOrderRow>[] = [
    {
      header: "Order ID",
      headerClassName: "min-w-[120px]",
      key: "id",
    },
    {
      header: "Ordered Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.orderedDate),
    },
    {
      header: "Referral Member",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-medium text-[#222125]">
            {item.referralMemberName}
          </span>
          <span className="text-[12px] text-[#878787]">
            {item.referralMemberCode}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-medium text-[#222125]">
            {item.customerName}
          </span>
          <span className="text-[12px] text-[#878787]">
            {item.customerCode}
          </span>
        </div>
      ),
    },
    {
      header: "Brand",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-medium text-[#222125]">
            {item.brandName}
          </span>
          <span className="text-[12px] text-[#878787]">{item.brandCode}</span>
        </div>
      ),
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
    },
    {
      header: "Own Commission",
      headerClassName: "min-w-[140px]",
      render: (item) => item.ownCommission || "",
    },
    {
      header: "Overriding Commission",
      headerClassName: "min-w-[160px]",
      render: (item) => (
        <span className={item.overridingNegative ? "text-[#d92d20]" : ""}>
          {item.overridingCommission}
        </span>
      ),
    },
    {
      header: "Shipping Status",
      headerClassName: "min-w-[140px]",
      render: (item) => <ShippingStatusPill status={item.shippingStatus} />,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Payouts", href: "/admin/payout" },
          {
            label: payout.circle,
            href: `/admin/payout/${encodeURIComponent(payout.id)}`,
          },
          { label: affiliate.name },
        ]}
      />

      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] md:text-[32px] font-medium leading-[1.1] tracking-[0.02em] text-[#222125]">
          {affiliate.name}
        </h1>
        <p className="flex items-center gap-2 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
          <span className="text-[#222125]">{affiliate.code}</span>
          <span
            aria-hidden
            className="inline-block size-2 rounded-full bg-[#B3B3B3]"
          />
          <span>{COUNTRY_NAMES[affiliate.country] ?? affiliate.country}</span>
        </p>
      </div>

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
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
            value={String(affiliate.totalOrders)}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value={affiliate.totalSales}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Commission"
            value={affiliate.totalCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Own Commission"
            value={affiliate.ownCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Overriding Commission"
            value={affiliate.overridingCommission}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>

      <Table
        variant="simple"
        data={filtered}
        columns={columns}
        minWidth="min-w-[1480px]"
      />
    </main>
  );
}
