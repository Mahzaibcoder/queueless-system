// backend/src/controllers/booking.controller.js
const Booking = require('../models/Booking');
const Business = require('../models/Business');
const Service = require('../models/Service');

// Helper to convert "HH:mm" to minutes from midnight
const toMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

exports.getAll = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1, time: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({
      $or: [
        { user: userId },
        { userId: userId },
        { userExternalId: userId },
      ],
    }).sort({ date: 1, time: 1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const bookings = await Booking.find({
      $or: [{ business: businessId }, { businessId: businessId }],
    }).sort({ date: 1, time: 1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create booking with STRICT SERVER-SIDE CONFLICT PREVENTION (PRD 4.4)
exports.create = async (req, res) => {
  try {
    const {
      businessId,
      serviceId,
      date,
      time,
      duration: reqDuration,
      price: reqPrice,
      serviceName: reqServiceName,
      businessName: reqBusinessName,
    } = req.body;

    const bId = businessId || req.body.business;
    const sId = serviceId || req.body.service;
    const userId = req.user ? req.user.id : (req.body.userId || req.body.user);

    if (!bId || !sId || !date || !time) {
      return res.status(400).json({ error: 'businessId, serviceId, date, and time are required.' });
    }

    // Look up service and business details if not provided
    let duration = reqDuration;
    let price = reqPrice;
    let serviceName = reqServiceName;
    let businessName = reqBusinessName;

    if (!duration || !serviceName) {
      const svc = await Service.findById(sId);
      if (svc) {
        duration = duration || svc.duration;
        price = price !== undefined ? price : svc.price;
        serviceName = serviceName || svc.name;
      }
    }

    if (!businessName) {
      const biz = await Business.findById(bId);
      if (biz) {
        businessName = biz.name;
      }
    }

    duration = parseInt(duration, 10) || 30;

    // --- CONFLICT CHECK ---
    const reqStart = toMinutes(time);
    const reqEnd = reqStart + duration;

    // Find all confirmed bookings on the same date for this business
    const existingBookings = await Booking.find({
      $or: [{ business: bId }, { businessId: bId }],
      date,
      status: 'confirmed',
    });

    for (const eb of existingBookings) {
      const ebStart = toMinutes(eb.time);
      const ebEnd = ebStart + (eb.duration || duration);

      // Overlap condition:
      if (reqStart < ebEnd && reqEnd > ebStart) {
        return res.status(409).json({
          error: `Conflict: This time slot (${time}) is already booked for ${businessName || 'this business'}. Please select an open slot.`,
        });
      }
    }

    // Create and save confirmed booking
    // Validate user identifier – allow either a MongoDB ObjectId or a custom string ID.
    const mongoose = require('mongoose');
    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId) &&
      String(new mongoose.Types.ObjectId(userId)) === userId;
    const userObjectId = isValidObjectId ? userId : undefined;

    const newBooking = new Booking({
      business: bId,
      businessId: bId,
      // Store ObjectId if valid, otherwise omit and keep external string.
      ...(userObjectId && { user: userObjectId, userId: userObjectId }),
      ...(!userObjectId && { userExternalId: userId }),
      service: sId,
      serviceId: sId,
      businessName: businessName || 'Verified Business',
      serviceName: serviceName || 'Standard Service',
      date,
      time,
      duration,
      price: price || 0,
      status: 'confirmed',
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelReason: req.body.reason || 'Cancelled by user' },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
