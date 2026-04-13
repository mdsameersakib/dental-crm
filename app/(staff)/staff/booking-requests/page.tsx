import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffBookingRequestsPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Booking Requests"
      path="/staff/booking-requests"
      description="Staff review queue for public booking requests before they are converted into confirmed clinic appointments."
      notes={[
        "This page is part of the MVP operations flow.",
        "Public booking requests will be reviewed manually by staff.",
      ]}
    />
  );
}
