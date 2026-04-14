const sendResponse = (res, statusCode, message, data = null, pagination = null) => {
  const response = {
    success: statusCode < 400,
    message,
  };
  if (data !== null) response.data = data;
  if (pagination !== null) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

module.exports = sendResponse;
