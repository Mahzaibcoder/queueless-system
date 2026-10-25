import { useState, useEffect } from "react";
import { serviceService, bookingService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CheckCircleIcon } from "../components/common/Icons";
import { generateSlots, formatDate, formatTime } from "../utils/dateHelpers";
import "../styles/components.css";

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
      <section style={{ padding: "6rem 1.5rem", textAlign: "center", background: "var(--bg)" }}>
        <div className="container">
          <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem" }}>
            <h2 style={{ color: "var(--navy)", fontWeight: 800, marginBottom: "0.75rem" }}>
              Sign in required
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
              Please log in or create an account to book your appointment with verified schedules.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <a href="/login" className="btn-navy-pill">Sign in</a>
              <a href="/signup" className="btn btn-outline" style={{ borderRadius: "9999px" }}>Create account</a>
            </div>
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
      <section style={{ padding: "4rem 1.5rem", textAlign: "center", background: "var(--bg)" }}>
        <div className="container">
          <div className="card" style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
              <CheckCircleIcon size={48} style={{ color: "var(--teal)" }} />
            </div>
            <h2 style={{ color: "var(--navy)", fontWeight: 800, marginBottom: "0.75rem" }}>Appointment Confirmed!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              You've booked <strong>{service?.name}</strong> on {formatDate(date)} at {formatTime(time)}.
            </p>
            <a href="/my-bookings" style={{ textDecoration: "none" }}>
              <button className="btn-navy-pill">View My Bookings</button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (!service) {
    return (
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", background: "var(--bg)" }}>
        <div className="container">
          <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem" }}>
            <h3 style={{ color: "var(--navy)", fontWeight: 700, marginBottom: "0.5rem" }}>Please select a service first</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Go to a business page and choose a service to book.</p>
            <a href="/browse" className="btn-navy-pill">Browse businesses</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "4rem 1.5rem", background: "var(--bg)" }}>
      <div className="container">
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div className="card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-light)" }}>
              <div>
                <h3 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.35rem" }}>{service.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{service.description}</p>
              </div>
              <div style={{ textAlign: "right", minWidth: "100px" }}>
                <div style={{ fontWeight: "800", color: "var(--teal-dark)", fontSize: "1.35rem" }}>${service.price}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>{service.duration} min</div>
              </div>
            </div>

            <form onSubmit={handleBook}>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="label">Select date</label>
                <input type="date" className="input" min={today} value={date} onChange={handleDateChange} required />
              </div>

              {date && (
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="label">Select time slot</label>
                  <div className="slot-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginTop: "0.5rem" }}>
                    {slots.map((t) => (
                      <button
                        type="button"
                        key={t}
                        style={{
                          padding: "0.6rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          border: time === t ? "2px solid var(--teal)" : "1px solid var(--border)",
                          background: time === t ? "var(--teal-bg)" : "var(--surface)",
                          color: time === t ? "var(--teal-dark)" : "var(--navy)",
                          fontWeight: "700",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "var(--transition)"
                        }}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {!time && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>Please select a time slot.</p>}
                </div>
              )}

              {error && (
                <div style={{
                  padding: "0.75rem", borderRadius: "var(--radius)", background: "var(--danger-bg)",
                  color: "var(--danger)", fontSize: "0.88rem", marginBottom: "1rem",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}>{error}</div>
              )}

              <div style={{ marginTop: "2rem" }}>
                <button type="submit" className="btn-navy-pill" style={{ width: "100%", justifyContent: "center", padding: "0.9rem 0", fontSize: "1rem" }} disabled={!time || loading}>
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}