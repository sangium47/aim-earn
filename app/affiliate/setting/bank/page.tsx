"use client";

import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Input,
  PageTitle,
} from "@/components/shared";

const BANK_OPTIONS = [
  { label: "Kasikorn Bank", value: "kbank" },
  { label: "Bangkok Bank", value: "bbl" },
  { label: "Siam Commercial Bank", value: "scb" },
  { label: "DBS", value: "dbs" },
  { label: "OCBC", value: "ocbc" },
  { label: "UOB", value: "uob" },
];

type BankForm = {
  bank: string;
  accountNumber: string;
  accountName: string;
};

const EMPTY_FORM: BankForm = {
  bank: "",
  accountNumber: "",
  accountName: "",
};

export default function BankAccountSettingPage() {
  const [form, setForm] = useState<BankForm>(EMPTY_FORM);

  const handleClear = () => setForm(EMPTY_FORM);
  const handleSave = () => {
    // TODO: wire to mutation
  };

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Setting" }, { label: "Bank Account" }]} />
      <PageTitle title="Bank Account" />

      <Card className="w-full lg:max-w-[620px] md:mx-auto flex flex-col gap-4 md:gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-2 items-start w-full">
          <FieldLabel>Bank</FieldLabel>
          <Dropdown
            value={form.bank}
            onChange={(value) => setForm((prev) => ({ ...prev, bank: value }))}
            options={BANK_OPTIONS}
            fullWidth
            placeholder="Select Bank"
          />
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <FieldLabel>Bank Account Number</FieldLabel>
          <Input
            value={form.accountNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, accountNumber: e.target.value }))
            }
            placeholder="e.g. 148-X-XXXX2-1"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <FieldLabel>Bank Account Name</FieldLabel>
          <Input
            value={form.accountName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, accountName: e.target.value }))
            }
            placeholder="Name as shown on the bank account"
          />
        </div>
        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-between md:gap-4">
          <Button
            variant="outline"
            onClick={handleClear}
            className="md:w-[140px]"
          >
            Clear
          </Button>
          <Button onClick={handleSave} className="md:w-[140px]">
            Save
          </Button>
        </div>
      </Card>
    </main>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[15px] font-medium leading-[1.4] text-[#222125]">
      {children}
    </label>
  );
}
