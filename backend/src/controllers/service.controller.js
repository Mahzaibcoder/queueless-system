// backend/src/controllers/service.controller.js
const Service = require('../models/Service');

exports.getByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const services = await Service.find({
      $or: [
        { business: businessId },
        { businessId: businessId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const bId = req.body.businessId || req.body.business;
    const newService = new Service({
      ...req.body,
      business: bId,
      businessId: bId,
    });
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
