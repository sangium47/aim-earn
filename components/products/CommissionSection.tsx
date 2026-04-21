"use client";

import { useState } from "react";
import { Tabs } from "@/components/shared/Tabs";
import {
  CountryCommissionRow,
  type CountryCommission,
} from "./CountryCommissionRow";
import PromotionsList from "./PromotionList";

type TabKey = "commission" | "promotion" | "media";

type CommissionSectionProps = {
  commissions: CountryCommission[];
  promotions?: any[] | null | undefined;
  /** When false, hides the "Add Promotion" button. Defaults to true. */
  canAdd?: boolean;
  /** When false, hides the delete button on each promotion row. Defaults to true. */
  canRemove?: boolean;
};

/**
 * Tabs + per-tab content. The "Commission" tab renders the country rows;
 * Promotion and Media are slotted — pass them if you want to fill them,
 * otherwise a simple placeholder is shown.
 */
export function CommissionSection({
  commissions,
  promotions,
  canAdd = true,
  canRemove = true,
}: CommissionSectionProps) {
  const [tab, setTab] = useState<TabKey>("commission");

  return (
    <div className="flex flex-col gap-4">
      <Tabs<TabKey>
        items={[
          { value: "commission", label: "Commission" },
          { value: "promotion", label: "Promotion" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "commission" && (
        <div className="flex flex-col gap-4">
          {commissions.map((row) => (
            <CountryCommissionRow key={row.country} data={row} />
          ))}
        </div>
      )}

      {tab === "promotion" && (
        <div className="flex flex-col gap-4">
          <PromotionsList
            promotions={promotions || []}
            canAdd={canAdd}
            canRemove={canRemove}
          />
        </div>
      )}
    </div>
  );
}

export default CommissionSection;
