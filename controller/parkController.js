const { StatusCodes } = require("http-status-codes");
const { handleResponse } = require("../utils/responseHandler");
const { Vehicle, Customer, ParkingSpot, CheckIn, Tariff } = require("../models");
const VehicleType = require("../models/VehicleType");
const { Op } = require("sequelize");

const createVehicle = async (req, res) => {
  const { customerId, vehicleNo, vehicleTypeId } = req.body; // Expect vehicleTypeId instead of vehicleType

  try {
    // Validate that the customer exists
    const customerExists = await Customer.findByPk(customerId);
    if (!customerExists) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Customer not found' });
    }

    // Validate that the vehicle type exists
    const vehicleTypeExists = await VehicleType.findByPk(vehicleTypeId);
    if (!vehicleTypeExists) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Vehicle type not found' });
    }

    const vehicle = await Vehicle.create({ customerId, vehicleNo, vehicleTypeId });

    return handleResponse(res, StatusCodes.CREATED, { message: 'Vehicle created successfully', vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return res.status(500).json({ message: 'An error occurred during vehicle creation' });
  }
};

const searchVehicle = async (req, res) => {
  const { query } = req.query;

  try {
    let vehicles;

    const includeOptions = [
      {
        model: Customer,
        as: 'customer', // Add this line
        attributes: ['id', 'name', 'phone']
      },
      {
        model: VehicleType,
        as: 'vehicleType', // Add this line
        attributes: ['id', 'name']
      }
    ];

    if (query) {
      vehicles = await Vehicle.findAll({
        where: {
          [Op.or]: [
            { vehicleNo: { [Op.iLike]: `%${query}%` } }
          ]
        },
        include: includeOptions,
        limit: 10 // Limit the number of results when searching
      });
    } else {
      vehicles = await Vehicle.findAll({
        include: includeOptions,
        limit: 100 // Limit the number of results when returning all vehicles
      });
    }

    if (vehicles.length === 0) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'No vehicles found');
    }

    return handleResponse(res, StatusCodes.OK, { vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while fetching vehicles');
  }
};


const createCustomer = async (req, res) => {
  const { name, phone } = req.body;

  try {
    const customer = await Customer.create({ name, phone });

    return handleResponse(res, StatusCodes.CREATED, customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred during customer creation');
  }
};

const searchCustomer = async (req, res) => {
  const { query } = req.query;

  try {
    let customers;

    if (query) {
      customers = await Customer.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { phone: { [Op.iLike]: `%${query}%` } }
          ]
        },
        limit: 10 // Limit the number of results when searching
      });
    } else {
      customers = await Customer.findAll({
        limit: 100 // Limit the number of results when returning all customers
      });
    }

    if (customers.length === 0) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'No customers found');
    }

    return handleResponse(res, StatusCodes.OK, { customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while fetching customers');
  }
};

const createCheckIn = async (req, res) => {
  const { customerId, vehicleId, parkingSpotId, advanceAmount, parkingMethod, checkoutTime } = req.body;

  try {
    // Validate the vehicle, customer, and parking spot existence
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Vehicle not found');
    }

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Customer not found');
    }

    const parkingSpot = await ParkingSpot.findByPk(parkingSpotId);
    if (!parkingSpot) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Parking spot not found');
    }

    // Check if the parking spot is available
    if (parkingSpot.status !== 'available') {
      return handleResponse(res, StatusCodes.BAD_REQUEST, 'Parking spot is not available');
    }

    // Fetch the applicable tariff based on vehicle type and parking method
    const tariff = await Tariff.findOne({
      where: {
        vehicleTypeId: vehicle.vehicleTypeId, // Use vehicleTypeId
        parkingMethod: parkingMethod,
      },
    });

    if (!tariff) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Tariff not found for the specified vehicle type and parking method');
    }

    // Calculate the estimated cost using the fetched tariff
    const estimatedCost = calculateParkingCost(new Date(), checkoutTime, tariff.rate, parkingMethod);

    // Create the check-in entry
    const checkIn = await CheckIn.create({
      vehicleId,
      parkingSpotId,
      advanceAmount,
      checkinTime: new Date(),
      tariffId: tariff.id, // Associate the tariff
      parkingMethod,
      calculatedAmount: estimatedCost, // Save the calculated amount
    });

    // Update the parking spot status to 'occupied'
    await parkingSpot.update({ status: 'occupied' });

    handleResponse(res, StatusCodes.CREATED, 'Check-in created successfully', checkIn);
  } catch (error) {
    console.error('Error creating check-in:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred during check-in');
  }
};

const calculateParkingCost = (checkinTime, checkoutTime, tariff, parkingMethod) => {
  const checkInDate = new Date(checkinTime);
  const checkOutDate = new Date(checkoutTime);

  const timeDifferenceInMs = checkOutDate - checkInDate;
  const days = Math.ceil(timeDifferenceInMs / (1000 * 60 * 60 * 24)); // Calculate the number of days

  let estimatedCost = 0;

  if (parkingMethod === 'daily') {
    estimatedCost = tariff * days; // Apply daily rate
  } else if (parkingMethod === 'monthly') {
    // Calculate the cost for a full month or prorated daily cost based on days parked
    const months = days / 30;
    estimatedCost = tariff * months;
  }

  return estimatedCost;
};

// API to estimate parking cost
const estimateParkingCost = async (req, res) => {
  const { vehicleId, parkingSpotId, checkinTime, checkoutTime, parkingMethod } = req.body;

  try {
    // Validate vehicle and parking spot existence
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Vehicle not found');
    }

    const parkingSpot = await ParkingSpot.findByPk(parkingSpotId);
    if (!parkingSpot) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Parking spot not found');
    }

    // Fetch the applicable tariff based on vehicle type and parking method
    const tariff = await Tariff.findOne({
      where: {
        vehicleTypeId: vehicle.vehicleTypeId, // Use vehicleTypeId
        parkingMethod: parkingMethod,
      },
    });

    if (!tariff) {
      return handleResponse(res, StatusCodes.NOT_FOUND, 'Tariff not found for the specified vehicle type and parking method');
    }

    // Calculate the estimated cost using the fetched tariff
    const estimatedCost = calculateParkingCost(checkinTime, checkoutTime, tariff.rate, parkingMethod);

    return handleResponse(res, StatusCodes.OK, 'Estimated parking cost calculated', estimatedCost);
  } catch (error) {
    console.error('Error estimating parking cost:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred during estimation');
  }
};

const listCheckIn = async (req, res) => {
  const { customerId, vehicleId, parkingSpotId, status, startDate, endDate } = req.query;

  try {
    // Build query filters based on provided query parameters
    let where = {};

    if (customerId) {
      where.customerId = customerId;
    }
    if (vehicleId) {
      where.vehicleId = vehicleId;
    }
    if (parkingSpotId) {
      where.parkingSpotId = parkingSpotId;
    }
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.checkinTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Fetch check-in records with relationships (Vehicle, Customer, ParkingSpot, Tariff)
    const checkIns = await CheckIn.findAll({
      where,
      include: [
        {
          model: Vehicle,
          as: 'vehicle', // Use 'as' based on the alias defined in the association
          attributes: ['id', 'vehicleNo', 'vehicleTypeId'],
        },
        {
          model: Customer,
          as: 'customer', // Use 'as' based on the alias defined in the association
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ParkingSpot,
          as: 'parkingSpot', // Use 'as' based on the alias defined in the association
          attributes: ['id', 'spotNumber'],
        },
        {
          model: Tariff,
          as: 'tariff', // Use 'as' based on the alias defined in the association
          attributes: ['id', 'rate', 'parkingMethod'],
        },
      ],
      order: [['checkinTime', 'DESC']], // Sort by check-in time descending
    });

    // Return the check-in records as a response
    return handleResponse(res, StatusCodes.OK, checkIns);
  } catch (error) {
    console.error('Error fetching check-in records:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'An error occurred while fetching check-in records' });
  }
};

const getCheckInById = async (req, res) => {
  const { id } = req.params;

  try {
    const checkIn = await CheckIn.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'vehicleNo', 'vehicleTypeId'],
          include: [
            {
              model: VehicleType,
              as: 'vehicleType',
              attributes: ['id', 'name'],
            },
            {
              model: Customer,
              as: 'customer',
              attributes: ['id', 'name', 'phone'],
            },
          ],
        },
        {
          model: ParkingSpot,
          as: 'parkingSpot',
          attributes: ['id', 'spotNumber'],
        },
        {
          model: Tariff,
          as: 'tariff',
          attributes: ['id', 'rate', 'parkingMethod'],
        },
      ],
    });

    if (!checkIn) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Check-in record not found' });
    }

    // Log the entire checkIn object to inspect its structure
    console.log('CheckIn record:', JSON.stringify(checkIn, null, 2));

    return handleResponse(res, StatusCodes.OK, checkIn);
  } catch (error) {
    console.error('Error fetching check-in record:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'An error occurred while fetching the check-in record' });
  }
};

const checkOutVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const checkIn = await CheckIn.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          include: [
            {
              model: VehicleType,
              as: 'vehicleType',
            },
          ],
        },
        {
          model: Tariff,
          as: 'tariff',
        },
        {
          model: ParkingSpot,
          as: 'parkingSpot',
        },
      ],
    });

    if (!checkIn) {
      return handleResponse(res, StatusCodes.NOT_FOUND, { message: 'Check-in record not found' });
    }

    if (checkIn.status === 'completed') {
      return handleResponse(res, StatusCodes.BAD_REQUEST, { message: 'Vehicle has already been checked out' });
    }

    const checkOutTime = new Date();
    const parkingDurationInHours = (checkOutTime - checkIn.checkinTime) / (1000 * 60 * 60); // Duration in hours
    const parkingDurationInDays = parkingDurationInHours / 24; // Duration in days

    let parkingFee;
    if (checkIn.parkingMethod === 'daily') {
      parkingFee = Math.ceil(parkingDurationInDays) * checkIn.tariff.rate;
    } else if (checkIn.parkingMethod === 'monthly') {
      const monthlyRate = checkIn.tariff.rate;
      const daysInMonth = 30; // Assuming a month has 30 days
      parkingFee = (parkingDurationInDays / daysInMonth) * monthlyRate;
    } else {
      return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Invalid parking method' });
    }

    // Update the CheckIn record
    await checkIn.update({
      checkoutTime: checkOutTime,
      calculatedAmount: parkingFee,
      status: 'completed'
    });

    // Free up the parking spot
    await checkIn.parkingSpot.update({ status: 'available' });

    return handleResponse(res, StatusCodes.OK, {
      message: 'Vehicle checked out successfully',
      checkIn: {
        id: checkIn.id,
        checkinTime: checkIn.checkinTime,
        checkoutTime: checkIn.checkoutTime,
        parkingDuration: parkingDurationInDays.toFixed(2) + ' days',
        parkingFee: parkingFee.toFixed(2),
        advanceAmount: checkIn.advanceAmount,
        calculatedAmount: checkIn.calculatedAmount,
        vehicle: checkIn.vehicle,
        parkingSpot: checkIn.parkingSpot,
        parkingMethod: checkIn.parkingMethod,
      },
    });
  } catch (error) {
    console.error('Error checking out vehicle:', error);
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'An error occurred while checking out the vehicle' });
  }
};

module.exports = {
  createVehicle,
  createCustomer,
  createCheckIn,
  listCheckIn,
  searchCustomer,
  searchVehicle,
  getCheckInById,
  checkOutVehicle
};