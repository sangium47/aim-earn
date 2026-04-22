"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryList,
  Dialog,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import {
  BRANDS,
  COUNTRY_OPTIONS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
} from "@/components/mock";
import type {
  Brand,
  DistributorStatus,
  TableColumn,
} from "@/components/type";

const RANGE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "0 - $100,000", value: "0-100000" },
  { label: "$100,000 - $500,000", value: "100000-500000" },
  { label: "$500,000 - $1M", value: "500000-1000000" },
  { label: "$1M+", value: "1000000-" },
];

function inRange(value: number, range: string) {
  if (range === "all") return true;
  const [minS, maxS] = range.split("-");
  const min = Number(minS);
  if (Number.isNaN(min)) return true;
  if (value < min) return false;
  if (maxS !== "" && !Number.isNaN(Number(maxS))) {
    if (value >= Number(maxS)) return false;
  }
  return true;
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function AdminBrandsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Brand[]>(BRANDS);
  const [search, setSearch] = useState("");
  const [sale, setSale] = useState("all");
  const [commission, setCommission] = useState("all");
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");
  const [confirm, setConfirm] = useState<{
    id: string;
    nextStatus: DistributorStatus;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.website.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (!inRange(r.totalSales, sale)) return false;
      if (!inRange(r.totalCommission, commission)) return false;
      if (country !== "all" && !r.countries.includes(country)) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [rows, search, sale, commission, country, status]);

  const setBrandStatus = (id: string, next: DistributorStatus) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: next } : r)),
    );
  };

  const confirmTarget = confirm
    ? (rows.find((r) => r.id === confirm.id) ?? null)
    : null;

  const columns: TableColumn<Brand>[] = [
    {
      header: "Logo",
      headerClassName: "min-w-[100px]",
      render: (item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logoUrl}
          alt={item.name}
          className="w-12 h-12 aspect-square rounded-lg border border-[#e7e7e7] object-cover"
        />
      ),
    },
    {
      header: "Brand",
      headerClassName: "min-w-[160px]",
      key: "name",
    },
    {
      header: "Website",
      headerClassName: "min-w-[220px]",
      render: (item) => (
        <a
          href={item.website}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="truncate text-[#222125] hover:underline"
        >
          {item.website.replace(/^https?:\/\//, "")}
        </a>
      ),
    },
    {
      header: "Products",
      headerClassName: "w-[100px]",
      render: (item) => item.products.toLocaleString(),
    },
    {
      header: "Total Sales",
      headerClassName: "min-w-[140px]",
      render: (item) => formatCurrency(item.totalSales),
    },
    {
      header: "Total Commission",
      headerClassName: "min-w-[160px]",
      render: (item) => formatCurrency(item.totalCommission),
    },
    {
      header: "Countries",
      headerClassName: "min-w-[160px]",
      render: (item) => <CountryList codes={item.countries} max={2} />,
    },
    {
      header: "Status",
      headerClassName: "min-w-[120px]",
      render: (item) => (
        <StatusPill {...DISTRIBUTOR_STATUS_CONFIG[item.status]} />
      ),
    },
    {
      header: "Updated By",
      key: "updatedBy",
      headerClassName: "min-w-[160px]",
    },
    {
      header: "Updated Date",
      key: "updatedDate",
      headerClassName: "min-w-[140px]",
    },
    {
      header: "Action",
      headerClassName: "w-[96px]",
      render: (item) => (
        <ActionMenu
          status={item.status}
          onToggle={() =>
            setConfirm({
              id: item.id,
              nextStatus: item.status === "active" ? "inactive" : "active",
            })
          }
        />
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Brands" }]} />

      <PageTitle
        title="Brands"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/brands/new")}
          >
            New Brand
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by brand or website..."
        onSearchChange={setSearch}
        dropdowns={[
          {
            label: "Sale",
            value: sale,
            onChange: setSale,
            options: RANGE_OPTIONS,
          },
          {
            label: "Commission",
            value: commission,
            onChange: setCommission,
            options: RANGE_OPTIONS,
          },
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
            options: DISTRIBUTOR_STATUS_OPTIONS,
          },
        ]}
      />

      <Table
        data={filtered}
        columns={columns}
        minWidth="min-w-[1400px]"
        onRowClick={(item) =>
          router.push(`/admin/brands/${encodeURIComponent(item.id)}`)
        }
      />

      <Dialog
        width="max-w-md"
        open={confirm !== null}
        onClose={() => setConfirm(null)}
      >
        {confirmTarget && confirm ? (
          <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                {confirm.nextStatus === "active"
                  ? "Activate Brand?"
                  : "Deactivate Brand?"}
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                <span className="font-semibold text-[#222125]">
                  {confirmTarget.name}
                </span>{" "}
                {confirm.nextStatus === "active"
                  ? "will become visible to distributors and affiliates again."
                  : "will be hidden from distributors and affiliates until it is reactivated."}
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirm(null)}
                className="md:w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setBrandStatus(confirm.id, confirm.nextStatus);
                  setConfirm(null);
                }}
                className="md:w-[140px]"
              >
                {confirm.nextStatus === "active" ? "Activate" : "Deactivate"}
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}

function ActionMenu({
  status,
  onToggle,
}: {
  status: DistributorStatus;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const nextLabel = status === "active" ? "Deactivate" : "Activate";

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Row actions"
        className="inline-flex size-9 items-center justify-center  text-[#222125] transition-colors hover:bg-[#f4f5f8]"
      >
        <MoreVertical className="size-4" />
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-[160px] overflow-hidden rounded-xl border border-line bg-white p-1 shadow-lg"
        >
          <li>
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onToggle();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-[#f4f5f8]"
            >
              {nextLabel}
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
