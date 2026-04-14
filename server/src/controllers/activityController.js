const { getActivityLogs } = require('../services/activityService');
const sendResponse = require('../utils/apiResponse');

const getLogs = async (req, res, next) => {
  try {
    const { logs, pagination } = await getActivityLogs(req.query);
    sendResponse(res, 200, 'Activity logs fetched successfully', logs, pagination);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs };
