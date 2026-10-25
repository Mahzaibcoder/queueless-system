import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || !password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const { user, error: err } = await login(email, password);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: user?.role === "owner" ? "/owner-dashboard" : "/browse" },
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
      {/* Left Column: Sign In Form */}
      <div
        style={{
          padding: "2.25rem 2.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        {/* Brand Kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
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
            Portal Access
          </span>
        </div>

        <h1
          style={{
            fontSize: "1.45rem",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "0.25rem",
            letterSpacing: "-0.4px",
            lineHeight: 1.2,
          }}
        >
          Sign in to QueueLess
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Enter your credentials to access your verified portal.
        </p>

        {error && (
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "10px",
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: "0.82rem",
              marginBottom: "1rem",
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label
              htmlFor="login-email"
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)" }}
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.65rem 0.95rem",
                fontSize: "0.9rem",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                background: "#F8FAFC",
                color: "var(--text-dark)",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label
                htmlFor="login-password"
                style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)" }}
              >
                Password
              </label>
              <a
                href="#"
                style={{ fontSize: "0.78rem", color: "var(--teal-dark)", fontWeight: 600, textDecoration: "none" }}
              >
                Forgot password?
              </a>
            </div>
            <input
              id="login-password"
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
                padding: "0.65rem 0.95rem",
                fontSize: "0.9rem",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                background: "#F8FAFC",
                color: "var(--text-dark)",
                outline: "none",
              }}
            />
          </div>

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
              marginTop: "0.35rem",
              transition: "var(--transition)",
            }}
          >
            <span>{loading ? "Signing in..." : "Sign in to Portal"}</span>
          </button>
        </form>

        {/* Demo Hint */}
        <div
          style={{
            marginTop: "1.15rem",
            padding: "0.6rem 0.85rem",
            background: "#F8FAFC",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "0.76rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            <strong>Quick Demo:</strong> <code style={{ color: "var(--teal-dark)" }}>alex@example.com</code> / <code style={{ color: "var(--teal-dark)" }}>password123</code>
          </div>
        </div>

        {/* Switch Link */}
        <div style={{ marginTop: "1.15rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: 0 }}>
            Don't have a portal account?{" "}
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("navigate", { detail: { href: "/signup" } }));
              }}
              style={{ color: "var(--navy)", fontWeight: 700, textDecoration: "none" }}
            >
              Register now &rarr;
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
            <span>National Framework</span>
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
            Zero wait times. <br />
            <span style={{ color: "var(--teal-light)" }}>Instant scheduling.</span>
          </h2>

          <p style={{ color: "#94A3B8", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            A verified platform synchronizing open capacity across top clinics, salons, and services.
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
                Real-time open slot verification
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
                Automated on-time arrival alerts
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
                Instant booking confirmation
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
          <span>4.9 / 5 satisfaction</span>
          <span style={{ color: "var(--teal-light)", fontWeight: 600 }}>99.4% Punctual</span>
        </div>
      </div>
    </div>
  );
}
