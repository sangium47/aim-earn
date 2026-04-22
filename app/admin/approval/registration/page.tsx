"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import {
  Breadcrumb,
  CountryList,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import type {
  DateRange,
  RegistrationApproval,
  TableColumn,
} from "@/components/type";
import {
  APPROVAL_STATUS_CONFIG,
  APPROVAL_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  MONTHS,
  REGISTRATION_APPROVALS,
} from "@/components/mock";

function formatDayMonthYear(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]},${y}`;
}

function inRange(iso: string, range: DateRange) {
  if (!range.start && !range.end) return true;
  if (!iso) return false;
  if (range.start && iso < range.start) return false;
  if (range.end && iso > range.end) return false;
  return true;
}


function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function RegistrationApprovalPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [requestedDate, setRequestedDate] = useState<DateRange>({
    start: "",
    end: "",
  });
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return REGISTRATION_APPROVALS.filter((r) => {
      if (
        q &&
        !r.distributor.name.toLowerCase().includes(q) &&
        !r.distributor.code.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q) &&
        !r.companyName.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (country !== "all" && !r.countries.includes(country)) return false;
      if (status !== "all" && r.status !== status) return false;
      if (!inRange(r.requestedDate, requestedDate)) return false;
      return true;
    });
  }, [search, country, status, requestedDate]);

  const columns: TableColumn<RegistrationApproval>[] = [
    {
      header: "Distributor",
      headerClassName: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm md:text-base text-[#1e1e1e]">
            {item.distributor.name}
          </span>
          <span className="text-xs md:text-sm text-[#878787]">
            {item.distributor.code}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      headerClassName: "min-w-[200px]",
      key: "email",
    },
    {
      header: "Company/Trading Name",
      headerClassName: "min-w-[220px]",
      key: "companyName",
    },
    {
      header: "Country",
      headerClassName: "min-w-[140px]",
      render: (item) => <CountryList codes={item.countries} />,
    },
    {
      header: "Total Amount",
      headerClassName: "min-w-[120px]",
      key: "totalAmount",
    },
    {
      header: "Requested Date",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDayMonthYear(item.requestedDate),
    },
    {
      header: "Payment Slip",
      headerClassName: "min-w-[120px]",
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            downloadFile(item.paymentSlipUrl, `payment-slip-${item.id}.png`);
          }}
          aria-label={`Download payment slip for ${item.distributor.name}`}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e7e7e7] text-[#222125] transition-colors hover:bg-[#f4f5f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237] focus-visible:ring-offset-1"
        >
          <Download className="size-4" aria-hidden />
        </button>
      ),
    },
    {
      header: "Status",
      headerClassName: "min-w-[140px]",
      render: (item) => <StatusPill {...APPROVAL_STATUS_CONFIG[item.status]} />,
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Approval" }, { label: "Registration" }]} />
      <PageTitle title="Registration Approval" />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by name or email..."
        onSearchChange={setSearch}
        dateRanges={[
          {
            label: "Requested Date",
            value: requestedDate,
            onChange: setRequestedDate,
          },
        ]}
        dropdowns={[
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: COUNTRY_OPTIONS,
          },
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: APPROVAL_STATUS_OPTIONS,
          },
        ]}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1200px]"
        onRowClick={(item) =>
          router.push(
            `/admin/approval/registration/${encodeURIComponent(item.id)}`,
          )
        }
      />
    </main>
  );
}
