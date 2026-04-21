"use client";

import { useState } from "react";
import { AddPromotionButton } from "./AddPromotionButton";
import { AddPromotionDialog } from "./AddPromotionDialog";
import { PromotionRow, type Promotion } from "./PromotionRow";

type PromotionsListProps = {
  promotions: Promotion[];
  /** Position of the Add button. Defaults to "top" to match Figma. */
  addButtonPosition?: "top" | "bottom";
  emptyState?: React.ReactNode;
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
}: PromotionsListProps) {
  const [addOpen, setAddOpen] = useState(false);

  const onAdd = () => setAddOpen(true);
  const onDelete = () => {};

  const addButton = <AddPromotionButton onClick={onAdd} />;

  return (
    <div className="flex flex-col gap-4">
      {addButtonPosition === "top" && addButton}
      {promotions.length === 0
        ? (emptyState ?? <></>)
        : promotions.map((promotion) => (
            <PromotionRow
              key={promotion.id}
              promotion={promotion}
              onDelete={onDelete}
            />
          ))}

      {addButtonPosition === "bottom" && addButton}

      <AddPromotionDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        promotions={promotions}
      />
    </div>
  );
}

export default PromotionsList;
