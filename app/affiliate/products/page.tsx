"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  CardHeader,
  Card,
  FilterBar,
  PageTitle,
  RefCodeCard,
  ReferalUrlCard,
  StatCard,
  Switch,
  Table,
} from "@/components/shared";
import type { Product, TableColumn } from "@/components/type";
import { ProductActions } from "@/components/products/ProductActions";
import { PRODUCTS } from "@/components/mock";

const code = "XX0025";
export default function ProductPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [publishMap, setPublishMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.sku, true])),
  );

  const columns: TableColumn<Product>[] = [
    {
      header: "Thumbnail",
      headerClassName: "w-[90px]",
      render: (item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail}
          alt={item.name}
          className="size-14 rounded-lg border border-[#e7e7e7] object-cover"
        />
      ),
    },
    {
      header: "Product",
      headerClassName: "min-w-[200px]",
      key: "name",
    },
    {
      header: "SKU",
      headerClassName: "min-w-[180px]",
      key: "sku",
    },
    {
      header: "Brand",
      headerClassName: "min-w-[140px]",
      key: "brand",
    },
    {
      header: "Price",
      headerClassName: "min-w-[120px]",
      key: "price",
    },
    {
      header: "Action",
      headerClassName: "w-[160px]",
      render: (item) => (
        <ProductActions
          shareUrl={item.shareUrl}
          downloadUrl={item.thumbnail}
          downloadFilename={`${item.sku}.png`}
          qrFilename={`${item.sku}-qr.png`}
          qrSubtitle={item.name}
        />
      ),
    },
  ];

  const affiliateUrl = "sg.getbrainspoke.com?code=xxxxxx";

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Product" }, { label: "Products" }]} />

      <PageTitle
        title="Products"
        actions={<RefCodeCard label="Ref Code" code={code} />}
      />
      <ReferalUrlCard label="Referral URL" url={affiliateUrl} />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by product name..."
        onSearchChange={setSearch}
      />
      <CardHeader title="Products Referred" />
      <Table
        variant="simple"
        data={PRODUCTS}
        columns={columns}
        minWidth="min-w-[960px]"
        onRowClick={(item) =>
          router.push(`/affiliate/products/${encodeURIComponent(item.sku)}`)
        }
      />
    </main>
  );
}
