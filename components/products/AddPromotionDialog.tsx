"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Dialog } from "@/components/shared";
import { MegaphoneIcon, SearchIcon } from "@/components/icons";
import type { Promotion } from "@/components/type";

type AddPromotionDialogProps = {
  open: boolean;
  onClose: () => void;
  promotions: Promotion[];
  onSubmit?: (promotion: Promotion) => void;
};

export function AddPromotionDialog({
  open,
  onClose,
  promotions,
  onSubmit,
}: AddPromotionDialogProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<Promotion | null>(null);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset local state whenever the dialog closes so the next open starts fresh.
  useEffect(() => {
    if (!open) {
      setDropdownOpen(false);
      setSelected(null);
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return promotions;
    return promotions.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [promotions, search]);

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit?.(selected);
    onClose();
  };

  return (
    <Dialog width="max-w-lg" open={open} onClose={onClose}>
      <section
        aria-label="Add Promotion"
        className="rounded-2xl p-3 md:p-4 flex flex-col gap-3 md:gap-6 items-start shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]"
      >
        <div className="flex-auto flex flex-col gap-6 w-full">
          <h2 className="text-[24px] font-medium leading-[1.2] tracking-[0.48px] text-[#1e1e1e] w-full">
            Add Promotion
          </h2>
          <div ref={dropdownRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              className="bg-[#f4f5f8] flex gap-2 h-10 items-center pl-4 pr-3 py-3 rounded-lg w-full text-left"
            >
              <span
                className={`flex-1 text-[15px] font-medium leading-none tracking-[0.3px] ${selected ? "text-[#222125]" : "text-[#878787]"}`}
              >
                {selected ? selected.name : "Select Promotion"}
              </span>
              <ChevronDownIcon
                className={`size-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen ? (
              <section
                aria-label="Promotion options"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-2 z-10 max-h-[374px] bg-white rounded-2xl overflow-hidden flex flex-col space-y-2 shadow-[0_6px_24px_-4px_rgba(12,12,13,0.12)] border border-[#e7e7e7]"
              >
                <div className="flex flex-col items-start px-2 md:px-4 pt-3 md:pt-6 w-full">
                  <div className="bg-white border border-[#e7e7e7] flex gap-2 h-10 items-center pl-4 pr-3 py-3 rounded-lg w-full">
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Promotion"
                      className="flex-1 bg-transparent text-[16px] font-normal leading-none text-[#222125] placeholder:text-[#878787] focus:outline-none"
                    />
                    <SearchIcon className="size-4 shrink-0 text-[#878787]" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col w-[96px] shrink-0">
                      <div className="border-b border-[#e0ddd2] h-[42px] flex items-center px-4 py-2">
                        <span className="text-[14px] font-semibold leading-[1.4] tracking-[0.28px] text-[#1e1e1e] whitespace-nowrap">
                          Thumbnail
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="border-b border-[#e0ddd2] h-[42px] flex items-center px-4 py-2 w-full">
                        <span className="text-[14px] font-semibold leading-[1.5] text-[#1e1e1e] whitespace-nowrap">
                          Promotion
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[30vh] overflow-y-auto w-full">
                    {filtered.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-[#878787]">
                        No promotions match &quot;{search}&quot;
                      </p>
                    ) : (
                      filtered.map((p) => {
                        const isSelected = selected?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelected(p);
                              setDropdownOpen(false);
                              setSearch("");
                            }}
                            className={`w-full flex items-center gap-2 border-b border-[#e7e7e7] last:border-b-0 text-left transition-colors ${isSelected ? "bg-[#f8d237]/15" : "hover:bg-[#f4f5f8]"}`}
                          >
                            <div className="w-[96px] shrink-0 flex items-center pl-3 p-2">
                              <Thumbnail />
                            </div>
                            <div className="flex-1 min-w-0 flex items-center p-2">
                              <span className="text-[14px] md:text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125] truncate">
                                {p.name}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </div>
        <div className="flex gap-4 items-start justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="border border-[#e7e7e7] flex gap-2 items-center justify-center min-w-[100px] w-[100px] p-3 rounded-lg text-[15px] font-medium leading-none tracking-[0.3px] text-[#222125] hover:bg-[#f4f5f8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className="bg-[#f8d237] flex gap-2 items-center justify-center min-w-[100px] w-[100px] p-3 rounded-lg text-[15px] font-medium leading-none tracking-[0.3px] text-[#441f04] hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </section>
    </Dialog>
  );
}

function Thumbnail() {
  return (
    <div className="size-[47px] rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-[#222125]">
      <MegaphoneIcon />
    </div>
  );
}

export default AddPromotionDialog;
