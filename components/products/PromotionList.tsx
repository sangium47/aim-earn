"use client";

import { useState } from "react";
import { AddPromotionButton } from "./AddPromotionButton";
import { AddPromotionDialog } from "./AddPromotionDialog";
import { PromotionRow } from "./PromotionRow";
import type { Promotion } from "@/components/type";

type PromotionsListProps = {
  promotions: Promotion[];
  /** Position of the Add button. Defaults to "top" to match Figma. */
  addButtonPosition?: "top" | "bottom";
  emptyState?: React.ReactNode;
  /** When false, hides the "Add Promotion" button. Defaults to true. */
  canAdd?: boolean;
  /** When false, hides the delete button on each promotion row. Defaults to true. */
  canRemove?: boolean;
};

/**
 * Full promotions list: "Add Promotion" CTA followed by the list of
 * promotion rows (Figma node 4020:27368).
 *
 * Presentational only — list state lives in the parent so it can be
 * wired to whatever server/cache layer the app uses.
 */
export function PromotionsList({
  promotions,
  addButtonPosition = "top",
  emptyState,
  canAdd = true,
  canRemove = true,
}: PromotionsListProps) {
  const [addOpen, setAddOpen] = useState(false);

  const onAdd = () => setAddOpen(true);
  const onDelete = () => {};

  const addButton = canAdd ? <AddPromotionButton onClick={onAdd} /> : null;

  return (
    <div className="flex flex-col gap-4">
      {addButtonPosition === "top" && addButton}
      {promotions.length === 0
        ? (emptyState ?? <></>)
        : promotions.map((promotion) => (
            <PromotionRow
              key={promotion.id}
              promotion={promotion}
              onDelete={canRemove ? onDelete : undefined}
            />
          ))}

      {addButtonPosition === "bottom" && addButton}

      {canAdd && (
        <AddPromotionDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          promotions={promotions}
        />
      )}
    </div>
  );
}

export default PromotionsList;
