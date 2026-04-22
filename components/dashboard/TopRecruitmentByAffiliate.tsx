"use client";

import { Card, CardHeader, Table } from "../shared";
import type { TableColumn } from "@/components/type";

type Recruitment = {
  name: string;
  code: string;
  affiliates: number;
};

const TOP_RECRUITMENT: Recruitment[] = [
  { name: "Sarah Chen", code: "#AG8932", affiliates: 2140 },
  { name: "Anan Suksan", code: "#AG8441", affiliates: 1875 },
  { name: "Nur Aisyah", code: "#AG8120", affiliates: 1640 },
  { name: "Wei Ming", code: "#AG7793", affiliates: 1422 },
  { name: "Zhi Hao", code: "#AG7542", affiliates: 1185 },
  { name: "Kasem Inta", code: "#AG7214", affiliates: 982 },
  { name: "Grace Lau", code: "#AG6987", affiliates: 810 },
  { name: "Jomar Cruz", code: "#AG6725", affiliates: 674 },
  { name: "Hana Park", code: "#AG6501", affiliates: 512 },
  { name: "Raj Mehta", code: "#AG6340", affiliates: 398 },
];

export function TopRecruitmentByAffiliate() {
  const columns: TableColumn<Recruitment>[] = [
    {
      header: "Affiliate Member",
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
      <CardHeader title="Top 10 Recruitment" subtitle="By Affiliate Member" />
      <Table
        data={TOP_RECRUITMENT}
        columns={columns}
        minWidth="min-w-[320px]"
        pagination={false}
      />
    </Card>
  );
}
