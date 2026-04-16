"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SimpleSelectOption = {
  value: string;
  label: string;
  subLabel?: string;
};

type SimpleSelectProps = {
  name: string;
  options: SimpleSelectOption[];
  defaultValue: string;
  required?: boolean;
};

export function SimpleSelect({
  name,
  options,
  defaultValue,
  required = false,
}: SimpleSelectProps) {
  const initialValue =
    options.find((option) => option.value === defaultValue)?.value ??
    options[0]?.value ??
    "";
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? options[0],
    [options, selectedValue],
  );

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 text-left shadow-[0_1px_0_rgba(10,24,29,0.04)] transition-colors hover:border-[var(--color-primary)]/45"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-[var(--color-foreground)]">
            {selectedOption?.label ?? "Select an option"}
          </span>
          {selectedOption?.subLabel ? (
            <span className="mt-0.5 block truncate text-xs text-[var(--color-on-surface-variant)]">
              {selectedOption.subLabel}
            </span>
          ) : null}
        </span>
        <span
          className={`material-symbols-outlined text-[20px] text-[var(--color-on-surface-variant)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[var(--color-outline-variant)]/30 bg-white shadow-[0_16px_40px_rgba(10,24,29,0.12)]">
          <ul role="listbox" className="max-h-80 overflow-auto">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedValue(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? "bg-[var(--color-primary-fixed)]/35"
                        : "hover:bg-[var(--color-surface-container-low)]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[var(--color-foreground)]">
                        {option.label}
                      </span>
                      {option.subLabel ? (
                        <span className="mt-0.5 block truncate text-xs text-[var(--color-on-surface-variant)]">
                          {option.subLabel}
                        </span>
                      ) : null}
                    </span>
                    <span className="w-5 text-right">
                      {isSelected ? (
                        <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">
                          check
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
