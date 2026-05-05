const authService = require('../services/authService');
const { logActivity } = require('../services/activityService');
const sendResponse = require('../utils/apiResponse');
const env = require('../config/env');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    logActivity({ user, action: 'USER_LOGIN', details: `${user.email} logged in`, req });

    sendResponse(res, 200, 'Login successful', {
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendResponse(res, 401, 'No refresh token provided');
    }

    const { user, accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(refreshToken);

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

    sendResponse(res, 200, 'Token refreshed', {
      user,
      accessToken,
    });
  } catch (error) {
    // Clear invalid cookie
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await authService.logout(req.user.id);
      logActivity({ user: req.user, action: 'USER_LOGOUT', details: `${req.user.email} logged out`, req });
    }
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refresh, logout };
