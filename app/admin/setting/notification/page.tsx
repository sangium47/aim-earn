"use client";

import { useState } from "react";
import { Breadcrumb, PageTitle, Switch } from "@/components/shared";

type NotificationRow = {
  key: string;
  title: string;
  description: string;
};

const ROWS: NotificationRow[] = [
  {
    key: "new-distributor",
    title: "New Distributor",
    description:
      "Enable/Disable notifications when a new distributor registers",
  },
  {
    key: "distributor-new-country",
    title: "Distributor adds a new country",
    description: "Enable/Disable notifications when a DD adds a new country",
  },
  {
    key: "new-brand",
    title: "New Brand",
    description: "Enable/Disable notifications when a new brand is added",
  },
];

export default function AdminSettingNotificationPage() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ROWS.map((r) => [r.key, true])),
  );

  const toggle = (key: string, next: boolean) =>
    setState((prev) => ({ ...prev, [key]: next }));

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Setting" }, { label: "Notifications" }]} />

      <PageTitle title="Notifications" />

      <div className="w-full overflow-hidden rounded-2xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full md:min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="bg-[#eae7e2] text-[14px] font-semibold text-[#1e1e1e]">
                <th className="min-w-[240px] px-4 py-3 font-semibold">
                  Notification
                </th>
                <th className="w-[200px] px-4 py-3 text-right font-semibold">
                  Turn Off/On
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.key}
                  className="border-t border-line bg-white align-middle"
                >
                  <td className="px-4 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[16px] font-semibold text-[#222125]">
                        {row.title}
                      </span>
                      <span className="text-[13px] text-[#5f5f5f]">
                        {row.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <div className="inline-flex">
                      <Switch
                        checked={!!state[row.key]}
                        onChange={(next) => toggle(row.key, next)}
                        ariaLabel={`Toggle ${row.title}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
