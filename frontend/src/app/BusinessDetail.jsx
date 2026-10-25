import { useState, useEffect } from "react";
import { businessService, serviceService, availabilityService } from "../services/api";
import ServiceCard from "../components/business/ServiceCard";
import { StarIcon, CalendarIcon, BuildingIcon, CheckCircleIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function BusinessDetail({ id }) {
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const idFromPath = pathParts[pathParts.length - 1];
    const params = new URLSearchParams(window.location.search);
    const resolvedId = id || (idFromPath && idFromPath !== "business" ? idFromPath : params.get("id")) || "b1";

    Promise.all([
      businessService.getById(resolvedId),
      serviceService.getByBusiness(resolvedId),
      availabilityService.getByBusiness(resolvedId),
    ])
      .then(([bRes, sRes, aRes]) => {
        setBusiness(bRes.data);
        setServices(sRes.data || []);
        setAvailability(aRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!business) {
    return (
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", background: "var(--bg)", minHeight: "75vh" }}>
        <div className="container">
          <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem", border: "1px solid var(--border)", borderRadius: "12px" }}>
            <h3 style={{ color: "#0C1B2A", fontWeight: 800, marginBottom: "0.5rem" }}>Business Not Found</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>The requested business profile is not available.</p>
            <a href="/browse" className="btn-navy-pill">Browse directory</a>
          </div>
        </div>
      </section>
    );
  }

  const handleSelectService = (service) => {
    window.location.href = `/book?business=${business.id}&service=${service.id}`;
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="homepage-wrapper" style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: "var(--bg)", minHeight: "100vh" }}>
      
      {/* Light Page Header (No dark blue banner background) */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid var(--border)", padding: "2.5rem 5vw 2rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          
          {/* Breadcrumb Navigation Link */}
          <div style={{ marginBottom: "1rem" }}>
            <a href="/browse" style={{ color: "var(--text-muted)", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>
              &larr; Back to Directory
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  background: "var(--teal-bg)",
                  color: "var(--teal-dark)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {business.category}
              </span>

              {/* Dark Navy Business Title */}
              <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 800, color: "#0C1B2A", margin: "0.6rem 0 0.5rem", letterSpacing: "-0.5px" }}>
                {business.name}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "var(--text-dark)", fontWeight: 500 }}>
                  <BuildingIcon size={16} /> {business.location || business.address}
                </span>
                <span>&bull;</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 500 }}>{business.phone}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--surface)", border: "1px solid var(--border)", padding: "0.6rem 1.25rem", borderRadius: "9999px" }}>
              <StarIcon size={18} style={{ color: "var(--teal-dark)" }} />
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0C1B2A" }}>{business.rating || "4.9"}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>({business.reviewCount || "120"} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Content */}
      <section style={{ padding: "2.5rem 5vw 4rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
          
          {/* Main Area: About + Services with Clear Boundaries */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Overview Description Box */}
            <div
              style={{
                padding: "2rem",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(12, 27, 42, 0.03)",
              }}
            >
              <h2 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.75rem", letterSpacing: "-0.2px" }}>
                About {business.name}
              </h2>
              <p style={{ color: "var(--text-dark)", fontSize: "0.98rem", lineHeight: "1.65", marginBottom: "1.25rem" }}>
                {business.description}
              </p>
              
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "1rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                <div>
                  <strong style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Queue Status
                  </strong>
                  <span style={{ fontWeight: 800, color: "#000000", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--teal)" }} />
                    Open for Bookings
                  </span>
                </div>
                <div>
                  <strong style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Instant Confirmation
                  </strong>
                  <span style={{ fontWeight: 700, color: "var(--teal-dark)", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem" }}>
                    <CheckCircleIcon size={16} /> Guaranteed
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Boundary Container around Available Services & Bookings */}
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid var(--border)",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-light)" }}>
                <div>
                  <h2 style={{ fontSize: "1.35rem", color: "#0C1B2A", fontWeight: 800, letterSpacing: "-0.2px", margin: 0 }}>
                    Available Services & Bookings
                  </h2>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                    Select an available service below to reserve your appointment slot.
                  </p>
                </div>
                <span style={{ padding: "0.3rem 0.8rem", borderRadius: "9999px", background: "var(--bg-light)", border: "1px solid var(--border)", fontSize: "0.82rem", color: "#0C1B2A", fontWeight: 700 }}>
                  {services.length} {services.length === 1 ? "Service" : "Services"}
                </span>
              </div>

              {services.length > 0 ? (
                <div style={{ display: "grid", gap: "1.25rem" }}>
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "var(--surface)",
                      }}
                    >
                      <ServiceCard service={svc} businessId={business.id} onSelect={handleSelectService} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No services currently listed for online scheduling.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Photo Preview & Opening Hours */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Image Preview Card */}
            <div style={{ overflow: "hidden", border: "1px solid var(--border)", borderRadius: "14px", background: "#FFFFFF" }}>
              <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                <img
                  src={business.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&h=500&q=80"}
                  alt={business.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Weekly Opening Hours Card */}
            <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "14px", background: "#FFFFFF" }}>
              <h3 style={{ color: "#0C1B2A", fontWeight: 800, fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CalendarIcon size={18} /> Opening Hours
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem" }}>
                {dayNames.map((day, idx) => {
                  const slot = availability.find((a) => a.day === idx);
                  const isOpen = slot && slot.start;
                  return (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", color: isOpen ? "#0C1B2A" : "var(--text-muted)" }}>
                      <span style={{ fontWeight: 600 }}>{day}</span>
                      <span style={{ fontWeight: isOpen ? 700 : 400, color: isOpen ? "var(--teal-dark)" : "var(--text-muted)" }}>
                        {isOpen ? `${slot.start} - ${slot.end}` : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}