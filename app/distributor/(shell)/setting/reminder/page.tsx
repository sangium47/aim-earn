"use client";

import { useState } from "react";
import {
  Breadcrumb,
  Button,
  CardHeader,
  Input,
  PageTitle,
  Table,
} from "@/components/shared";
import type { TableColumn } from "@/components/type";
import { } from "@/components/mock";
import { formatDate } from "@/components/util";

type Reminder = {
  key: string;
  title: string;
  description: string;
  days: string;
  updatedAt: string; // ISO YYYY-MM-DD
};

const INACTIVE_REMINDERS: Reminder[] = [
  {
    key: "last-invite",
    title: "Last invite more than",
    description:
      "If an Affiliate has not invited anyone within the specified period, the Affiliate will be marked as inactive.",
    days: "30",
    updatedAt: "2026-03-18",
  },
  {
    key: "last-purchase",
    title: "Last purchase more than",
    description:
      "If an Affiliate has not made a purchase within the specified period, the Affiliate will be marked as inactive.",
    days: "60",
    updatedAt: "2026-03-18",
  },
  {
    key: "last-order",
    title: "Last order more than",
    description:
      "An Affiliate will be marked as inactive if the buyer has not made a purchase within the specified period",
    days: "45",
    updatedAt: "2026-03-18",
  },
];

export default function ReminderSettingPage() {
  const [rows, setRows] = useState(INACTIVE_REMINDERS);

  const setDays = (key: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, days: value } : r)),
    );
  };

  const columns: TableColumn<Reminder>[] = [
    {
      header: "Title",
      headerClassName: "min-w-[320px]",
      render: (item) => (
        <div className="flex flex-col gap-1 py-1">
          <span className="text-[15px] font-medium leading-[1.4] text-[#222125]">
            {item.title}
          </span>
          <span className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
            {item.description}
          </span>
        </div>
      ),
    },
    {
      header: "",
      headerClassName: "min-w-[120px]",
      render: (item) => (
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={item.days}
          onChange={(e) => setDays(item.key, e.target.value)}
          wrapperClassName="md:max-w-[120px]"
          trailing={
            <span className="text-[13px] font-medium text-ink-secondary">
              Days
            </span>
          }
        />
      ),
    },
    {
      header: "Last Updated",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDate(item.updatedAt, "—"),
    },
  ];

  const handleSave = () => {
    // TODO: wire to mutation
  };

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8 pb-24">
      <Breadcrumb items={[{ label: "Setting" }, { label: "Reminder" }]} />
      <PageTitle title="Reminder" />

      <CardHeader title="Inactive Affiliate" />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[720px]"
        pagination={false}
      />

      <div
        id="reminder-save-panel"
        className="fixed bottom-0 left-0 md:left-[218px] right-0 z-20 flex justify-end border-t border-line bg-white px-4 md:px-8 py-3 md:py-4"
      >
        <Button onClick={handleSave} className="w-full md:w-[140px]">
          Save
        </Button>
      </div>
    </main>
  );
}
