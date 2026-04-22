"use client";

import { Fragment, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Package,
  Wallet,
} from "lucide-react";
import {
  Breadcrumb,
  CountryPill,
  FilterBar,
  PageTitle,
} from "@/components/shared";
import type { DateRange, Order } from "@/components/type";
import { ChangeChip } from "@/components/shared/ChangeChip";
import { CUSTOMERS, ORDERS } from "@/components/mock";
import { formatDate } from "@/components/util";

const PERFORMANCE = [
  {
    label: "Total Orders",
    value: "1,874",
    change: "+5.1%",
    Icon: Package,
  },
  {
    label: "Total Sales",
    value: "$220,192",
    change: "+9.2%",
    Icon: BarChart3,
  },
  {
    label: "Commission",
    value: "$22,019",
    change: "+4.8%",
    Icon: Wallet,
  },
];

type AffiliateRole = "Originator" | "Direct" | "Indirect" | "Distributor";

const AFFILIATE_ROLES: { role: AffiliateRole; percent: number }[] = [
  { role: "Originator", percent: 15 },
  { role: "Direct", percent: 10 },
  { role: "Indirect", percent: 5 },
  { role: "Distributor", percent: 10 },
];

const ROLE_MEMBERS: Record<AffiliateRole, { name: string; code: string }> = {
  Originator: { name: "You", code: "#AG0001" },
  Direct: { name: "Sarah Chen", code: "#AG8932" },
  Indirect: { name: "Mark Lee", code: "#AG5522" },
  Distributor: { name: "Amelia Cruz", code: "#DIS-001" },
};

function parseCurrency(s: string) {
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function fmtMoney(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function rowsFor(order: Order) {
  const sales = parseCurrency(order.totalSales);
  return AFFILIATE_ROLES.map(({ role, percent }) => ({
    role,
    percent,
    member: ROLE_MEMBERS[role],
    commission: (sales * percent) / 100,
  }));
}

export default function SalesReportPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (orderId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const { totalCommission, totalSales } = useMemo(() => {
    let sales = 0;
    let commission = 0;
    for (const order of ORDERS) {
      const s = parseCurrency(order.totalSales);
      sales += s;
      commission += (s * 15) / 100; // Originator share (you)
    }
    return { totalSales: sales, totalCommission: commission };
  }, []);

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Reports" }, { label: "Sales & Commission" }]}
      />
      <PageTitle title="Sales & Commission" />

      <div className="grid w-full grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PERFORMANCE.map(({ label, value, change, Icon }) => (
          <article
            key={label}
            className="flex h-[151px] flex-col justify-between overflow-hidden rounded-3xl border border-[#e7e7e7] bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#f1ead9]">
                  <Icon className="size-5 text-[#796100]" aria-hidden />
                </span>
                <span className="text-base font-semibold tracking-[0.01em] text-[#222125]">
                  {label}
                </span>
              </div>
            </div>

            <p className="text-[32px] font-medium leading-[1.2] text-[#222125]">
              {value}
            </p>

            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-[#767676]">Yesterday :</span>
              <ChangeChip value={change} />
            </div>
          </article>
        ))}
      </div>

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by order ID or customer..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Order Period"
        onDateClick={setDateRange}
      />

      <div className="max-w-full overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead>
            <tr className="text-left text-xs md:text-sm font-semibold text-[#1e1e1e] bg-surface-brand">
              <th className="bg-surface-brand py-3 pl-3 pr-2 md:pl-6 md:pr-4 font-semibold w-10"></th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold min-w-[130px]">
                Order ID
              </th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold w-[100px]">
                Country
              </th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold min-w-[140px]">
                Ordered Date
              </th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold min-w-[180px]">
                Customer
              </th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold min-w-[120px]">
                Total Sales
              </th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold min-w-[200px]">
                Affiliate Member
              </th>
              <th className="bg-surface-brand py-3 px-2 md:px-4 font-semibold min-w-[120px]">
                Commission
              </th>
              <th className="bg-surface-brand py-3 px-2 pr-3 md:px-4 md:pr-6 font-semibold min-w-[110px]">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order, orderIndex) => {
              const positions = rowsFor(order);
              const me = positions.find((p) => p.role === "Originator")!;
              const others = positions.filter((p) => p.role !== "Originator");
              const isOpen = expanded.has(order.id);
              const baseBg = orderIndex % 2 === 0 ? "bg-white" : "bg-line/20";
              const customerCountry = CUSTOMERS.find(
                (c) => c.code === order.customerId,
              )?.country;

              return (
                <Fragment key={order.id}>
                  <tr
                    onClick={() => toggleExpand(order.id)}
                    className={`align-middle cursor-pointer transition-colors hover:bg-line/60 ${baseBg}`}
                  >
                    <td className="py-4 pl-3 pr-2 md:pl-6 md:pr-4">
                      <ChevronDown
                        className={`size-4 text-[#5f5f5f] transition-transform ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      {order.id}
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      {customerCountry ? (
                        <CountryPill code={customerCountry} />
                      ) : null}
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      {formatDate(order.orderedDate)}
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-ink">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-ink-secondary">
                          {order.customerId}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      {order.totalSales}
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-ink">
                          {me.member.name}{" "}
                          <span className="text-xs text-ink-secondary font-normal">
                            ({me.role})
                          </span>
                        </span>
                        <span className="text-xs text-ink-secondary">
                          {me.member.code}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-4 text-sm md:text-base text-[#1e1e1e]">
                      {fmtMoney(me.commission)}
                    </td>
                    <td className="py-4 px-2 pr-3 md:px-4 md:pr-6 text-sm md:text-base text-[#1e1e1e]">
                      {me.percent}%
                    </td>
                  </tr>
                  {isOpen ? (
                    <>
                      {others.map((row) => (
                        <tr
                          key={`${order.id}-${row.role}`}
                          className={`align-middle ${baseBg}`}
                        >
                          <td className="py-3 pl-3 pr-2 md:pl-6 md:pr-4"></td>
                          <td
                            colSpan={5}
                            className="py-3 px-2 md:px-4 text-xs text-ink-secondary"
                          ></td>
                          <td className="py-3 px-2 md:px-4">
                            <div className="flex flex-col gap-0.5 pl-4 border-l-2 border-line">
                              <span className="text-sm font-medium text-ink">
                                {row.member.name}{" "}
                                <span className="text-xs text-ink-secondary font-normal">
                                  ({row.role})
                                </span>
                              </span>
                              <span className="text-xs text-ink-secondary">
                                {row.member.code}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 md:px-4 text-sm text-ink-secondary">
                            {fmtMoney(row.commission)}
                          </td>
                          <td className="py-3 px-2 pr-3 md:px-4 md:pr-6 text-sm text-ink-secondary">
                            {row.percent}%
                          </td>
                        </tr>
                      ))}
                      <tr
                        key={`${order.id}-total`}
                        className={`align-middle ${baseBg} border-t border-line`}
                      >
                        <td className="py-3 pl-3 pr-2 md:pl-6 md:pr-4"></td>
                        <td
                          colSpan={6}
                          className="py-3 px-2 md:px-4 text-right text-sm font-semibold text-[#1e1e1e]"
                        >
                          Total
                        </td>
                        <td className="py-3 px-2 md:px-4 text-sm font-semibold text-[#1e1e1e]">
                          {fmtMoney(
                            positions.reduce((sum, p) => sum + p.commission, 0),
                          )}
                        </td>
                        <td className="py-3 px-2 pr-3 md:px-4 md:pr-6 text-sm font-semibold text-[#1e1e1e]">
                          {positions.reduce((sum, p) => sum + p.percent, 0)}%
                        </td>
                      </tr>
                    </>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
