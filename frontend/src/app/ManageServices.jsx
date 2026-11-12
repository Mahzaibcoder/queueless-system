import { useState, useEffect } from "react";
import { serviceService, businessService } from "../services/api";
import { ServiceIcon, TrashIcon, EditIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function ManageServices() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      loadServices(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const loadInitialData = async () => {
    try {
      const bizRes = await businessService.getMyBusinesses();
      const list = bizRes.data || [];
      setBusinesses(list);
      if (list.length > 0) {
        setSelectedBusinessId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async (bizId) => {
    try {
      const { data } = await serviceService.getByBusiness(bizId);
      setServices(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!selectedBusinessId) {
      alert("Please select or create a business first.");
      return;
    }
    if (!name || !price) {
      alert("Please enter a service name and price.");
      return;
    }

    setSaving(true);
    try {
      const newSvc = {
        businessId: selectedBusinessId,
        business: selectedBusinessId,
        name,
        duration: parseInt(duration, 10),
        price: parseFloat(price),
        description,
      };
      const res = await serviceService.create(newSvc);
      if (res.error) {
        alert("Failed to add service: " + res.error);
      } else {
        setServices([...services, res.data]);
        setName("");
        setPrice("");
        setDescription("");
        alert("Service added successfully!");
      }
    } catch (err) {
      alert("Failed to add service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await serviceService.remove(id);
      if (res.error) {
        alert("Failed to delete service: " + res.error);
      } else {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert("Error deleting service");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "var(--bg)" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <section style={{ padding: "2.5rem clamp(1.5rem, 4vw, 3.5rem) 4rem", background: "var(--bg)", minHeight: "85vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation Link */}
        <div style={{ marginBottom: "1rem" }}>
          <a href="/owner-dashboard" style={{ color: "var(--text-muted)", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>
            &larr; Back to Dashboard
          </a>
        </div>

        {/* Deep Navy Header Banner */}
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
            gap: "1rem",
          }}
        >
          <div>
            <div className="section-kicker section-kicker-light" style={{ marginBottom: '0.4rem' }}>Catalog Management</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.5px" }}>
              Service Catalog
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0 }}>
              Add new services or manage existing appointment offerings for your customers.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {businesses.length > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 600 }}>Business:</span>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
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
            <span style={{ padding: "0.35rem 0.9rem", borderRadius: "9999px", background: "rgba(45, 212, 191, 0.15)", color: "var(--teal-light)", fontSize: "0.82rem", fontWeight: 800, border: "1px solid rgba(45, 212, 191, 0.3)" }}>
              {services.length} Active Services
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }}>
          
          {/* Active Services List Area */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", color: "var(--navy)", fontWeight: 800, margin: "0 0 1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
              Existing Services ({services.length})
            </h2>

            {services.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "1.25rem",
                      background: "var(--surface)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      transition: "var(--transition)",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 0.25rem" }}>
                        {svc.name}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 0.5rem" }}>
                        {svc.description || "No description provided."}
                      </p>
                      <div style={{ fontSize: "0.82rem", color: "var(--navy)", fontWeight: 700 }}>
                        ⏱ {svc.duration} Minutes Duration
                      </div>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "100px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--teal-dark)" }}>
                        ${svc.price}
                      </div>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        style={{
                          background: "var(--danger-bg)",
                          color: "var(--danger)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          borderRadius: "6px",
                          padding: "0.25rem 0.5rem",
                          cursor: "pointer",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <TrashIcon size={13} /> Delete
                      </button>
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

          {/* Create Service Form */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "var(--shadow-sm)",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", color: "var(--navy)", fontWeight: 800, margin: "0 0 1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
              Add New Service
            </h2>

            <form onSubmit={handleAddService} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="label">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Haircut & Style"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="label">Price ($) *</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="label">Duration (Mins)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="form-input"
                    style={{ background: "#F8FAFC" }}
                  >
                    <option value="15">15 Mins</option>
                    <option value="30">30 Mins</option>
                    <option value="45">45 Mins</option>
                    <option value="60">60 Mins</option>
                    <option value="90">90 Mins</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="label">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of what is included in this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  justifyContent: "center",
                  fontSize: "0.92rem",
                  borderRadius: "9999px",
                }}
              >
                {saving ? "Saving..." : "Add Service Offer \u2192"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
