import {
  BanknoteArrowUp,
  DollarSign,
  Package,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ChangeChip } from "../shared";

type Stat = {
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  changeTooltip?: string;
  Icon?: LucideIcon;
};

const GRID_STATS: Stat[] = [
  {
    label: "Total Orders",
    value: "1,874",
    change: "+9.2%",
    changeLabel: "vs Last Week",
    changeTooltip: "+ 842 Orders",
    Icon: Package,
  },
  {
    label: "Total Sales",
    value: "$22,000,192",
    change: "+9.2%",
    changeLabel: "vs Last Week",
    changeTooltip: "+ $1,852,004",
    Icon: DollarSign,
  },
  {
    label: "Commission Payout",
    value: "$10,000,000",
    change: "+9.2%",
    changeLabel: "vs Last Week",
    changeTooltip: "+ $842,300",
    Icon: Wallet,
  },
  {
    label: "Profit",
    value: "$3,084,654",
    change: "+9.2%",
    changeLabel: "vs Last Week",
    changeTooltip: "+ $259,812",
    Icon: BanknoteArrowUp,
  },
];

const SIDE_STATS: Stat[] = [
  {
    label: "Total Distributor",
    value: "10,000",
    change: "+9.2%",
    changeLabel: "vs Last Week",
    changeTooltip: "+ 842 Distributors",
  },
  {
    label: "Total Affiliates",
    value: "800,000",
    change: "+9.2%",
    changeLabel: "vs Last Week",
    changeTooltip: "+ 67,384 Affiliates",
  },
];

function ChangeBlock({
  change,
  label,
  tooltip,
}: {
  change: string;
  label: string;
  tooltip?: string;
}) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <ChangeChip value={change} tooltip={tooltip} />
      <span className="text-[14px] font-medium leading-[1.4] text-[#767676] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function StatTile({ stat }: { stat: Stat }) {
  const { Icon, label, value, change, changeLabel, changeTooltip } = stat;
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#e7e7e7] bg-[#f5f5f5] p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {Icon ? (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1ead9]">
              <Icon className="size-5 text-[#796100]" aria-hidden />
            </span>
          ) : null}
          <span className="truncate text-[16px] font-semibold leading-[1.4] tracking-[0.16px] text-[#222125]">
            {label}
          </span>
        </div>
        {change ? (
          <ChangeBlock
            change={change}
            label={changeLabel ?? ""}
            tooltip={changeTooltip}
          />
        ) : null}
      </div>
      <p className="font-['DM_Sans',sans-serif] text-[28px] md:text-[32px] font-medium leading-[1.2] text-[#222125]">
        {value}
      </p>
    </article>
  );
}

/**
 * Overview card — admin dashboard summary panel (Figma node 137:136668).
 *
 * Renders under `<TitleBar />`. A 2x2 grid of stat tiles sits on the left,
 * and a single tall two-stat card (distributor + affiliates counts) sits on
 * the right. The range selector in the header is presentational — wire the
 * `onChange` handler up when real data is available.
 */
export function Overview() {
  return (
    <section className="flex w-full flex-col gap-4 md:gap-6 rounded-3xl border border-[#e7e7e7] bg-white p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-ink-heading">
          Overview
        </h2>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
        {/* 2x2 grid */}
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          {GRID_STATS.map((stat) => (
            <StatTile key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Tall side card */}
        <aside className="flex w-full xl:w-[320px] flex-col justify-between gap-4 rounded-2xl border border-[#e7e7e7] bg-[#f5f5f5] p-5 md:p-6">
          {SIDE_STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col gap-2">
              {i > 0 ? (
                <hr className="border-0 border-t border-[#e7e7e7]" />
              ) : null}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[16px] font-semibold leading-[1.4] tracking-[0.16px] text-[#222125]">
                  {stat.label}
                </span>
                {stat.change ? (
                  <ChangeBlock
                    change={stat.change}
                    label={stat.changeLabel ?? ""}
                    tooltip={stat.changeTooltip}
                  />
                ) : null}
              </div>
              <p className="font-['DM_Sans',sans-serif] text-[28px] md:text-[32px] font-medium leading-[1.2] text-[#222125]">
                {stat.value}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

export default Overview;
