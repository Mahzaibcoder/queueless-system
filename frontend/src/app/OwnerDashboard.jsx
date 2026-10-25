import { useState, useEffect } from "react";
import { bookingService, businessService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon, DollarIcon, CheckCircleIcon, BuildingIcon,
  ServiceIcon, TrashIcon, EditIcon, ArrowRightIcon,
} from "../components/common/Icons";
import "../styles/components.css";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bRes, bizRes] = await Promise.all([
        bookingService.getByBusiness("b1"),
        businessService.getById("b1"),
      ]);
      setBookings(bRes.data || []);
      setBusiness(bizRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const upcoming = bookings.filter((b) => b.status === "confirmed");
  const totalThisWeek = upcoming.length;
  const totalRevenue = upcoming.reduce((sum, b) => sum + (b.price || 0), 0);

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

  const handleReschedule = (id) => {
    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: `/book?business=b1&booking=${id}` },
      })
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <section style={{ padding: "2.5rem 5vw 4rem", background: "var(--bg)", minHeight: "85vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="container" style={{ maxWidth: "1150px", margin: "0 auto" }}>
        
        {/* SECTION 1: Deep Navy Header Banner */}
        <div
          style={{
            background: "#0C1B2A",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            padding: "1.75rem 2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 12px rgba(12, 27, 42, 0.1)",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
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
                letterSpacing: "0.5px",
              }}
            >
              Management Console
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0.25rem", letterSpacing: "-0.5px" }}>
              Owner Dashboard
            </h1>
            <p style={{ color: "var(--text-light)", fontSize: "0.95rem", margin: 0 }}>
              Control center for {business?.name || "Luna Glow Salon"}. Manage schedules, appointments, and services.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a href="/create-business" style={{ textDecoration: "none" }}>
              <button
                className="btn"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                <BuildingIcon size={15} /> Profile
              </button>
            </a>
            <a href="/manage-services" style={{ textDecoration: "none" }}>
              <button
                className="btn"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                <ServiceIcon size={15} /> Services
              </button>
            </a>
            <a href="/set-availability" style={{ textDecoration: "none" }}>
              <button
                className="btn"
                style={{
                  background: "var(--teal)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.1rem",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                }}
              >
                <CalendarIcon size={15} /> Set Hours
              </button>
            </a>
          </div>
        </div>

        {/* SECTION 2: Key Metrics & Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--bg-light)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0C1B2A" }}>
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "#0C1B2A", fontWeight: 800, margin: 0, lineHeight: 1 }}>{totalThisWeek}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", margin: 0 }}>Bookings This Week</p>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--teal-bg)", border: "1px solid rgba(45, 212, 191, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal-dark)" }}>
              <DollarIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "var(--teal-dark)", fontWeight: 800, margin: 0, lineHeight: 1 }}>${totalRevenue}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", margin: 0 }}>Upcoming Revenue</p>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "#ECFDF5", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
              <CheckCircleIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "#0C1B2A", fontWeight: 800, margin: 0, lineHeight: 1 }}>{upcoming.length}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", margin: 0 }}>Confirmed Slots</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Active Bookings Table Container */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid var(--border)",
            borderRadius: "14px",
            overflow: "hidden",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 12px rgba(12, 27, 42, 0.03)",
          }}
        >
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border-light)", background: "#FAFAFA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.25rem", margin: 0, letterSpacing: "-0.2px" }}>
              Active Customer Appointments
            </h2>
            <span style={{ fontSize: "0.82rem", color: "var(--teal-dark)", fontWeight: 800, background: "var(--teal-bg)", padding: "0.25rem 0.75rem", borderRadius: "9999px", border: "1px solid rgba(45, 212, 191, 0.3)" }}>
              {upcoming.length} Confirmed
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.92rem" }}>
              <thead>
                <tr style={{ background: "#0C1B2A", color: "#FFFFFF" }}>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Service</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date & Time</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.length > 0 ? (
                  upcoming.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "1.1rem 1.5rem", color: "#0C1B2A", fontWeight: 700 }}>
                        Customer #{b.userId ? b.userId.slice(-4) : "1024"}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-dark)" }}>{b.serviceName}</td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-dark)", fontWeight: 500 }}>
                        {new Date(b.date).toLocaleDateString()} at {b.time}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--teal-dark)", fontWeight: 800 }}>${b.price}</td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", background: "var(--teal-bg)", color: "var(--teal-dark)", fontSize: "0.78rem", fontWeight: 800, border: "1px solid rgba(45, 212, 191, 0.3)" }}>
                          Confirmed
                        </span>
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => handleReschedule(b.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid var(--border)",
                              color: "#0C1B2A",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <EditIcon size={13} /> Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancel(b.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "var(--danger)",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <TrashIcon size={13} /> Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem 1.5rem" }}>
                      No active appointments scheduled at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: Quick Action Module Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Business Settings</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", flex: 1, lineHeight: 1.5 }}>
              Update business profile details, photo image, contact info, and address.
            </p>
            <a href="/create-business" className="btn-navy-pill" style={{ justifyContent: "center" }}>
              Edit Profile <ArrowRightIcon size={15} />
            </a>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Services Catalog</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", flex: 1, lineHeight: 1.5 }}>
              Add, edit, or remove service offerings, prices, and appointment durations.
            </p>
            <a href="/manage-services" className="btn-navy-pill" style={{ justifyContent: "center" }}>
              Manage Services <ArrowRightIcon size={15} />
            </a>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Operating Schedule</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", flex: 1, lineHeight: 1.5 }}>
              Configure opening and closing working hours for weekly booking slots.
            </p>
            <a href="/set-availability" className="btn-navy-pill" style={{ justifyContent: "center" }}>
              Set Availability <ArrowRightIcon size={15} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}