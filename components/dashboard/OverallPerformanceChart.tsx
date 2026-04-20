import { Card, CardHeader } from "./shared";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Commission (USD) and Affiliate count per month, used by the area chart. */
const CHART_DATA: { commission: number; affiliates: number }[] = [
  { commission: 420, affiliates: 18 },
  { commission: 520, affiliates: 22 },
  { commission: 700, affiliates: 26 },
  { commission: 640, affiliates: 28 },
  { commission: 880, affiliates: 34 },
  { commission: 980, affiliates: 30 },
  { commission: 1180, affiliates: 38 },
  { commission: 1080, affiliates: 42 },
  { commission: 1260, affiliates: 45 },
  { commission: 1340, affiliates: 48 },
  { commission: 1280, affiliates: 50 },
  { commission: 1380, affiliates: 54 },
];

export function OverallPerformanceChart() {
  const W = 532;
  const H = 254;
  const padL = 58;
  const padR = 26;
  const padT = 10;
  const padB = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const commissionMax = 1400;
  const affiliatesMax = 60;

  const xFor = (i: number) => padL + (i * innerW) / (CHART_DATA.length - 1);
  const yForCommission = (v: number) =>
    padT + innerH - (v / commissionMax) * innerH;
  const yForAffiliates = (v: number) =>
    padT + innerH - (v / affiliatesMax) * innerH;

  const commissionLine = CHART_DATA.map(
    (d, i) =>
      `${i === 0 ? "M" : "L"} ${xFor(i)} ${yForCommission(d.commission)}`,
  ).join(" ");
  const commissionArea = `${commissionLine} L ${xFor(CHART_DATA.length - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  const affiliatesLine = CHART_DATA.map(
    (d, i) =>
      `${i === 0 ? "M" : "L"} ${xFor(i)} ${yForAffiliates(d.affiliates)}`,
  ).join(" ");
  const affiliatesArea = `${affiliatesLine} L ${xFor(CHART_DATA.length - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  const leftLabels = [
    "$1400",
    "$1200",
    "$1000",
    "€800",
    "$600",
    "$400",
    "$200",
  ];
  const rightLabels = ["60", "50", "40", "30", "20", "10", "0"];

  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <CardHeader title="Overall Performace" />

      <div className="flex flex-1 flex-col gap-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Overall performance line chart: commission and number of affiliates by month"
        >
          <defs>
            <linearGradient id="grad-commission" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f8d237" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f8d237" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad-affiliates" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1e1e1e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1e1e1e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines + left & right axis labels */}
          {leftLabels.map((label, i) => {
            const y = padT + (i * innerH) / (leftLabels.length - 1);
            return (
              <g key={label + i}>
                <line
                  x1={padL}
                  y1={y}
                  x2={W - padR}
                  y2={y}
                  stroke="#eeeeee"
                  strokeWidth="1"
                />
                <text x={0} y={y + 4} className="fill-[#8a8a8a]" fontSize="12">
                  {label}
                </text>
                <text
                  x={W - 18}
                  y={y + 4}
                  className="fill-[#8a8a8a]"
                  fontSize="12"
                >
                  {rightLabels[i]}
                </text>
              </g>
            );
          })}

          {/* Affiliates area (behind) */}
          <path d={affiliatesArea} fill="url(#grad-affiliates)" />
          <path
            d={affiliatesLine}
            fill="none"
            stroke="#1e1e1e"
            strokeWidth="2"
          />

          {/* Commission area (front) */}
          <path d={commissionArea} fill="url(#grad-commission)" />
          <path
            d={commissionLine}
            fill="none"
            stroke="#f8d237"
            strokeWidth="2.5"
          />
        </svg>

        {/* Month axis */}
        <div className="grid grid-cols-12 pl-[58px] pr-[26px] text-xs text-[#8a8a8a]">
          {MONTHS.map((m) => (
            <span key={m} className="text-center">
              {m}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 text-sm text-[#1e1e1e]">
          <span className="inline-flex items-center gap-2">
            <span
              className="size-[10px] rounded-full bg-[#f8d237]"
              aria-hidden
            />
            Commission
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="size-[10px] rounded-full bg-[#1e1e1e]"
              aria-hidden
            />
            Number of Affiliates
          </span>
        </div>
      </div>
    </Card>
  );
}