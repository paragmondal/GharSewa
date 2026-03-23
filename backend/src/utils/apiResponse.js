/**
 * Standard API response helpers.
 * Controllers MUST use these — never send raw res.json.
 */

const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendCreated = (res, data = {}, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

const sendUnauthorized = (res, message = 'Unauthorized') =>
  sendError(res, message, 401);

const sendForbidden = (res, message = 'Forbidden') =>
  sendError(res, message, 403);

const sendNotFound = (res, message = 'Resource not found') =>
  sendError(res, message, 404);

const sendBadRequest = (res, message = 'Bad request', errors = null) =>
  sendError(res, message, 400, errors);

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendBadRequest,
};
