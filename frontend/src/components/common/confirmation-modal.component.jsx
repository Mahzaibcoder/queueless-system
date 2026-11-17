import React from "react";

export default function ConfirmationModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
  children,
}) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 bg-[#16261A]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl flex flex-col gap-5 border border-[#E8E2D5] sunnah-card-hover">
        <div className="flex items-start gap-4">
          {/* Icon Badge */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDanger
                ? "bg-[#FEF5F4] text-[#C0392B] border border-[#F5C2BE]"
                : "bg-[#FFF8E6] text-[#C49337] border border-[#E8D5A0]"
            }`}
          >
            {isDanger ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <h3 className="m-0 text-lg font-bold text-[#16261A] tracking-tight">
              {title}
            </h3>
            <p className="mt-1 mb-0 text-xs sm:text-sm text-[#556054] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {children && <div className="mt-0">{children}</div>}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#FAF7F2] text-[#556054] border border-[#E8E2D5] hover:bg-[#F2ECE0] hover:text-[#16261A] cursor-pointer transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow transition-all cursor-pointer border-none disabled:opacity-50 inline-flex items-center gap-2 ${
              isDanger
                ? "bg-[#C0392B] hover:bg-[#962D22]"
                : "bg-[#203626] hover:bg-[#16261A]"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
