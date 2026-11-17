import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 shadow-sm sunnah-card-hover ${className}`}>
      {children}
    </div>
  );
}
