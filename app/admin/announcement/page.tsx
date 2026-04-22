"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  Button,
  Dialog,
  FilterBar,
  PageTitle,
  StatusPill,
  Table,
} from "@/components/shared";
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENT_STATUS_CONFIG,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";
import type {
  Announcement,
  DateRange,
  TableColumn,
} from "@/components/type";

export default function AdminAnnouncementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [updated, setUpdated] = useState<DateRange>({ start: "", end: "" });
  const [confirm, setConfirm] = useState<Announcement | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ANNOUNCEMENTS.filter((a) => {
      if (
        q &&
        !a.title.toLowerCase().includes(q) &&
        !a.targetAudience.toLowerCase().includes(q) &&
        !a.createdBy.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (updated.start && a.publishDate < updated.start) return false;
      if (updated.end && a.publishDate > updated.end) return false;
      return true;
    });
  }, [search, updated]);

  const columns: TableColumn<Announcement>[] = [
    {
      header: "Title",
      headerClassName: "min-w-[200px]",
      key: "title",
    },
    {
      header: "Target Audience",
      headerClassName: "min-w-[200px]",
      key: "targetAudience",
    },
    {
      header: "Publish Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.publishDate),
    },
    {
      header: "Status",
      headerClassName: "min-w-[140px]",
      render: (item) => (
        <StatusPill {...ANNOUNCEMENT_STATUS_CONFIG[item.status]} />
      ),
    },
    {
      header: "Created By",
      headerClassName: "min-w-[160px]",
      key: "createdBy",
    },
    {
      header: "Created Date",
      headerClassName: "min-w-[140px]",
      render: (item) => formatDate(item.createdDate),
    },
    {
      header: "Action",
      headerClassName: "w-[72px] text-right",
      cellClassName: "text-right",
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setConfirm(item);
          }}
          aria-label="Delete"
          title="Delete"
          className="inline-flex size-9 items-center justify-center rounded-lg text-[#b42318] transition-colors hover:bg-[#fef2f2]"
        >
          <Trash2 className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Announcement" }]} />

      <PageTitle
        title="Announcement"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/announcement/new")}
          >
            Create New
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dateValue={updated}
        dateLabel="Updated Date"
        onDateClick={setUpdated}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[1120px]"
        onRowClick={(item) =>
          router.push(`/admin/announcement/${encodeURIComponent(item.id)}`)
        }
      />

      <Dialog
        width="max-w-md"
        open={confirm !== null}
        onClose={() => setConfirm(null)}
      >
        {confirm ? (
          <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                Delete Announcement?
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                <span className="font-semibold text-[#222125]">
                  {confirm.title}
                </span>{" "}
                will be permanently deleted and can no longer be sent.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
              <Button
                variant="outline"
                className="md:w-[100px]"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                className="md:w-[140px] !bg-[#b42318] !text-white hover:!opacity-90"
                onClick={() => setConfirm(null)}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}
