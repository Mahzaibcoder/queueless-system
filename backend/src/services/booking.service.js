// src/services/booking.service.js
const Booking = require('../models/Booking');
const Business = require('../models/Business');
const Service = require('../models/Service');
const { CONFIRMED, CANCELLED } = require('../enums/bookingStatus');
const AppError = require('../errors/AppError');

const getByUser = async (userId) => {
  return await Booking.find({ user: userId }).sort({ createdAt: -1 });
};

const getByBusiness = async (businessId, ownerId = null) => {
  let targetBusinessId = businessId;

  if ((!targetBusinessId || targetBusinessId === 'b1') && ownerId) {
    const ownerBusiness = await Business.findOne({ owner: ownerId });
    if (ownerBusiness) {
      targetBusinessId = ownerBusiness._id;
    }
  }

  return await Booking.find({ business: targetBusinessId }).sort({ createdAt: -1 });
};

const create = async (userId, payload) => {
  let { businessId, serviceId, serviceName, date, time, duration, price } = payload;

  // Resolve businessId if placeholder passed
  if (!businessId || businessId === 'b1') {
    const firstBiz = await Business.findOne();
    if (firstBiz) businessId = firstBiz._id;
  }

  // Resolve service if not passed or placeholder
  let resolvedService;
  if (serviceId && serviceId.match(/^[0-9a-fA-F]{24}$/)) {
    resolvedService = await Service.findById(serviceId);
  }
  if (!resolvedService) {
    resolvedService = await Service.findOne({ business: businessId });
  }

  const biz = await Business.findById(businessId);
  const finalBusinessName = biz ? biz.name : (payload.businessName || 'Business');
  const finalServiceName = resolvedService ? resolvedService.name : (serviceName || 'Service');
  const finalDuration = resolvedService ? resolvedService.duration : (Number(duration) || 30);
  const finalPrice = resolvedService ? resolvedService.price : (Number(price) || 0);

  // Concurrency / conflict check: ensure exact slot is not double booked
  const conflict = await Booking.findOne({
    business: businessId,
    date,
    time,
    status: CONFIRMED,
  });

  if (conflict) {
    throw new AppError('This time slot has already been booked by another user.', 409);
  }

  const booking = await Booking.create({
    business: businessId,
    user: userId,
    service: resolvedService ? resolvedService._id : businessId,
    businessName: finalBusinessName,
    serviceName: finalServiceName,
    date,
    time,
    duration: finalDuration,
    price: finalPrice,
    status: CONFIRMED,
  });

  return booking;
};

const cancel = async (bookingId, userId, reason = '') => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  booking.status = CANCELLED;
  booking.cancelReason = reason;
  await booking.save();

  return { id: bookingId, status: CANCELLED, cancelReason: reason };
};

module.exports = { getByUser, getByBusiness, create, cancel };
