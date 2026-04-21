import { ArrowUpRight, BarChart3, Package, Wallet } from "lucide-react";
import { CardHeader, ChangeChip } from "../shared";

const MY_PERFORMANCE = [
  {
    label: "Total Orders",
    value: "1,874",
    change: "+9.2%",
    Icon: Package,
    detail: null as string | null,
  },
  {
    label: "Total Sales",
    value: "$220,192",
    change: "+9.2%",
    Icon: BarChart3,
    detail: null,
  },
  {
    label: "Commission",
    value: "$140,626",
    change: "+9.2%",
    Icon: Wallet,
    detail: "Detail",
  },
];

export function MyPerformance() {
  return (
    <section className="flex w-full flex-col gap-2 md:gap-4">
      <CardHeader title="My Performance" />

      <div className="grid w-full grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MY_PERFORMANCE.map(({ label, value, change, Icon, detail }) => (
          <article
            key={label}
            className="flex h-[151px] flex-col justify-between overflow-hidden rounded-3xl border border-[#e7e7e7] bg-white p-4"
          >
            {/* Top row: icon + label + action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#f1ead9]">
                  <Icon className="size-5 text-[#796100]" aria-hidden />
                </span>
                <span className="text-base font-semibold tracking-[0.01em] text-[#222125]">
                  {label}
                </span>
              </div>
              {detail ? (
                <a
                  href="#"
                  className="flex items-center gap-1 text-sm text-[#757575] hover:text-[#1e1e1e]"
                >
                  <span>{detail}</span>
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full border border-[#e6e6e6] text-[#1e1e1e]">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              )}
            </div>

            {/* Big number */}
            <p className="text-[32px] font-medium leading-[1.2] text-[#222125]">
              {value}
            </p>

            {/* Yesterday */}
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-[#767676]">Yesterday :</span>
              <ChangeChip value={change} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
