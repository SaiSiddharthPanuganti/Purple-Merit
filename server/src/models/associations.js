const User = require('./User');
const ActivityLog = require('./ActivityLog');

User.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.belongsTo(User, { as: 'updatedByUser', foreignKey: 'updatedBy' });

ActivityLog.belongsTo(User, { as: 'userDetails', foreignKey: 'user' });
ActivityLog.belongsTo(User, { as: 'targetUserDetails', foreignKey: 'targetUser' });

module.exports = {
  User,
  ActivityLog,
};
