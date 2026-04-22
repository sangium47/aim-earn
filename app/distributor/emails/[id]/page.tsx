"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dialog,
  Dropdown,
  Input,
  SectionRow,
  PageTitle,
} from "@/components/shared";
import { TrashIcon, XIcon } from "@/components/icons";
import { EMAIL_TEMPLATES, MONTHS, PROMOTIONS } from "@/components/mock";

function formatPeriodDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]},${y}`;
}
import type { EmailTemplateRecord } from "@/components/type";

type EmailForm = {
  name: string;
  title: string;
  content: string;
  promotionId: string;
};

const EMPTY_FORM: EmailForm = {
  name: "",
  title: "",
  content: "",
  promotionId: "",
};

function formFromTemplate(t: EmailTemplateRecord): EmailForm {
  return {
    name: t.name,
    title: t.title,
    content: t.content,
    promotionId: t.promotionId ?? "",
  };
}

export default function EmailDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");
  const isNew = rawId === "new";
  const id = isNew ? "New Template" : rawId;

  const match = useMemo(
    () => (isNew ? undefined : EMAIL_TEMPLATES.find((t) => t.id === rawId)),
    [isNew, rawId],
  );

  const notFound = !isNew && rawId !== "" && !match;

  useEffect(() => {
    if (notFound) router.replace("/distributor/emails");
  }, [notFound, router]);

  const [form, setForm] = useState<EmailForm>(EMPTY_FORM);

  useEffect(() => {
    if (isNew || !match) {
      setForm(EMPTY_FORM);
      return;
    }
    setForm(formFromTemplate(match));
  }, [isNew, match]);

  const promotionOptions = useMemo(
    () => PROMOTIONS.map((p) => ({ label: p.name, value: p.id })),
    [],
  );

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const selectedPromotion = useMemo(
    () => PROMOTIONS.find((p) => p.id === form.promotionId),
    [form.promotionId],
  );

  if (notFound) return null;

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Emails", href: "/distributor/emails" },
          { label: match?.name ?? id },
        ]}
      />
      <PageTitle title={match?.name ?? "New Template"} />

      <div
        id="email-container"
        className="h-[calc(100vh-225px)] md:h-[calc(100vh-295px)] overflow-y-auto w-full bg-white rounded-2xl p-3 md:p-6 flex flex-col gap-3 md:gap-6 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]"
      >
        <SectionRow title="Content">
          <div className="flex flex-col gap-6 items-start w-full">
            <div className="flex flex-col gap-2 items-start w-full">
              <FieldLabel>Template Name</FieldLabel>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Template name"
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <FieldLabel>Title</FieldLabel>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Email subject line"
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <FieldLabel>Content</FieldLabel>
              <Input
                multiline
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Body of the email"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <FieldLabel>Promotion</FieldLabel>
              <Dropdown
                value={form.promotionId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, promotionId: value }))
                }
                options={promotionOptions}
                fullWidth
                position="top"
                placeholder="Select Promotion"
              />
              {selectedPromotion ? (
                <div className="relative mt-1 flex items-start gap-4 p-4 w-full rounded-2xl border border-[#e7e7e7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPromotion.thumbnail}
                    alt={selectedPromotion.name}
                    className="w-[85px] h-[85px] aspect-square shrink-0 object-cover rounded-md"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-[15px] font-medium leading-[1.4] tracking-[0.3px] text-[#222125]">
                      {selectedPromotion.name}
                    </p>
                    <p className="line-clamp-2 text-[13px] font-medium leading-[1.4] tracking-[0.26px] text-[#5f5f5f]">
                      {selectedPromotion.description}
                    </p>
                    <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                      <span className="text-[#222125]">Period :</span>{" "}
                      {formatPeriodDate(selectedPromotion.periodStart)} to{" "}
                      {formatPeriodDate(selectedPromotion.periodEnd)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, promotionId: "" }))
                    }
                    aria-label="Remove promotion"
                    className="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-md text-[#5f5f5f] transition-colors hover:bg-[#f4f5f8] hover:text-[#222125]"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </SectionRow>
      </div>

      <div
        id="email-footer"
        className="flex border border-line justify-between w-full absolute -ml-4 md:-ml-8 bottom-0 px-4 md:px-8 py-2 md:py-4"
      >
        {!isNew ? (
          <Button
            leading={<TrashIcon />}
            className="p-0 bg-transparent"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="flex-1 flex justify-end gap-2 md:gap-4">
          <Button className="w-[120px]" onClick={() => {}}>
            Save
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmDeleteOpen}
        width="max-w-md"
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[18px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              Delete Template?
            </h2>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
              This action will remove the template from the system.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              className="md:w-[120px]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmDeleteOpen(false);
                router.push("/distributor/emails");
              }}
              className="md:w-[140px]"
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[15px] font-medium leading-[1.4] text-[#222125]">
      {children}
    </label>
  );
}
