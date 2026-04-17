"use client";

import { updateStaffAccountStatus } from "./actions";

type StaffStatusToggleProps = {
  profileId: string;
  isActive: boolean;
  disabled?: boolean;
};

export function StaffStatusToggle({
  profileId,
  isActive,
  disabled = false,
}: StaffStatusToggleProps) {
  return (
    <form
      action={updateStaffAccountStatus}
      className="inline-flex items-center gap-2"
    >
      <input type="hidden" name="profile_id" value={profileId} />
      <input
        type="hidden"
        name="next_is_active"
        value={isActive ? "false" : "true"}
      />
      <button
        type="submit"
        disabled={disabled}
        role="switch"
        aria-checked={isActive}
        aria-label={isActive ? "Set inactive" : "Set active"}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
          isActive ? "bg-emerald-500" : "bg-slate-300"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
        {isActive ? "Active" : "Inactive"}
      </span>
    </form>
  );
}
