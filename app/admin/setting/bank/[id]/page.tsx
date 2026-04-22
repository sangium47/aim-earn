"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Dialog,
  Dropdown,
  Field,
  Input,
  PageTitle,
  SectionRow,
} from "@/components/shared";
import { BANK_CONFIGS } from "@/components/mock";
import type { BankConfig, DistributorStatus } from "@/components/type";

const NEW_BANK_ID = "new";

const DEFAULT_NEW_BANK: BankConfig = {
  id: NEW_BANK_ID,
  name: "",
  code: "",
  country: "",
  currency: "",
  status: "active",
};

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

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

export default function AdminSettingBankDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const isNew = rawId === NEW_BANK_ID;
  const bank = useMemo<BankConfig | undefined>(() => {
    if (isNew) return DEFAULT_NEW_BANK;
    return BANK_CONFIGS.find((b) => b.id === rawId);
  }, [isNew, rawId]);
  const notFound = !isNew && rawId !== "" && !bank;

  useEffect(() => {
    if (notFound) router.replace("/admin/setting/bank");
  }, [notFound, router]);

  const [name, setName] = useState(bank?.name ?? "");
  const [code, setCode] = useState(bank?.code ?? "");
  const [country, setCountry] = useState(bank?.country ?? "");
  const [currency, setCurrency] = useState(bank?.currency ?? "");
  const [status, setStatus] = useState<DistributorStatus>(
    bank?.status ?? "active",
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!bank) return;
    setName(bank.name);
    setCode(bank.code);
    setCountry(bank.country);
    setCurrency(bank.currency);
    setStatus(bank.status);
  }, [bank]);

  if (notFound || !bank) return null;

  const displayTitle = isNew ? "New Bank" : bank.name;

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8 pb-[96px]">
      <Breadcrumb
        items={[
          { label: "Setting" },
          { label: "Banks", href: "/admin/setting/bank" },
          { label: displayTitle },
        ]}
      />

      <PageTitle
        className="!flex-row justify-between items-center"
        title={displayTitle}
        actions={
          <div className="w-[120px]">
            <Dropdown
              color="bg-white"
              value={status}
              onChange={(v) => setStatus(v as DistributorStatus)}
              options={STATUS_OPTIONS}
              fullWidth
            />
          </div>
        }
      />

      <section className="flex flex-col gap-4 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <SectionRow title="Bank Info">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <Field label="Bank Name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bank name"
              />
            </Field>
            <Field label="Bank Code">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="0000"
              />
            </Field>
            <Field label="Country">
              <Dropdown
                value={country}
                onChange={setCountry}
                options={COUNTRY_OPTIONS}
                placeholder="Select Country"
                fullWidth
              />
            </Field>
            <Field label="Currency">
              <Dropdown
                value={currency}
                onChange={setCurrency}
                options={CURRENCY_OPTIONS}
                placeholder="Select Currency"
                fullWidth
              />
            </Field>
          </div>
        </SectionRow>
      </section>

      <div
        id="bank-detail-footer"
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-line bg-white px-4 md:px-8 py-3"
      >
        {!isNew ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-medium text-[#b42318] transition-colors hover:bg-[#fef2f2]"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        ) : (
          <span aria-hidden />
        )}
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="outline"
            className="md:w-[100px]"
            onClick={() => router.push("/admin/setting/bank")}
          >
            Cancel
          </Button>
          <Button className="md:w-[120px]" onClick={() => {}}>
            Save
          </Button>
        </div>
      </div>

      <Dialog
        width="max-w-md"
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              Delete Bank?
            </h2>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
              <span className="font-semibold text-[#222125]">
                {bank.name || displayTitle}
              </span>{" "}
              will be removed from bank settings.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
            <Button
              variant="outline"
              className="md:w-[100px]"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              className="md:w-[140px] !bg-[#b42318] !text-white hover:!opacity-90"
              onClick={() => setConfirmDelete(false)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
