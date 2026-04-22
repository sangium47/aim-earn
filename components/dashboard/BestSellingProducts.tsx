"use client";

import { useState } from "react";
import { Card, CardHeader, Dialog, Table } from "../shared";
import PopupTable from "./PopupTable";
import { affiliateMembers, agentSummary } from "./PopupTable/data";
import type { AffiliateMember, TableColumn } from "@/components/type";

const BEST_SELLING = [
  {
    product: "AquaPure Filter",
    sku: "SKU-AER-IUUU",
    units: 500,
    country: "SG",
  },
  {
    product: "ClearWave System",
    sku: "SKU-AER-IUUU",
    units: 300,
    country: "TH",
  },
  {
    product: "VitaSpring Filter",
    sku: "SKU-AER-IUUU",
    units: 200,
    country: "MY",
  },
  {
    product: "FreshStream Purifier:",
    sku: "SKU-AER-IUUU",
    units: 100,
    country: "SG",
  },
  {
    product: "PureFlow Filter:",
    sku: "SKU-AER-IUUU",
    units: 20,
    country: "SG",
  },
];

/** Stacked avatar chip (3 dummy avatars + "+7"). */
function AvatarStack() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="inline-block size-[34px] rounded-full border-2 border-white bg-gradient-to-br from-[#cbcfd5] to-[#9aa0ab]"
          />
        ))}
      </div>
      <span className="ml-1 text-sm text-[#1e1e1e]">+7</span>
    </div>
  );
}

function CountryPill({ code }: { code: string }) {
  return (
    <span className="inline-flex h-6 w-9 items-center justify-center rounded bg-[#f5f5f5] text-xs font-medium tracking-wide text-[#1e1e1e]">
      {code}
    </span>
  );
}

export function BestSellingProducts() {
  const [isOpen, setIsOpen] = useState(false);

  const columns: TableColumn<(typeof BEST_SELLING)[0]>[] = [
    {
      header: "Product",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.product}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">{item.sku}</span>
        </div>
      ),
    },
    {
      header: "Unit Sold",
      key: "units",
    },
    {
      header: "Total Sales",
      render: () => "$42,781",
    },
    {
      header: "Total Commission",
      render: () => "$42,781",
    },
    {
      header: "Direct Commission",
      render: () => "$42,781",
    },
    {
      header: "Indirect Commission",
      render: () => "$42,781",
    },
    {
      header: "Country",
      render: (item) => <CountryPill code={item.country} />,
    },
    {
      header: "Top Affiliate Members",
      render: () => <AvatarStack />,
    },
  ];

  return (
    <>
      <Card className="flex flex-col gap-2 md:gap-4 p-3 md:p-6">
        <CardHeader title="Top 10 Best Selling Products" />
        <Table
          data={BEST_SELLING}
          columns={columns}
          minWidth="min-w-[1080px]"
          onRowClick={() => setIsOpen(true)}
          pagination={false}
        />
      </Card>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <PopupTable
          onClose={() => setIsOpen(false)}
          summary={agentSummary}
          stats={agentSummary.stats}
          table={
            <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
              <h3 className="text-[15px] font-medium leading-none tracking-[0.3px] text-[#1e1e1e]">
                Affiliate Members
              </h3>
              <Table
                data={affiliateMembers || []}
                columns={memberColumns}
                minWidth="720px"
              />
            </div>
          }
        />
      </Dialog>
    </>
  );
}

const memberColumns: TableColumn<AffiliateMember>[] = [
  {
    header: "Member Name",
    headerClassName: "w-[200px]",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
          {item.name}
        </span>
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
          {item.agentId}
        </span>
      </div>
    ),
  },
  {
    header: "Country",
    headerClassName: "w-[120px]",
    render: (item) => (
      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(248,210,55,0.35)] px-2 text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#222125]">
        {item.country}
      </span>
    ),
  },
  {
    header: "Unit Sold",
    key: "unitSold",
  },
  {
    header: "Total Sales",
    key: "totalSales",
  },
  {
    header: "Commission",
    key: "commission",
  },
  {
    header: "My Commission",
    key: "myCommission",
    headerClassName: "w-[160px]",
  },
];
