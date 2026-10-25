import { useState, useEffect } from "react";
import { serviceService } from "../services/api";
import { ServiceIcon, TrashIcon, EditIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await serviceService.getByBusiness("b1");
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Please enter a service name and price.");
      return;
    }

    setSaving(true);
    try {
      const newSvc = {
        businessId: "b1",
        name,
        duration: parseInt(duration, 10),
        price: parseFloat(price),
        description,
      };
      const { data } = await serviceService.create(newSvc);
      setServices([...services, data]);
      setName("");
      setPrice("");
      setDescription("");
      alert("Service added successfully!");
    } catch (err) {
      alert("Failed to add service. Please try again.");
    } finally {
      setSaving(false);
    }
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
        
        {/* Navigation Link */}
        <div style={{ marginBottom: "1rem" }}>
          <a href="/owner-dashboard" style={{ color: "var(--text-muted)", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>
            &larr; Back to Dashboard
          </a>
        </div>

        {/* SECTION 1: Blue Header Banner */}
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
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.5px" }}>
              Service Catalog Management
            </h1>
            <p style={{ color: "var(--text-light)", fontSize: "0.95rem", margin: 0 }}>
              Add new services or manage existing appointment offerings for your customers.
            </p>
          </div>
          <span style={{ padding: "0.35rem 0.9rem", borderRadius: "9999px", background: "rgba(45, 212, 191, 0.15)", color: "var(--teal-light)", fontSize: "0.82rem", fontWeight: 800, border: "1px solid rgba(45, 212, 191, 0.3)" }}>
            {services.length} Active Services
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }}>
          
          {/* SECTION 2: Active Services List Area */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.75rem",
              boxShadow: "0 4px 12px rgba(12, 27, 42, 0.03)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", color: "#0C1B2A", fontWeight: 800, margin: "0 0 1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
              Existing Services ({services.length})
            </h2>

            {services.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "1.25rem",
                      background: "var(--surface)",
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0C1B2A", margin: "0 0 0.25rem" }}>
                        {svc.name}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 0.5rem" }}>
                        {svc.description || "No description provided."}
                      </p>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-dark)", fontWeight: 700 }}>
                        ⏱ {svc.duration} Minutes Duration
                      </div>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--teal-dark)", marginBottom: "0.5rem" }}>
                        ${svc.price}
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>
                        ID: {svc.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                No services currently listed. Use the form to add your first service.
              </div>
            )}
          </div>

          {/* SECTION 3: Create Service Form */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "14px",
              padding: "1.75rem",
              boxShadow: "0 4px 12px rgba(12, 27, 42, 0.03)",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", color: "#0C1B2A", fontWeight: 800, margin: "0 0 1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
              Add New Service
            </h2>

            <form onSubmit={handleAddService} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0C1B2A", marginBottom: "0.35rem" }}>
                  Service Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Haircut & Style"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0C1B2A", marginBottom: "0.35rem" }}>
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    placeholder="35"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0C1B2A", marginBottom: "0.35rem" }}>
                    Duration (Mins)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none",
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="15">15 Mins</option>
                    <option value="30">30 Mins</option>
                    <option value="45">45 Mins</option>
                    <option value="60">60 Mins</option>
                    <option value="90">90 Mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0C1B2A", marginBottom: "0.35rem" }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Brief description of what is included in this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-navy-pill"
                disabled={saving}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.65rem",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                }}
              >
                {saving ? "Saving..." : "Add Service Offer"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}