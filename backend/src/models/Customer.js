// src/models/Customer.js - Customer Model (extending User)
const mongoose = require('mongoose');
const User = require('./User');
const { CUSTOMER } = require('../enums/roles');

const CustomerSchema = new mongoose.Schema({
  address: { type: String, trim: true, default: '' },
  preferredNotification: {
    type: String,
    enum: ['email', 'sms'],
    default: 'email',
  },
  notes: { type: String, default: '' },
});

// Virtual populate for customer bookings
CustomerSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user',
});

const Customer =
  User.discriminators && User.discriminators[CUSTOMER]
    ? User.discriminators[CUSTOMER]
    : User.discriminator(CUSTOMER, CustomerSchema);

module.exports = Customer;
