import { BarChart3, Package, Users, Wallet } from "lucide-react";
import { Card, CardHeader } from "./shared";

const TEAM_PERFORMANCE = [
  { label: "Total Orders", value: "1,874", Icon: Package },
  { label: "Total Sales", value: "$220,192", Icon: BarChart3 },
  { label: "Total Commission", value: "$84,654", Icon: Wallet },
  { label: "Total Affiliate Members", value: "197", Icon: Users },
];

export function TeamPerformance() {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 p-3 md:p-6">
      <CardHeader title="Team Performance" />

      <div className="grid flex-1 md:grid-cols-2 gap-2 md:gap-4">
        {TEAM_PERFORMANCE.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="flex flex-col justify-between rounded-2xl bg-[#f6f4ef] p-6"
          >
            <div className="flex items-start justify-between">
              <span className="text-base font-medium leading-tight text-[#222125]">
                {label}
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1ead9]">
                <Icon className="size-4 text-[#796100]" aria-hidden />
              </span>
            </div>
            <p className="text-[32px] font-medium leading-[1.2] text-[#222125]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
