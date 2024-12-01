const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createCheckIn, createCustomer, createVehicle, listCheckIn, searchCustomer, searchVehicle, getCheckInById, checkOutVehicle } = require('../controller/parkController');

const router = express.Router();

router.post('/checkin', authMiddleware, createCheckIn);
router.get('/checkin', authMiddleware, listCheckIn);
router.get('/checkin/:id', authMiddleware, getCheckInById);
router.post('/checkout/:id', authMiddleware, checkOutVehicle);

router.post('/customer', authMiddleware, createCustomer);
router.get('/customer', authMiddleware, searchCustomer);
router.post('/vehicle', authMiddleware, createVehicle);
router.get('/vehicle', authMiddleware, searchVehicle);

module.exports = router;