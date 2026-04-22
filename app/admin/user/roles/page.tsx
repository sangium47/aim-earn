"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Pencil, Plus } from "lucide-react";
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
  ADMIN_ROLES,
  DISTRIBUTOR_STATUS_CONFIG,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";
import type { AdminRole, DateRange, TableColumn } from "@/components/type";

export default function AdminRolesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [registered, setRegistered] = useState<DateRange>({
    start: "",
    end: "",
  });
  const [confirm, setConfirm] = useState<AdminRole | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADMIN_ROLES.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (registered.start && r.lastUpdated < registered.start) return false;
      if (registered.end && r.lastUpdated > registered.end) return false;
      return true;
    });
  }, [search, registered]);

  const columns: TableColumn<AdminRole>[] = [
    {
      header: "Role",
      headerClassName: "min-w-[220px]",
      key: "name",
    },
    {
      header: "Status",
      headerClassName: "min-w-[140px]",
      render: (item) => (
        <StatusPill {...DISTRIBUTOR_STATUS_CONFIG[item.status]} />
      ),
    },
    {
      header: "Last Updated",
      headerClassName: "min-w-[160px]",
      render: (item) => formatDate(item.lastUpdated),
    },
    {
      header: "Action",
      headerClassName: "w-[112px] text-right",
      cellClassName: "text-right",
      render: (item) => (
        <RowActions
          onEdit={() =>
            router.push(`/admin/user/roles/${encodeURIComponent(item.id)}`)
          }
          onArchive={() => setConfirm(item)}
        />
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "User" }, { label: "Roles" }]} />

      <PageTitle
        title="Roles"
        actions={
          <Button
            leading={<Plus className="size-4" />}
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/user/roles/new")}
          >
            New Role
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        searchPlaceholder="Search by keyword"
        onSearchChange={setSearch}
        dateValue={registered}
        dateLabel="Registed Date"
        onDateClick={setRegistered}
      />

      <Table
        variant="simple"
        data={rows}
        columns={columns}
        minWidth="min-w-[720px]"
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
                Archive Role?
              </h2>
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                <span className="font-semibold text-[#222125]">
                  {confirm.name}
                </span>{" "}
                will be archived and can no longer be assigned to new users.
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
                Archive
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}

function RowActions({
  onEdit,
  onArchive,
}: {
  onEdit: () => void;
  onArchive: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label="Edit"
        title="Edit"
        className="inline-flex size-9 items-center justify-center rounded-lg text-[#222125] transition-colors hover:bg-[#f4f5f8]"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onArchive();
        }}
        aria-label="Archive"
        title="Archive"
        className="inline-flex size-9 items-center justify-center rounded-lg text-[#b42318] transition-colors hover:bg-[#fef2f2]"
      >
        <Archive className="size-4" />
      </button>
    </div>
  );
}
