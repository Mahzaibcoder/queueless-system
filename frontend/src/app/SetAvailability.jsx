import { useState, useEffect } from "react";
import { availabilityService } from "../services/api";
import { CalendarIcon, CheckCircleIcon } from "../components/common/Icons";
import "../styles/components.css";

const DAYS = [
  { key: 1, name: "Monday" },
  { key: 2, name: "Tuesday" },
  { key: 3, name: "Wednesday" },
  { key: 4, name: "Thursday" },
  { key: 5, name: "Friday" },
  { key: 6, name: "Saturday" },
  { key: 0, name: "Sunday" },
];

export default function SetAvailability() {
  const [schedule, setSchedule] = useState({
    1: { active: true, start: "09:00", end: "17:00" },
    2: { active: true, start: "09:00", end: "17:00" },
    3: { active: true, start: "09:00", end: "17:00" },
    4: { active: true, start: "09:00", end: "17:00" },
    5: { active: true, start: "09:00", end: "15:00" },
    6: { active: false, start: "09:00", end: "17:00" },
    0: { active: false, start: "09:00", end: "17:00" },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const { data } = await availabilityService.getByBusiness("b1");
      if (data && data.length > 0) {
        const mapped = { ...schedule };
        data.forEach((slot) => {
          if (slot.start && slot.end) {
            mapped[slot.day] = { active: true, start: slot.start, end: slot.end };
          } else {
            mapped[slot.day] = { ...mapped[slot.day], active: false };
          }
        });
        setSchedule(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayKey) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], active: !prev[dayKey].active },
    }));
  };

  const handleTimeChange = (dayKey, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = DAYS.map((d) => {
        const item = schedule[d.key];
        return {
          day: d.key,
          start: item.active ? item.start : null,
          end: item.active ? item.end : null,
        };
      });

      await availabilityService.save("b1", payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert("Failed to save availability schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <section
      style={{
        padding: "2.5rem 5vw 4rem",
        background: "var(--bg)",
        minHeight: "85vh",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div className="container" style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* Navigation Link */}
        <div style={{ marginBottom: "1rem" }}>
          <a href="/owner-dashboard" style={{ color: "var(--text-muted)", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>
            &larr; Back to Dashboard
          </a>
        </div>

        {/* SECTION 1: Deep Navy Banner Header */}
        <div
          style={{
            background: "#0C1B2A",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            padding: "1.75rem 2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 12px rgba(12, 27, 42, 0.1)",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(45, 212, 191, 0.15)",
                color: "var(--teal-light)",
                border: "1px solid rgba(45, 212, 191, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Operating Hours
            </span>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0.5rem 0 0.25rem", letterSpacing: "-0.5px" }}>
              Set Weekly Availability
            </h1>
            <p style={{ color: "var(--text-light)", fontSize: "0.92rem", margin: 0 }}>
              Define open booking hours for each day of the week. Unchecked days will show as closed.
            </p>
          </div>

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justify: "center",
              color: "var(--teal-light)",
            }}
          >
            <CalendarIcon size={24} />
          </div>
        </div>

        {/* SECTION 2: Form Container with High-Contrast Boundaries */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid var(--border)",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 12px rgba(12, 27, 42, 0.03)",
          }}
        >
          {savedSuccess && (
            <div
              style={{
                background: "#ECFDF5",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#065F46",
                padding: "0.85rem 1.25rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CheckCircleIcon size={18} /> Schedule availability saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {DAYS.map((d) => {
                const item = schedule[d.key];
                return (
                  <div
                    key={d.key}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "1rem 1.25rem",
                      background: item.active ? "var(--surface)" : "#FAFAFA",
                      display: "flex",
                      alignItems: "center",
                      justify: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                      transition: "var(--transition)",
                    }}
                  >
                    {/* Day Toggle Switch & Label */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: "150px" }}>
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => handleToggleDay(d.key)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "#0C1B2A",
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: item.active ? "#0C1B2A" : "var(--text-muted)",
                        }}
                      >
                        {d.name}
                      </span>
                    </div>

                    {/* Time Slot Selectors */}
                    {item.active ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Start</span>
                          <input
                            type="time"
                            value={item.start}
                            onChange={(e) => handleTimeChange(d.key, "start", e.target.value)}
                            style={{
                              padding: "0.45rem 0.75rem",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                              fontSize: "0.88rem",
                              fontWeight: 600,
                              color: "#0C1B2A",
                              background: "#FFFFFF",
                              outline: "none",
                            }}
                          />
                        </div>

                        <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>&ndash;</span>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>End</span>
                          <input
                            type="time"
                            value={item.end}
                            onChange={(e) => handleTimeChange(d.key, "end", e.target.value)}
                            style={{
                              padding: "0.45rem 0.75rem",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                              fontSize: "0.88rem",
                              fontWeight: 600,
                              color: "#0C1B2A",
                              background: "#FFFFFF",
                              outline: "none",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          background: "var(--bg-light)",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "9999px",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        Closed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* High-Impact CTA Save Button (Matching Sign-Up Styling) */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: "#0C1B2A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9999px",
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "0.3px",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(12, 27, 42, 0.2)",
                transition: "all 0.2s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                if (!saving) e.currentTarget.style.background = "#142A40";
              }}
              onMouseOut={(e) => {
                if (!saving) e.currentTarget.style.background = "#0C1B2A";
              }}
            >
              {saving ? (
                "Saving Schedule..."
              ) : (
                <>
                  <CheckCircleIcon size={18} /> Save Availability Schedule
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}