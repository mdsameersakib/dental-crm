"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ServiceOption = {
  id: string;
  name: string;
  priceLabel: string;
  durationLabel: string;
};

type ServiceSelectProps = {
  id?: string;
  name: string;
  options: ServiceOption[];
  defaultValue: string;
};

export function ServiceSelect({
  id,
  name,
  options,
  defaultValue,
}: ServiceSelectProps) {
  const initialValue =
    options.find((option) => option.id === defaultValue)?.id ??
    options[0]?.id ??
    "";
  const [selectedId, setSelectedId] = useState(initialValue);
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
    () => options.find((option) => option.id === selectedId) ?? options[0],
    [options, selectedId],
  );

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={selectedId} required />

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 text-left shadow-[0_1px_0_rgba(10,24,29,0.04)] transition-colors hover:border-[var(--color-primary)]/45"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-[var(--color-foreground)]">
            {selectedOption?.name ?? "Select a service"}
          </span>
        </span>
        {selectedOption ? (
          <span className="shrink-0 text-right">
            <span className="block text-sm font-bold text-[var(--color-primary)]">
              {selectedOption.priceLabel}
            </span>
            <span className="block text-xs text-[var(--color-on-surface-variant)]">
              {selectedOption.durationLabel}
            </span>
          </span>
        ) : null}
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
          <ul className="max-h-80 overflow-auto">
            {options.map((option) => {
              const isSelected = option.id === selectedId;

              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(option.id);
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
                        {option.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-bold text-[var(--color-primary)]">
                        {option.priceLabel}
                      </span>
                      <span className="block text-xs text-[var(--color-on-surface-variant)]">
                        {option.durationLabel}
                      </span>
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
