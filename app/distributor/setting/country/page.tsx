"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  Button,
  FilterBar,
  PageTitle,
  Table,
  type TableColumn,
} from "@/components/shared";

type CountryRow = {
  country: string;
  countryName: string;
  companyName: string;
  taxId: string;
  products: number;
  effectiveAffiliates: number;
  totalAffiliates: number;
};

const COUNTRIES: CountryRow[] = [
  {
    country: "SG",
    countryName: "Singapore",
    companyName: "Aimearn Singapore Pte. Ltd.",
    taxId: "201801234A",
    products: 128,
    effectiveAffiliates: 320,
    totalAffiliates: 487,
  },
  {
    country: "TH",
    countryName: "Thailand",
    companyName: "Aimearn (Thailand) Co., Ltd.",
    taxId: "0105562000123",
    products: 96,
    effectiveAffiliates: 284,
    totalAffiliates: 412,
  },
  {
    country: "MY",
    countryName: "Malaysia",
    companyName: "Aimearn Malaysia Sdn Bhd",
    taxId: "202001012345",
    products: 74,
    effectiveAffiliates: 198,
    totalAffiliates: 301,
  },
  {
    country: "ID",
    countryName: "Indonesia",
    companyName: "PT Aimearn Indonesia",
    taxId: "01.234.567.8-123.000",
    products: 62,
    effectiveAffiliates: 156,
    totalAffiliates: 248,
  },
  {
    country: "VN",
    countryName: "Vietnam",
    companyName: "Aimearn Vietnam Co., Ltd.",
    taxId: "0312345678",
    products: 48,
    effectiveAffiliates: 112,
    totalAffiliates: 186,
  },
  {
    country: "PH",
    countryName: "Philippines",
    companyName: "Aimearn Philippines Inc.",
    taxId: "009-876-543-000",
    products: 33,
    effectiveAffiliates: 78,
    totalAffiliates: 124,
  },
];

function CountryPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-ink">{name}</span>
    </span>
  );
}

export default function CountrySettingPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const columns: TableColumn<CountryRow>[] = [
    {
      header: "Country",
      headerClassName: "min-w-[180px]",
      render: (item) => <CountryPill name={item.countryName} />,
    },
    {
      header: "Company",
      headerClassName: "min-w-[260px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.companyName}
          </span>
          <span className="text-xs text-ink-secondary">{item.taxId}</span>
        </div>
      ),
    },
    {
      header: "Products",
      headerClassName: "min-w-[120px]",
      key: "products",
    },
    {
      header: "Effective Affiliate Members",
      headerClassName: "min-w-[200px]",
      key: "effectiveAffiliates",
    },
    {
      header: "All Affiliate Members",
      headerClassName: "min-w-[180px]",
      key: "totalAffiliates",
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
            onClick={() => router.push("/add-country")}
          >
            Add Country
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by country or company..."
        onSearchChange={setSearch}
      />

      <Table
        variant="simple"
        data={COUNTRIES}
        columns={columns}
        minWidth="min-w-[1040px]"
      />
    </main>
  );
}
