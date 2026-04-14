const User = require('../models/User');
const AppError = require('../utils/AppError');

const getUsers = async (query) => {
  const { page, limit, search, role, status, sortBy, sortOrder } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) filter.role = role;
  if (status) filter.status = status;

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName'),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('createdBy', 'firstName lastName email')
    .populate('updatedBy', 'firstName lastName email');

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

const createUser = async (data, createdById) => {
  const existingUser = await User.findOne({ email: data.email });
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
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // Manager can only update users with 'user' role, and cannot change roles
  if (requestingUser.role === 'manager') {
    if (user.role !== 'user') {
      throw new AppError('Managers can only edit users with the "user" role.', 403);
    }
    if (data.role && data.role !== 'user') {
      throw new AppError('Managers cannot change user roles.', 403);
    }
    // Managers cannot change status either
    delete data.status;
    delete data.role;
  }

  // If password is being updated, handle it via save() to trigger pre-save hook
  if (data.password) {
    user.password = data.password;
    delete data.password;
  }

  Object.assign(user, data, { updatedBy: updatedById });
  await user.save();

  return user;
};

const deleteUser = async (id, requestingUserId) => {
  if (id === requestingUserId.toString()) {
    throw new AppError('You cannot deactivate your own account.', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.status = 'inactive';
  user.updatedBy = requestingUserId;
  await user.save({ validateBeforeSave: false });

  return user;
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId).select('+password');
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
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'inactive' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'manager' }),
    User.countDocuments({ role: 'user' }),
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
