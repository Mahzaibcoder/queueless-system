// src/models/Owner.js - Owner Model (extending User)
const mongoose = require('mongoose');
const User = require('./User');
const { OWNER } = require('../enums/roles');

const OwnerSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  businessName: { type: String, trim: true, default: '' },
  businessCategory: { type: String, trim: true, default: '' },
  isVerified: { type: Boolean, default: false },
});

// Virtual populate for owner's businesses
OwnerSchema.virtual('businesses', {
  ref: 'Business',
  localField: '_id',
  foreignField: 'owner',
});

const Owner =
  User.discriminators && User.discriminators[OWNER]
    ? User.discriminators[OWNER]
    : User.discriminator(OWNER, OwnerSchema);

module.exports = Owner;
