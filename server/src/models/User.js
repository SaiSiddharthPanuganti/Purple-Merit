const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name is required' },
        len: { args: [1, 50], msg: 'First name is required' },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Last name is required' },
        len: { args: [1, 50], msg: 'Last name is required' },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please provide a valid email' },
        notEmpty: { msg: 'Email is required' },
      },
      set(value) {
        this.setDataValue('email', value ? String(value).trim().toLowerCase() : value);
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: { args: [4, 255], msg: 'Password must be at least 4 characters' },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    avatar: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    refreshTokenHash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  },
  {
    tableName: 'users',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password', 'refreshTokenHash'] },
    },
    scopes: {
      withSecrets: {
        attributes: { include: ['password', 'refreshTokenHash'] },
      },
    },
    hooks: {
      beforeSave: async (user) => {
        if (!user.changed('password')) return;
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const obj = { ...this.get() };
  obj._id = obj.id;
  delete obj.password;
  delete obj.refreshTokenHash;
  return obj;
};

module.exports = User;
