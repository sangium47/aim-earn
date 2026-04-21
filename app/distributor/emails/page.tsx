"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  Button,
  FilterBar,
  PageTitle,
  Table,
  type DateRange,
  type TableColumn,
} from "@/components/shared";
import { TrashIcon } from "@/components/icons";
import { MONTHS } from "../products/mock";
import { EMAIL_TEMPLATES, type EmailTemplate } from "./mock";

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]} ${y}`;
}

export default function EmailPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [rows, setRows] = useState(EMAIL_TEMPLATES);

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const columns: TableColumn<EmailTemplate>[] = [
    {
      header: "ID",
      headerClassName: "min-w-[140px]",
      key: "id",
    },
    {
      header: "Email Template Name",
      headerClassName: "min-w-[260px]",
      key: "name",
    },
    {
      header: "Updated Date",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDate(item.updatedDate),
    },
    {
      header: "Action",
      headerClassName: "w-[80px]",
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
          aria-label={`Delete ${item.name}`}
          className="inline-flex size-9 items-center justify-center rounded-lg text-[#222125] transition-colors hover:bg-[#f4f5f8]"
        >
          <TrashIcon className="size-5" />
        </button>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Emails" }]} />

      <PageTitle
        title="Emails"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            onClick={() => router.push("/distributor/emails/new")}
          >
            New Template
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by template name..."
        onSearchChange={setSearch}
        dateValue={dateRange}
        dateLabel="Updated Date"
        onDateClick={setDateRange}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[720px]"
        onRowClick={(item) =>
          router.push(`/distributor/emails/${encodeURIComponent(item.id)}`)
        }
      />
    </main>
  );
}
