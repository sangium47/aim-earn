import { Card, CardHeader } from "../shared";

import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sales: 1800, payout: 720, profit: 420 },
  { month: "Feb", sales: 2050, payout: 810, profit: 490 },
  { month: "Mar", sales: 1620, payout: 640, profit: 380 },
  { month: "Apr", sales: 2360, payout: 940, profit: 560 },
  { month: "May", sales: 2790, payout: 1120, profit: 720 },
  { month: "Jun", sales: 2180, payout: 860, profit: 510 },
  { month: "Jul", sales: 3120, payout: 1280, profit: 840 },
  { month: "Aug", sales: 3310, payout: 1340, profit: 910 },
  { month: "Sep", sales: 2640, payout: 1050, profit: 690 },
  { month: "Oct", sales: 3020, payout: 1210, profit: 830 },
  { month: "Nov", sales: 2480, payout: 990, profit: 640 },
  { month: "Dec", sales: 3470, payout: 1390, profit: 990 },
];

export function BusinessPerformanceChart() {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 py-3 md:py-6">
      <div className="px-3 md:px-6">
        <CardHeader title="Business Performance" />
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FAC069" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FAC069" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#414655" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#414655" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7496FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7496FF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#E5E6EA" vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={Number(y) + 12}
                  textAnchor="middle"
                  className="fill-[#1E1E1E] text-xs md:text-sm"
                >
                  {payload.value}
                </text>
              )}
            />

            <YAxis
              domain={[0, 3600]}
              ticks={[0, 600, 1200, 1800, 2400, 3000, 3600]}
              tickFormatter={(v) => `$${v}`}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
            <Legend
              iconType="circle"
              formatter={(value) => (
                <span
                  className="text-xs md:text-sm"
                  style={{ color: "#1E1E1E" }}
                >
                  {value}
                </span>
              )}
            />

            <Area
              type="monotone"
              dataKey="sales"
              name="Total Sales"
              stroke="#FAC069"
              strokeWidth={3}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="payout"
              name="Commission Payout"
              stroke="#414655"
              strokeWidth={3}
              fill="url(#payoutGradient)"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#7496FF"
              strokeWidth={3}
              fill="url(#profitGradient)"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
