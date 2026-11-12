// backend/src/controllers/auth.controller.js
const User = require('../models/User');
const Business = require('../models/Business');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user (Customer or Owner)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, businessName, businessCategory } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const assignedRole = role === 'owner' ? 'owner' : 'customer';

    // Create new user (UserSchema pre-save handles password hashing)
    const newUser = new User({
      name: name.trim(),
      email: trimmedEmail,
      password,
      role: assignedRole,
      businessName: businessName ? businessName.trim() : null,
      businessCategory: businessCategory || null,
    });

    const savedUser = await newUser.save();

    // If owner and provided a business name, auto-create business record
    if (assignedRole === 'owner' && businessName && businessName.trim()) {
      try {
        await Business.create({
          ownerId: savedUser._id,
          name: businessName.trim(),
          category: businessCategory || 'Beauty',
          description: `Premier ${businessCategory || 'service'} destination providing verified appointments with zero wait times.`,
          address: 'Main Commercial Avenue, Lahore, Pakistan',
          phone: savedUser.phone || '+92 300 1234567',
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
        });
      } catch (bizErr) {
        console.error('Error auto-creating business on registration:', bizErr);
      }
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'queueless_super_secret_key_change_me_2024',
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      businessName: savedUser.businessName,
      businessCategory: savedUser.businessCategory,
      token,
    };

    res.status(201).json({ user: userResponse, error: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user in MongoDB Atlas
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'queueless_super_secret_key_change_me_2024',
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      businessCategory: user.businessCategory,
      token,
    };

    res.status(200).json({ user: userResponse, error: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current logged-in user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const userObj = user.toJSON ? user.toJSON() : user.toObject();
    res.status(200).json({ user: userObj, error: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
