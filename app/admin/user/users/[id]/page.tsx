"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dialog,
  Dropdown,
  Field,
  Input,
  PageTitle,
} from "@/components/shared";
import { ADMIN_ROLES, ADMIN_USERS } from "@/components/mock";
import type { AdminUser, DistributorStatus } from "@/components/type";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const NEW_USER_ID = "new";

const DEFAULT_NEW_USER: AdminUser = {
  id: NEW_USER_ID,
  firstName: "",
  lastName: "",
  email: "",
  role: ADMIN_ROLES[0]?.name ?? "Admin",
  status: "active",
};

const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png"];
const MAX_AVATAR_BYTES = 15 * 1024 * 1024;

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const isNew = rawId === NEW_USER_ID;
  const user = useMemo<AdminUser | undefined>(() => {
    if (isNew) return DEFAULT_NEW_USER;
    return ADMIN_USERS.find((u) => u.id === rawId);
  }, [isNew, rawId]);
  const notFound = !isNew && rawId !== "" && !user;

  useEffect(() => {
    if (notFound) router.replace("/admin/user/users");
  }, [notFound, router]);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? DEFAULT_NEW_USER.role);
  const [status, setStatus] = useState<DistributorStatus>(
    user?.status ?? "active",
  );
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user && !isNew
      ? `https://i.pravatar.cc/240?u=${encodeURIComponent(user.id)}`
      : "",
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setAvatarUrl(
      isNew ? "" : `https://i.pravatar.cc/240?u=${encodeURIComponent(user.id)}`,
    );
    setAvatarError(null);
  }, [user, isNew]);

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current)
        URL.revokeObjectURL(avatarObjectUrlRef.current);
    };
  }, []);

  if (notFound || !user) return null;

  const handleAvatar = (file: File) => {
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Avatar must be a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Avatar must be 15 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    if (avatarObjectUrlRef.current)
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    avatarObjectUrlRef.current = url;
    setAvatarUrl(url);
    setAvatarError(null);
  };

  const displayName =
    `${firstName} ${lastName}`.trim() ||
    (isNew ? "New User" : `${user.firstName} ${user.lastName}`.trim());

  const roleOptions = ADMIN_ROLES.map((r) => ({
    label: r.name,
    value: r.name,
  }));

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8 md:pb-[96px]">
      <Breadcrumb
        items={[
          { label: "User" },
          { label: "Users", href: "/admin/user/users" },
          { label: displayName },
        ]}
      />

      <PageTitle
        className="!flex-row justify-between items-center"
        title={displayName}
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

      <section className="max-h-[calc(100vh-265px)] md:max-h-[calc(100vh-305px)] overflow-y-auto flex flex-col gap-6 rounded-2xl bg-white p-4 md:p-6 md:flex-row md:items-start md:gap-10 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <div className="flex shrink-0 flex-col items-center md:items-start gap-3">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            aria-label="Upload avatar"
            className="group relative size-[140px] md:size-[200px] shrink-0 overflow-hidden rounded-full bg-[#cdcdcd] ring-1 ring-[#e7e7e7] transition-shadow hover:ring-2 hover:ring-[#f8d237]"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-[28px] font-semibold text-white">
                {(firstName[0] ?? "?").toUpperCase()}
              </span>
            )}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Change photo
            </span>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept={ACCEPTED_AVATAR_TYPES.join(",")}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatar(file);
              e.target.value = "";
            }}
          />
          {avatarError ? (
            <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#d92d20]">
              {avatarError}
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-4">
          <Field label="First Name">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </Field>
          <Field label="Last Name">
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </Field>
          <Field label="Role">
            <Dropdown
              value={role}
              onChange={setRole}
              options={roleOptions}
              fullWidth
            />
          </Field>
        </div>
      </section>

      <div
        id="user-detail-footer"
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
              Archive User?
            </h2>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
              <span className="font-semibold text-[#222125]">
                {displayName}
              </span>{" "}
              will lose access immediately and be hidden from the active user
              list.
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
