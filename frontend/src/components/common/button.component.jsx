import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  disabled,
  loading,
  className = "",
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs sm:text-sm",
    lg: "px-6 py-3 text-sm sm:text-base",
  }[size] || "px-5 py-2.5 text-xs sm:text-sm";

  const variantClasses = {
    primary: "bg-[#203626] hover:bg-[#16261A] text-white shadow-sm hover:shadow border border-[#203626]",
    secondary: "bg-white text-[#16261A] border border-[#E8E2D5] hover:bg-[#F2ECE0]",
    outline: "bg-transparent text-[#203626] border border-[#E8E2D5] hover:bg-[#FAF6EF]",
    gold: "bg-[#C49337] hover:bg-[#A37422] text-white shadow-sm border border-[#C49337]",
    danger: "bg-[#FEF5F4] hover:bg-[#FDD8D5] text-[#C0392B] border border-[#F5C2BE]",
  }[variant] || "bg-[#203626] hover:bg-[#16261A] text-white";

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? "w-full" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
