"use client";

import { ArrowUpRight } from "lucide-react";
import { Button, Field, Input } from "@/components/shared";
import { CountryChip, CountrySelect } from "@/components/select-country-form";
import { COUNTRY_NAMES } from "@/components/mock";
import type { Distributor } from "@/components/type";

type ProfilePanelProps = {
  member: Distributor;
  first: string;
  last: string;
  countries: string[];
  onRemoveCountry: (code: string) => void;
  onChangeCountries: (codes: string[]) => void;
};

export function ProfilePanel({
  member,
  first,
  last,
  countries,
  onRemoveCountry,
  onChangeCountries,
}: ProfilePanelProps) {
  return (
    <section className="max-h-[calc(100vh-305px)] md:max-h-[calc(100vh-355px)] overflow-y-auto flex flex-col gap-6 rounded-2xl border border-[#cbcfd5] bg-white p-4 md:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
        {/* Profile image column */}
        <div className="flex w-full flex-col items-center gap-4 md:w-[276px]">
          <div className="size-[160px] md:size-[206px] overflow-hidden rounded-full bg-[#cbcfd5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.pravatar.cc/256?img=12"
              alt="Profile"
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
              Profile Image
            </p>
            <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
              JPG or PNG | Max 15MB
            </p>
          </div>
          <Button variant="outline" className="md:w-[120px]">
            Edit Photo
          </Button>
        </div>

        {/* Form column */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Field label="First Name">
            <Input value={first} disabled readOnly />
          </Field>
          <Field label="Last Name">
            <Input value={last} disabled readOnly />
          </Field>
          <Field label="Countries">
            <div className="flex w-full flex-col gap-2">
              <CountrySelect
                value={countries}
                onChange={onChangeCountries}
                placeholder="Select Country"
                maxSelection={10}
              />
              {countries.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {countries.map((code) => (
                    <CountryChip
                      key={code}
                      label={COUNTRY_NAMES[code] ?? code}
                      onRemove={() => onRemoveCountry(code)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </Field>
        </div>
      </div>

      {member.inviter || member.distributor ? (
        <>
          {/* Divider between the profile form and the info grid */}
          <hr className="border-0 border-t border-[#e7e7e7]" />

          {/* Info cards — 2-column grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {member.inviter ? (
              <InfoCard
                label="Inviter"
                value={member.inviter.name}
                hint={member.inviter.code}
                linkable
              />
            ) : null}
            {member.distributor ? (
              <InfoCard
                label="Distributor"
                value={member.distributor.name}
                hint={member.distributor.code}
                linkable
              />
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
  hint?: string;
  linkable?: boolean;
};

function InfoCard({ label, value, hint, linkable = false }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-[#f5f5f5] p-4">
      <p className="text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#1e1e1e]">
        {label}
      </p>
      <div className="flex w-full items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
          {value}
        </p>
        {linkable ? (
          <ArrowUpRight
            className="size-5 shrink-0 text-[#222125]"
            aria-hidden
          />
        ) : null}
      </div>
      {hint ? (
        <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

