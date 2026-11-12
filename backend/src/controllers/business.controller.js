// backend/src/controllers/business.controller.js
const Business = require('../models/Business');

exports.getAll = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBusiness = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.ownerId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const businesses = await Business.find({
      $or: [{ ownerId: userId }, { owner: userId }]
    }).sort({ createdAt: -1 });

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ error: 'No business found for this owner.' });
    }

    // Return first for single-business backwards-compatibility, plus attach list
    const primary = businesses[0].toObject ? businesses[0].toObject() : businesses[0];
    primary.allBusinesses = businesses;
    res.status(200).json(primary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBusinesses = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.ownerId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const businesses = await Business.find({
      $or: [{ ownerId: userId }, { owner: userId }]
    }).sort({ createdAt: -1 });

    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const ownerId = req.user ? req.user.id : req.body.ownerId;
    const newBusiness = new Business({
      ...req.body,
      ownerId,
      owner: ownerId,
    });
    const saved = await newBusiness.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
