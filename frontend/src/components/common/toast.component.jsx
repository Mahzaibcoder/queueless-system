import React, { useEffect, useState } from "react";

export default function Toast({ message, type = "info", duration = 3500, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "warning"
      ? "bg-[#FFF8E6] border-[#C49337] text-[#A37422]"
      : type === "error"
      ? "bg-red-50 border-red-400 text-red-700"
      : type === "success"
      ? "bg-green-50 border-green-400 text-green-700"
      : "bg-[#FAF7F2] border-[#E8E2D5] text-[#16261A]";

  const icon =
    type === "warning"
      ? "⚠️"
      : type === "error"
      ? "✕"
      : type === "success"
      ? "✓"
      : "ℹ";

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${bgColor} ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3"
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold">{message}</span>
      </div>
    </div>
  );
}
