import { useState } from "react";
import { businessService } from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { BuildingIcon, ArrowRightIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function CreateBusiness() {
  const [form, setForm] = useState({
    name: "",
    category: "Beauty",
    description: "",
    location: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const categories = ["Beauty", "Healthcare", "Fitness", "Consulting", "Restaurants"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await businessService.create(form);
      setLoading(false);
      setCreated(true);
    } catch (err) {
      setLoading(false);
      setError("Failed to create business. Please try again.");
    }
  };

  if (created) {
    return (
      <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <div className="container">
          <div className="card" style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              <BuildingIcon size={48} style={{ color: "var(--primary)" }} />
            </div>
            <h2 style={{ color: "var(--primary-dark)", marginBottom: "0.75rem" }}>Business Created!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Your business profile is live. Next, add services and set availability.
            </p>
            <a href="/manage-services" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary">Add Services</button>
            </a>
            <br />
            <a href="/owner-dashboard" style={{ textDecoration: "none", marginTop: "1rem", display: "inline-block", color: "var(--primary)", fontWeight: "600" }}>
              Go to Dashboard <ArrowRightIcon size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "clamp(2rem, 5vw, 3rem) 1rem clamp(3rem, 5vw, 4rem)" }}>
      <div className="container">
        <div className="form-card form-container">
          <h2 style={{ fontSize: "1.75rem", color: "var(--primary-dark)", marginBottom: "0.5rem" }}>Create Business Profile</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Tell us about your business so customers can find you.</p>

          {error && (
            <div style={{
              padding: "0.75rem", borderRadius: "var(--radius)", background: "var(--danger-bg)",
              color: "var(--danger)", fontSize: "0.88rem", marginBottom: "1.25rem",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <Input id="name" label="Business name" placeholder="Luna Glow Salon"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input id="description" label="Description" placeholder="What services do you offer?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <div className="form-group">
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input id="location" label="Location / Address" placeholder="123 Main Street, Downtown"
              value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            <Input id="phone" label="Phone" type="tel" placeholder="+1 (555) 000-0000"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />

            <Button type="submit" variant="primary" fullWidth loading={loading} style={{ fontSize: "1rem", padding: "1rem 0" }}>
              Create Business
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
