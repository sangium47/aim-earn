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
import { BrandInfoPanel } from "@/components/brand/BrandInfoPanel";
import { IntegrationPanel } from "@/components/brand/IntegrationPanel";
import { ProductsPanel } from "@/components/brand/ProductsPanel";
import { BRANDS } from "@/components/mock";
import type { Brand, BrandTab, DistributorStatus } from "@/components/type";

const TAB_ITEMS: { value: BrandTab; label: string }[] = [
  { value: "info", label: "Brand Info" },
  { value: "products", label: "Products" },
  { value: "integration", label: "Integration" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const NEW_BRAND_ID = "new";

const DEFAULT_NEW_BRAND: Brand = {
  id: NEW_BRAND_ID,
  name: "",
  logoUrl: "https://placehold.co/104x104?text=Brand",
  website: "https://",
  products: 0,
  totalSales: 0,
  totalCommission: 0,
  countries: [],
  status: "active",
  updatedBy: "",
  updatedDate: "",
  contact: {
    name: "",
    position: "",
    email: "",
    phone: "",
  },
};

export default function BrandDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const isNew = rawId === NEW_BRAND_ID;
  const match = useMemo(() => {
    if (isNew) return DEFAULT_NEW_BRAND;
    return BRANDS.find((b) => b.id === rawId);
  }, [isNew, rawId]);
  const notFound = !isNew && rawId !== "" && !match;

  useEffect(() => {
    if (notFound) router.replace("/admin/brands");
  }, [notFound, router]);

  const [tab, setTab] = useState<BrandTab>("info");
  const [status, setStatus] = useState<DistributorStatus>("active");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    if (!match) return;
    setStatus(match.status);
    setCountries(match.countries);
  }, [match]);

  if (notFound || !match) return null;

  const displayTitle = isNew ? "New Brand" : match.name;

  return (
    <main
      className={`relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-10 p-3 md:p-6 lg:p-8${tab === "info" ? " pb-[96px]" : ""}`}
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <Breadcrumb
          items={[
            { label: "Brands", href: "/admin/brands" },
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
        <Tabs<BrandTab>
          items={TAB_ITEMS}
          value={tab}
          onChange={setTab}
          className="gap-2"
        />

        {tab === "info" ? (
          <BrandInfoPanel
            brand={match}
            countries={countries}
            onChangeCountries={setCountries}
            onRemoveCountry={(code) =>
              setCountries((prev) => prev.filter((c) => c !== code))
            }
          />
        ) : tab === "products" ? (
          <ProductsPanel />
        ) : tab === "integration" ? (
          <IntegrationPanel brand={match} />
        ) : (
          <PlaceholderPanel
            label={TAB_ITEMS.find((t) => t.value === tab)?.label ?? ""}
          />
        )}
      </div>

      {tab === "info" ? (
        <div
          id="brand-detail-footer"
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
      ) : null}
    </main>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <section className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#cbcfd5] bg-white p-6 text-center">
      <p className="text-[14px] font-medium leading-[1.4] text-ink-secondary">
        {label} content coming soon.
      </p>
    </section>
  );
}
