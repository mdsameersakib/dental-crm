"use client";

import type { ButtonHTMLAttributes } from "react";

type ConfirmSubmitButtonProps = {
  className?: string;
  confirmMessage: string;
  label: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "children"
>;

export function ConfirmSubmitButton({
  className,
  confirmMessage,
  label,
  ...buttonProps
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      {...buttonProps}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
