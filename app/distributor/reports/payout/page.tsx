"use client";

import { useState } from "react";
import { BarChart3, Wallet } from "lucide-react";
import {
  Breadcrumb,
  CardHeader,
  FilterBar,
  PageTitle,
  Table,
  type DateRange,
  type TableColumn,
} from "@/components/shared";
import { MONTHS } from "../../products/mock";

const PERFORMANCE = [
  {
    label: "Commission Balance",
    value: "$12,480",
    Icon: Wallet,
    detail: "Payout Cycle : 1 Feb - 2 Mar 2026",
  },
  {
    label: "Total Commission Earned",
    value: "$220,192",
    Icon: BarChart3,
    detail: null as string | null,
  },
];

type PayoutStatus = "paid" | "pending";

const PAYOUT_STATUS_CONFIG: Record<
  PayoutStatus,
  { label: string; dotColor: string }
> = {
  paid: { label: "Paid", dotColor: "#51C712" },
  pending: { label: "Pending", dotColor: "#FFC300" },
};

type Payout = {
  id: string;
  cycleStart: string; // ISO YYYY-MM-DD
  cycleEnd: string; // ISO YYYY-MM-DD
  paidDate: string | null;
  amount: string;
  bankAccount: string;
  bankName: string;
  status: PayoutStatus;
};

const PAYOUTS: Payout[] = [
  {
    id: "PAY-2025-12",
    cycleStart: "2025-12-01",
    cycleEnd: "2025-12-31",
    paidDate: "2026-01-05",
    amount: "$1,820",
    bankAccount: "148-X-XXXX2-1",
    bankName: "Kasikorn",
    status: "paid",
  },
  {
    id: "PAY-2026-01",
    cycleStart: "2026-01-01",
    cycleEnd: "2026-01-31",
    paidDate: "2026-02-05",
    amount: "$2,410",
    bankAccount: "148-X-XXXX2-1",
    bankName: "Kasikorn",
    status: "paid",
  },
  {
    id: "PAY-2026-02",
    cycleStart: "2026-02-01",
    cycleEnd: "2026-02-28",
    paidDate: "2026-03-05",
    amount: "$1,320",
    bankAccount: "148-X-XXXX2-1",
    bankName: "Kasikorn",
    status: "paid",
  },
  {
    id: "PAY-2026-03",
    cycleStart: "2026-03-01",
    cycleEnd: "2026-03-31",
    paidDate: null,
    amount: "$980",
    bankAccount: "148-X-XXXX2-1",
    bankName: "Kasikorn",
    status: "pending",
  },
  {
    id: "PAY-2026-04",
    cycleStart: "2026-04-01",
    cycleEnd: "2026-04-30",
    paidDate: null,
    amount: "$540",
    bankAccount: "148-X-XXXX2-1",
    bankName: "Kasikorn",
    status: "pending",
  },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]} ${y}`;
}

function formatCycle(start: string, end: string) {
  const [sy, sm, sd] = start.split("-");
  const [ey, em, ed] = end.split("-");
  const sMonth = MONTHS[Number(sm) - 1];
  const eMonth = MONTHS[Number(em) - 1];
  if (!sMonth || !eMonth) return `${start} – ${end}`;
  // Same month/year → "1-31 Dec 2025"
  if (sy === ey && sm === em) return `${sd}-${ed} ${eMonth} ${ey}`;
  // Same year → "1 Dec-15 Jan 2026"
  if (sy === ey) return `${sd} ${sMonth}-${ed} ${eMonth} ${ey}`;
  return `${sd} ${sMonth} ${sy} – ${ed} ${eMonth} ${ey}`;
}

function StatusPill({ status }: { status: PayoutStatus }) {
  const cfg = PAYOUT_STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#222125]">
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: cfg.dotColor }}
      />
      {cfg.label}
    </span>
  );
}

export default function PayoutReportPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });

  const columns: TableColumn<Payout>[] = [
    {
      header: "Payout Cycle",
      headerClassName: "min-w-[200px]",
      render: (item) => formatCycle(item.cycleStart, item.cycleEnd),
    },
    {
      header: "Paid Date",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDate(item.paidDate),
    },
    {
      header: "Amount",
      headerClassName: "min-w-[120px]",
      key: "amount",
    },
    {
      header: "Bank Account",
      headerClassName: "min-w-[220px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">
            {item.bankAccount}
          </span>
          <span className="text-xs text-ink-secondary">{item.bankName}</span>
        </div>
      ),
    },
    {
      header: "Status",
      headerClassName: "min-w-[120px]",
      render: (item) => <StatusPill status={item.status} />,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Reports" }, { label: "Payouts" }]} />
      <PageTitle title="Payouts" />

      <div className="flex flex-col gap-2">
        <div className="grid w-full grid-cols-1 gap-2 md:gap-4 md:grid-cols-2">
          {PERFORMANCE.map(({ label, value, Icon, detail }) => (
            <article
              key={label}
              className="flex h-[151px] flex-col justify-between overflow-hidden rounded-3xl border border-[#e7e7e7] bg-white p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#f1ead9]">
                  <Icon className="size-5 text-[#796100]" aria-hidden />
                </span>
                <span className="text-base font-semibold tracking-[0.01em] text-[#222125]">
                  {label}
                </span>
              </div>
              <p className="text-[32px] font-medium leading-[1.2] text-[#222125]">
                {value}
              </p>
              {detail ? (
                <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                  {detail}
                </p>
              ) : (
                <span />
              )}
            </article>
          ))}
        </div>
        <p className="text-[12px] leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
          *If the amount is less than $20, no payout will be made. A $5 fee
          will be charged for every transaction.
        </p>
      </div>

      <CardHeader title="Earnings History" />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by payout ID..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Payout Period"
        onDateClick={setDateRange}
      />

      <Table
        variant="simple"
        data={PAYOUTS}
        columns={columns}
        minWidth="min-w-[960px]"
      />
    </main>
  );
}
