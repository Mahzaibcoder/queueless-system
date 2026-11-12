// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const AppError = require('../errors/AppError');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Format user data for frontend response.
 * Includes businessName and businessCategory for owners.
 */
const formatUser = async (user) => {
  const data = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: null,
    businessCategory: null,
  };

  // If owner, look up their business
  if (user.role === 'owner') {
    const business = await Business.findOne({ owner: user._id });
    if (business) {
      data.businessName = business.name;
      data.businessCategory = business.category;
      data.businessId = business._id.toString();
    }
  }

  return data;
};

const register = async ({ name, email, password, role, businessName, businessCategory }) => {
  // Check if user already exists
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new AppError('An account with this email already exists.', 400);
  }

  // Create the user
  const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password, role });

  // If owner, also create a business profile
  if (role === 'owner' && businessName) {
    const business = await Business.create({
      owner: user._id,
      name: businessName.trim(),
      category: businessCategory || 'General',
    });
    user.business = business._id;
    user.businessName = businessName.trim();
    user.businessCategory = businessCategory || 'General';
    await user.save();
  }

  const token = generateToken(user);
  const userData = await formatUser(user);
  return { token, user: userData };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new AppError('No account found with this email.', 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Incorrect password.', 400);
  }

  const token = generateToken(user);
  const userData = await formatUser(user);
  return { token, user: userData };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return await formatUser(user);
};

module.exports = { register, login, getCurrentUser };
