import { Mail, Phone } from "lucide-react";
import { COUNTRY_NAMES } from "@/components/mock";
import type { Customer } from "@/components/type";

type CustomerHeaderProps = {
  customer: Customer;
};

/**
 * Shared description block for the Customer detail `PageTitle`.
 *
 * Used on:
 *   - /affiliate/customers/direct/[id]
 *   - /affiliate/customers/affiliate/[id]
 *   - /distributor/customers/direct/[id]
 *   - /distributor/customers/affiliate/[id]
 *
 * Pass as the `description` prop of `<PageTitle>`.
 */
export function CustomerHeader({ customer }: CustomerHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
        {customer.code ? (
          <span className="inline-flex text-ink-heading items-center gap-1.5">
            {customer.code}
          </span>
        ) : null}
        <span className="inline-flex text-ink-heading items-center gap-1.5">
          <Mail className="size-4 text-ink-heading" aria-hidden />
          {customer.email}
        </span>
        <span className="inline-flex text-ink-heading items-center gap-1.5">
          <Phone className="size-4 text-ink-heading" aria-hidden />
          {customer.phone}
        </span>
      </div>
      <span className="inline-flex items-center gap-1.5">
        {COUNTRY_NAMES[customer.country] ?? customer.country}
      </span>
    </div>
  );
}
