// backend/src/models/Booking.js
const mongoose = require('mongoose');
const { CONFIRMED, CANCELLED, COMPLETED } = require('../enums/bookingStatus');

const BookingSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    // Stores custom non‑ObjectId identifiers (e.g., short IDs from external systems)
    userExternalId: { type: String, default: '' },

    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false },
    businessName: { type: String, default: '' },
    serviceName: { type: String, default: '' },
    date: { type: String, required: true },     // "YYYY-MM-DD"
    time: { type: String, required: true },     // "HH:mm"
    duration: { type: Number, default: 30 },   // minutes
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [CONFIRMED, CANCELLED, COMPLETED, 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    cancelReason: { type: String, default: '' },
  },
  { timestamps: true }
);

BookingSchema.pre('save', function (next) {
  if (!this.businessId && this.business) this.businessId = this.business;
  if (!this.business && this.businessId) this.business = this.businessId;
  if (!this.userId && this.user) this.userId = this.user;
  if (!this.user && this.userId) this.user = this.userId;
  if (!this.serviceId && this.service) this.serviceId = this.service;
  if (!this.service && this.serviceId) this.service = this.serviceId;
  next();
});

BookingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.businessId = (ret.business || ret.businessId)?.toString?.() || '';
    ret.userId = (ret.user || ret.userId)?.toString?.() || '';
    ret.serviceId = (ret.service || ret.serviceId)?.toString?.() || '';
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
