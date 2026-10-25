import "./../../styles/components.css";

export default function Input({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "0.35rem" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "0.86rem",
            fontWeight: "600",
            color: "var(--navy)",
            display: "block",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          display: "block",
          width: "100%",
          padding: "0.85rem 1.15rem",
          fontSize: "0.95rem",
          borderRadius: "12px",
          border: error ? "1.5px solid #EF4444" : "1.5px solid var(--border)",
          background: "#F8FAFC",
          color: "var(--text-dark)",
          outline: "none",
          transition: "var(--transition)",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <span style={{ color: "#EF4444", fontSize: "0.82rem", marginTop: "0.15rem" }}>
          {error}
        </span>
      )}
    </div>
  );
}
