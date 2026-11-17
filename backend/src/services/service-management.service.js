// src/services/service.service.js
const Service = require('../models/Service');
const Business = require('../models/Business');
const AppError = require('../errors/AppError');

const getByBusiness = async (businessId) => {
  return await Service.find({ business: businessId }).sort({ createdAt: 1 });
};

const getById = async (id) => {
  const service = await Service.findById(id);
  if (!service) throw new AppError('Service not found', 404);
  return service;
};

const create = async (ownerId, data) => {
  let businessId = data.businessId;

  // Resolve business for owner if not explicitly passed or fallback passed
  if (!businessId || businessId === 'b1') {
    const ownerBusiness = await Business.findOne({ owner: ownerId });
    if (!ownerBusiness) {
      throw new AppError('Business not found for this owner', 404);
    }
    businessId = ownerBusiness._id;
  } else {
    const business = await Business.findOne({ _id: businessId, owner: ownerId });
    if (!business) {
      throw new AppError('Business not found or unauthorized', 404);
    }
  }

  const service = await Service.create({
    business: businessId,
    name: data.name,
    duration: Number(data.duration),
    price: Number(data.price),
    description: data.description || '',
  });

  return service;
};

const update = async (id, ownerId, data) => {
  const service = await Service.findById(id).populate('business');
  if (!service) throw new AppError('Service not found', 404);

  if (service.business.owner.toString() !== ownerId) {
    throw new AppError('Unauthorized', 403);
  }

  if (data.name !== undefined) service.name = data.name;
  if (data.duration !== undefined) service.duration = Number(data.duration);
  if (data.price !== undefined) service.price = Number(data.price);
  if (data.description !== undefined) service.description = data.description;

  await service.save();
  return service;
};

const remove = async (id, ownerId) => {
  const service = await Service.findById(id).populate('business');
  if (!service) throw new AppError('Service not found', 404);

  if (service.business.owner.toString() !== ownerId) {
    throw new AppError('Unauthorized', 403);
  }

  await Service.findByIdAndDelete(id);
  return { id };
};

module.exports = { getByBusiness, getById, create, update, remove };
