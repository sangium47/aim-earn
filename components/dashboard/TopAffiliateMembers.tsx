"use client";

import { useState } from "react";
import { Card, CardHeader, Dialog, Table } from "../shared";
import PopupTable from "./PopupTable";
import { memberProducts, memberSummary } from "./PopupTable/data";
import type { MemberProduct, TableColumn } from "@/components/type";

const TOP_AFFILIATES = [
  { id: "AF-001", name: "Sarah Chen", country: "SG", orders: 120 },
  { id: "AF-002", name: "Anan Suksan", country: "TH", orders: 100 },
  { id: "AF-003", name: "Nur Aisyah", country: "MY", orders: 89 },
  { id: "AF-004", name: "Wei Ming", country: "SG", orders: 80 },
  { id: "AF-005", name: "Zhi Hao", country: "SG", orders: 78 },
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

export function TopAffiliateMembers() {
  const [isOpen, setIsOpen] = useState(false);

  const columns: TableColumn<(typeof TOP_AFFILIATES)[0]>[] = [
    {
      header: "ID · Name",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.name}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">{item.id}</span>
        </div>
      ),
    },
    {
      header: "Country",
      render: (item) => <CountryPill code={item.country} />,
    },
    {
      header: "Total Orders",
      key: "orders",
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
      header: "Products",
      render: () => <AvatarStack />,
    },
  ];

  return (
    <>
      <Card className="flex flex-col gap-2 md:gap-4 p-3 md:p-6">
        <CardHeader title="Top 10 Affiliate Members" />
        <Table
          data={TOP_AFFILIATES}
          columns={columns}
          minWidth="min-w-[1080px]"
          onRowClick={() => setIsOpen(true)}
          pagination={false}
        />
      </Card>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <PopupTable
          summary={memberSummary}
          stats={memberSummary.stats}
          onClose={() => setIsOpen(false)}
          table={
            <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
              <h3 className="text-[15px] font-medium leading-none tracking-[0.3px] text-[#1e1e1e]">
                Orders Overview
              </h3>
              <Table
                data={memberProducts}
                columns={productColumns}
                minWidth="720px"
              />
            </div>
          }
        />
      </Dialog>
    </>
  );
}

const productColumns: TableColumn<MemberProduct>[] = [
  {
    header: "Order ID",
    headerClassName: "w-[100px]",
    key: "orderID",
  },
  {
    header: "Ordered Date",
    headerClassName: "w-[120px]",
    key: "orderedDate",
  },
  {
    header: "Unit Sold",
    key: "status",
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
