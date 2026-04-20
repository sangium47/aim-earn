import { Card, CardHeader } from "./shared";

export type BottomPanelProps = {
  title: string;
  summaryText: string;
  summaryNumber: string;
  extraColumn: { header: string; rows: string[] };
  rows: { name: string; email: string }[];
};

export function BottomPanel({
  title,
  summaryText,
  summaryNumber,
  extraColumn,
  rows,
}: BottomPanelProps) {
  return (
    <Card className="flex h-full flex-col gap-6 p-6">
      <CardHeader title={title} />

      {/* Summary block with accent bar */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#e7e7e7] p-4">
        <span aria-hidden className="h-16 w-2 rounded-full bg-[#f8d237]" />
        <p className="flex-1 text-base text-[#1e1e1e]">{summaryText}</p>
        <p className="text-[32px] font-medium leading-[1.2] tracking-[0.01em] text-[#1e1e1e]">
          {summaryNumber}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr className="text-left text-sm font-medium text-[#1e1e1e]">
              <th className="py-3 pr-4 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">{extraColumn.header}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.email}>
                <td className="py-4 pr-4 text-base text-[#1e1e1e]">
                  {row.name}
                </td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">
                  {row.email}
                </td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">
                  {extraColumn.rows[i]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export const BOTTOM_ROWS = [
  { name: "Alex Johnson", email: "alex.johnson@example.com" },
  { name: "Maria Chen", email: "maria.chen@example.com" },
  { name: "Liam Park", email: "liam.park@example.com" },
  { name: "Nia Okafor", email: "nia.okafor@example.com" },
];