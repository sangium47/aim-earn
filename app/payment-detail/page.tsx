"use client";

/**
 * Payment Details — Outside Thailand
 *
 * Drop-in Next.js (App Router) component using Tailwind CSS + lucide-react.
 * Source: Figma node 137-56275 (kUcUVBDuAMEPjvqpqAGkIO).
 *
 * Usage:
 *   - As a page: place at `app/payment-details/page.tsx` and re-export as default.
 *   - As a component: `import PaymentDetailsPage from "@/components/PaymentDetailsPage"`.
 *
 * Fonts: the design uses "Urbanist" (Medium/SemiBold) for most text and "Inter"
 * for table headers. Wire these through `next/font/google` in `app/layout.tsx`:
 *
 *   import { Urbanist, Inter } from "next/font/google";
 *   const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });
 *   const inter    = Inter({    subsets: ["latin"], variable: "--font-inter"    });
 *   // then add `${urbanist.variable} ${inter.variable}` to <html> or <body>.
 *
 * Dependencies:
 *   npm i lucide-react
 */

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, ChevronDown, Copy, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const COMPANY = {
  name: "Aimearn CO., LTD.",
  email: "support@aimearn.com",
  phone: "+65 092 9222",
  address: "123 Thanon Sukhumvit, Bangkok",
};

const BANK_DETAILS = [
  { label: "Bank Name:", value: "Kasikornbank", withLogo: true },
  { label: "SWIFT:", value: "KASITHBK" },
  { label: "Account Name:", value: "Aimearn CO., LTD." },
  { label: "Account Number:", value: "123-4-56789-0" },
] as const;

const COUNTRIES = [
  { name: "Malaysia", price: "$999" },
  { name: "Philippines", price: "$999" },
];

const TOTALS = {
  subtotal: "$1899",
  vat: "$189.9",
  total: "$2088.9",
};

const CUSTOMER = {
  name: "Alex  Johnson",
  email: "alex@example.com",
};

/* -------------------------------------------------------------------------- */
/*  Small sub-components                                                       */
/* -------------------------------------------------------------------------- */

type CopyableRowProps = {
  label: string;
  value: string;
  leading?: ReactNode;
};

function CopyableRow({ label, value, leading }: CopyableRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — fail silently */
    }
  };

  return (
    <div className="flex w-full items-start justify-between gap-4">
      <p className="shrink-0 text-base leading-[1.4] tracking-[0.02em] text-[#757575]">
        {label}
      </p>
      <div className="flex min-w-0 items-center gap-2">
        {leading}
        <p className="truncate text-base leading-[1.4] tracking-[0.02em] text-[#222125]">
          {value}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label.replace(/:$/, "")}`}
          className="flex size-4 shrink-0 items-center justify-center text-[#222125] transition-colors hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b1610c] focus-visible:ring-offset-2"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}

type LabeledInputProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
};

function LabeledInput({
  id,
  label,
  placeholder,
  type = "text",
}: LabeledInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-base leading-[1.4] tracking-[0.02em] text-[#222125]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-[46px] w-full rounded-lg border border-[#e7e7e7] bg-[#f4f5f8] px-4 py-3 text-[15px] leading-none tracking-[0.02em] text-[#222125] placeholder:text-[#878787] focus:outline-none focus:ring-2 focus:ring-[#f8d237]"
      />
    </div>
  );
}

type SectionHeadingProps = {
  number: number;
  title: string;
  subtitle?: string;
};

function SectionHeading({ number, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline gap-1.5 text-[15px] font-medium leading-none tracking-[0.02em] text-[#222125]">
        <span>{number}.</span>
        <span>{title}</span>
      </div>
      {subtitle ? (
        <p className="text-sm leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ThailandFlag() {
  return (
    <svg
      viewBox="0 0 18 12"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-[12px] w-[18px] shrink-0 overflow-hidden rounded-[1px]"
    >
      <rect width="18" height="2" y="0" fill="#ED1B24" />
      <rect width="18" height="1" y="2" fill="#fff" />
      <rect width="18" height="6" y="3" fill="#241D4F" />
      <rect width="18" height="1" y="9" fill="#fff" />
      <rect width="18" height="2" y="10" fill="#ED1B24" />
    </svg>
  );
}

/** Simple inline placeholder for the Kasikornbank logo glyph (K mark).
 *  Replace with an actual `<Image src="/figma/kasikornbank.png" />`
 *  once the asset is added to `public/figma/`. */
function BankMark() {
  return (
    <span
      aria-hidden
      className="inline-flex h-[17px] w-[16px] items-center justify-center rounded-[2px] bg-[#138f2d] text-[10px] font-bold leading-none text-white"
    >
      K
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PaymentDetailsPage() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/payment-detail/submitted");
  };

  return (
    <main className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center gap-6 md:gap-12 px-4 py-8 sm:px-6 md:px-12 md:py-20 lg:px-40 lg:py-24">
        {/* -------- Header -------- */}
        <header className="flex w-full flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
            Payment Details
          </h1>
          <p className="max-w-[442px] text-center text-base leading-[1.4] tracking-[0.02em] text-[#757575]">
            Please review the invoice details below and complete the payment
            using the appropriate method.
          </p>
        </header>

        {/* -------- Two-column content -------- */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,639px)_minmax(0,1fr)]">
          {/* ============================================================== */}
          {/*  LEFT — Form card                                              */}
          {/* ============================================================== */}
          <section className="flex flex-col items-center justify-center gap-8 rounded-2xl border border-[#e7e7e7] p-6">
            {/* Company header + contact */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <div
                  aria-hidden
                  className="size-[35.461px] shrink-0 rounded-full bg-[#e5e5e5]"
                />
                <h2 className="text-xl font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                  {COMPANY.name}
                </h2>
              </div>

              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-2">
                  <Mail
                    className="size-4 shrink-0 text-[#222125]"
                    aria-hidden
                  />
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-base leading-[1.4] tracking-[0.02em] text-[#222125] hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    className="size-4 shrink-0 text-[#222125]"
                    aria-hidden
                  />
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s+/g, "")}`}
                    className="text-base leading-[1.4] tracking-[0.02em] text-[#222125] hover:underline"
                  >
                    {COMPANY.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin
                    className="size-4 shrink-0 text-[#222125]"
                    aria-hidden
                  />
                  <p className="text-base leading-[1.4] tracking-[0.02em] text-[#222125]">
                    {COMPANY.address}
                  </p>
                </li>
              </ul>
            </div>

            <hr className="w-full border-t border-[#e7e7e7]" />

            {/* 1. Company Details */}
            <div className="flex w-full flex-col gap-5">
              <SectionHeading number={1} title="Company Details" />
              <LabeledInput
                id="company-name"
                label="Company/Trading Name"
                placeholder="Enter Company/Trading Name"
              />
              <LabeledInput
                id="tax-id"
                label="Tax ID"
                placeholder="Ente Tax ID"
              />
            </div>

            {/* 2. Bank Details */}
            <div className="flex w-full flex-col gap-5">
              <SectionHeading
                number={2}
                title="Bank Details"
                subtitle="Please include the following reference in your transfer to avoid payment delay."
              />

              {/* Country select */}
              <div className="flex w-full flex-col gap-2">
                <label
                  htmlFor="country"
                  className="text-base leading-[1.4] tracking-[0.02em] text-[#222125]"
                >
                  Select your Country
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <ThailandFlag />
                  </span>
                  <select
                    id="country"
                    defaultValue="Thailand"
                    className="h-[50px] w-full appearance-none rounded-lg border border-[#e7e7e7] bg-white pl-11 pr-10 text-[15px] leading-none tracking-[0.02em] text-[#222125] focus:outline-none focus:ring-2 focus:ring-[#f8d237]"
                  >
                    <option>Thailand</option>
                    <option>Malaysia</option>
                    <option>Philippines</option>
                    <option>Singapore</option>
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#222125]"
                  />
                </div>
              </div>

              {/* Bank details panel */}
              <div className="flex w-full flex-col gap-8 rounded-2xl bg-[#f5f5f5] p-4">
                {BANK_DETAILS.map((row) => (
                  <CopyableRow
                    key={row.label}
                    label={row.label}
                    value={row.value}
                    leading={
                      "withLogo" in row && row.withLogo ? (
                        <BankMark />
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </div>

            {/* 3. Upload Payment Slip */}
            <div className="flex w-full flex-col gap-4">
              <SectionHeading number={3} title="Upload Payment Slip" />
              <div className="flex w-full items-end gap-2">
                <label
                  htmlFor="payment-slip"
                  className="flex h-[46px] flex-1 cursor-pointer items-center rounded-lg border border-[#e7e7e7] bg-[#f4f5f8] px-4 py-3"
                >
                  <span className="flex-1 truncate text-[15px] leading-none tracking-[0.02em] text-[#878787]">
                    Upload payment slip
                  </span>
                  <input
                    id="payment-slip"
                    type="file"
                    className="sr-only"
                    accept="image/*,application/pdf"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("payment-slip")?.click()
                  }
                  className="flex min-w-[100px] h-[46px] items-center justify-center gap-2 rounded-lg bg-[#f8d237] p-3 text-[15px] font-medium leading-none tracking-[0.02em] text-[#441f04] transition-colors hover:bg-[#f4c91a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b1610c] focus-visible:ring-offset-2"
                >
                  Upload
                </button>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/*  RIGHT — Summary + Submit                                      */}
          {/* ============================================================== */}
          <aside className="flex flex-col items-stretch gap-8 lg:items-end">
            <div className="flex w-full flex-col gap-4">
              <h2 className="flex h-10 w-full items-center text-2xl font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
                Summary
              </h2>

              {/* Customer */}
              <div className="flex w-full flex-col gap-1">
                <p className="text-[15px] font-medium leading-none tracking-[0.02em] text-[#1e1e1e]">
                  {CUSTOMER.name}
                </p>
                <p className="text-base leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                  {CUSTOMER.email}
                </p>
              </div>

              {/* Countries table */}
              <div className="w-full overflow-hidden rounded-2xl border border-[#d9d9d9]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#cbcfd5] bg-[#f5f5f5]">
                      <th
                        scope="col"
                        className="px-4 py-2 text-left align-middle font-[family-name:var(--font-inter,'Inter',sans-serif)] text-sm font-medium leading-5 tracking-[-0.0094em] text-[#1e1e1e]"
                      >
                        Country
                      </th>
                      <th
                        scope="col"
                        className="w-[119px] px-4 py-2 text-left align-middle font-[family-name:var(--font-inter,'Inter',sans-serif)] text-sm font-medium leading-5 tracking-[-0.0094em] text-[#1e1e1e]"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES.map((c, i) => (
                      <tr
                        key={c.name}
                        className={
                          i < COUNTRIES.length - 1
                            ? "border-b border-[#e7e7e7]"
                            : ""
                        }
                      >
                        <td className="px-4 py-4 align-top text-base leading-[1.4] tracking-[0.02em] text-[#222125]">
                          {c.name}
                        </td>
                        <td className="px-4 py-4 align-top text-base leading-[1.4] tracking-[0.02em] text-[#222125]">
                          {c.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex w-full flex-col gap-4 rounded-2xl bg-[#f5f5f5] px-6 py-3">
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm font-semibold leading-[1.4] tracking-[0.02em] text-[#434343]">
                    Subtotal :
                  </p>
                  <p className="text-[15px] font-medium leading-none tracking-[0.02em] text-[#434343]">
                    {TOTALS.subtotal}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm font-semibold leading-[1.4] tracking-[0.02em] text-[#434343]">
                    Vat 10% :
                  </p>
                  <p className="text-[15px] font-medium leading-none tracking-[0.02em] text-[#434343]">
                    {TOTALS.vat}
                  </p>
                </div>
                <div className="flex w-full items-start justify-between">
                  <p className="text-xl font-medium leading-[1.2] tracking-[0.02em] text-[#434343]">
                    Total Amount :
                  </p>
                  <p className="text-xl font-medium leading-[1.2] tracking-[0.02em] text-[#434343] whitespace-nowrap">
                    {TOTALS.total}
                  </p>
                </div>
                <p className="w-full whitespace-pre-wrap text-xs leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                  <span>* Please remit the payment in </span>
                  <span className="text-[#222125]">USD</span>
                  <span>
                    {" "}
                    only to our Thai bank account.
                    <br /> All bank charges must be borne by the sender (OUR).
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex min-w-[100px] items-center justify-center gap-2 self-stretch rounded-lg bg-[#f8d237] p-3 text-[15px] font-medium leading-none tracking-[0.02em] text-[#441f04] transition-colors hover:bg-[#f4c91a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b1610c] focus-visible:ring-offset-2 sm:w-[117px] sm:self-end"
            >
              Submit
            </button>
          </aside>
        </div>

        {/* -------- Footer note -------- */}
        <p className="w-full text-base leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
          <span className="text-[#222125]">Note </span>
          <span>
            : Using a new company detail by adding more difference countries,
            could be done after the first registration successfully.
          </span>
        </p>
      </div>
    </main>
  );
}
