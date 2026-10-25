import { useState, useEffect } from "react";
import { bookingService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CalendarIcon, TrashIcon, ArrowRightIcon, SearchIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    bookingService.getByUser(user?.id || "u1").then(({ data }) => {
      setBookings(data || []);
      setLoading(false);
    });
  }, [user]);

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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
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
        padding: "3.5rem 5vw 4rem",
        background: "var(--bg)",
        minHeight: "85vh",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* UNIFORM HEADER BANNER */}
        <div
          style={{
            background: "#0C1B2A",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "2rem 2.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 12px rgba(12, 27, 42, 0.1)",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
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
              }}
            >
              Customer Portal
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0.25rem", letterSpacing: "-0.5px" }}>
              My Bookings
            </h1>
            <p style={{ color: "var(--text-light)", fontSize: "0.95rem", margin: 0 }}>
              Review your scheduled appointments and past booking history.
            </p>
          </div>

          {/* Right Corner: Search and Book New Button Locked Together in One Line */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
            
            {/* Search Input Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "9999px",
                padding: "0.5rem 0.9rem",
                gap: "0.5rem",
              }}
            >
              <SearchIcon size={16} style={{ color: "var(--text-light)", flexShrink: 0 }} />
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
                style={{
                  background: "var(--teal)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.1rem",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  whiteSpace: "nowrap",
                }}
              >
                <CalendarIcon size={16} /> Book New
              </button>
            </a>
          </div>
        </div>

        {/* SECTION 2: Layout Content Grid */}
        <div style={{ display: "grid", gap: "2.5rem" }}>
          
          {/* Upcoming Appointments Section */}
          <div>
            <h3 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1rem", letterSpacing: "-0.2px" }}>
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
                      justify: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                      boxShadow: "0 2px 8px rgba(12, 27, 42, 0.03)",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0C1B2A", margin: "0 0 0.3rem" }}>
                        {b.businessName || "Verified Business"}
                      </h4>
                      <p style={{ color: "var(--text-dark)", fontSize: "0.92rem", margin: 0 }}>
                        <strong style={{ color: "#0C1B2A" }}>{b.serviceName}</strong> &bull; {new Date(b.date).toLocaleDateString()} at {b.time}
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
                          border: "1px solid rgba(45, 212, 191, 0.3)",
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
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <TrashIcon size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid var(--border)",
                  borderRadius: "14px",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <h4 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>No upcoming appointments</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "1.25rem" }}>You don't have any active bookings scheduled right now.</p>
                <a href="/browse" style={{ color: "var(--teal-dark)", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  Browse businesses and book <ArrowRightIcon size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Past / Cancelled History Section */}
          <div>
            <h3 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1rem", letterSpacing: "-0.2px" }}>
              Past / Cancelled History
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
                      padding: "1.25rem 1.5rem",
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center",
                      opacity: 0.85,
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0C1B2A", margin: "0 0 0.2rem" }}>
                        {b.businessName || "Verified Business"}
                      </h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>
                        {b.serviceName} &bull; {new Date(b.date).toLocaleDateString()} at {b.time}
                      </p>
                      {b.cancelReason && (
                        <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem", fontStyle: "italic" }}>
                          Reason: {b.cancelReason}
                        </p>
                      )}
                    </div>

                    <span
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "9999px",
                        background: "var(--danger-bg)",
                        color: "var(--danger)",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                      }}
                    >
                      {b.status === "cancelled" ? "Cancelled" : "Completed"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid var(--border)",
                  borderRadius: "14px",
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.92rem",
                }}
              >
                No past or cancelled appointments in your history.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}