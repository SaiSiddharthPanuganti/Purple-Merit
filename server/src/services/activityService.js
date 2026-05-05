const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

const logActivity = async ({ user, action, targetUser = null, details = '', req = null }) => {
  try {
    await ActivityLog.create({
      user: user.id || user._id || user,
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
  const where = {};
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (action) where.action = action;
  if (userId) where.user = userId;

  const skip = (pageNumber - 1) * limitNumber;

  const { rows, count } = await ActivityLog.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset: skip,
    limit: limitNumber,
    include: [
      {
        model: User,
        as: 'userDetails',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      },
      {
        model: User,
        as: 'targetUserDetails',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
    ],
  });

  const logs = rows.map((log) => {
    const plain = log.toJSON();
    plain.user = plain.userDetails || plain.user;
    plain.targetUser = plain.targetUserDetails || plain.targetUser;
    delete plain.userDetails;
    delete plain.targetUserDetails;
    return plain;
  });

  return {
    logs,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total: count,
      pages: Math.ceil(count / limitNumber),
    },
  };
};

module.exports = { logActivity, getActivityLogs };
