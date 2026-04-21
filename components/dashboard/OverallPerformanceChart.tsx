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
  { month: "Jan", commission: 620, affiliates: 14 },
  { month: "Feb", commission: 780, affiliates: 19 },
  { month: "Mar", commission: 540, affiliates: 22 },
  { month: "Apr", commission: 910, affiliates: 28 },
  { month: "May", commission: 1120, affiliates: 34 },
  { month: "Jun", commission: 860, affiliates: 31 },
  { month: "Jul", commission: 1280, affiliates: 42 },
  { month: "Aug", commission: 1340, affiliates: 47 },
  { month: "Sep", commission: 1050, affiliates: 39 },
  { month: "Oct", commission: 1210, affiliates: 51 },
  { month: "Nov", commission: 990, affiliates: 45 },
  { month: "Dec", commission: 1390, affiliates: 58 },
];

export function OverallPerformanceChart() {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 py-3 md:py-6">
      <div className="px-3 md:px-6">
        <CardHeader title="Overall Performace" />
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 0, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient
                id="commissionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1E1E1E" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#1E1E1E" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="affiliatesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#FACC15" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
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
              domain={[200, 1400]}
              ticks={[200, 400, 600, 800, 1000, 1200, 1400]}
              tickFormatter={(v) => `$${v}`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />
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
              dataKey="commission"
              name="Commission"
              stroke="#1E1E1E"
              strokeWidth={3}
              fill="url(#commissionGradient)"
              dot={false}
              activeDot={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="affiliates"
              name="Number of Affiliates"
              stroke="#FACC15"
              strokeWidth={3}
              fill="url(#affiliatesGradient)"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
