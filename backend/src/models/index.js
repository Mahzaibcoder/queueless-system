// src/models/index.js - Central export for all Mongoose models
const User = require('./User');
const Customer = require('./Customer');
const Owner = require('./Owner');
const Business = require('./Business');
const Service = require('./Service');
const Availability = require('./Availability');
const Booking = require('./Booking');

module.exports = {
  User,
  Customer,
  Owner,
  Business,
  Service,
  Availability,
  Booking,
};
