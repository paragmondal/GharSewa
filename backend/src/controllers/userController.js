const userService = require('../services/UserService');
const { sendSuccess } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);
    return sendSuccess(res, { user });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    return sendSuccess(res, { user }, 'Profile updated');
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getAllUsers(+page, +limit);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.userId);
    return sendSuccess(res, { user }, 'User status updated');
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getAllUsers, toggleUserStatus };
