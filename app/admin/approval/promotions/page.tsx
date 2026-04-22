"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  CountryList,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import type {
  ApprovalPromotion,
  DateRange,
  TableColumn,
} from "@/components/type";
import {
  APPROVAL_PROMOTIONS,
  APPROVAL_STATUS_CONFIG,
  APPROVAL_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  MONTHS,
} from "@/components/mock";

function formatDayMonthYear(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]},${y}`;
}

function inRange(iso: string, range: DateRange) {
  if (!range.start && !range.end) return true;
  if (!iso) return false;
  if (range.start && iso < range.start) return false;
  if (range.end && iso > range.end) return false;
  return true;
}

export default function PromotionApprovalPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [promotionPeriod, setPromotionPeriod] = useState<DateRange>({
    start: "",
    end: "",
  });
  const [requestedDate, setRequestedDate] = useState<DateRange>({
    start: "",
    end: "",
  });
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return APPROVAL_PROMOTIONS.filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.productName.toLowerCase().includes(q) &&
        !p.requester.name.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (country !== "all" && !p.countries.includes(country)) return false;
      if (status !== "all" && p.status !== status) return false;
      if (promotionPeriod.start || promotionPeriod.end) {
        const startOK =
          !promotionPeriod.end || p.periodStart <= promotionPeriod.end;
        const endOK =
          !promotionPeriod.start || p.periodEnd >= promotionPeriod.start;
        if (!startOK || !endOK) return false;
      }
      if (!inRange(p.requestedDate, requestedDate)) return false;
      return true;
    });
  }, [search, country, status, promotionPeriod, requestedDate]);

  const columns: TableColumn<ApprovalPromotion>[] = [
    {
      header: "Thumbnail",
      headerClassName: "w-[90px]",
      render: (item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail}
          alt={item.name}
          className="size-14 rounded-lg border border-[#e7e7e7] object-cover"
        />
      ),
    },
    {
      header: "Promotion",
      headerClassName: "min-w-[220px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.name}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">
            {item.productName}
          </span>
        </div>
      ),
    },
    {
      header: "Country",
      headerClassName: "min-w-[140px]",
      render: (item) => <CountryList codes={item.countries} max={2} />,
    },
    {
      header: "Promotion Period",
      headerClassName: "min-w-[240px]",
      render: (item) =>
        `${formatDayMonthYear(item.periodStart)} - ${formatDayMonthYear(
          item.periodEnd,
        )}`,
    },
    {
      header: "Requested Date",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDayMonthYear(item.requestedDate),
    },
    {
      header: "Requested by",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.requester.name}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">
            {item.requester.code}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      headerClassName: "min-w-[140px]",
      render: (item) => <StatusPill {...APPROVAL_STATUS_CONFIG[item.status]} />,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Approval" }, { label: "Promotions" }]} />
      <PageTitle title="Promotion Approval" />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by promotion name..."
        onSearchChange={setSearch}
        dateRanges={[
          {
            label: "Promotion Period",
            value: promotionPeriod,
            onChange: setPromotionPeriod,
          },
          {
            label: "Requested Date",
            value: requestedDate,
            onChange: setRequestedDate,
          },
        ]}
        dropdowns={[
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: COUNTRY_OPTIONS,
          },
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: APPROVAL_STATUS_OPTIONS,
          },
        ]}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1120px]"
        onRowClick={(item) =>
          router.push(
            `/admin/approval/promotions/${encodeURIComponent(item.id)}`,
          )
        }
      />
    </main>
  );
}
