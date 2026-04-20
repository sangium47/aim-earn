import { Card, CardHeader } from "./shared";

const ORDER_DONUT = [
  { label: "Paid", value: "20,000 (25%)", color: "#f8d237" },
  { label: "Delivered", value: "80,874 (75%)", color: "#1e1e1e" },
  { label: "Shipped", value: "80,874 (25%)", color: "#b9b9b9" },
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
    <Card className="flex h-full flex-col gap-2 md:gap-4 p-3 md:p-6">
      <CardHeader title="Order Performance" />

      <div className="flex flex-col items-center gap-2 md:gap-4">
        <div className="relative">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden
          >
            {/* track rings */}
            <circle
              cx={center}
              cy={center}
              r={outerR}
              stroke="#f1f1f1"
              fill="none"
              strokeWidth={stroke}
            />
            <circle
              cx={center}
              cy={center}
              r={midR}
              stroke="#f1f1f1"
              fill="none"
              strokeWidth={stroke}
            />
            <circle
              cx={center}
              cy={center}
              r={innerR}
              stroke="#f1f1f1"
              fill="none"
              strokeWidth={stroke}
            />
            {/* data rings */}
            {ring(outerR, 0.75, "#1e1e1e")}
            {ring(midR, 0.25, "#b9b9b9")}
            {ring(innerR, 0.25, "#f8d237")}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-[#757575]">Total Orders</span>
            <span className="text-2xl font-semibold text-[#1e1e1e]">
              100,874
            </span>
          </div>
        </div>

        {/* Legend 2x2 */}
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 px-4">
          {ORDER_DONUT.map(({ label, value, color }) => (
            <div key={label} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.5 size-[10px] shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#1e1e1e]">{label}</span>
                <span className="text-sm text-[#757575]">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
