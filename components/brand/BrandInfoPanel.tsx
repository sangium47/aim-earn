"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Divider, Field, Input, SectionRow } from "@/components/shared";
import { CountryChip, CountrySelect } from "@/components/select-country-form";
import { COUNTRY_NAMES } from "@/components/mock";
import type { Brand } from "@/components/type";

type BrandInfoPanelProps = {
  brand: Brand;
  countries: string[];
  onChangeCountries: (codes: string[]) => void;
  onRemoveCountry: (code: string) => void;
};

const MAX_LOGO_BYTES = 15 * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/jpeg", "image/png"];

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export function BrandInfoPanel({
  brand,
  countries,
  onChangeCountries,
  onRemoveCountry,
}: BrandInfoPanelProps) {
  const [name, setName] = useState(brand.name);
  const [host, setHost] = useState(stripProtocol(brand.website));
  const [contactName, setContactName] = useState(brand.contact.name);
  const [contactPosition, setContactPosition] = useState(brand.contact.position);
  const [contactEmail, setContactEmail] = useState(brand.contact.email);
  const [contactPhone, setContactPhone] = useState(brand.contact.phone);
  const [logoUrl, setLogoUrl] = useState(brand.logoUrl);
  const [logoError, setLogoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Reset form when the underlying brand record changes.
  useEffect(() => {
    setName(brand.name);
    setHost(stripProtocol(brand.website));
    setContactName(brand.contact.name);
    setContactPosition(brand.contact.position);
    setContactEmail(brand.contact.email);
    setContactPhone(brand.contact.phone);
    setLogoUrl(brand.logoUrl);
    setLogoError(null);
  }, [brand]);

  // Revoke any object URL we created when it is replaced or on unmount.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFile = (file: File) => {
    if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
      setLogoError("Logo must be a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo must be 15 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = url;
    setLogoUrl(url);
    setLogoError(null);
  };

  return (
    <section className="max-h-[calc(100vh-305px)] md:max-h-[calc(100vh-355px)] overflow-y-auto flex flex-col gap-3 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
      <SectionRow title="Brand Info">
        <div className="flex flex-col w-full gap-3 md:gap-6">
          {/* Logo row */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="size-[88px] md:size-[104px] shrink-0 overflow-hidden rounded-full bg-[#cdcdcd]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={name || brand.name}
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
                Brand Logo
              </p>
              <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
                JPG or PNG | Max 15MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_LOGO_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  // Allow re-selecting the same file.
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                className="md:w-[140px]"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>
              {logoError ? (
                <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#d92d20]">
                  {logoError}
                </p>
              ) : null}
            </div>
          </div>

          <Field label="Brand Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brand name"
            />
          </Field>

          <Field label="Label">
            <div className="flex h-10 w-full overflow-hidden rounded-lg border border-line bg-white focus-within:border-ink-secondary">
              <div className="flex h-full items-center border-r border-[#cbcfd5] bg-[#f4f5f8] px-4 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]">
                https://
              </div>
              <input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="shop.example.com"
                className="h-full flex-1 bg-white px-4 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125] outline-none placeholder:text-ink-tertiary"
              />
            </div>
          </Field>
        </div>
      </SectionRow>

      <Divider />

      <SectionRow title="Contact Info">
        <div className="flex flex-col gap-3 md:gap-6 w-full">
          <Field label="Name">
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact name"
            />
          </Field>
          <Field label="Position">
            <Input
              value={contactPosition}
              onChange={(e) => setContactPosition(e.target.value)}
              placeholder="Position"
            />
          </Field>
          <div className="flex flex-col gap-4 md:flex-row md:gap-4">
            <Field label="Email" className="flex-1">
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </Field>
            <Field label="Phone Number" className="flex-1">
              <Input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+00 0000 0000"
              />
            </Field>
          </div>
        </div>
      </SectionRow>

      <Divider />

      <SectionRow
        title="Country's Affiliates"
        hint="Select to specify which country's Affiliates are allowed to sell this brand's products"
      >
        <div className="flex flex-col gap-3 w-full ">
          <Field label="Country's Affiliates">
            <CountrySelect
              value={countries}
              onChange={onChangeCountries}
              placeholder="Select Country"
              maxSelection={10}
              position="top"
            />
          </Field>
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
      </SectionRow>
    </section>
  );
}
