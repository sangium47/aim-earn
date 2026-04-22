"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryPill,
  Dropdown,
  FilterBar,
  StatusPill,
} from "@/components/shared";
import {
  COUNTRY_NAMES,
  COUNTRY_OPTIONS,
  PAYOUT_GROUPS,
  PAYOUT_SORT_OPTIONS,
  PAYOUT_STATUS_CONFIG,
  PAYOUT_STATUS_OPTIONS,
  PAYOUTS,
} from "@/components/mock";
import type { PayoutAffiliate, PayoutStatus } from "@/components/type";

export default function AdminPayoutDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const payout = useMemo(() => PAYOUTS.find((p) => p.id === rawId), [rawId]);
  const notFound = rawId !== "" && !payout;

  useEffect(() => {
    if (notFound) router.replace("/admin/payout");
  }, [notFound, router]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState("net-desc");
  const [status, setStatus] = useState<PayoutStatus>("processing");

  useEffect(() => {
    if (payout) setStatus(payout.status);
  }, [payout]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PAYOUT_GROUPS.map((group) => {
      if (country !== "all" && group.country !== country) return null;
      const affiliates = group.affiliates.filter(
        (a) =>
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q),
      );
      if (affiliates.length === 0) return null;
      return { ...group, affiliates };
    }).filter((g): g is NonNullable<typeof g> => g !== null);
  }, [search, country]);

  if (notFound || !payout) return null;

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Payouts", href: "/admin/payout" },
          { label: payout.circle },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] md:text-[32px] font-medium leading-[1.1] tracking-[0.02em] text-[#222125]">
              Affiliate Summary
            </h1>
            <StatusPill {...PAYOUT_STATUS_CONFIG[payout.status]} />
          </div>
          <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
            Payout Circle : {payout.circle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button leading={<Download className="size-4" />}>Export CSV</Button>
          <div className="w-[140px]">
            <Dropdown
              color="bg-white"
              value={status}
              onChange={(v) => setStatus(v as PayoutStatus)}
              options={PAYOUT_STATUS_OPTIONS.filter((o) => o.value !== "all")}
              fullWidth
            />
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dropdowns={[
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: COUNTRY_OPTIONS,
          },
        ]}
      />

      <div className="flex justify-end">
        <div className="w-[220px]">
          <Dropdown
            value={sort}
            onChange={setSort}
            options={PAYOUT_SORT_OPTIONS}
            color="bg-transparent"
            label=""
            fullWidth
          />
        </div>
      </div>
      <GroupedTable
        groups={filteredGroups}
        onRowClick={(a) =>
          router.push(
            `/admin/payout/${encodeURIComponent(payout.id)}/${encodeURIComponent(a.code)}`,
          )
        }
      />
    </main>
  );
}

function GroupedTable({
  groups,
  onRowClick,
}: {
  groups: { country: string; affiliates: PayoutAffiliate[] }[];
  onRowClick?: (affiliate: PayoutAffiliate) => void;
}) {
  const subtotal = (affiliates: PayoutAffiliate[]) => {
    const orders = affiliates.reduce((sum, a) => sum + a.totalOrders, 0);
    return {
      orders: orders.toLocaleString(),
      // Other columns show placeholder subtotals in Figma ("$100,000").
      totalSales: "$100,000",
      totalCommission: "$100,000",
      ownCommission: "$100,000",
      overridingCommission: "$100,000",
      netPayout: "$20,225",
    };
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-line bg-white">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[1280px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eae7e2] text-[14px] font-semibold text-[#1e1e1e]">
              <Th className="min-w-[160px]">Affiliate</Th>
              <Th className="w-[90px]">Country</Th>
              <Th className="min-w-[120px]">Total Orders</Th>
              <Th className="min-w-[120px]">Total Sales</Th>
              <Th className="min-w-[140px]">Total Commission</Th>
              <Th className="min-w-[140px]">Own Commission</Th>
              <Th className="min-w-[160px]">Overriding Commission</Th>
              <Th className="min-w-[120px]">Net Payout</Th>
              <Th className="min-w-[160px]">Bank Account</Th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const sub = subtotal(group.affiliates);
              return (
                <Fragment key={group.country}>
                  <tr className="bg-white">
                    <td
                      colSpan={9}
                      className="border-t border-line px-4 py-3 text-[15px] font-medium text-[#222125]"
                    >
                      {COUNTRY_NAMES[group.country] ?? group.country}
                    </td>
                  </tr>
                  {group.affiliates.map((a) => (
                    <tr
                      key={a.code}
                      onClick={onRowClick ? () => onRowClick(a) : undefined}
                      tabIndex={onRowClick ? 0 : undefined}
                      role={onRowClick ? "button" : undefined}
                      onKeyDown={
                        onRowClick
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onRowClick(a);
                              }
                            }
                          : undefined
                      }
                      className={`border-t border-line bg-white text-[14px] text-[#222125] ${
                        onRowClick
                          ? "cursor-pointer transition-colors hover:bg-[#f4f5f8]"
                          : ""
                      }`}
                    >
                      <Td>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-medium text-[#222125]">
                            {a.name}
                          </span>
                          <span className="text-[12px] text-[#878787]">
                            {a.code}
                          </span>
                        </div>
                      </Td>
                      <Td>
                        <CountryPill code={a.country} />
                      </Td>
                      <Td>{a.totalOrders}</Td>
                      <Td>{a.totalSales}</Td>
                      <Td>{a.totalCommission}</Td>
                      <Td>{a.ownCommission}</Td>
                      <Td>{a.overridingCommission}</Td>
                      <Td>{a.netPayout}</Td>
                      <Td>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-medium text-[#222125]">
                            {a.bankAccount}
                          </span>
                          <span className="text-[12px] text-[#878787]">
                            {a.bankName}
                          </span>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  <tr className="border-t border-line bg-[#f4f5f8] text-[14px] font-semibold text-[#222125]">
                    <Td>Subtotal</Td>
                    <Td>&nbsp;</Td>
                    <Td>{sub.orders}</Td>
                    <Td>{sub.totalSales}</Td>
                    <Td>{sub.totalCommission}</Td>
                    <Td>{sub.ownCommission}</Td>
                    <Td>{sub.overridingCommission}</Td>
                    <Td>{sub.netPayout}</Td>
                    <Td>&nbsp;</Td>
                  </tr>
                </Fragment>
              );
            })}
            {groups.length > 0 ? (
              <tr className="border-t border-line bg-white text-[15px] font-semibold text-[#222125]">
                <Td>Total</Td>
                <Td>&nbsp;</Td>
                <Td>$430,000</Td>
                <Td>$380,000</Td>
                <Td>$120,000</Td>
                <Td>$120,000</Td>
                <Td>$120,000</Td>
                <Td>$270,000</Td>
                <Td>&nbsp;</Td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}
