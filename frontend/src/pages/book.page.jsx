import { useState, useEffect } from "react";
import { serviceService, bookingService } from "../services/api";
import { useAuth } from "../context/auth.context";
import { CheckCircleIcon } from "../components/common/Icons";
import { generateSlots, formatDate, formatTime } from "../utils/dateHelpers";

export default function Book() {
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  // Read query params for preselect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const businessId = params.get("business");
    const serviceId = params.get("service");
    if (businessId && serviceId) {
      serviceService.getByBusiness(businessId).then(({ data }) => {
        const svc = (data || []).find((s) => s.id === serviceId);
        if (svc) setService(svc);
      });
    }
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Require authentication check
  if (!isAuthenticated) {
    return (
      <section className="py-24 px-4 text-center bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white border border-[#E8E2D5] rounded-3xl p-8 sm:p-10 shadow-lg sunnah-card-hover">
          <h2 className="text-2xl font-black text-[#16261A] mb-3">
            Sign in required
          </h2>
          <p className="text-xs sm:text-sm text-[#556054] mb-8 leading-relaxed">
            Please log in or create an account to book your appointment with verified schedules.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/login"
              className="px-6 py-2.5 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-sm transition-all no-underline"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="px-6 py-2.5 rounded-full bg-white text-[#16261A] border border-[#E8E2D5] hover:bg-[#F2ECE0] text-xs sm:text-sm font-bold shadow-sm transition-all no-underline"
            >
              Create account
            </a>
          </div>
        </div>
      </section>
    );
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setTime("");
    setSlots([]);
    if (service && e.target.value) {
      setSlots(generateSlots("09:00", "17:00", service.duration));
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate server-side conflict check
    await new Promise((r) => setTimeout(r, 800));

    try {
      await bookingService.create({
        businessId: "b1",
        userId: user?.id || "u1",
        serviceId: service.id,
        serviceName: service.name,
        date,
        time,
        duration: service.duration,
        price: service.price,
      });
      setLoading(false);
      setBooked(true);
    } catch (err) {
      setLoading(false);
      setError("This time slot is no longer available. Please choose another.");
    }
  };

  if (booked) {
    return (
      <section className="py-20 px-4 text-center bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white border border-[#E8E2D5] rounded-3xl p-8 sm:p-10 shadow-lg text-center sunnah-card-hover">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F7F0] text-[#203626] flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon size={40} className="text-[#C49337]" />
          </div>
          <h2 className="text-2xl font-black text-[#16261A] mb-3">Appointment Confirmed!</h2>
          <p className="text-xs sm:text-sm text-[#556054] mb-8 leading-relaxed">
            You've booked <strong className="text-[#16261A]">{service?.name}</strong> on {formatDate(date)} at {formatTime(time)}.
          </p>
          <a href="/my-bookings" className="no-underline">
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer border-none"
            >
              View My Bookings
            </button>
          </a>
        </div>
      </section>
    );
  }

  if (!service) {
    return (
      <section className="py-24 px-4 text-center bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white border border-[#E8E2D5] rounded-3xl p-8 sm:p-10 shadow-lg sunnah-card-hover">
          <h3 className="text-xl font-bold text-[#16261A] mb-2">Please select a service first</h3>
          <p className="text-xs sm:text-sm text-[#556054] mb-6">Go to a business page and choose a service to book.</p>
          <a
            href="/browse"
            className="inline-flex px-6 py-2.5 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-sm transition-all no-underline"
          >
            Browse businesses
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] min-h-[85vh]">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 shadow-md sunnah-card-hover">
          <div className="flex justify-between items-start gap-4 mb-8 pb-5 border-b border-[#F2ECE0]">
            <div>
              <h3 className="text-2xl font-black text-[#16261A] mb-1">{service.name}</h3>
              <p className="text-xs sm:text-sm text-[#556054] m-0">{service.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-black text-[#C49337]">${service.price}</div>
              <div className="text-xs font-semibold text-[#636D62]">{service.duration} min</div>
            </div>
          </div>

          <form onSubmit={handleBook} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-[#16261A] mb-1.5">Select date</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={handleDateChange}
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
              />
            </div>

            {date && (
              <div>
                <label className="block text-xs font-bold text-[#16261A] mb-1.5">Select time slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {slots.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        time === t
                          ? "bg-[#203626] text-white border-[#203626] shadow-sm"
                          : "bg-[#FAF7F2] text-[#16261A] border-[#E8E2D5] hover:bg-[#F2ECE0]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {!time && <p className="text-xs text-[#C0392B] mt-2">Please select a time slot.</p>}
              </div>
            )}

            {error && (
              <div className="p-3 bg-[#FEF5F4] text-[#C0392B] border border-[#F5C2BE] rounded-xl text-xs font-bold">
                {error}
              </div>
            )}

            <div className="mt-4">
              <button
                type="submit"
                disabled={!time || loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
