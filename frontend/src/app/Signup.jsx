import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Beauty");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const categories = ["Beauty", "Healthcare", "Fitness", "Consulting", "Restaurants"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (role === "owner" && (!businessName || !businessName.trim())) {
      setError("Please enter your business name.");
      return;
    }

    setLoading(true);
    const userData = {
      name,
      email,
      password,
      role,
      ...(role === "owner" && { businessName, businessCategory }),
    };

    const { user, error: err } = await register(userData);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: role === "owner" ? "/owner-dashboard" : "/browse" },
      })
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        width: "100%",
        maxWidth: "880px",
        margin: "0 auto",
        background: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "22px",
        boxShadow: "0 20px 50px -12px rgba(12, 27, 42, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* Left Column: Sign Up Form */}
      <div
        style={{
          padding: "2rem 2.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        {/* Brand Kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "var(--navy)",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "1.05rem",
              fontWeight: 800,
            }}
          >
            Q
          </div>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--teal-dark)",
            }}
          >
            Registration
          </span>
        </div>

        <h1
          style={{
            fontSize: "1.45rem",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "0.2rem",
            letterSpacing: "-0.4px",
            lineHeight: 1.2,
          }}
        >
          Create Portal Account
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Join QueueLess to book appointments or manage verified capacity.
        </p>

        {error && (
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "10px",
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: "0.82rem",
              marginBottom: "0.85rem",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontWeight: 700, color: "#DC2626" }}>!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Segmented Role Control */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.35rem",
                background: "#F1F5F9",
                padding: "3px",
                borderRadius: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setRole("customer")}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: role === "customer" ? "#FFFFFF" : "transparent",
                  color: role === "customer" ? "var(--navy)" : "var(--text-muted)",
                  fontWeight: role === "customer" ? 700 : 500,
                  fontSize: "0.84rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  boxShadow: role === "customer" ? "0 2px 6px rgba(12, 27, 42, 0.08)" : "none",
                  transition: "var(--transition)",
                }}
              >
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("owner")}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: role === "owner" ? "#FFFFFF" : "transparent",
                  color: role === "owner" ? "var(--navy)" : "var(--text-muted)",
                  fontWeight: role === "owner" ? 700 : 500,
                  fontSize: "0.84rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  boxShadow: role === "owner" ? "0 2px 6px rgba(12, 27, 42, 0.08)" : "none",
                  transition: "var(--transition)",
                }}
              >
                <span>Business Owner</span>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label
              htmlFor="signup-name"
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)" }}
            >
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="Alex Jordan"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.6rem 0.9rem",
                fontSize: "0.88rem",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                background: "#F8FAFC",
                color: "var(--text-dark)",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label
              htmlFor="signup-email"
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)" }}
            >
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@institution.edu.pk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.6rem 0.9rem",
                fontSize: "0.88rem",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                background: "#F8FAFC",
                color: "var(--text-dark)",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label
              htmlFor="signup-password"
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)" }}
            >
              Password (min. 6 chars)
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.6rem 0.9rem",
                fontSize: "0.88rem",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                background: "#F8FAFC",
                color: "var(--text-dark)",
                outline: "none",
              }}
            />
          </div>

          {/* Conditional Owner fields */}
          {role === "owner" && (
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "0.75rem 0.9rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--navy)" }}>
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="Apex Health Clinic"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.84rem",
                    borderRadius: "8px",
                    border: "1.5px solid var(--border)",
                    background: "#FFFFFF",
                    color: "var(--text-dark)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--navy)" }}>
                  Category
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.84rem",
                    borderRadius: "8px",
                    border: "1.5px solid var(--border)",
                    background: "#FFFFFF",
                    color: "var(--text-dark)",
                    outline: "none",
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem 1.4rem",
              borderRadius: "9999px",
              background: "var(--navy)",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              border: "none",
              boxShadow: "0 4px 14px rgba(12, 27, 42, 0.22)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              marginTop: "0.25rem",
              transition: "var(--transition)",
            }}
          >
            <span>{loading ? "Registering..." : "Complete Registration"}</span>
          </button>
        </form>

        {/* Switch Link */}
        <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: 0 }}>
            Already registered?{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("navigate", { detail: { href: "/login" } }));
              }}
              style={{ color: "var(--navy)", fontWeight: 700, textDecoration: "none" }}
            >
              Sign in here &rarr;
            </a>
          </p>
        </div>
      </div>

      {/* Right Column: Statement & Value (Same Unified Card, Concise) */}
      <div
        style={{
          background: "linear-gradient(145deg, #07111E 0%, #0C1B2A 100%)",
          padding: "2.25rem 2rem",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div>
          {/* Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(45, 212, 191, 0.12)",
              color: "var(--teal-light)",
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              border: "1px solid rgba(45, 212, 191, 0.25)",
            }}
          >
            <span>Verified Directory</span>
          </div>

          <h2
            style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.25,
              marginBottom: "0.75rem",
              letterSpacing: "-0.5px",
            }}
          >
            Punctual scheduling, <br />
            <span style={{ color: "var(--teal-light)" }}>zero waiting lines.</span>
          </h2>

          <p style={{ color: "#94A3B8", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            Join thousands of customers and premier local businesses standardizing appointment flow.
          </p>

          {/* 3 Short, Effective Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--teal-light)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "#F1F5F9", fontWeight: 500 }}>
                Guaranteed time slots with no double-booking
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--teal-light)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "#F1F5F9", fontWeight: 500 }}>
                Automated arrival and status notifications
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--teal-light)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "#F1F5F9", fontWeight: 500 }}>
                Dedicated customer and business dashboards
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "#94A3B8",
          }}
        >
          <span>Thousands of verified bookings</span>
          <span style={{ color: "var(--teal-light)", fontWeight: 600 }}>Quality Assured</span>
        </div>
      </div>
    </div>
  );
}
