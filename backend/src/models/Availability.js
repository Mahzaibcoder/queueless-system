// backend/src/models/Availability.js
const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false },
    day: { type: Number, min: 0, max: 6, required: true }, // 0=Sun, 1=Mon ... 6=Sat
    start: { type: String, default: null }, // "09:00" or null if closed
    end: { type: String, default: null },   // "17:00" or null if closed
  },
  { timestamps: true }
);

AvailabilitySchema.pre('save', function (next) {
  if (!this.businessId && this.business) this.businessId = this.business;
  if (!this.business && this.businessId) this.business = this.businessId;
  next();
});

AvailabilitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.businessId = (ret.business || ret.businessId)?.toString?.() || '';
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Availability || mongoose.model('Availability', AvailabilitySchema);
