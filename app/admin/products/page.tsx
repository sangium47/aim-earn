"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  Button,
  CountryList,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import type { Product, TableColumn } from "@/components/type";
import {
  COUNTRY_OPTIONS,
  DISTRIBUTOR_STATUS_CONFIG,
  DISTRIBUTOR_STATUS_OPTIONS,
  PRODUCTS,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";

export default function AdminProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");

  const brandOptions = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
    return [
      { label: "All Brands", value: "all" },
      ...unique.map((b) => ({ label: b, value: b })),
    ];
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.sku.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (brand !== "all" && p.brand !== brand) return false;
      if (country !== "all" && !p.countries.includes(country)) return false;
      if (status !== "all" && p.status !== status) return false;
      return true;
    });
  }, [search, brand, country, status]);

  const columns: TableColumn<Product>[] = [
    {
      header: "Thumbnail",
      headerClassName: "w-[100px]",
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
      header: "Brand",
      headerClassName: "min-w-[160px]",
      key: "brand",
    },
    {
      header: "Country",
      headerClassName: "min-w-[160px]",
      render: (item) => <CountryList codes={item.countries} max={2} />,
    },
    {
      header: "Price",
      headerClassName: "min-w-[120px]",
      key: "price",
    },
    {
      header: "Updated By",
      headerClassName: "min-w-[160px]",
      key: "updatedBy",
    },
    {
      header: "Updated Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.updatedDate),
    },
    {
      header: "Status",
      headerClassName: "min-w-[120px]",
      render: (item) => (
        <StatusPill {...DISTRIBUTOR_STATUS_CONFIG[item.status]} />
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Product" }]} />

      <PageTitle
        title="Products"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/products/new")}
          >
            New Product
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dropdowns={[
          {
            label: "Brand",
            value: brand,
            onChange: setBrand,
            options: brandOptions,
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
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1400px]"
        onRowClick={(item) =>
          router.push(`/admin/products/${encodeURIComponent(item.sku)}`)
        }
      />
    </main>
  );
}
