"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  id,
  tabIndex,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const isChecked = Boolean(checked);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onCheckedChange) {
      onCheckedChange(!isChecked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && onCheckedChange) {
        onCheckedChange(!isChecked);
      }
    }
  };

  return (
    <button
      type="button"
      role="switch"
      id={id}
      tabIndex={tabIndex}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-none",
        isChecked
          ? "bg-blue-600 dark:bg-blue-500 shadow-xs"
          : "bg-slate-300 dark:bg-slate-700",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
          isChecked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
