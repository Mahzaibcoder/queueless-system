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
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBusinessId && businesses.length > 0) {
      const found = businesses.find((b) => b.id === selectedBusinessId);
      if (found) {
        setBusiness(found);
        loadBookingsForBusiness(found.id);
      }
    }
  }, [selectedBusinessId]);

  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!business?.id) return;
    if (!window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) return;
    try {
      const res = await businessService.delete(business.id);
      if (res.error) {
        alert('Failed to delete business: ' + res.error);
      } else {
        alert('Business deleted successfully.');
        const remaining = businesses.filter((b) => b.id !== business.id);
        setBusinesses(remaining);
        if (remaining.length > 0) {
          setBusiness(remaining[0]);
          setSelectedBusinessId(remaining[0].id);
        } else {
          setBusiness(null);
          setSelectedBusinessId("");
          setBookings([]);
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting business');
    }
  };

  const loadBookingsForBusiness = async (bizId) => {
    try {
      const bRes = await bookingService.getByBusiness(bizId);
      setBookings(bRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    try {
      const bizRes = await businessService.getMyBusinesses();
      const list = bizRes.data || [];
      setBusinesses(list);
      if (list.length > 0) {
        setBusiness(list[0]);
        setSelectedBusinessId(list[0].id);
        loadBookingsForBusiness(list[0].id);
      } else {
        setBusiness(null);
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "var(--bg)" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "var(--danger)", textAlign: "center" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <section style={{ padding: "2.5rem clamp(1.5rem, 4vw, 3.5rem) 4rem", background: "var(--bg)", minHeight: "85vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* SECTION 1: Deep Navy Header Banner */}
        <div
          style={{
            background: "var(--navy-darkest)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.75rem 2.25rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 14px rgba(15, 32, 56, 0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
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

              {businesses.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 700 }}>Switch Business:</span>
                  <select
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    style={{
                      background: "rgba(255, 255, 255, 0.18)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",
                      padding: "0.25rem 0.65rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id} style={{ background: "var(--navy-darkest)", color: "#FFFFFF" }}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.25rem 0 0.25rem", letterSpacing: "-0.5px" }}>
              {business?.name || "Owner Dashboard"}
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0 }}>
              Control center for {business?.name || "your business"}. Manage schedules, appointments, and services.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <a href="/create-business" style={{ textDecoration: "none" }}>
              <button
                className="btn"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.15rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <BuildingIcon size={15} /> Edit Profile
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
                  padding: "0.55rem 1.15rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <ServiceIcon size={15} /> Services
              </button>
            </a>
            <a href="/set-availability" style={{ textDecoration: "none" }}>
              <button
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <CalendarIcon size={15} /> Set Hours &rarr;
              </button>
            </a>
            {business?.id && (
              <button
                onClick={handleDelete}
                className="btn"
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.15rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <TrashIcon size={15} /> Delete Business
              </button>
            )}
          </div>
        </div>

        {/* SECTION 2: Key Metrics & Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--bg-light)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)" }}>
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "var(--navy)", fontWeight: 800, margin: 0, lineHeight: 1 }}>{totalThisWeek}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", margin: 0 }}>Bookings This Week</p>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--teal-bg)", border: "1px solid var(--teal-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal-dark)" }}>
              <DollarIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "var(--teal-dark)", fontWeight: 800, margin: 0, lineHeight: 1 }}>{totalRevenue}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", margin: 0 }}>Upcoming Revenue</p>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--teal-bg)", border: "1px solid var(--teal-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)" }}>
              <CheckCircleIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "var(--navy)", fontWeight: 800, margin: 0, lineHeight: 1 }}>{upcoming.length}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", margin: 0 }}>Confirmed Slots</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Active Bookings Table Container */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "2.5rem",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border-light)", background: "#FAFAFA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.25rem", margin: 0, letterSpacing: "-0.2px" }}>
              Active Customer Appointments
            </h2>
            <span style={{ fontSize: "0.82rem", color: "var(--teal-dark)", fontWeight: 800, background: "var(--teal-bg)", padding: "0.25rem 0.75rem", borderRadius: "9999px", border: "1px solid var(--teal-border)" }}>
              {upcoming.length} Confirmed
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.92rem" }}>
              <thead>
                <tr style={{ background: "var(--navy-darkest)", color: "#FFFFFF" }}>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Service</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date &amp; Time</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                  <th style={{ padding: "0.85rem 1.5rem", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.length > 0 ? (
                  upcoming.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--navy)", fontWeight: 700 }}>
                        Customer #{b.userId ? b.userId.slice(-4) : "1024"}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-dark)" }}>{b.serviceName}</td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-dark)", fontWeight: 500 }}>
                        {new Date(b.date).toLocaleDateString()} at {b.time}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", color: "var(--teal-dark)", fontWeight: 800 }}>${b.price}</td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", background: "var(--teal-bg)", color: "var(--teal-dark)", fontSize: "0.78rem", fontWeight: 800, border: "1px solid var(--teal-border)" }}>
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
                              color: "var(--navy)",
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
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Business Settings</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", flex: 1, lineHeight: 1.5 }}>
              Update business profile details, photo image, contact info, and address.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <a
                href="/create-business"
                className="btn-primary"
                style={{
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  flex: 1,
                  boxSizing: "border-box",
                }}
              >
                <span>Edit Profile</span>
                <ArrowRightIcon size={14} />
              </a>
              {business?.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    background: "var(--danger-bg)",
                    color: "var(--danger)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "9999px",
                    padding: "0.65rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                  }}
                  title="Remove Business"
                >
                  <TrashIcon size={14} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Services Catalog</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", flex: 1, lineHeight: 1.5 }}>
              Add, edit, or remove service offerings, prices, and appointment durations.
            </p>
            <a
              href="/manage-services"
              className="btn-primary"
              style={{
                padding: "0.65rem 1.25rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                boxSizing: "border-box",
              }}
            >
              <span>Manage Services</span>
              <ArrowRightIcon size={14} />
            </a>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ color: "var(--navy)", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Operating Schedule</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", flex: 1, lineHeight: 1.5 }}>
              Configure opening and closing working hours for weekly booking slots.
            </p>
            <a
              href="/set-availability"
              className="btn-primary"
              style={{
                padding: "0.65rem 1.25rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                boxSizing: "border-box",
              }}
            >
              <span>Set Availability</span>
              <ArrowRightIcon size={14} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
