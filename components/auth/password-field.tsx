"use client";

import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
};

export function PasswordField({
  id,
  name,
  placeholder = "••••••••",
  required = false,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#6e7979]">
        <span className="material-symbols-outlined text-xl">lock</span>
      </div>
      <input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        required={required}
        placeholder={placeholder}
        className="block w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] py-3.5 pr-12 pl-11 text-[var(--color-foreground)] outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-[#6e7979] transition-colors hover:text-[var(--color-foreground)]"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-controls={id}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isVisible ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}
