// OwnerDashboardPage – modernized with Tailwind CSS and TanStack Query
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService, businessService } from "../services/api.service";
import { useAuth } from "../context/auth.context";
import ConfirmationModal from "../components/common/ConfirmationModal";
import OwnerHeaderBanner from "../components/owner/owner-header.component";
import OwnerMetricsSection from "../components/owner/owner-metrics.component";
import OwnerBookingsTable from "../components/owner/owner-bookings-table.component";
import OwnerQuickActions from "../components/owner/owner-quick-actions.component";

export default function OwnerDashboardPage() {
  const { user } = useAuth(); // kept for potential future auth‑based queries
  const queryClient = useQueryClient();

  // ---------- Queries ----------
  // Fetch list of businesses belonging to the logged‑in owner
  const {
    data: businesses = [],
    isLoading: loadingBusinesses,
    isError: errorBusinesses,
    error: errorBusinessesObj,
  } = useQuery(["myBusinesses"], async () => {
    const res = await businessService.getMyBusinesses();
    if (res.error) throw new Error(res.error);
    return res.data ?? [];
  });

  // Selected business – derived from state but defaults to first available
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId) ?? businesses[0] ?? null;

  // Modal states for destructive actions
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Fetch bookings for the selected business (enabled only when a business exists)
  const {
    data: bookings = [],
    isLoading: loadingBookings,
    isError: errorBookings,
    error: errorBookingsObj,
  } = useQuery(
    ["bookings", selectedBusiness?.id],
    async () => {
      const res = await bookingService.getByBusiness(selectedBusiness.id);
      if (res.error) throw new Error(res.error);
      return res.data ?? [];
    },
    { enabled: !!selectedBusiness?.id }
  );

  // ---------- Mutations ----------
  // Delete a business
  const deleteBusinessMutation = useMutation(
    async (bizId) => {
      const res = await businessService.delete(bizId);
      if (res.error) throw new Error(res.error);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["myBusinesses"]);
        // Reset selected business after deletion – will be refreshed by the myBusinesses query
        setSelectedBusinessId("");
      },
    }
  );

  // Cancel a booking
  const cancelBookingMutation = useMutation(
    async ({ id, reason }) => {
      await bookingService.cancel(id, reason);
      return { id, reason };
    },
    {
      // Optimistic update for immediate UI feedback
      onMutate: async ({ id, reason }) => {
        await queryClient.cancelQueries(["bookings", selectedBusiness?.id]);
        const previous = queryClient.getQueryData(["bookings", selectedBusiness?.id]);
        queryClient.setQueryData(["bookings", selectedBusiness?.id], (old) =>
          (old ?? []).map((b) => (b.id === id ? { ...b, status: "cancelled", cancelReason: reason } : b))
        );
        return { previous };
      },
      onError: (_err, _variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(["bookings", selectedBusiness?.id], context.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(["bookings", selectedBusiness?.id]);
      },
    }
  );

  // ---------- Handlers ----------
  const handleDelete = () => {
    if (!selectedBusiness?.id) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteBusiness = async () => {
    if (!selectedBusiness?.id) return;
    try {
      await deleteBusinessMutation.mutateAsync(selectedBusiness.id);
      setShowDeleteModal(false);
    } catch (e) {
      console.error(e);
      alert("Failed to delete business: " + e.message);
    }
  };

  const handleCancel = (id) => {
    setBookingToCancel(id);
    setCancelReason("");
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBookingMutation.mutateAsync({ id: bookingToCancel, reason: cancelReason });
      setBookingToCancel(null);
    } catch (e) {
      console.error(e);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleReschedule = (id) => {
    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: `/book?business=${selectedBusiness?.id ?? ""}&booking=${id}` },
      })
    );
  };

  // ---------- Derived UI data ----------
  const upcoming = bookings.filter((b) => b.status === "confirmed");
  const totalThisWeek = upcoming.length;
  const totalRevenue = upcoming.reduce((sum, b) => sum + (b.price || 0), 0);

  // ---------- Loading / Error states ----------
  if (loadingBusinesses || loadingBookings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAF7F2]">
        <div className="w-8 h-8 border-3 border-[#203626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorBusinesses || errorBookings) {
    const errMsg = (errorBusinessesObj?.message ?? errorBookingsObj?.message) ?? "Failed to load data";
    return (
      <div className="p-10 text-[#C0392B] bg-[#FEF5F4] border border-[#F5C2BE] rounded-2xl max-w-xl mx-auto my-12 text-center text-sm font-semibold">
        Error: {errMsg}
      </div>
    );
  }

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] min-h-[85vh]">
      <div className="w-full max-w-7xl mx-auto">
        {/* SECTION 1: Header Banner */}
        <OwnerHeaderBanner
          business={selectedBusiness}
          businesses={businesses}
          selectedBusinessId={selectedBusinessId}
          setSelectedBusinessId={setSelectedBusinessId}
          handleDelete={handleDelete}
        />

        {/* SECTION 2: Metrics */}
        <OwnerMetricsSection
          totalThisWeek={totalThisWeek}
          totalRevenue={totalRevenue}
          confirmedCount={upcoming.length}
        />

        {/* SECTION 3: Bookings Table */}
        <OwnerBookingsTable
          upcoming={upcoming}
          handleReschedule={handleReschedule}
          handleCancel={handleCancel}
        />

        {/* SECTION 4: Quick Actions */}
        <OwnerQuickActions business={selectedBusiness} handleDelete={handleDelete} />
      </div>

      {/* Confirmation Modal for Business Deletion */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Business"
        message={`Are you sure you want to delete "${selectedBusiness?.name || 'this business'}"? All associated services, availability, and bookings will be permanently removed. This action cannot be undone.`}
        confirmText="Delete Business"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteBusinessMutation.isLoading}
        onConfirm={confirmDeleteBusiness}
        onClose={() => setShowDeleteModal(false)}
      />

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmationModal
        isOpen={!!bookingToCancel}
        title="Cancel Client Appointment"
        message="Are you sure you want to cancel this booking?"
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
        variant="danger"
        isLoading={cancelBookingMutation.isLoading}
        onConfirm={confirmCancelBooking}
        onClose={() => setBookingToCancel(null)}
      >
        <div className="mt-3">
          <label className="block text-xs font-bold text-[#16261A] mb-1">
            Reason for cancellation (optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Schedule adjustment / provider unavailable"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
          />
        </div>
      </ConfirmationModal>
    </section>
  );
}
