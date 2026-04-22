"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  DollarSign,
  HelpCircle,
  ListChecks,
  Mail,
  PieChart,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  UserCog,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  Breadcrumb,
  Button,
  Dialog,
  Divider,
  Dropdown,
  Field,
  Input,
  PageTitle,
  SectionRow,
} from "@/components/shared";
import { ADMIN_ROLES } from "@/components/mock";
import type { AdminRole, DistributorStatus } from "@/components/type";

type PermKey = "view" | "create" | "edit" | "delete";
const PERM_KEYS: readonly PermKey[] = [
  "view",
  "create",
  "edit",
  "delete",
] as const;

type MenuRow = {
  key: string;
  label: string;
  Icon?: LucideIcon;
  indent?: boolean;
  /** When true, the row starts disabled (no permissions available). */
  disabled?: boolean;
  /** Defaults to all perms checked; override per row for initial state. */
  defaults?: Partial<Record<PermKey, boolean>>;
};

const MENU_ROWS: MenuRow[] = [
  { key: "dashboard", label: "Dashboard", Icon: PieChart },
  {
    key: "affiliate",
    label: "Affiliate User",
    Icon: UsersRound,
    disabled: true,
  },
  {
    key: "affiliate.distributors",
    label: "Distributors",
    indent: true,
    disabled: true,
  },
  {
    key: "affiliate.affiliates",
    label: "Affiliates",
    indent: true,
    disabled: true,
  },
  { key: "affiliate.suspend", label: "Suspend", indent: true, disabled: true },
  { key: "brands", label: "Brands", Icon: Star },
  { key: "product", label: "Product", Icon: Tag },
  { key: "orders", label: "Orders", Icon: ShoppingCart },
  { key: "customers", label: "Customers", Icon: ListChecks },
  { key: "payout", label: "Payout", Icon: DollarSign },
  { key: "user", label: "User", Icon: UserCog },
  { key: "user.roles", label: "Roles", indent: true },
  { key: "user.users", label: "Users", indent: true },
  { key: "reports", label: "Reports", Icon: BarChart3, disabled: true },
  { key: "reports.sales", label: "Sales", indent: true },
  { key: "reports.commission", label: "Commission", indent: true },
  { key: "emails", label: "Emails", Icon: Mail, disabled: true },
  { key: "announcement", label: "Announcement", Icon: Bell, disabled: true },
  { key: "support", label: "Support", Icon: HelpCircle, disabled: true },
  { key: "setting", label: "Setting", Icon: Settings },
  { key: "setting.county", label: "County", indent: true },
  { key: "setting.banks", label: "Banks", indent: true },
  { key: "setting.reminder", label: "Reminder", indent: true },
  { key: "setting.integration", label: "Integration", indent: true },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const NEW_ROLE_ID = "new";

const DEFAULT_NEW_ROLE: AdminRole = {
  id: NEW_ROLE_ID,
  name: "",
  status: "active",
  lastUpdated: "",
};

type PermState = Record<string, Record<PermKey, boolean>>;

function buildInitialPerms(): PermState {
  const state: PermState = {};
  for (const row of MENU_ROWS) {
    if (row.disabled) {
      state[row.key] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
      };
    } else {
      state[row.key] = {
        view: row.defaults?.view ?? true,
        create: row.defaults?.create ?? true,
        edit: row.defaults?.edit ?? true,
        delete: row.defaults?.delete ?? true,
      };
    }
  }
  return state;
}

export default function AdminRoleDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const isNew = rawId === NEW_ROLE_ID;
  const role = useMemo<AdminRole | undefined>(() => {
    if (isNew) return DEFAULT_NEW_ROLE;
    return ADMIN_ROLES.find((r) => r.id === rawId);
  }, [isNew, rawId]);
  const notFound = !isNew && rawId !== "" && !role;

  useEffect(() => {
    if (notFound) router.replace("/admin/user/roles");
  }, [notFound, router]);

  const [name, setName] = useState(role?.name ?? "");
  const [status, setStatus] = useState<DistributorStatus>(
    role?.status ?? "active",
  );
  const [perms, setPerms] = useState<PermState>(() => buildInitialPerms());
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setStatus(role.status);
    }
  }, [role]);

  if (notFound || !role) return null;

  const displayTitle = isNew ? "New Role" : role.name;

  const togglePerm = (key: string, field: PermKey, value: boolean) => {
    setPerms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const toggleAll = (key: string, value: boolean) => {
    setPerms((prev) => ({
      ...prev,
      [key]: { view: value, create: value, edit: value, delete: value },
    }));
  };

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8 pb-[96px]">
      <Breadcrumb
        items={[
          { label: "User" },
          { label: "Roles", href: "/admin/user/roles" },
          { label: displayTitle },
        ]}
      />

      <PageTitle
        className="!flex-row justify-between items-center"
        title={displayTitle}
        actions={
          <div className="w-[120px]">
            <Dropdown
              color="bg-white"
              value={status}
              onChange={(v) => setStatus(v as DistributorStatus)}
              options={STATUS_OPTIONS}
              fullWidth
            />
          </div>
        }
      />

      <section className="max-h-[calc(100vh-265px)] md:max-h-[calc(100vh-305px)] overflow-y-auto flex flex-col gap-4 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <SectionRow title="Role">
          <Field label="Role">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Role name"
            />
          </Field>
        </SectionRow>

        <Divider />

        <PermissionsMatrix
          rows={MENU_ROWS}
          perms={perms}
          onToggle={togglePerm}
          onToggleAll={toggleAll}
        />
      </section>

      <div
        id="role-detail-footer"
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-line bg-white px-4 md:px-8 py-3"
      >
        {!isNew ? (
          <Button
            variant="outline"
            className="md:w-[140px] !text-[#b42318] !border-[#fca5a5] hover:!bg-[#fef2f2]"
            onClick={() => setConfirm(true)}
          >
            Archive
          </Button>
        ) : (
          <span aria-hidden />
        )}
        <Button className="md:w-[140px]" onClick={() => {}}>
          Save
        </Button>
      </div>

      <Dialog width="max-w-md" open={confirm} onClose={() => setConfirm(false)}>
        <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              Archive Role?
            </h2>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
              <span className="font-semibold text-[#222125]">{role.name}</span>{" "}
              will be archived and can no longer be assigned to new users.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
            <Button
              variant="outline"
              className="md:w-[100px]"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="md:w-[140px] !bg-[#b42318] !text-white hover:!opacity-90"
              onClick={() => setConfirm(false)}
            >
              Archive
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

function PermissionsMatrix({
  rows,
  perms,
  onToggle,
  onToggleAll,
}: {
  rows: MenuRow[];
  perms: PermState;
  onToggle: (key: string, field: PermKey, value: boolean) => void;
  onToggleAll: (key: string, value: boolean) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full md:min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-[14px] font-semibold text-[#1e1e1e]">
            <th className="min-w-[200px] px-4 py-3 font-semibold">Menu</th>
            <th className="w-[80px] px-4 py-3 text-center font-semibold">
              All
            </th>
            <th className="w-[80px] px-4 py-3 text-center font-semibold">
              View
            </th>
            <th className="w-[80px] px-4 py-3 text-center font-semibold">
              Create
            </th>
            <th className="w-[80px] px-4 py-3 text-center font-semibold">
              Edit
            </th>
            <th className="w-[96px] px-4 py-3 text-center font-semibold">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const state = perms[row.key] ?? {
              view: false,
              create: false,
              edit: false,
              delete: false,
            };
            const allChecked = PERM_KEYS.every((k) => state[k]);
            const disabled = !!row.disabled;
            return (
              <tr
                key={row.key}
                className="border-b border-line last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div
                    className={`flex items-center gap-2 text-[14px] text-[#222125] ${
                      row.indent ? "pl-6" : ""
                    }`}
                  >
                    {row.Icon ? (
                      <row.Icon className="size-4 text-[#222125]" aria-hidden />
                    ) : null}
                    <span>{row.label}</span>
                  </div>
                </td>
                <Cell>
                  <PermCheckbox
                    checked={allChecked}
                    disabled={disabled}
                    onChange={(v) => onToggleAll(row.key, v)}
                    ariaLabel={`${row.label} — all permissions`}
                  />
                </Cell>
                {PERM_KEYS.map((k) => (
                  <Cell key={k}>
                    <PermCheckbox
                      checked={state[k]}
                      disabled={disabled}
                      onChange={(v) => onToggle(row.key, k, v)}
                      ariaLabel={`${row.label} — ${k}`}
                    />
                  </Cell>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-center">{children}</td>;
}

function PermCheckbox({
  checked,
  disabled,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={ariaLabel}
      className="size-4 cursor-pointer accent-[#222125] disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
