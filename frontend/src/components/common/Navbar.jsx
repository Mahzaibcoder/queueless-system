import { useState } from "react";
import Link from "./Link";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";
import "./../../styles/components.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated, isOwner } = useAuth();

  const publicLinks = [
    { href: "/#about", label: "About QueueLess" },
    { href: "/browse", label: "Browse" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#resources", label: "Resources" },
    { href: "/#updates", label: "Updates" },
  ];

  const customerLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Businesses" },
    { href: "/my-bookings", label: "My Bookings" },
  ];

  const ownerLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Businesses" },
    { href: "/owner-dashboard", label: "Dashboard" },
    { href: "/manage-services", label: "Services" },
    { href: "/set-availability", label: "Availability" },
  ];

  const activeLinks = isAuthenticated
    ? isOwner
      ? ownerLinks
      : customerLinks
    : publicLinks;

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div className="navbar-wrapper">
      {/* Main Navbar - 100% Full Screen Width */}
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link href="/" className="brand">
            <div className="brand-icon-box">Q</div>
            <div className="brand-text-group">
              <span className="brand-title">QueueLess</span>
              <span className="brand-subtitle">Smart Appointment & Queue Framework</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            {activeLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link ${currentPath === l.href ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="auth-actions">
            {isAuthenticated ? (
              <>
                <div className="user-badge">
                  <span>Signed in as</span>
                  <strong>{user?.name}</strong>
                  <span>({user?.role === "owner" ? "Owner" : "Customer"})</span>
                </div>
                <button
                  type="button"
                  className="btn-portal"
                  onClick={logout}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn-portal" style={{ textDecoration: "none" }}>
                  Log in
                </a>
                <a href="/browse" className="btn-portal" style={{ textDecoration: "none" }}>
                  <span>Explore portal</span>
                  <span className="btn-portal-arrow">&rarr;</span>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {activeLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.6rem 0",
                  color: "var(--navy)",
                  fontWeight: "600",
                  fontSize: "1rem",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                {l.label}
              </a>
            ))}

            <div style={{ paddingTop: "1rem" }}>
              {isAuthenticated ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="user-badge" style={{ justifyContent: "center" }}>
                    {user?.name} ({user?.role})
                  </div>
                  <Button variant="outline" fullWidth onClick={() => { logout(); setMobileOpen(false); }}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      textAlign: "center",
                      padding: "0.75rem",
                      fontWeight: "600",
                      color: "var(--navy)",
                    }}
                  >
                    Log in
                  </Link>
                  <a
                    href="/browse"
                    onClick={() => setMobileOpen(false)}
                    className="btn-portal"
                    style={{ justifyContent: "center" }}
                  >
                    <span>Explore portal</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}