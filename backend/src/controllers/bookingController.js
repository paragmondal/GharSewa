const bookingService = require('../services/BookingService');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { getIO } = require('../config/socket');

const createBooking = async (req, res, next) => {
  try {
    const { booking, assignedProvider } = await bookingService.createBooking(req.user._id, req.body);

    // Real-time: notify provider of new booking
    if (assignedProvider) {
      const io = getIO();
      io.to(`provider_${assignedProvider._id}`).emit('newBooking', {
        bookingId: booking._id,
        bookingNumber: booking.bookingNumber,
        service: booking.serviceId,
        scheduledDate: booking.scheduledDate,
      });
    }

    return sendCreated(res, { booking }, 'Booking created successfully');
  } catch (err) { next(err); }
};

const getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await bookingService.getUserBookings(req.user._id, +page, +limit);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    return sendSuccess(res, { booking });
  } catch (err) { next(err); }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status, req.user._id, note);

    // Real-time: notify user of status change
    const io = getIO();
    io.to(`user_${booking.userId}`).emit('bookingUpdated', {
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
    });

    return sendSuccess(res, { booking }, `Booking status updated to ${status}`);
  } catch (err) { next(err); }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id, reason);
    return sendSuccess(res, { booking }, 'Booking cancelled');
  } catch (err) { next(err); }
};

const getProviderBookings = async (req, res, next) => {
  try {
    const providerService = require('../services/ProviderService');
    const provider = await providerService.getProfile(req.user._id);
    const bookings = await bookingService.getProviderBookings(provider._id, req.query.status);
    return sendSuccess(res, { bookings });
  } catch (err) { next(err); }
};

const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const result = await bookingService.getAllBookings(+page, +limit, { status, paymentStatus });
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

module.exports = {
  createBooking, getMyBookings, getBookingById,
  updateBookingStatus, cancelBooking, getProviderBookings, getAllBookings,
};
