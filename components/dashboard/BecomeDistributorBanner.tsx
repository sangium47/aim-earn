"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

export function BecomeDistributorBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleApply = () => {
    router.push(
      `/register-distributor?page=${encodeURIComponent(pathname ?? "/")}`,
    );
  };

  return (
    <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-32 rounded-xl bg-[#e6e6e6] py-4 md:py-8 pl-6 pr-10 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-[15px] font-medium leading-none tracking-[0.02em] text-[#222125]">
          Become a Distributor
        </p>
        <p className="text-sm font-medium leading-[1.4] tracking-[0.02em] text-[#222125]">
          If you would like to become a distributor, simply sign up here and
          select the
          <br />
          country you wish to join.
        </p>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="inline-flex min-w-[100px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f8d237] p-3 text-[15px] font-medium leading-none tracking-[0.02em] text-[#441f04] hover:bg-[#ebc422]"
      >
        Apply Now
      </button>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-2.5 top-2.5 md:top-4 md:right-3 inline-flex size-4 items-center justify-center text-[#222125] hover:opacity-70"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
