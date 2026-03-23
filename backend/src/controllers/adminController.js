const userService = require('../services/UserService');
const providerService = require('../services/ProviderService');
const bookingService = require('../services/BookingService');
const { sendSuccess } = require('../utils/apiResponse');

const getDashboardStats = async (req, res, next) => {
  try {
    const [bookingStats, userCount, providerCount] = await Promise.all([
      bookingService.getAnalytics(),
      require('../repositories/UserRepository').count({ role: 'user' }),
      require('../repositories/ProviderRepository').count({ isApproved: true }),
    ]);

    return sendSuccess(res, {
      bookings: bookingStats,
      users: userCount,
      providers: providerCount,
    });
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

const getAllProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;
    const result = await providerService.getAllProviders(+page, +limit, {
      isApproved: isApproved !== undefined ? isApproved === 'true' : undefined,
    });
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

const approveProvider = async (req, res, next) => {
  try {
    const provider = await providerService.approveProvider(req.params.id, req.user._id);
    return sendSuccess(res, { provider }, 'Provider approved successfully');
  } catch (err) { next(err); }
};

const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const result = await bookingService.getAllBookings(+page, +limit, { status });
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

module.exports = {
  getDashboardStats, getAllUsers, toggleUserStatus,
  getAllProviders, approveProvider, getAllBookings,
};
