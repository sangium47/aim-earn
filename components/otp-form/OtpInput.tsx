"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";

export type OtpInputProps = {
  /** The current OTP value as a string. Must be <= `length`. */
  value: string;
  /** Fires on every digit change. Receives the new combined string. */
  onChange: (next: string) => void;
  /** Number of digit cells. Defaults to 6. */
  length?: number;
  /** Fires when the user has filled all cells. */
  onComplete?: (code: string) => void;
  /** Disables input and paste. */
  disabled?: boolean;
  /** Accessible label describing the field to screen readers. */
  ariaLabel?: string;
  /** Optional id used for the first input (for <label htmlFor>). */
  id?: string;
};

/**
 * OTP digit input.
 *
 * Figma source: the "Select" row in node 2041:47339. Six individual filled
 * boxes the user types one digit into each. This component handles:
 *
 *   - auto-advance to the next cell on input
 *   - backspace to previous cell when current is empty
 *   - paste of a full code distributes across cells
 *   - arrow-key navigation between cells
 *   - numeric-only (via `inputMode` + sanitization in onChange)
 *
 * Visually matches the Figma spec: 60px tall cells, `surface.input` fill,
 * `rounded-lg`, 10px gap, each cell `flex-1` to share available width.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  onComplete,
  disabled = false,
  ariaLabel = "One-time passcode",
  id,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusCell = (i: number) => {
    const target = inputsRef.current[i];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const handleChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      // clearing a cell
      const arr = digits.slice();
      arr[i] = "";
      commit(arr.join(""));
      return;
    }
    // Handle both single-character and paste-like multi-character input
    const chars = raw.split("");
    const arr = digits.slice();
    let cursor = i;
    for (const c of chars) {
      if (cursor >= length) break;
      arr[cursor] = c;
      cursor += 1;
    }
    commit(arr.join(""));
    const nextIndex = Math.min(cursor, length - 1);
    focusCell(nextIndex);
  };

  const handleKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        // clear current cell, stay here
        const arr = digits.slice();
        arr[i] = "";
        commit(arr.join(""));
        return;
      }
      // empty cell → move to previous and clear it
      if (i > 0) {
        e.preventDefault();
        const arr = digits.slice();
        arr[i - 1] = "";
        commit(arr.join(""));
        focusCell(i - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusCell(i - 1);
      return;
    }
    if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      focusCell(i + 1);
    }
  };

  const handlePaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const digitsOnly = pasted.replace(/\D/g, "");
    if (!digitsOnly) return;
    e.preventDefault();
    const arr = digits.slice();
    let cursor = i;
    for (const c of digitsOnly.split("")) {
      if (cursor >= length) break;
      arr[cursor] = c;
      cursor += 1;
    }
    commit(arr.join(""));
    focusCell(Math.min(cursor, length - 1));
  };

  return (
    <div
      className="flex h-[60px] w-full items-center gap-2.5"
      role="group"
      aria-label={ariaLabel}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          id={i === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={length /* allow paste to overflow then we truncate */}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste(i)}
          onFocus={(e) => e.target.select()}
          className={[
            "min-w-0 flex-1 self-stretch rounded-lg bg-surface-input",
            "text-center font-sans text-xl font-medium text-ink",
            "outline-none transition-all",
            "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface-card",
            "disabled:cursor-not-allowed disabled:opacity-60",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
