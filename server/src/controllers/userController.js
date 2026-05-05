const userService = require('../services/userService');
const { logActivity } = require('../services/activityService');
const sendResponse = require('../utils/apiResponse');

const getUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await userService.getUsers(req.query);
    sendResponse(res, 200, 'Users fetched successfully', users, pagination);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, 200, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user.id);
    logActivity({ user: req.user, action: 'USER_CREATED', targetUser: user.id || user._id, details: `Created user ${user.email}`, req });
    sendResponse(res, 201, 'User created successfully', user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user.id,
      req.user
    );
    logActivity({ user: req.user, action: 'USER_UPDATED', targetUser: user.id || user._id, details: `Updated user ${user.email}`, req });
    sendResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id, req.user.id);
    logActivity({ user: req.user, action: 'USER_DELETED', targetUser: user.id || user._id, details: `Deactivated user ${user.email}`, req });
    sendResponse(res, 200, 'User deactivated successfully', user);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    sendResponse(res, 200, 'Profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    const action = req.body.newPassword ? 'PASSWORD_CHANGED' : 'PROFILE_UPDATED';
    logActivity({ user: req.user, action, details: `Profile updated by ${req.user.email}`, req });
    sendResponse(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats();
    sendResponse(res, 200, 'Stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
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
