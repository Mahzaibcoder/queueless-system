import { useState, useEffect } from "react";
import { bookingService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CalendarIcon, TrashIcon, ArrowRightIcon, SearchIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const handleCancel = async (id) => {
    const reason = window.prompt("Reason for cancellation (optional):");
    if (reason === null) return;

    try {
      await bookingService.cancel(id, reason);
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "cancelled", cancelReason: reason } : b)));
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "var(--bg)" }}>
        <div className="loading-spinner" />
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
    <section
      style={{
        padding: "3.5rem clamp(1.5rem, 4vw, 3.5rem) 4rem",
        background: "var(--bg)",
        minHeight: "85vh",
      }}
    >
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Banner */}
        <div
          style={{
            background: "var(--navy-darkest)",
            color: "#FFFFFF",
            borderRadius: "16px",
            padding: "2rem 2.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 14px rgba(15, 32, 56, 0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Left Side: Title & Subtitle */}
          <div>
            <span
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(45, 212, 191, 0.15)",
                color: "var(--teal-light)",
                border: "1px solid rgba(45, 212, 191, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Customer Portal
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0.25rem", letterSpacing: "-0.5px" }}>
              My Bookings
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0 }}>
              Review your scheduled appointments and past booking history.
            </p>
          </div>

          {/* Right Corner: Search and Book New Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
            {/* Search Input Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "9999px",
                padding: "0.5rem 1rem",
                gap: "0.5rem",
              }}
            >
              <SearchIcon size={16} style={{ color: "var(--teal-light)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  outline: "none",
                  width: "160px",
                }}
              />
            </div>

            {/* Book New Button */}
            <a href="/browse" style={{ textDecoration: "none" }}>
              <button
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.25rem",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  whiteSpace: "nowrap",
                }}
              >
                <CalendarIcon size={15} /> Book New →
              </button>
            </a>
          </div>
        </div>

        {/* SECTION 2: Layout Content Grid */}
        <div style={{ display: "grid", gap: "2.5rem" }}>
          {/* Upcoming Appointments Section */}
          <div>
            <h3 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1rem", letterSpacing: "-0.2px" }}>
              Upcoming Appointments
            </h3>
            {filteredUpcoming.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredUpcoming.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1.5px solid var(--border)",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 0.3rem" }}>
                        {b.businessName || "Verified Business"}
                      </h4>
                      <p style={{ color: "var(--text-dark)", fontSize: "0.92rem", margin: 0 }}>
                        <strong style={{ color: "var(--navy)" }}>{b.serviceName}</strong> • {new Date(b.date).toLocaleDateString()} at {b.time}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span
                        style={{
                          padding: "0.35rem 0.85rem",
                          borderRadius: "9999px",
                          background: "var(--teal-bg)",
                          color: "var(--teal-dark)",
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          border: "1px solid var(--teal-border)",
                        }}
                      >
                        Confirmed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancel(b.id)}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "var(--danger)",
                          padding: "0.45rem 0.9rem",
                          borderRadius: "9999px",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No upcoming appointments.</p>
            )}
          </div>

          {/* Past Appointments */}
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1rem", letterSpacing: "-0.2px" }}>
              Past Appointments
            </h3>
            {filteredPast.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredPast.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1.5px solid var(--border)",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 0.3rem" }}>
                        {b.businessName || "Verified Business"}
                      </h4>
                      <p style={{ color: "var(--text-dark)", fontSize: "0.92rem", margin: 0 }}>
                        <strong style={{ color: "var(--navy)" }}>{b.serviceName}</strong> • {new Date(b.date).toLocaleDateString()} at {b.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No past appointments.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
