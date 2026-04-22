"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CountryPill,
  FilterBar,
  StatCard,
  StatusPill,
  Table,
} from "@/components/shared";
import { DISTRIBUTOR_STATUS_CONFIG } from "@/components/mock";
import type {
  DateRange,
  DistributorStatus,
  TableColumn,
} from "@/components/type";

type AffiliateMemberRow = {
  id: string;
  name: string;
  email: string;
  inviterName: string;
  inviterCode: string;
  country: string;
  joined: string;
  totalOrders: number;
  totalSales: string;
  commissionPool: string;
  directCommission: string;
  indirectCommission: string;
  totalEarnings: string;
  personalCommission: string;
  status: DistributorStatus;
};

const AFFILIATE_MEMBERS: AffiliateMemberRow[] = [
  {
    id: "#AG8932",
    name: "Sarah Chen",
    email: "sarah.chen@aimearn.com",
    inviterName: "Alexa Microsoft",
    inviterCode: "#BB5252",
    country: "SG",
    joined: "2026-01-12",
    totalOrders: 210,
    totalSales: "$42,781",
    commissionPool: "$4,278",
    directCommission: "$2,100",
    indirectCommission: "$800",
    totalEarnings: "$2,900",
    personalCommission: "$1,450",
    status: "active",
  },
  {
    id: "#AG3761",
    name: "Anan Suksan",
    email: "anan.suksan@aimearn.com",
    inviterName: "Alexa Microsoft",
    inviterCode: "#BB5252",
    country: "TH",
    joined: "2026-01-22",
    totalOrders: 164,
    totalSales: "$31,200",
    commissionPool: "$3,120",
    directCommission: "$1,560",
    indirectCommission: "$624",
    totalEarnings: "$2,184",
    personalCommission: "$1,092",
    status: "active",
  },
  {
    id: "#AG6145",
    name: "Nur Aisyah",
    email: "nur.aisyah@aimearn.com",
    inviterName: "Alexa Microsoft",
    inviterCode: "#BB5252",
    country: "MY",
    joined: "2026-02-03",
    totalOrders: 120,
    totalSales: "$22,400",
    commissionPool: "$2,240",
    directCommission: "$1,120",
    indirectCommission: "$450",
    totalEarnings: "$1,570",
    personalCommission: "$785",
    status: "active",
  },
  {
    id: "#AG9892",
    name: "Wei Ming",
    email: "wei.ming@aimearn.com",
    inviterName: "Alexa Microsoft",
    inviterCode: "#BB5252",
    country: "SG",
    joined: "2026-02-18",
    totalOrders: 98,
    totalSales: "$19,800",
    commissionPool: "$1,980",
    directCommission: "$990",
    indirectCommission: "$395",
    totalEarnings: "$1,385",
    personalCommission: "$690",
    status: "inactive",
  },
  {
    id: "#AG9735",
    name: "Zhi Hao",
    email: "zhi.hao@aimearn.com",
    inviterName: "Alexa Microsoft",
    inviterCode: "#BB5252",
    country: "SG",
    joined: "2026-03-01",
    totalOrders: 76,
    totalSales: "$18,450",
    commissionPool: "$1,845",
    directCommission: "$920",
    indirectCommission: "$370",
    totalEarnings: "$1,290",
    personalCommission: "$645",
    status: "inactive",
  },
];

export function AffiliatesPanel() {
  const [search, setSearch] = useState("");
  const [orderPeriod, setOrderPeriod] = useState<DateRange>({
    start: "",
    end: "",
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return AFFILIATE_MEMBERS.filter((r) => {
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q) &&
        !r.id.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (orderPeriod.start && r.joined < orderPeriod.start) return false;
      if (orderPeriod.end && r.joined > orderPeriod.end) return false;
      return true;
    });
  }, [search, orderPeriod]);

  const columns: TableColumn<AffiliateMemberRow>[] = [
    {
      header: "Affiliate Member",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.name}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">{item.id}</span>
        </div>
      ),
    },
    { header: "Email", key: "email", headerClassName: "min-w-[200px]" },
    {
      header: "Inviter",
      headerClassName: "min-w-[160px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.inviterName}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">
            {item.inviterCode}
          </span>
        </div>
      ),
    },
    {
      header: "Country",
      render: (item) => <CountryPill code={item.country} />,
    },
    {
      header: "Registered Date",
      key: "joined",
      headerClassName: "min-w-[140px]",
      borderRight: true,
    },
    {
      header: "Total Orders",
      headerClassName: "min-w-[120px]",
      render: (item) => item.totalOrders.toLocaleString(),
    },
    {
      header: "Total Sales",
      key: "totalSales",
      headerClassName: "min-w-[120px]",
    },
    {
      header: "Commission Pool",
      key: "commissionPool",
      headerClassName: "min-w-[140px]",
      borderRight: true,
    },
    {
      header: "Direct Commission",
      key: "directCommission",
      headerClassName: "min-w-[140px]",
    },
    {
      header: "Indirect Commission",
      key: "indirectCommission",
      headerClassName: "min-w-[140px]",
    },
    {
      header: "Total Earnings",
      key: "totalEarnings",
      headerClassName: "min-w-[140px]",
      borderRight: true,
    },
    {
      header: "Personal Commission",
      key: "personalCommission",
      headerClassName: "min-w-[160px]",
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
    <section className="flex flex-col gap-3 md:gap-4">
      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name or email..."
        onSearchChange={setSearch}
        dateRanges={[
          {
            label: "Order Period",
            value: orderPeriod,
            onChange: setOrderPeriod,
          },
        ]}
      />

      <Card className="flex flex-col gap-3 !bg-transparent !border-none">
        <div className="grid md:grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
          <StatCard
            label="Total Affiliate"
            value={AFFILIATE_MEMBERS.length.toLocaleString()}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Orders"
            value={AFFILIATE_MEMBERS.reduce(
              (sum, r) => sum + r.totalOrders,
              0,
            ).toLocaleString()}
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Sales"
            value="$134,631"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Commission Pool"
            value="$13,463"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
          <StatCard
            label="Total Personal Commission"
            value="$4,662"
            className="!bg-white !border-none shadow-xs md:shadow-sm"
          />
        </div>
      </Card>

      <Table
        data={rows}
        variant="simple"
        columns={columns}
        minWidth="min-w-[1680px]"
      />
    </section>
  );
}
