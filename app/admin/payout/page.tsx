"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import {
  PAYOUTS,
  PAYOUT_STATUS_CONFIG,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";
import type { DateRange, Payout, TableColumn } from "@/components/type";

export default function AdminPayoutPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [payoutPeriod, setPayoutPeriod] = useState<DateRange>({
    start: "",
    end: "",
  });
  const [cutoff, setCutoff] = useState<DateRange>({ start: "", end: "" });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PAYOUTS.filter((p) => {
      if (q && !p.circle.toLowerCase().includes(q)) return false;
      if (payoutPeriod.start && p.payoutDate < payoutPeriod.start) return false;
      if (payoutPeriod.end && p.payoutDate > payoutPeriod.end) return false;
      if (cutoff.start && p.payoutDate < cutoff.start) return false;
      if (cutoff.end && p.payoutDate > cutoff.end) return false;
      return true;
    });
  }, [search, payoutPeriod, cutoff]);

  const columns: TableColumn<Payout>[] = [
    {
      header: "Payout Circle",
      headerClassName: "min-w-[160px]",
      key: "circle",
    },
    {
      header: "Payout Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.payoutDate),
    },
    {
      header: "Orders",
      headerClassName: "min-w-[100px]",
      render: (item) => item.orders.toLocaleString(),
    },
    {
      header: "Affiliates",
      headerClassName: "min-w-[110px]",
      render: (item) => item.affiliates.toLocaleString(),
    },
    {
      header: "Transaction Fee",
      headerClassName: "min-w-[140px]",
      key: "transactionFee",
    },
    {
      header: "Total Amount",
      headerClassName: "min-w-[140px]",
      key: "totalAmount",
    },
    {
      header: "Status",
      headerClassName: "min-w-[120px]",
      render: (item) => <StatusPill {...PAYOUT_STATUS_CONFIG[item.status]} />,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Payouts" }]} />

      <PageTitle
        title="Payouts"
        description={
          <div className="flex flex-col gap-0.5">
            <p>
              *Affiliates are not eligible to withdraw funds if their commission
              balance is less than $20.
            </p>
            <p>A $5 transaction fee will be charged for every withdrawal.</p>
          </div>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dateRanges={[
          {
            label: "Payout Period",
            value: payoutPeriod,
            onChange: setPayoutPeriod,
          },
          {
            label: "Cut-off Date",
            value: cutoff,
            onChange: setCutoff,
          },
        ]}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1080px]"
        onRowClick={(item) =>
          router.push(`/admin/payout/${encodeURIComponent(item.id)}`)
        }
      />
    </main>
  );
}
