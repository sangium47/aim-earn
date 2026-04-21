import { Card, CardHeader, Table, TableColumn } from "../shared";

export type BottomPanelProps = {
  title: string;
  color?: string;
  summaryText: string;
  summaryNumber: string;
  extraColumn: { header: string; rows: string[] };
  rows: { name: string; email: string }[];
};

export function BottomPanel({
  title,
  color,
  summaryText,
  summaryNumber,
  extraColumn,
  rows,
}: BottomPanelProps) {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 p-3 md:p-6">
      <CardHeader title={title} />

      {/* Summary block with accent bar */}
      <div className="flex items-center bg-surface-page gap-2 md:gap-4 rounded-2xl p-4">
        <span
          aria-hidden
          className={`h-16 w-2 rounded-full ${color ? color : "bg-[#f8d237]"}`}
        />
        <p className="flex-1 text-base text-[#1e1e1e]">{summaryText}</p>
        <p className="text-[32px] font-medium leading-[1.2] tracking-[0.01em] text-[#1e1e1e]">
          {summaryNumber}
        </p>
      </div>

      <Table
        data={rows}
        columns={[
          { header: "Name", key: "name" },
          { header: "Email", key: "email" },
          {
            header: extraColumn.header,
            render: (_, index) => extraColumn.rows[index],
          },
        ]}
        minWidth="min-w-[520px]"
      />
    </Card>
  );
}

export const BOTTOM_ROWS = [
  { name: "Alex Johnson", email: "alex.johnson@example.com" },
  { name: "Maria Chen", email: "maria.chen@example.com" },
  { name: "Liam Park", email: "liam.park@example.com" },
  { name: "Nia Okafor", email: "nia.okafor@example.com" },
];
