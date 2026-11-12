// src/routes/service.routes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const auth = require('../middleware/auth');

router.get('/business/:businessId', serviceController.getByBusiness);
router.post('/', auth('owner'), serviceController.create);
router.put('/:id', auth('owner'), serviceController.update);
router.delete('/:id', auth('owner'), serviceController.remove);

module.exports = router;