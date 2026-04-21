"use client";

import { useRef, useState } from "react";
import { User } from "lucide-react";
import { Button, Card, Input, PageTitle } from "@/components/shared";
import { CountryChip, findCountry } from "@/components/select-country-form";

const PROFILE = {
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@aimearn.com",
  countries: ["SG", "TH", "MY"],
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[15px] font-medium leading-[1.4] text-[#222125]">
      {children}
    </label>
  );
}

export default function ProfilePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <PageTitle title="Profile" />

      <Card className="flex flex-col gap-6 p-4 md:p-8 md:flex-row md:gap-12">
        {/* Profile image column */}
        <div className="flex shrink-0 flex-col items-start gap-3 md:w-[280px]">
          <div className="flex flex-col items-center gap-3 self-center">
            <div className="flex size-[200px] items-center justify-center overflow-hidden rounded-full border border-[#e7e7e7] bg-[#f4f5f8] text-[#5a5a5a]">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-20" aria-hidden />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-[14px] md:text-[16px] text-center font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                Profile Image
              </h2>
              <p className="text-[12px] font-medium text-center leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
                JPG or PNG | Max 15MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="md:w-[160px]"
            >
              Edit Photo
            </Button>
          </div>
        </div>

        {/* Form column */}
        <div className="flex flex-1 min-w-0 flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <FieldLabel>First Name</FieldLabel>
            <Input value={PROFILE.firstName} disabled readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Last Name</FieldLabel>
            <Input value={PROFILE.lastName} disabled readOnly />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Email</FieldLabel>
            <Input value={PROFILE.email} disabled readOnly type="email" />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Countries</FieldLabel>
            <div className="flex flex-wrap items-start gap-2 min-h-10 rounded-lgp-2">
              {PROFILE.countries.map((code) => {
                const country = findCountry(code);
                return <CountryChip key={code} label={country?.name ?? code} />;
              })}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
