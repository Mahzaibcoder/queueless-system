// src/services/business.service.js
const Business = require('../models/Business');
const AppError = require('../errors/AppError');

const getAll = async (query = {}) => {
  const filter = { isActive: true };
  if (query.name) filter.name = { $regex: query.name, $options: 'i' };
  if (query.category && query.category !== 'All') {
    filter.category = { $regex: query.category, $options: 'i' };
  }
  return await Business.find(filter).sort({ createdAt: -1 });
};

const getById = async (id) => {
  const business = await Business.findById(id);
  if (!business) throw new AppError('Business not found', 404);
  return business;
};

const getByOwner = async (ownerId) => {
  return await Business.findOne({ owner: ownerId });
};

const create = async (ownerId, data) => {
  const business = await Business.create({
    owner: ownerId,
    name: data.name,
    category: data.category,
    description: data.description || '',
    location: data.location || '',
    phone: data.phone || '',
    image: data.image || '',
  });
  return business;
};

const update = async (id, ownerId, data) => {
  const business = await Business.findOne({ _id: id, owner: ownerId });
  if (!business) throw new AppError('Business not found or unauthorized', 404);

  if (data.name !== undefined) business.name = data.name;
  if (data.category !== undefined) business.category = data.category;
  if (data.description !== undefined) business.description = data.description;
  if (data.location !== undefined) business.location = data.location;
  if (data.phone !== undefined) business.phone = data.phone;
  if (data.image !== undefined) business.image = data.image;

  await business.save();
  return business;
};

const remove = async (id, ownerId) => {
  const business = await Business.findOneAndDelete({ _id: id, owner: ownerId });
  if (!business) throw new AppError('Business not found or unauthorized', 404);
  return business;
};

module.exports = { getAll, getById, getByOwner, create, update, remove };
