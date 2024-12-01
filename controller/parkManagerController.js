// const { StatusCodes } = require("http-status-codes");
// const { handleResponse } = require("../utils/responseHandler");
// const { Vehicle, ParkingSpot, CheckIn, Tariff } = require("../models");

// const createCheckIn = async (req, res) => {
//   const { vehicleId, parkingSpotId, advanceAmount, parkingMethod } = req.body; // Added parkingMethod to request body

//   try {
//     // Validate that the vehicle and parking spot exist
//     const vehicle = await Vehicle.findByPk(vehicleId);
//     if (!vehicle) {
//       return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Vehicle not found' });
//     }

//     const parkingSpot = await ParkingSpot.findByPk(parkingSpotId);
//     if (!parkingSpot) {
//       return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Parking spot not found' });
//     }

//     // Check if parking spot is available
//     if (parkingSpot.status !== 'available') {
//       return handleResponse(res, StatusCodes.BAD_REQUEST, { message: 'Parking spot is not available' });
//     }

//     // Retrieve tariff based on vehicle type and parking method
//     const tariff = await Tariff.findOne({
//       where: { vehicleType: vehicle.vehicleType, method: parkingMethod }
//     });

//     if (!tariff) {
//       return handleResponse(res, StatusCodes.BAD_REQUEST, { message: 'Tariff not found for the specified vehicle type and parking method' });
//     }

//     // Create the check-in
//     const checkIn = await CheckIn.create({
//       vehicleId,
//       parkingSpotId,
//       advanceAmount: advanceAmount || 0, // Default to 0 if not provided
//       checkinTime: new Date(), // Check-in time set to now
//       tariffId: tariff.id, // Associate the tariff with the check-in
//     });

//     // Update the status of the parking spot to 'occupied'
//     await parkingSpot.update({ status: 'occupied' });

//     return res.status(201).json({
//       message: 'Check-in created successfully',
//       checkIn,
//     });
//   } catch (error) {
//     console.error('Error creating check-in:', error);
//     return res.status(500).json({ message: 'An error occurred during check-in' });
//   }
// };

// module.exports = {
//   createCheckIn,
// };