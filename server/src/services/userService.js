const { Op } = require('sequelize');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'firstName', 'lastName', 'email', 'role', 'status']);

const serializeUser = (user) => {
  const plain = user.toJSON();
  if (user.createdByUser) {
    plain.createdBy = user.createdByUser.toJSON();
  }
  if (user.updatedByUser) {
    plain.updatedBy = user.updatedByUser.toJSON();
  }
  delete plain.createdByUser;
  delete plain.updatedByUser;
  return plain;
};

const getUsers = async (query) => {
  const { page, limit, search, role, status, sortBy, sortOrder } = query;
  const where = {};

  const safeSearch = search ? search.trim().slice(0, 80) : '';
  if (safeSearch) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${safeSearch}%` } },
      { lastName: { [Op.like]: `%${safeSearch}%` } },
      { email: { [Op.like]: `%${safeSearch}%` } },
    ];
  }

  if (role) where.role = role;
  if (status) where.status = status;

  const normalizedSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';
  const skip = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    where,
    order: [[normalizedSortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']],
    limit,
    offset: skip,
    include: [
      {
        model: User,
        as: 'createdByUser',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
      {
        model: User,
        as: 'updatedByUser',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
    ],
  });

  return {
    users: rows.map(serializeUser),
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: User,
        as: 'createdByUser',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
      {
        model: User,
        as: 'updatedByUser',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
    ],
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return serializeUser(user);
};

const createUser = async (data, createdById) => {
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const user = await User.create({
    ...data,
    createdBy: createdById,
    updatedBy: createdById,
  });

  return user;
};

const updateUser = async (id, data, updatedById, requestingUser) => {
  const user = await User.scope('withSecrets').findByPk(id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (requestingUser.role === 'manager') {
    if (user.role !== 'user') {
      throw new AppError('Managers can only edit users with the "user" role.', 403);
    }
    if (data.role && data.role !== 'user') {
      throw new AppError('Managers cannot change user roles.', 403);
    }
    delete data.status;
    delete data.role;
  }

  if (data.password) {
    user.password = data.password;
    delete data.password;
  }

  Object.assign(user, data, { updatedBy: updatedById });
  await user.save();

  return user;
};

const deleteUser = async (id, requestingUserId) => {
  if (id === requestingUserId) {
    throw new AppError('You cannot deactivate your own account.', 400);
  }

  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.status = 'inactive';
  user.updatedBy = requestingUserId;
  await user.save({ hooks: false });

  return user;
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.scope('withSecrets').findByPk(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (data.newPassword) {
    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400);
    }
    user.password = data.newPassword;
  }

  if (data.firstName) user.firstName = data.firstName;
  if (data.lastName) user.lastName = data.lastName;
  user.updatedBy = userId;

  await user.save();
  return user;
};

const getUserStats = async () => {
  const [total, active, inactive, adminCount, managerCount, userCount] = await Promise.all([
    User.count(),
    User.count({ where: { status: 'active' } }),
    User.count({ where: { status: 'inactive' } }),
    User.count({ where: { role: 'admin' } }),
    User.count({ where: { role: 'manager' } }),
    User.count({ where: { role: 'user' } }),
  ]);

  return {
    total,
    active,
    inactive,
    byRole: {
      admin: adminCount,
      manager: managerCount,
      user: userCount,
    },
  };
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getUserStats,
};
