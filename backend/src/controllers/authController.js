const authService = require('../services/AuthService');
const { sendSuccess, sendCreated, sendError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendCreated(res, result, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshToken(token);
    return sendSuccess(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id);
    return sendSuccess(res, {}, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  return sendSuccess(res, { user: req.user }, 'Current user');
};

module.exports = { register, login, refreshToken, logout, getMe };
