"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryPill,
  Dialog,
  Dropdown,
  Field,
  FilterBar,
  Input,
  PageTitle,
  StatusPill,
  Switch,
  Table,
} from "@/components/shared";
import {
  COUNTRY_CONFIGS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
} from "@/components/mock";
import type { CountryConfig, TableColumn } from "@/components/type";

type FormState = {
  name: string;
  code: string;
  currency: string;
  distributorFee: string;
  rateValue: string; // e.g. "35"
  rateCurrency: string;
  active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  code: "",
  currency: "",
  distributorFee: "",
  rateValue: "35",
  rateCurrency: "US Dollar",
  active: true,
};

const COUNTRY_OPTIONS = [
  { label: "Singapore", value: "Singapore" },
  { label: "Thailand", value: "Thailand" },
  { label: "Malaysia", value: "Malaysia" },
  { label: "India", value: "India" },
  { label: "China", value: "China" },
  { label: "Japan", value: "Japan" },
  { label: "Australia", value: "Australia" },
  { label: "United States", value: "United States" },
  { label: "Myanmar", value: "Myanmar" },
  { label: "Georgia", value: "Georgia" },
];

const CURRENCY_OPTIONS = [
  { label: "SGD", value: "SGD" },
  { label: "THB", value: "THB" },
  { label: "MYR", value: "MYR" },
  { label: "INR", value: "INR" },
  { label: "CNY", value: "CNY" },
  { label: "JPY", value: "JPY" },
  { label: "AUD", value: "AUD" },
  { label: "USD", value: "USD" },
  { label: "MMK", value: "MMK" },
  { label: "GEL", value: "GEL" },
];

export default function AdminSettingCountryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [editor, setEditor] = useState<
    | { mode: "create" }
    | { mode: "edit"; target: CountryConfig }
    | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<CountryConfig | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COUNTRY_CONFIGS.filter((c) => {
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.currency.toLowerCase().includes(q) &&
        !c.code.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (status !== "all" && c.status !== status) return false;
      return true;
    });
  }, [search, status]);

  const columns: TableColumn<CountryConfig>[] = [
    { header: "Country", headerClassName: "min-w-[180px]", key: "name" },
    { header: "Currency", headerClassName: "min-w-[140px]", key: "currency" },
    {
      header: "Exchange Rate",
      headerClassName: "min-w-[160px]",
      key: "exchangeRate",
    },
    {
      header: "Country Code",
      headerClassName: "min-w-[140px]",
      render: (item) => <CountryPill code={item.code} />,
    },
    {
      header: "Distributor Fee",
      headerClassName: "min-w-[160px]",
      key: "distributorFee",
    },
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
              setEditor({ mode: "edit", target: item });
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
      <Breadcrumb items={[{ label: "Setting" }, { label: "Country" }]} />

      <PageTitle
        title="Country"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            className="w-full md:w-auto"
            onClick={() => setEditor({ mode: "create" })}
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

      <CountryEditorDialog
        editor={editor}
        onClose={() => setEditor(null)}
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
                Delete Country?
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                <span className="font-semibold text-[#222125]">
                  {deleteTarget.name}
                </span>{" "}
                will be removed from country settings.
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

function CountryEditorDialog({
  editor,
  onClose,
}: {
  editor:
    | { mode: "create" }
    | { mode: "edit"; target: CountryConfig }
    | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (!editor) return;
    if (editor.mode === "edit") {
      const t = editor.target;
      // Parse "$1 = $35" → 35 for the rate input.
      const rate = t.exchangeRate.match(/\$1\s*=\s*\$?([\d.]+)/);
      setForm({
        name: t.name,
        code: t.code,
        currency: t.currency,
        distributorFee: t.distributorFee.replace(/[^0-9.]/g, ""),
        rateValue: rate?.[1] ?? "35",
        rateCurrency: "US Dollar",
        active: t.status === "active",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editor]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isEdit = editor?.mode === "edit";
  const title = isEdit ? "Edit Country" : "Add New Country";

  return (
    <Dialog width="max-w-xl" open={editor !== null} onClose={onClose}>
      <div className="flex flex-col gap-4 md:gap-5 p-4 md:p-6">
        <h2 className="text-[20px] md:text-[22px] font-semibold leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
          {title}
        </h2>

        <Field label="Country">
          <Dropdown
            value={form.name}
            onChange={(v) => update("name", v)}
            options={COUNTRY_OPTIONS}
            placeholder="Select Country"
            fullWidth
          />
        </Field>

        <Field label="Country Code">
          <Input
            value={form.code}
            onChange={(e) => update("code", e.target.value.toUpperCase())}
            placeholder="Enter Country Code"
          />
        </Field>

        <Field label="Currency">
          <Dropdown
            value={form.currency}
            onChange={(v) => update("currency", v)}
            options={CURRENCY_OPTIONS}
            placeholder="Select Currency"
            fullWidth
          />
        </Field>

        <Field label="Distributor Fee">
          <span className="flex h-10 w-full overflow-hidden rounded-lg bg-[#f4f5f8]">
            <input
              value={form.distributorFee}
              onChange={(e) =>
                update(
                  "distributorFee",
                  e.target.value.replace(/[^0-9.]/g, ""),
                )
              }
              placeholder="Enter Distributor Fee"
              className="h-full flex-1 bg-transparent px-4 text-[15px] font-medium text-[#222125] outline-none placeholder:text-[#878787]"
            />
            <span className="flex h-full w-14 items-center justify-center border-l border-[#cbcfd5] bg-[#f4f5f8] text-[15px] font-medium text-[#878787]">
              $
            </span>
          </span>
        </Field>

        <Field label="Rate">
          <div className="flex items-center gap-3">
            <div className="flex h-16 flex-1 flex-col justify-center rounded-lg bg-[#f4f5f8] px-4">
              <span className="text-[12px] font-medium text-[#878787]">
                {form.currency || "SGP"}
              </span>
              <span className="text-[16px] font-semibold text-[#222125]">
                $1
              </span>
            </div>
            <span className="text-[16px] font-medium text-[#222125]">=</span>
            <div className="flex h-16 flex-1 flex-col justify-center rounded-lg border border-line bg-white px-4">
              <span className="text-[12px] font-medium text-[#878787]">
                {form.rateCurrency}
              </span>
              <input
                value={form.rateValue}
                onChange={(e) =>
                  update("rateValue", e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="w-full bg-transparent text-[16px] font-semibold text-[#222125] outline-none"
              />
            </div>
          </div>
        </Field>

        <label className="inline-flex cursor-pointer items-center gap-3">
          <Switch
            checked={form.active}
            onChange={(v) => update("active", v)}
            ariaLabel="Active this country"
          />
          <span className="text-[15px] font-medium text-[#222125]">
            Active this country
          </span>
        </label>

        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
          <Button
            variant="outline"
            className="md:w-[100px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="md:w-[140px]" onClick={onClose}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
