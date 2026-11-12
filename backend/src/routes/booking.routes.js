// backend/src/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const auth = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) {
    return auth()(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, bookingController.getAll || ((req, res) => res.json([])));
router.get('/user/:userId', optionalAuth, bookingController.getByUser || ((req, res) => res.json([])));
router.get('/business/:businessId', optionalAuth, bookingController.getByBusiness || ((req, res) => res.json([])));
router.post('/', optionalAuth, bookingController.create || ((req, res) => res.status(500).json({ error: 'Not implemented' })));
router.put('/:id/cancel', optionalAuth, bookingController.cancel || ((req, res) => res.status(500).json({ error: 'Not implemented' })));

module.exports = router;