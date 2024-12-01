const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createVehicleType, createParkingSpot, createTariff, searchVehicleTypes, searchParkingSpots, searchTariffs } = require('../controller/masterController');

const router = express.Router();

router.post('/vehicle-type', authMiddleware, createVehicleType);
router.get('/vehicle-type', authMiddleware, searchVehicleTypes);
router.post('/spot', authMiddleware, createParkingSpot);
router.get('/spot', authMiddleware, searchParkingSpots);
router.post('/tariff', authMiddleware, createTariff);
router.get('/tariff', authMiddleware, searchTariffs);

module.exports = router;