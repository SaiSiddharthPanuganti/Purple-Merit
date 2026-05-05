const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM(
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
        'PROFILE_UPDATED',
        'PASSWORD_CHANGED'
      ),
      allowNull: false,
    },
    targetUser: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: null,
    },
    userAgent: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'activity_logs',
    underscored: true,
    indexes: [
      { fields: ['user', 'created_at'] },
      { fields: ['action'] },
    ],
  }
);

ActivityLog.prototype.toJSON = function () {
  const obj = { ...this.get() };
  obj._id = obj.id;
  return obj;
};

module.exports = ActivityLog;
