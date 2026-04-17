import { redirect } from "next/navigation";

export default function StaffDashboardPage() {
  // Dashboard was planned in the early IA, but we intentionally skip it for the MVP.
  // Keep this route as a safe redirect target for older links or auth redirects.
  redirect("/staff/booking-requests");
}
