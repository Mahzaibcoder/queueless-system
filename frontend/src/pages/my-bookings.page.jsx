import { useState, useEffect } from "react";
import { bookingService } from "../services/api";
import { useAuth } from "../context/auth.context";
import { CalendarIcon, TrashIcon, SearchIcon } from "../components/common/Icons";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch bookings once auth is ready and we have a valid user ID
  useEffect(() => {
    if (authLoading) return; // wait for auth context to finish loading
    if (!user?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }
    bookingService
      .getByUser(user.id)
      .then(({ data }) => {
        setBookings(data || []);
      })
      .catch((err) => console.error('Failed to load bookings', err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleCancel = (id) => {
    setBookingToCancel(id);
    setCancelReason("");
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await bookingService.cancel(bookingToCancel, cancelReason);
      setBookings(
        bookings.map((b) =>
          b.id === bookingToCancel ? { ...b, status: "cancelled", cancelReason } : b
        )
      );
      setBookingToCancel(null);
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#FAF7F2]">
        <div className="w-8 h-8 border-3 border-[#203626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const upcoming = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) => b.status === "cancelled" || b.status === "completed");

  const filterList = (list) =>
    list.filter(
      (b) =>
        (b.businessName && b.businessName.toLowerCase().includes(search.toLowerCase())) ||
        (b.serviceName && b.serviceName.toLowerCase().includes(search.toLowerCase()))
    );

  const filteredUpcoming = filterList(upcoming);
  const filteredPast = filterList(past);

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] min-h-[85vh]">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="bg-[#182B1F] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 mb-10 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#273D2E]">
          {/* Left Side: Title & Subtitle */}
          <div>
            <span className="px-3 py-1 rounded-full bg-[#253E2C] text-[#D9A948] border border-[#D9A948]/30 text-xs font-bold uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight my-2">
              My Bookings
            </h1>
            <p className="text-xs sm:text-sm text-[#B4C2AF] m-0">
              Review your scheduled appointments and past booking history.
            </p>
          </div>

          {/* Right Corner: Search and Book New Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input Box */}
            <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 gap-2 flex-1 md:flex-initial">
              <SearchIcon size={16} className="text-[#D9A948] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-white text-xs sm:text-sm outline-none w-full md:w-40 placeholder-white/60"
              />
            </div>

            {/* Book New Button */}
            <a href="/browse" className="no-underline">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#C49337] hover:bg-[#A37422] text-white shadow-sm transition-all cursor-pointer border-none whitespace-nowrap"
              >
                <CalendarIcon size={15} />
                <span>Book New &rarr;</span>
              </button>
            </a>
          </div>
        </div>

        {/* SECTION 2: Layout Content Grid */}
        <div className="flex flex-col gap-10">
          {/* Upcoming Appointments Section */}
          <div>
            <h3 className="text-xl font-bold text-[#16261A] mb-4">
              Upcoming Appointments
            </h3>
            {filteredUpcoming.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredUpcoming.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white border border-[#E8E2D5] rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm sunnah-card-hover"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-[#16261A] mb-1">
                        {b.businessName || "Verified Business"}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#556054] m-0">
                        <strong className="text-[#16261A] font-semibold">{b.serviceName}</strong> • {new Date(b.date).toLocaleDateString()} at {b.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#F0F7F0] text-[#203626] border border-[#C5DEC0] text-xs font-bold">
                        Confirmed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancel(b.id)}
                        className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FEF5F4] hover:bg-[#FDD8D5] text-[#C0392B] border border-[#F5C2BE] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <TrashIcon size={12} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white border border-[#E8E2D5] rounded-3xl text-center text-sm text-[#636D62]">
                No upcoming appointments.
              </div>
            )}
          </div>

          {/* Past Appointments */}
          <div>
            <h3 className="text-xl font-bold text-[#16261A] mb-4">
              Past Appointments
            </h3>
            {filteredPast.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredPast.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white border border-[#E8E2D5] rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm sunnah-card-hover opacity-85"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-[#16261A] mb-1">
                        {b.businessName || "Verified Business"}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#556054] m-0">
                        <strong className="text-[#16261A] font-semibold">{b.serviceName}</strong> • {new Date(b.date).toLocaleDateString()} at {b.time}
                      </p>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-[#F2ECE0] text-[#636D62] text-xs font-bold">
                        {b.status === "cancelled" ? "Cancelled" : "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white border border-[#E8E2D5] rounded-3xl text-center text-sm text-[#636D62]">
                No past appointments.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmationModal
        isOpen={!!bookingToCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this booking? This will free up the time slot for other customers."
        confirmText="Cancel Appointment"
        cancelText="Keep Booking"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={confirmCancel}
        onClose={() => setBookingToCancel(null)}
      >
        <div className="mt-3">
          <label className="block text-xs font-bold text-[#16261A] mb-1">
            Reason for cancellation (optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Schedule conflict"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
          />
        </div>
      </ConfirmationModal>
    </section>
  );
}
