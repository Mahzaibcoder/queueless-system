// src/services/availability.service.js
const Availability = require('../models/Availability');
const Business = require('../models/Business');
const AppError = require('../errors/AppError');

const getByBusiness = async (businessId, ownerId = null) => {
  let targetBusinessId = businessId;

  // Resolve businessId if placeholder or missing
  if ((!targetBusinessId || targetBusinessId === 'b1') && ownerId) {
    const ownerBusiness = await Business.findOne({ owner: ownerId });
    if (ownerBusiness) {
      targetBusinessId = ownerBusiness._id;
    }
  }

  const list = await Availability.find({ business: targetBusinessId }).sort({ day: 1 });
  return list;
};

const saveAvailability = async (businessId, slots, ownerId) => {
  let targetBusinessId = businessId;

  if (!targetBusinessId || targetBusinessId === 'b1') {
    const ownerBusiness = await Business.findOne({ owner: ownerId });
    if (!ownerBusiness) {
      throw new AppError('Business not found for this owner', 404);
    }
    targetBusinessId = ownerBusiness._id;
  } else {
    const business = await Business.findOne({ _id: targetBusinessId, owner: ownerId });
    if (!business) {
      throw new AppError('Business not found or unauthorized', 404);
    }
  }

  // Clear existing availability and insert updated
  await Availability.deleteMany({ business: targetBusinessId });

  const toInsert = slots.map((s) => ({
    business: targetBusinessId,
    day: s.day,
    start: s.start || null,
    end: s.end || null,
  }));

  const created = await Availability.insertMany(toInsert);
  return created;
};

module.exports = { getByBusiness, saveAvailability };
