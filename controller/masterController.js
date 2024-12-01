const { StatusCodes } = require("http-status-codes");
const { handleResponse } = require("../utils/responseHandler");
const { ParkingSpot, Tariff } = require("../models");
const VehicleType = require("../models/VehicleType");
const { Op } = require("sequelize");

const createParkingSpot = async (req, res) => {
  const { spotNumber, status } = req.body;

  try {
    const parkingSpot = await ParkingSpot.create({ spotNumber, status });

    return handleResponse(res, StatusCodes.CREATED, { message: 'Parking spot created successfully', parkingSpot });
  } catch (error) {
    console.error('Error creating parking spot:', error);
    return res.status(500).json({ message: 'An error occurred during parking spot creation' });
  }
};

const searchParkingSpots = async (req, res) => {
  const { query, status } = req.query;

  try {
    let where = {};

    if (query) {
      where.spotNumber = { [Op.iLike]: `%${query}%` };
    }

    if (status) {
      where.status = status;
    }

    const parkingSpots = await ParkingSpot.findAll({
      where,
      order: [['spotNumber', 'ASC']],
      limit: query ? 10 : 100 // Limit results when searching
    });

    if (parkingSpots.length === 0) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'No parking spots found' });
    }

    return handleResponse(res, StatusCodes.OK, { parkingSpots });
  } catch (error) {
    console.error('Error searching parking spots:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'An error occurred while searching parking spots' });
  }
};

const createTariff = async (req, res) => {
  const { vehicleTypeId, rate, parkingMethod } = req.body;

  try {
    // Validate input
    if (!vehicleTypeId) {
      return handleResponse(res, StatusCodes.BAD_REQUEST, { message: 'Invalid vehicle type ID format' });
    }
    if (!rate || !parkingMethod) {
      return handleResponse(res, StatusCodes.BAD_REQUEST, { message: 'All fields are required' });
    }

    // Check if vehicle type exists
    const vehicleType = await VehicleType.findByPk(vehicleTypeId);
    if (!vehicleType) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Vehicle type not found' });
    }

    // Create the tariff entry
    const tariff = await Tariff.create({ vehicleTypeId, rate, parkingMethod });

    return handleResponse(res, StatusCodes.CREATED, { message: 'Tariff created successfully', tariff });
  } catch (error) {
    console.error('Error creating tariff:', error);
    return res.status(500).json({ message: 'An error occurred during tariff creation' });
  }
};

const createVehicleType = async (req, res) => {
  const { name } = req.body; // Expect the vehicle type name in the request body

  try {
    // Validate that the name is provided
    if (!name) {
      return handleResponse(res, StatusCodes.BAD_REQUEST, { message: 'Vehicle type name is required' });
    }

    // Create a new vehicle type
    const vehicleType = await VehicleType.create({ name });

    return handleResponse(res, StatusCodes.CREATED, { message: 'Vehicle type created successfully', vehicleType });
  } catch (error) {
    console.error('Error creating vehicle type:', error);
    return res.status(500).json({ message: 'An error occurred during vehicle type creation' });
  }
};

const searchVehicleTypes = async (req, res) => {
  const { query } = req.query; // Get the search query from the request

  try {
    let vehicleTypes;

    if (query) {
      // Search for vehicle types that match the query
      vehicleTypes = await VehicleType.findAll({
        where: {
          name: {
            [Op.iLike]: `%${query}%` // Case-insensitive search
          }
        }
      });
    } else {
      // If no query is provided, return all vehicle types
      vehicleTypes = await VehicleType.findAll();
    }

    return handleResponse(res, StatusCodes.OK, { vehicleTypes });
  } catch (error) {
    console.error('Error searching vehicle types:', error);
    return res.status(500).json({ message: 'An error occurred while searching vehicle types' });
  }
};

const searchTariffs = async (req, res) => {
  const { vehicleTypeId, parkingMethod } = req.query;

  try {
    let where = {};

    if (vehicleTypeId) {
      where.vehicleTypeId = vehicleTypeId;
    }

    if (parkingMethod) {
      where.parkingMethod = parkingMethod;
    }

    const tariffs = await Tariff.findAll({
      where,
      order: [['rate', 'ASC']], // Order by rate ascending
      include: [{ model: VehicleType, as: 'vehicleType' }] // Include the VehicleType relation with alias
    });

    if (tariffs.length === 0) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'No tariffs found' });
    }

    return handleResponse(res, StatusCodes.OK, { tariffs });
  } catch (error) {
    console.error('Error searching tariffs:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'An error occurred while searching tariffs' });
  }
};

module.exports = {
  createParkingSpot,
  createTariff,
  createVehicleType,
  searchVehicleTypes,
  searchParkingSpots,
  searchTariffs
};