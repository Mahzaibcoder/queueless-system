// backend/src/routes/business.routes.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');
const auth = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) {
    return auth()(req, res, next);
  }
  next();
};

router.get('/', businessController.getAll);
router.get('/me', auth(), businessController.getMyBusiness);
router.get('/my/all', auth(), businessController.getMyBusinesses);
router.get('/:id', businessController.getById);
router.post('/', optionalAuth, businessController.create);
router.put('/:id', auth('owner'), businessController.update);
router.delete('/:id', auth('owner'), businessController.remove);

module.exports = router;
