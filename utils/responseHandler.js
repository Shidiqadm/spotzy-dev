const { StatusCodes } = require('http-status-codes');

const createSuccessResponse = (data) => {
  return {
    status: "SUCCESS",
    result: data,
    error: false,
    error_message: null,
  };
};

const createErrorResponse = (message) => {
  return {
    status: "ERROR",
    result: null,
    error: true,
    error_message: message,
  };
};

const handleResponse = (res, statusCode, data) => {
  if (statusCode >= StatusCodes.OK && statusCode < StatusCodes.MULTIPLE_CHOICES) {
    res.status(statusCode).json(createSuccessResponse(data));
  } else {
    res.status(statusCode).json(createErrorResponse(data.error || data));
  }
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  handleResponse,
};