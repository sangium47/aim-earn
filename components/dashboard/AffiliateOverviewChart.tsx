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
  { month: "Jan", affiliates: 120000, distributors: 1800 },
  { month: "Feb", affiliates: 180000, distributors: 2100 },
  { month: "Mar", affiliates: 230000, distributors: 2550 },
  { month: "Apr", affiliates: 310000, distributors: 3200 },
  { month: "May", affiliates: 390000, distributors: 3950 },
  { month: "Jun", affiliates: 460000, distributors: 4700 },
  { month: "Jul", affiliates: 520000, distributors: 5400 },
  { month: "Aug", affiliates: 590000, distributors: 6200 },
  { month: "Sep", affiliates: 650000, distributors: 7100 },
  { month: "Oct", affiliates: 710000, distributors: 8050 },
  { month: "Nov", affiliates: 760000, distributors: 9100 },
  { month: "Dec", affiliates: 800000, distributors: 10000 },
];

export function AffiliateOverviewChart() {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 py-3 md:py-6">
      <div className="px-3 md:px-6">
        <CardHeader title="Affiliate Overview" />
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 0, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient
                id="affiliatesOverviewGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#7496FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7496FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="distributorsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#F8D237" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F8D237" stopOpacity={0} />
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
              yAxisId="left"
              domain={[0, 900000]}
              ticks={[0, 150000, 300000, 450000, 600000, 750000, 900000]}
              tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 12000]}
              ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000]}
              tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip formatter={(v) => Number(v).toLocaleString()} />
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
              yAxisId="left"
              type="monotone"
              dataKey="affiliates"
              name="Number of Affiliates"
              stroke="#7496FF"
              strokeWidth={3}
              fill="url(#affiliatesOverviewGradient)"
              dot={false}
              activeDot={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="distributors"
              name="Number of Distributor"
              stroke="#F8D237"
              strokeWidth={3}
              fill="url(#distributorsGradient)"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
