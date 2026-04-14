const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ user, action, targetUser = null, details = '', req = null }) => {
  try {
    await ActivityLog.create({
      user: user._id || user,
      action,
      targetUser,
      details,
      ipAddress: req ? req.ip || req.connection?.remoteAddress : null,
      userAgent: req ? req.headers['user-agent'] : null,
    });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

const getActivityLogs = async (query) => {
  const { page = 1, limit = 20, action = '', userId = '' } = query;
  const filter = {};

  if (action) filter.action = action;
  if (userId) filter.user = userId;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email role')
      .populate('targetUser', 'firstName lastName email'),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = { logActivity, getActivityLogs };
