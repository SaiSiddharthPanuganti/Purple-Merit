const User = require('../models/User');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const compareTokenHash = (storedHash, token) => {
  if (!storedHash) return false;
  const incomingHash = hashToken(token);
  const stored = Buffer.from(storedHash, 'hex');
  const incoming = Buffer.from(incomingHash, 'hex');
  return stored.length === incoming.length && crypto.timingSafeEqual(stored, incoming);
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('Your account has been deactivated. Contact an admin.', 403);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token hash and update last login
  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  const { verifyRefreshToken } = require('../utils/token');

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select('+refreshTokenHash');

  if (!user || !compareTokenHash(user.refreshTokenHash, refreshToken)) {
    throw new AppError('Invalid refresh token.', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('Account deactivated.', 403);
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
};

module.exports = { login, refreshAccessToken, logout };
