"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button, Dropdown } from "@/components/shared";
import { SelectCountryForm } from "@/components/select-country-form";

const COMPANY_OPTIONS = [
  { label: "Aimearn Singapore Pte. Ltd.", value: "aimearn-sg" },
  { label: "Aimearn (Thailand) Co., Ltd.", value: "aimearn-th" },
  { label: "Aimearn Malaysia Sdn Bhd", value: "aimearn-my" },
  { label: "PT Aimearn Indonesia", value: "aimearn-id" },
  { label: "Aimearn Vietnam Co., Ltd.", value: "aimearn-vn" },
  { label: "Aimearn Philippines Inc.", value: "aimearn-ph" },
];

export default function AddCountryPage() {
  const router = useRouter();
  const user = { email: "admin@aimearn.com" };
  const [company, setCompany] = useState("");

  return (
    <main className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 lg:p-8 bg-white min-h-screen items-center justify-center">
      <SelectCountryForm defaultValue={[]} />

      <div className="flex w-full max-w-[354px] mx-auto flex-col gap-2 items-start">
        <label className="text-base font-medium leading-[1.4] tracking-figma text-ink">
          Company
        </label>
        <Dropdown
          value={company}
          onChange={setCompany}
          options={COMPANY_OPTIONS}
          fullWidth
          placeholder="Select Company"
        />
      </div>

      <div className="w-full max-w-[354px] mx-auto flex flex-col-reverse gap-2 md:flex-row md:justify-between md:gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/distributor/setting/country")}
          className="md:w-[140px]"
        >
          Back to Setting
        </Button>
        <Button
          onClick={() => {
            redirect(
              `/confirmation?email=${encodeURIComponent(user?.email || "admin@aimearn.com")}`,
            );
          }}
          className="md:w-[140px]"
        >
          Submit
        </Button>
      </div>
    </main>
  );
}
