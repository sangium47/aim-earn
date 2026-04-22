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
import { ProfilePanel } from "@/components/affiliate/ProfilePanel";
import { AffiliatesPanel } from "@/components/affiliate/AffiliatesPanel";
import { SellingPanel } from "@/components/affiliate/SellingPanel";
import { BuyingPanel } from "@/components/affiliate/BuyingPanel";
import { BankPanel } from "@/components/affiliate/BankPanel";
import { DISTRIBUTORS, PROFILE_TAB_ITEMS } from "@/components/mock";
import type { DistributorStatus, ProfileTab } from "@/components/type";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

function splitName(name: string) {
  const [first, ...rest] = name.trim().split(/\s+/);
  return { first: first ?? "", last: rest.join(" ") };
}

export default function DistributorDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const match = useMemo(
    () => DISTRIBUTORS.find((d) => d.id === rawId),
    [rawId],
  );
  const notFound = rawId !== "" && !match;

  useEffect(() => {
    if (notFound) router.replace("/admin/affiliate/distributor");
  }, [notFound, router]);

  const [tab, setTab] = useState<ProfileTab>("profile");
  const [status, setStatus] = useState<DistributorStatus>("active");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    if (!match) return;
    setStatus(match.status);
    setCountries(match.countries);
  }, [match]);

  if (notFound || !match) return null;

  const { first, last } = splitName(match.name);

  return (
    <main
      className={`flex flex-col gap-4 md:gap-10 p-3 md:p-6 lg:p-8${tab === "profile" ? " pb-24" : ""}`}
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <Breadcrumb
          items={[
            { label: "Affiliate Users" },
            {
              label: "Distributors",
              href: "/admin/affiliate/distributor",
            },
            { label: match.name },
            {
              label:
                PROFILE_TAB_ITEMS.find((t) => t.value === tab)?.label ?? "",
            },
          ]}
        />

        <PageTitle
          className={`!flex-row justify-between items-center`}
          title={match.name}
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
        <Tabs<ProfileTab>
          items={PROFILE_TAB_ITEMS}
          value={tab}
          onChange={setTab}
          className="gap-2"
        />

        {tab === "profile" ? (
          <>
            <ProfilePanel
              member={match}
              first={first}
              last={last}
              countries={countries}
              onRemoveCountry={(code) =>
                setCountries((prev) => prev.filter((c) => c !== code))
              }
              onChangeCountries={setCountries}
            />

            {/* Absolute footer — Save */}
            <div
              id="distributor-detail-footer"
              className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-end border-t border-line bg-white px-4 md:px-8 py-3"
            >
              <Button className="md:w-[140px]" onClick={() => {}}>
                Save
              </Button>
            </div>
          </>
        ) : tab === "affiliates" ? (
          <AffiliatesPanel />
        ) : tab === "selling" ? (
          <SellingPanel />
        ) : tab === "buying" ? (
          <BuyingPanel />
        ) : tab === "bank" ? (
          <BankPanel member={match} />
        ) : (
          <PlaceholderPanel
            label={PROFILE_TAB_ITEMS.find((t) => t.value === tab)?.label ?? ""}
          />
        )}
      </div>
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
