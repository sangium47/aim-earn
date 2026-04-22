"use client";

import { useMemo, useState } from "react";
import { DollarSign, Wallet } from "lucide-react";
import {
  CountryList,
  FilterBar,
  StatusPill,
  SummaryCard,
  Table,
} from "@/components/shared";
import {
  BRAND_PRODUCTS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
} from "@/components/mock";
import type { BrandProduct, TableColumn } from "@/components/type";

export function ProductsPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BRAND_PRODUCTS.filter((r) => {
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.sku.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [search, status]);

  const columns: TableColumn<BrandProduct>[] = [
    {
      header: "Thumbnail",
      headerClassName: "w-[108px]",
      render: (item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail}
          alt={item.name}
          className="size-12 shrink-0 rounded-lg border border-[#e7e7e7] object-cover"
        />
      ),
    },
    {
      header: "Product",
      headerClassName: "min-w-[180px]",
      key: "name",
    },
    {
      header: "SKU",
      headerClassName: "min-w-[200px]",
      key: "sku",
    },
    {
      header: "Price",
      headerClassName: "min-w-[120px]",
      key: "price",
    },
    {
      header: "Country's Affiliates",
      headerClassName: "min-w-[180px]",
      render: (item) => <CountryList codes={item.countries} max={2} />,
    },
    {
      header: "Status",
      headerClassName: "min-w-[140px]",
      render: (item) => (
        <StatusPill {...DISTRIBUTOR_STATUS_CONFIG[item.status]} />
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-3 md:gap-4">
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <SummaryCard Icon={DollarSign} label="Total Sales" value="$7,583" />
        <SummaryCard
          Icon={Wallet}
          label="Purchase Commission"
          value="$2,487"
        />
      </div>

      <Table
        data={rows}
        columns={columns}
        minWidth="min-w-[980px]"
        variant="simple"
      />
    </section>
  );
}
