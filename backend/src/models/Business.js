// backend/src/models/Business.js
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 36,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

businessSchema.pre('save', function (next) {
  if (!this.ownerId && this.owner) this.ownerId = this.owner;
  if (!this.owner && this.ownerId) this.owner = this.ownerId;
  if (!this.location && this.address) this.location = this.address;
  next();
});

businessSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.ownerId = (ret.ownerId || ret.owner)?.toString?.() || '';
    ret.location = ret.location || ret.address;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Business || mongoose.model('Business', businessSchema);
