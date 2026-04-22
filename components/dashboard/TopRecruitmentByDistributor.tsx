"use client";

import { Card, CardHeader, Table } from "../shared";
import type { TableColumn } from "@/components/type";

type Recruitment = {
  name: string;
  code: string;
  affiliates: number;
};

const TOP_RECRUITMENT: Recruitment[] = [
  { name: "Dana Wong", code: "#DS1024", affiliates: 18240 },
  { name: "Marcus Lim", code: "#DS0871", affiliates: 14130 },
  { name: "Priya Shah", code: "#DS0612", affiliates: 11890 },
  { name: "Haruto Sato", code: "#DS0455", affiliates: 9720 },
  { name: "Lena Pham", code: "#DS0339", affiliates: 8150 },
  { name: "Samuel Tan", code: "#DS0287", affiliates: 6640 },
  { name: "Nadia Rahman", code: "#DS0214", affiliates: 5220 },
  { name: "Oliver Khoo", code: "#DS0183", affiliates: 4380 },
  { name: "Mei Lin", code: "#DS0141", affiliates: 3510 },
  { name: "Noah Rivera", code: "#DS0102", affiliates: 2890 },
];

export function TopRecruitmentByDistributor() {
  const columns: TableColumn<Recruitment>[] = [
    {
      header: "Distributor",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.name}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">{item.code}</span>
        </div>
      ),
    },
    {
      header: "Number of Affiliates",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (item) => item.affiliates.toLocaleString(),
    },
  ];

  return (
    <Card className="flex flex-col gap-2 md:gap-4 p-3 md:p-6">
      <CardHeader title="Top 10 Recruitment" subtitle="By Distributor" />
      <Table
        data={TOP_RECRUITMENT}
        columns={columns}
        minWidth="min-w-[320px]"
        pagination={false}
      />
    </Card>
  );
}
