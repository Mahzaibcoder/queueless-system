// backend/src/routes/availability.routes.js
const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availability.controller');
const auth = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) {
    return auth()(req, res, next);
  }
  next();
};

router.get('/slots', availabilityController.getSlots);
router.get('/business/:businessId', optionalAuth, availabilityController.getByBusiness);
router.post('/business/:businessId', auth('owner'), availabilityController.save);

module.exports = router;
