"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dropdown,
  PageTitle,
  Tabs,
} from "@/components/shared";
import { ProductInfoPanel } from "@/components/product/ProductInfoPanel";
import { CommissionPolicyPanel } from "@/components/product/CommissionPolicyPanel";
import { BRANDS, PRODUCTS } from "@/components/mock";
import type { DistributorStatus, Product, ProductTab } from "@/components/type";

const NEW_PRODUCT_ID = "new";

const DEFAULT_NEW_PRODUCT: Product = {
  sku: "",
  name: "",
  brand: BRANDS[0]?.name ?? "",
  price: "",
  thumbnail: "https://placehold.co/120x120?text=Product",
  shareUrl: "",
  countries: [],
  status: "active",
  updatedBy: "",
  updatedDate: "",
};

const TAB_ITEMS: { value: ProductTab; label: string }[] = [
  { value: "info", label: "Product Info" },
  { value: "commission", label: "Commission Policy" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const isNew = rawId === NEW_PRODUCT_ID;
  const match = useMemo(() => {
    if (isNew) return DEFAULT_NEW_PRODUCT;
    return PRODUCTS.find((p) => p.sku === rawId);
  }, [isNew, rawId]);
  const notFound = !isNew && rawId !== "" && !match;

  useEffect(() => {
    if (notFound) router.replace("/admin/products");
  }, [notFound, router]);

  const [tab, setTab] = useState<ProductTab>("info");
  const [status, setStatus] = useState<DistributorStatus>("active");

  useEffect(() => {
    if (!match) return;
    setStatus(match.status);
  }, [match]);

  if (notFound || !match) return null;

  const displayTitle = isNew ? "New Product" : match.name;

  return (
    <main
      className={`relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8${tab === "info" ? " pb-[96px]" : ""}`}
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <Breadcrumb
          items={[
            { label: "Products", href: "/admin/products" },
            { label: displayTitle },
            {
              label: TAB_ITEMS.find((t) => t.value === tab)?.label ?? "",
            },
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
      </div>

      <div className="flex flex-col gap-4">
        <Tabs<ProductTab>
          items={TAB_ITEMS}
          value={tab}
          onChange={setTab}
          className="gap-2"
        />

        {tab === "info" ? (
          <ProductInfoPanel product={match} />
        ) : (
          <CommissionPolicyPanel />
        )}
      </div>

      <div
        id="product-detail-footer"
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-line bg-white px-4 md:px-8 py-3"
      >
        {!isNew ? (
          <Button
            variant="outline"
            className="md:w-[140px] !text-[#b42318] !border-[#fca5a5] hover:!bg-[#fef2f2]"
            onClick={() => {}}
          >
            Archive
          </Button>
        ) : (
          <span aria-hidden />
        )}
        <Button className="md:w-[140px]" onClick={() => {}}>
          Save
        </Button>
      </div>
    </main>
  );
}
