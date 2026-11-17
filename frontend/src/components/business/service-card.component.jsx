import "./../../styles/components.css";

export default function ServiceCard({ service, businessId, onSelect }) {
  return (
    <div className="card" style={{ padding: "1.5rem", cursor: "pointer" }} onClick={() => onSelect(service)}>
      <div className="flex-between">
        <div>
          <h4 style={{ color: "var(--navy)", fontWeight: "700", marginBottom: "0.25rem" }}>{service.name}</h4>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{service.description}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "800", color: "var(--teal-dark)", fontSize: "1.2rem" }}>${service.price}</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{service.duration} min</div>
        </div>
      </div>
    </div>
  );
}
