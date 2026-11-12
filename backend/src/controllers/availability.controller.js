// backend/src/controllers/availability.controller.js
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');

// Helper to convert "HH:mm" to minutes from midnight
const toMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Helper to convert minutes from midnight to "HH:mm"
const toTimeString = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Get availability for a business
exports.getByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const records = await Availability.find({
      $or: [
        { business: businessId },
        { businessId: businessId },
      ],
    }).sort({ day: 1 });

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save weekly availability (supports full array of 7 days or single day object)
exports.save = async (req, res) => {
  try {
    const { businessId } = req.params;
    const items = Array.isArray(req.body) ? req.body : [req.body];

    const results = [];
    for (const item of items) {
      const updated = await Availability.findOneAndUpdate(
        {
          $or: [{ business: businessId }, { businessId: businessId }],
          day: item.day,
        },
        {
          business: businessId,
          businessId: businessId,
          day: item.day,
          start: item.start || null,
          end: item.end || null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(updated);
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compute available slots: availability window minus existing bookings (PRD 4.3)
exports.getSlots = async (req, res) => {
  try {
    const { businessId, date, duration: durQuery } = req.query;
    if (!businessId || !date) {
      return res.status(400).json({ error: 'businessId and date are required' });
    }

    const duration = parseInt(durQuery, 10) || 30;

    // Determine day of week from YYYY-MM-DD
    // Parse year, month (0-indexed), and day to avoid timezone drift
    const [year, month, dayNum] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, dayNum, 12, 0, 0));
    const dayOfWeek = dateObj.getUTCDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday

    const availability = await Availability.findOne({
      $or: [{ business: businessId }, { businessId: businessId }],
      day: dayOfWeek,
    });

    // If no availability record found or day is closed (start or end is null)
    if (!availability || !availability.start || !availability.end) {
      return res.status(200).json({
        date,
        isClosed: true,
        availableSlots: [],
        bookedSlots: [],
        message: 'Business is closed on this day.',
      });
    }

    const openMin = toMinutes(availability.start);
    const closeMin = toMinutes(availability.end);

    // Generate potential slots
    const generatedSlots = [];
    for (let current = openMin; current + duration <= closeMin; current += duration) {
      generatedSlots.push(toTimeString(current));
    }

    // Query existing confirmed bookings on this date for this business
    const existingBookings = await Booking.find({
      $or: [{ business: businessId }, { businessId: businessId }],
      date,
      status: 'confirmed',
    });

    const bookedTimes = new Set();
    existingBookings.forEach((b) => {
      const bStart = toMinutes(b.time);
      const bEnd = bStart + (b.duration || duration);

      // Any slot that starts inside an existing booking window is unavailable
      generatedSlots.forEach((slot) => {
        const slotStart = toMinutes(slot);
        const slotEnd = slotStart + duration;
        // Overlap condition: slot starts before booking ends AND slot ends after booking starts
        if (slotStart < bEnd && slotEnd > bStart) {
          bookedTimes.add(slot);
        }
      });
    });

    const availableSlots = generatedSlots.filter((slot) => !bookedTimes.has(slot));

    res.status(200).json({
      date,
      dayOfWeek,
      isClosed: false,
      window: { start: availability.start, end: availability.end },
      duration,
      availableSlots,
      bookedSlots: Array.from(bookedTimes),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
