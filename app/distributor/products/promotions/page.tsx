"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  FilterBar,
  PageTitle,
  Button,
  Table,
  type DateRange,
  type TableColumn,
} from "@/components/shared";
import { TrashIcon } from "@/components/icons";
import {
  COUNTRY_OPTIONS,
  MONTHS,
  PROMOTIONS,
  STATUS_CONFIG,
  STATUS_OPTIONS,
  type Promotion,
  type PromotionStatus,
} from "../mock";

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]} ${y}`;
}

function StatusPill({ status }: { status: PromotionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#222125]">
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: cfg.dotColor }}
      />
      {cfg.label}
    </span>
  );
}

export default function PromotionPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState(PROMOTIONS);

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((p) => p.id !== id));
  };

  const columns: TableColumn<Promotion>[] = [
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
      header: "Promotion Name",
      headerClassName: "min-w-[180px]",
      key: "name",
    },
    {
      header: "Product Name",
      headerClassName: "min-w-[200px]",
      key: "productName",
    },
    {
      header: "Brand",
      headerClassName: "min-w-[140px]",
      key: "brand",
    },
    {
      header: "Country",
      headerClassName: "w-[100px]",
      render: (item) => (
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(248,210,55,0.35)] px-2 text-xs font-medium tracking-[0.02em] text-ink">
          {item.country}
        </span>
      ),
    },
    {
      header: "Promotion Period",
      headerClassName: "min-w-[220px]",
      render: (item) =>
        `${formatDate(item.periodStart)} – ${formatDate(item.periodEnd)}`,
    },
    {
      header: "Status",
      headerClassName: "min-w-[140px]",
      render: (item) => <StatusPill status={item.status} />,
    },
    {
      header: "Action",
      headerClassName: "w-[80px]",
      render: (item) =>
        item.status === "draft" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
            aria-label={`Delete promotion ${item.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-[#222125] transition-colors hover:bg-[#f4f5f8]"
          >
            <TrashIcon className="size-5" />
          </button>
        ) : null,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Product" }, { label: "Promotions" }]} />

      <PageTitle
        title="Promotions"
        actions={
          <>
            <Button
              leading={<Plus className="size-4" />}
              onClick={() => {
                router.push(`/distributor/products/promotions/new`);
              }}
              className="w-full"
            >
              New Promotion
            </Button>
          </>
        }
      />
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by product name..."
        onSearchChange={setSearch}
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
            options: STATUS_OPTIONS,
          },
        ]}
        dateValue={dateRange}
        dateLabel="Promotion Period"
        onDateClick={setDateRange}
      />
      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1080px]"
        onRowClick={(item) =>
          router.push(
            `/distributor/products/promotions/${encodeURIComponent(item.id)}`,
          )
        }
      />
    </main>
  );
}
