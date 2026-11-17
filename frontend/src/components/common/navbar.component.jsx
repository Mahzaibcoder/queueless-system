import { useState, useEffect } from "react";
import Link from "./Link";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import Toast from "./toast.component";
import { useAuth } from "../../context/auth.context";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState(null);
  const { user, logout, isAuthenticated, isOwner } = useAuth();

  const publicLinks = [
    { href: "/#about", label: "About QueueLess" },
    { href: "/browse", label: "Browse" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#resources", label: "Resources" },
    { href: "/#updates", label: "Updates" },
  ];

  const customerLinks = [
    { href: "/browse", label: "Browse Businesses" },
    { href: "/my-bookings", label: "My Bookings" },
  ];

  const ownerLinks = [
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

  // Handle smooth sliding scroll to sections + browse auth guard
  const handleLinkClick = (e, href) => {
    // Guard: /browse requires login from landing page
    if (href === "/browse" && !isAuthenticated) {
      e.preventDefault();
      setToast({ message: "Please log in first to browse businesses", type: "warning" });
      setMobileOpen(false);
      return;
    }

    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      
      if (window.location.pathname === "/") {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
      } else {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new CustomEvent("navigate", { detail: { href: "/" } }));
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
      setMobileOpen(false);
    }
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Main Navbar - Aligned tightly to left using max-w-[1600px] and smaller side padding */}
      <nav className="w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between h-[4.5rem]">
          
          {/* Brand - Clean human typography */}
          <Link href="/" className="flex flex-col group cursor-pointer no-underline">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#16261A] group-hover:text-[#203626] transition-colors leading-tight font-serif sm:font-sans">
              Queue<span className="text-[#C49337]">Less</span>
            </span>
            <span className="text-[0.68rem] font-semibold text-[#636D62] tracking-wider uppercase">
              Smart Appointment &amp; Queue Framework
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {activeLinks.map((l) => {
              const isActive = currentPath === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 no-underline cursor-pointer ${
                    isActive
                      ? "bg-[#203626] text-[#FAF7F2] shadow-sm"
                      : "text-[#3D473C] hover:text-[#16261A] hover:bg-[#EFE8DA]/80"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-1.5 text-xs text-[#636D62] bg-[#F2ECE0] border border-[#E8E2D5] px-3.5 py-1.5 rounded-full">
                  <span>Signed in as</span>
                  <strong className="text-[#16261A] font-bold">{user?.name}</strong>
                  <span className="text-[#636D62]">({user?.role === "owner" ? "Owner" : "Customer"})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-[#203626] hover:bg-[#16261A] text-[#FAF7F2] text-sm font-bold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-none"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-sm font-bold text-[#16261A] hover:text-[#C49337] px-3.5 py-1.5 rounded-full hover:bg-[#EFE8DA]/60 transition-all duration-200 no-underline"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[#203626] hover:bg-[#16261A] text-[#FAF7F2] text-sm font-bold px-5 py-2 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
                >
                  <span>Get Started</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#16261A] hover:bg-[#EFE8DA] transition-colors border-none bg-transparent cursor-pointer text-xl"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-t border-[#E8E2D5] px-6 py-4 shadow-lg animate-in slide-in-from-top">
            <div className="flex flex-col gap-2">
              {activeLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className="py-2.5 px-3 rounded-xl text-base font-semibold text-[#16261A] hover:bg-[#EFE8DA] transition-colors no-underline border-b border-[#F2ECE0]"
                >
                  {l.label}
                </a>
              ))}

              <div className="pt-3">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <div className="text-center text-sm py-2 px-3 bg-[#F2ECE0] rounded-xl text-[#16261A] font-medium border border-[#E8E2D5]">
                      {user?.name} ({user?.role})
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setShowLogoutModal(true);
                        setMobileOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-center py-2.5 font-bold text-[#16261A] hover:text-[#C49337] transition-colors no-underline"
                    >
                      Log in
                    </Link>
                    <a
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 bg-[#203626] hover:bg-[#16261A] text-[#FAF7F2] py-2.5 px-4 rounded-full font-bold shadow-sm transition-all no-underline"
                    >
                      <span>Get Started</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Confirmation Modal for Logout */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign out"
        cancelText="Stay signed in"
        variant="warning"
        onConfirm={async () => {
          setShowLogoutModal(file => false);
          setShowLogoutModal(false);
          await logout();
          window.dispatchEvent(
            new CustomEvent("navigate", {
              detail: { href: "/login" },
            })
          );
        }}
        onClose={() => setShowLogoutModal(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}