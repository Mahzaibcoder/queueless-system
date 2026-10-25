import "./../../styles/components.css";

export default function TimeSlot({ time, selected, disabled, onSelect }) {
  return (
    <button
      className={`slot-button ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
      onClick={onSelect}
      disabled={disabled}
    >
      {time}
    </button>
  );
}
