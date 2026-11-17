import { useState, useEffect } from "react";
import { availabilityService, businessService } from "../services/api";
import { CalendarIcon, CheckCircleIcon } from "../components/common/Icons";

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
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
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
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      loadAvailability(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const loadInitialData = async () => {
    try {
      const bizRes = await businessService.getMyBusinesses();
      const list = bizRes.data || [];
      setBusinesses(list);
      if (list.length > 0) {
        setSelectedBusinessId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async (bizId) => {
    try {
      const { data } = await availabilityService.getByBusiness(bizId);
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
    if (!selectedBusinessId) {
      alert("Please select or create a business first.");
      return;
    }
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

      await availabilityService.save(selectedBusinessId, payload);
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
      <div className="flex justify-center items-center min-h-[60vh] bg-[#FAF7F2]">
        <div className="w-8 h-8 border-3 border-[#203626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] min-h-[85vh]">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Navigation Link */}
        <div className="mb-4">
          <a
            href="/owner-dashboard"
            className="text-xs sm:text-sm font-bold text-[#636D62] hover:text-[#16261A] transition-colors inline-flex items-center gap-1.5 no-underline"
          >
            &larr; Back to Dashboard
          </a>
        </div>

        {/* Forest Green Banner Header */}
        <div className="bg-[#182B1F] text-[#FAF7F2] border border-[#273D2E] rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full bg-[#253E2C] text-[#D9A948] border border-[#D9A948]/30 text-xs font-bold uppercase tracking-wider">
                Operating Hours
              </span>

              {businesses.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A8B3A3] font-semibold">Business:</span>
                  <select
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    className="bg-[#253E2C] text-white border border-[#3D5C43] rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer outline-none focus:border-[#D9A948]"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#182B1F] text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
              Set Weekly Availability
            </h1>
            <p className="text-xs sm:text-sm text-[#B4C2AF] m-0">
              Define open booking hours for each day of the week. Unchecked days will show as closed.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#253E2C] border border-[#3D5C43] flex items-center justify-center text-[#D9A948] flex-shrink-0">
            <CalendarIcon size={24} />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm sunnah-card-hover">
          {savedSuccess && (
            <div className="bg-[#F0F7F0] border border-[#C5DEC0] text-[#203626] p-4 rounded-2xl text-xs sm:text-sm font-bold mb-6 flex items-center gap-2">
              <CheckCircleIcon size={18} className="text-[#203626]" />
              <span>Schedule availability saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 mb-8">
              {DAYS.map((d) => {
                const item = schedule[d.key];
                return (
                  <div
                    key={d.key}
                    className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 sunnah-card-hover ${
                      item.active
                        ? "bg-[#FAF7F2] border-[#E8E2D5]"
                        : "bg-[#FAFAFA] border-[#F2ECE0] opacity-75"
                    }`}
                  >
                    {/* Day Toggle Switch & Label */}
                    <div className="flex items-center gap-3 min-w-[150px]">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => handleToggleDay(d.key)}
                        className="w-4 h-4 cursor-pointer accent-[#203626]"
                      />
                      <span className={`text-base font-bold ${item.active ? "text-[#16261A]" : "text-[#8E9B89]"}`}>
                        {d.name}
                      </span>
                    </div>

                    {/* Time Slot Selectors */}
                    {item.active ? (
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.7rem] text-[#636D62] font-bold uppercase">Start</span>
                          <input
                            type="time"
                            value={item.start}
                            onChange={(e) => handleTimeChange(d.key, "start", e.target.value)}
                            className="px-3 py-1.5 border border-[#E8E2D5] rounded-xl text-xs sm:text-sm font-semibold text-[#16261A] bg-white outline-none focus:border-[#C49337]"
                          />
                        </div>

                        <span className="text-[#636D62] font-bold">&ndash;</span>

                        <div className="flex items-center gap-2">
                          <span className="text-[0.7rem] text-[#636D62] font-bold uppercase">End</span>
                          <input
                            type="time"
                            value={item.end}
                            onChange={(e) => handleTimeChange(d.key, "end", e.target.value)}
                            className="px-3 py-1.5 border border-[#E8E2D5] rounded-xl text-xs sm:text-sm font-semibold text-[#16261A] bg-white outline-none focus:border-[#C49337]"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#8E9B89] bg-[#EFE8DA] px-3 py-1 rounded-full border border-[#E8E2D5]">
                        Closed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                "Saving Schedule..."
              ) : (
                <>
                  <CheckCircleIcon size={18} />
                  <span>Save Availability Schedule &rarr;</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
