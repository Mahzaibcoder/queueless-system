// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { CUSTOMER, OWNER } = require('../enums/roles');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: [CUSTOMER, OWNER, 'customer', 'owner'], required: true, default: 'customer' },
    businessName: { type: String, default: null },
    businessCategory: { type: String, default: null },
  },
  { timestamps: true }
);

// Hash password before save - avoid double-hashing if already hashed
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (typeof this.password === 'string' && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove password from JSON output and include id
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.id = obj._id.toString();
  return obj;
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
