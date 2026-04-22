"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Upload } from "lucide-react";
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
import { ANNOUNCEMENTS, COUNTRY_OPTIONS } from "@/components/mock";
import type { Announcement } from "@/components/type";

const NEW_ANNOUNCEMENT_ID = "new";

const DEFAULT_NEW: Announcement = {
  id: NEW_ANNOUNCEMENT_ID,
  title: "",
  targetAudience: "",
  publishDate: "",
  status: "draft",
  createdBy: "",
  createdDate: "",
};

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "ไทย (Thai)", value: "th" },
  { label: "Bahasa Melayu", value: "ms" },
  { label: "Tiếng Việt", value: "vi" },
  { label: "Bahasa Indonesia", value: "id" },
];

const TARGETS = [
  { key: "distributors", label: "Distributors" },
  { key: "affiliates", label: "Affiliates" },
] as const;

type TargetKey = (typeof TARGETS)[number]["key"];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export default function AdminAnnouncementDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const isNew = rawId === NEW_ANNOUNCEMENT_ID;
  const announcement = useMemo<Announcement | undefined>(() => {
    if (isNew) return DEFAULT_NEW;
    return ANNOUNCEMENTS.find((a) => a.id === rawId);
  }, [isNew, rawId]);
  const notFound = !isNew && rawId !== "" && !announcement;

  useEffect(() => {
    if (notFound) router.replace("/admin/announcement");
  }, [notFound, router]);

  const [title, setTitle] = useState(announcement?.title ?? "");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [targets, setTargets] = useState<Record<TargetKey, boolean>>({
    distributors: true,
    affiliates: true,
  });
  const [country, setCountry] = useState("all");
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const imagePreviewRef = useRef<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!announcement) return;
    setTitle(announcement.title);
    setMessage("");
    setPeriodStart("");
    setPeriodEnd("");
    setTargets({ distributors: true, affiliates: true });
    setCountry("all");
    setScheduled(false);
    setScheduleDate(announcement.publishDate);
    setScheduleTime("");
    setImage(null);
    setImagePreview(null);
    setImageError(null);
  }, [announcement]);

  useEffect(() => {
    return () => {
      if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    };
  }, []);

  if (notFound || !announcement) return null;

  const handleImage = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Supported file types: .jpg or .png");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 15 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    imagePreviewRef.current = url;
    setImage(file);
    setImagePreview(url);
    setImageError(null);
  };

  const displayTitle = isNew ? "New Announcement" : announcement.title;

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8 md:pb-[96px]">
      <Breadcrumb
        items={[
          { label: "Announcement", href: "/admin/announcement" },
          { label: displayTitle },
        ]}
      />

      <PageTitle title="Announcement" />

      <section className="max-h-[calc(100vh-245px)] md:max-h-[calc(100vh-285px)] overflow-y-auto flex flex-col gap-4 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <SectionRow title="Content">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <Field label="Title">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
              />
            </Field>
            <Field label="Message">
              <Input
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Message"
              />
            </Field>
            <Field label="Language">
              <Dropdown
                value={language}
                onChange={setLanguage}
                options={LANGUAGE_OPTIONS}
                placeholder="Select Language"
                fullWidth
              />
            </Field>
            <Field label="Period">
              <div className="flex items-center gap-3">
                <DateField
                  value={periodStart}
                  onChange={setPeriodStart}
                  placeholder="Start Date"
                />
                <span className="text-[14px] text-[#5f5f5f]">–</span>
                <DateField
                  value={periodEnd}
                  onChange={setPeriodEnd}
                  placeholder="End Date"
                />
              </div>
            </Field>
          </div>
        </SectionRow>

        <Divider />

        <SectionRow title="Image" hint="(optional)">
          <Field label="Import Image">
            <div className="flex flex-col gap-2">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleImage(f);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                  dragActive
                    ? "border-[#796100] bg-[#fdf7e4]"
                    : "border-[#d9d9d9] bg-white hover:border-[#796100]/60 hover:bg-[#fdf7e4]/40"
                }`}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImage(f);
                    e.target.value = "";
                  }}
                />
                <Upload className="size-5 text-[#222125]" aria-hidden />
                <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
                  Click or Drag file to this area to upload
                </p>
                <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#878787]">
                  Supported file types: .jpg or .png
                </p>
              </label>
              {image && imagePreview ? (
                <div className="flex items-center gap-3 rounded-lg border border-line bg-white p-2">
                  <div className="size-12 shrink-0 overflow-hidden rounded-md bg-[#f4f5f8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt={image.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <p className="truncate text-[13px] font-medium text-[#222125]">
                    {image.name}
                  </p>
                </div>
              ) : null}
              {imageError ? (
                <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#d92d20]">
                  {imageError}
                </p>
              ) : null}
            </div>
          </Field>
        </SectionRow>

        <Divider />

        <SectionRow title="Target Audience">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <Field label="Target">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-3">
                {TARGETS.map((t) => (
                  <label
                    key={t.key}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-4 py-3 transition-colors ${
                      targets[t.key]
                        ? "border-[#222125]"
                        : "border-line hover:border-[#cbcfd5]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targets[t.key]}
                      onChange={(e) =>
                        setTargets((prev) => ({
                          ...prev,
                          [t.key]: e.target.checked,
                        }))
                      }
                      className="size-4 accent-[#222125] cursor-pointer"
                    />
                    <span className="text-[15px] font-medium text-[#222125]">
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Country">
              <Dropdown
                value={country}
                onChange={setCountry}
                options={COUNTRY_OPTIONS}
                placeholder="Select Country"
                fullWidth
              />
            </Field>
          </div>
        </SectionRow>

        <Divider />

        <SectionRow title="Publish Date">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                className="size-4 accent-[#222125] cursor-pointer"
              />
              <span className="text-[15px] font-medium text-[#222125]">
                Set Schedule
              </span>
            </label>
            {scheduled ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <Field label="Date">
                  <DateField
                    value={scheduleDate}
                    onChange={setScheduleDate}
                    placeholder="Start Date"
                  />
                </Field>
                <Field label="Time">
                  <TimeField
                    value={scheduleTime}
                    onChange={setScheduleTime}
                    placeholder="Start Date"
                  />
                </Field>
              </div>
            ) : null}
          </div>
        </SectionRow>
      </section>

      <div
        id="announcement-detail-footer"
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-line bg-white px-4 md:px-8 py-3"
      >
        {!isNew ? (
          <Button
            variant="outline"
            className="md:w-[140px] !text-[#b42318] !border-[#fca5a5] hover:!bg-[#fef2f2]"
            onClick={() => setConfirm(true)}
          >
            Delete
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
              Delete Announcement?
            </h2>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
              <span className="font-semibold text-[#222125]">
                {announcement.title || displayTitle}
              </span>{" "}
              will be permanently deleted and can no longer be sent.
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
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

function DateField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <span className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg bg-[#f4f5f8] px-3 text-[15px] font-medium text-[#222125]">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full flex-1 min-w-0 bg-transparent outline-none placeholder:text-[#878787]"
      />
      <Calendar className="size-4 text-[#5f5f5f]" aria-hidden />
    </span>
  );
}

function TimeField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <span className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg bg-[#f4f5f8] px-3 text-[15px] font-medium text-[#222125]">
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full flex-1 min-w-0 bg-transparent outline-none placeholder:text-[#878787]"
      />
      <Calendar className="size-4 text-[#5f5f5f]" aria-hidden />
    </span>
  );
}
