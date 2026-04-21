import { Card, CardHeader } from "../shared";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ORDER_DONUT = [
  { label: "Paid", value: "20,000 (25%)", color: "#f8d237" },
  { label: "Delivered", value: "80,874 (75%)", color: "#1e1e1e" },
  { label: "Shipped", value: "80,874 (25%)", color: "#b9b9b9" },
];

export type OrderStatusDatum = {
  /** Legend label, e.g. "Paid" */
  name: string;
  /** Numeric value used to size the segment in the donut */
  value: number;
  /** Hex fill for both the segment and the legend dot */
  color: string;
  /** Pre-formatted "20,000 (25%)" string shown under the legend label */
  displayLabel: string;
};

export type OrderStatusChartProps = {
  /** Centered title, e.g. "Total Orders" */
  centerTitle?: string;
  /** Centered value, e.g. "100,874" */
  centerValue: string;
  /** Segments, in clockwise order starting from 12 o'clock */
  data: OrderStatusDatum[];
  /** Optional className passed to the outer wrapper */
  className?: string;
};

const centerTitle = "Total Orders";
const centerValue = "100,874";
const data: OrderStatusDatum[] = [
  {
    name: "Paid",
    value: 25,
    color: "#F5C242",
    displayLabel: "20,000 (25%)",
  },
  {
    name: "Delivered",
    value: 25,
    color: "#FFFFFF",
    displayLabel: "80,874 (75%)",
  },
  {
    name: "Shipped",
    value: 50,
    color: "#9B9B9B",
    displayLabel: "80,874 (25%)",
  },
];

export function OrderPerformance() {
  // Two concentric rings + center label
  const size = 196;
  const center = size / 2;
  const outerR = 86;
  const midR = 66;
  const innerR = 46;
  const stroke = 16;

  const ring = (r: number, segFrac: number, color: string) => {
    const circumference = 2 * Math.PI * r;
    const dash = circumference * segFrac;
    return (
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset={circumference * 0.25}
        transform={`rotate(-90 ${center} ${center})`}
        strokeLinecap="butt"
      />
    );
  };

  return (
    <Card
      color="bg-[#3C3B36]"
      className="flex h-full  flex-col gap-2 md:gap-4 p-3 md:p-6"
    >
      <CardHeader title="Order Performance" color="text-white" />

      <div
        className={[
          "flex flex-col items-start gap-3 md:gap-6 w-full max-w-[334px]",
        ].join(" ")}
      >
        {/* Donut */}
        <div className="relative w-full aspect-square max-w-[218px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                cornerRadius={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-sans text-[11.873px] leading-[1.4] text-white text-center">
              {centerTitle}
            </p>
            <p className="font-sans font-semibold text-[20.354px] leading-[1.2] tracking-[-0.4071px] text-white text-center">
              {centerValue}
            </p>
          </div>
        </div>

        {/* Legend — matches the 2-column wrap from the Figma frame */}
        <ul className="grid grid-cols-2 md:gap-x-[89px] md:gap-y-4 w-full list-none p-0 m-0">
          {data.map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-[17px] min-w-0"
            >
              <span
                aria-hidden
                className="shrink-0 w-[10.223px] h-[10.223px] rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col gap-px min-w-0">
                <span className="font-urbanist font-medium text-[14px] leading-[1.4] text-white whitespace-nowrap">
                  {item.name}
                </span>
                <span className="font-urbanist font-normal text-[14px] leading-[1.4] tracking-[0.28px] text-white whitespace-nowrap">
                  {item.displayLabel}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
