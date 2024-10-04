const { StatusCodes } = require("http-status-codes");
const ParkingSpot = require("../models/parkingSpot");
const vehicle = require("../models/vehicle");
const { handleResponse } = require("../utils/responseHandler");

exports.createCheckin = async (req, res) => {
  try {
    const { userId, userName, vehicleNo, vehicleType, parkingSpot, advanceAmount } = req.body;

    // Step 1: Validate that all required fields are provided
    if (!userId || !userName || !vehicleNo || !vehicleType || !parkingSpot || !advanceAmount) {
      return handleResponse(res, StatusCodes.BAD_REQUEST, { error: 'All fields are required' });
    }

    // Step 2: Check if the parking spot is available (if you have a ParkingSpot model)
    const spot = await ParkingSpot.findOne({ where: { spotName: parkingSpot, status: 'available' } });

    if (!spot) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { error: 'Parking spot is not available or not found' });
    }

    // Step 3: Create a new check-in record in the Vehicle table
    const checkin = await vehicle.create({
      userId,
      userName,
      vehicleNo,
      vehicleType,
      parkingSpot,
      checkinDate: new Date(),
      advanceAmount,
      calculatedAmount: 0,  // Assume initial calculated amount is 0
    });

    // Step 4: Update the parking spot status to 'occupied' (if applicable)
    spot.status = 'occupied';
    await spot.save();

    // Step 5: Return success response with check-in details
    handleResponse(res, StatusCodes.CREATED, checkin);
    
  } catch (error) {
    console.error(error);
    handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { error: 'An error occurred during check-in' });
  }
};