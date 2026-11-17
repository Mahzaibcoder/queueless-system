export const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  const [h, m] = timeString.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

export const generateSlots = (start, end, durationMinutes) => {
  const slots = [];
  let [sh, sm] = start.split(":").map(Number);
  let [eh, em] = end.split(":").map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (current + durationMinutes <= endMin) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    current += durationMinutes;
  }
  return slots;
};

export const isSameDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.toDateString() === d2.toDateString();
};

export const getWeekDates = (offset = 0) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const diff = today.getDate() - day + offset * 7;
  const monday = new Date(today.setDate(diff));
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d.toISOString().split("T")[0]);
  }
  return week;
};
