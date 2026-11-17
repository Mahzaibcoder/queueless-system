import React, { useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import ConfirmationModal from "../common/ConfirmationModal";
import { useAuth } from "../../context/auth.context";

export default function MainLayout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isHomePage = currentPath === "/";

  const handleBackToHomeClick = () => {
    if (isAuthenticated) {
      setShowLogoutConfirm(true);
    } else {
      window.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { href: "/" },
        })
      );
    }
  };

  const confirmLogoutAndGoHome = async () => {
    setShowLogoutConfirm(false);
    await logout();
    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: "/" },
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#FAF7F2] overflow-x-hidden text-[#1A241C]">
      <Navbar />

      {/* Top-left Back to Home sub-bar when owner or customer is logged in */}
      {isAuthenticated && !isHomePage && (
        <div className="w-full bg-[#FAF6EF] border-b border-[#E8E2D5] px-4 sm:px-6 lg:px-8 py-2 flex items-center">
          <button
            type="button"
            onClick={handleBackToHomeClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#16261A] bg-white border border-[#E8E2D5] rounded-full hover:bg-[#F2ECE0] hover:border-[#C49337] transition-all duration-200 shadow-sm cursor-pointer"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      )}

      <main className="flex-1 w-full bg-[#FAF7F2]">{children}</main>
      <Footer />

      {/* Confirmation Modal when going back to home while logged in */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Log Out & Return to Home"
        message="To view the public home page, you will need to sign out of your account. Would you like to log out now?"
        confirmText="Log Out & Go Home"
        cancelText="Stay in Portal"
        variant="warning"
        onConfirm={confirmLogoutAndGoHome}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
