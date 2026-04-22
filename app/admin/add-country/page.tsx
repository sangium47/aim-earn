"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  PageTitle,
} from "@/components/shared";
import {
  CountryChip,
  CountrySelect,
  findCountry,
} from "@/components/select-country-form";

const MAX_COUNTRIES = 3;

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
  const [countries, setCountries] = useState<string[]>([]);
  const [company, setCompany] = useState("");

  const canSubmit = countries.length > 0 && company !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    redirect(
      `/confirmation?email=${encodeURIComponent(user?.email || "admin@aimearn.com")}`,
    );
  };

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Setting" },
          { label: "Country", href: "/admin/setting/country" },
          { label: "Add Country" },
        ]}
      />
      <PageTitle title="Add Country" />

      <Card className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-2 items-start w-full">
          <label
            htmlFor="countries-select"
            className="text-[15px] font-medium leading-[1.4] text-[#222125]"
          >
            Countries
          </label>
          <CountrySelect
            id="countries-select"
            maxSelection={MAX_COUNTRIES}
            value={countries}
            onChange={setCountries}
          />
          {countries.length > 0 ? (
            <div
              className="flex w-full flex-wrap items-start gap-2 pt-1"
              aria-live="polite"
              aria-label="Selected countries"
            >
              {countries.map((code) => {
                const country = findCountry(code);
                if (!country) return null;
                return <CountryChip key={code} label={country.name} />;
              })}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-[15px] font-medium leading-[1.4] text-[#222125]">
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
      </Card>

      <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/setting/country")}
          className="md:w-[140px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="md:w-[140px]"
        >
          Submit
        </Button>
      </div>
    </main>
  );
}
