// backend/src/models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false },
    name: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, default: 30 }, // in minutes
    price: { type: Number, required: true, default: 0 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

ServiceSchema.pre('save', function (next) {
  if (!this.businessId && this.business) this.businessId = this.business;
  if (!this.business && this.businessId) this.business = this.businessId;
  next();
});

ServiceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.businessId = (ret.business || ret.businessId)?.toString?.() || '';
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
