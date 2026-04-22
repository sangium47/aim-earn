"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Dialog,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import {
  BANK_CONFIGS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
} from "@/components/mock";
import type { BankConfig, TableColumn } from "@/components/type";

export default function AdminSettingBankPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [status, setStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<BankConfig | null>(null);

  const countryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(BANK_CONFIGS.map((b) => b.country)),
    ).sort();
    return [
      { label: "All", value: "all" },
      ...unique.map((c) => ({ label: c, value: c })),
    ];
  }, []);

  const currencyOptions = useMemo(() => {
    const unique = Array.from(
      new Set(BANK_CONFIGS.map((b) => b.currency)),
    ).sort();
    return [
      { label: "All", value: "all" },
      ...unique.map((c) => ({ label: c, value: c })),
    ];
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BANK_CONFIGS.filter((b) => {
      if (
        q &&
        !b.name.toLowerCase().includes(q) &&
        !b.code.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (country !== "all" && b.country !== country) return false;
      if (currency !== "all" && b.currency !== currency) return false;
      if (status !== "all" && b.status !== status) return false;
      return true;
    });
  }, [search, country, currency, status]);

  const columns: TableColumn<BankConfig>[] = [
    { header: "Bank Name", headerClassName: "min-w-[200px]", key: "name" },
    { header: "Bank Code", headerClassName: "min-w-[140px]", key: "code" },
    { header: "Country", headerClassName: "min-w-[180px]", key: "country" },
    { header: "Currency", headerClassName: "min-w-[140px]", key: "currency" },
    {
      header: "Status",
      headerClassName: "min-w-[120px]",
      render: (item) => (
        <StatusPill {...DISTRIBUTOR_STATUS_CONFIG[item.status]} />
      ),
    },
    {
      header: "Action",
      headerClassName: "w-[112px] text-right",
      cellClassName: "text-right",
      render: (item) => (
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/admin/setting/bank/${encodeURIComponent(item.id)}`,
              );
            }}
            aria-label="Edit"
            title="Edit"
            className="inline-flex size-9 items-center justify-center rounded-lg text-[#222125] transition-colors hover:bg-[#f4f5f8]"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(item);
            }}
            aria-label="Delete"
            title="Delete"
            className="inline-flex size-9 items-center justify-center rounded-lg text-[#b42318] transition-colors hover:bg-[#fef2f2]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Setting" }, { label: "Banks" }]} />

      <PageTitle
        title="Banks"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/setting/bank/new")}
          >
            Create New
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dropdowns={[
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: countryOptions,
          },
          {
            label: "Currency",
            value: currency,
            onChange: setCurrency,
            options: currencyOptions,
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
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1120px]"
      />

      <Dialog
        width="max-w-md"
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
        {deleteTarget ? (
          <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                Delete Bank?
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                <span className="font-semibold text-[#222125]">
                  {deleteTarget.name}
                </span>{" "}
                will be removed from bank settings.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
              <Button
                variant="outline"
                className="md:w-[100px]"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                className="md:w-[140px] !bg-[#b42318] !text-white hover:!opacity-90"
                onClick={() => setDeleteTarget(null)}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}
