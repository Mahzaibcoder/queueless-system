import "./../../styles/components.css";

export default function Button({ children, type = "button", variant = "primary", size = "md", fullWidth = false, onClick, disabled, loading }) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : "",
    fullWidth ? "btn-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ borderRadius: "9999px", fontWeight: 700 }}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}