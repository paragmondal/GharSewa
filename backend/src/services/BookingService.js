const bookingRepository = require('../repositories/BookingRepository');
const serviceRepository = require('../repositories/ServiceRepository');
const providerRepository = require('../repositories/ProviderRepository');

class BookingService {
  async createBooking(userId, { serviceId, scheduledDate, scheduledTime, address, notes }) {
    // Validate service exists
    const service = await serviceRepository.findById(serviceId);
    if (!service || !service.isActive) {
      const err = new Error('Service not found or unavailable');
      err.statusCode = 404;
      throw err;
    }

    // Auto-assign best available provider for this service category
    const providers = await providerRepository.findAvailableBySkill(
      service.category,
      address.city
    );
    const assignedProvider = providers.length > 0 ? providers[0] : null;

    const booking = await bookingRepository.create({
      userId,
      serviceId,
      providerId: assignedProvider ? assignedProvider._id : null,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      address,
      notes,
      amount: service.basePrice,
      status: assignedProvider ? 'confirmed' : 'pending',
      statusHistory: [{ status: assignedProvider ? 'confirmed' : 'pending', changedAt: new Date() }],
    });

    // Increment service popularity
    await serviceRepository.incrementPopularity(serviceId);

    return { booking, assignedProvider };
  }

  async getUserBookings(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const bookings = await bookingRepository.findByUser(userId, { limit, skip });
    const total = await bookingRepository.count({ userId });
    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getProviderBookings(providerId, status = null) {
    const filter = {};
    if (status) filter.status = status;
    return bookingRepository.findMany(
      { providerId, ...filter },
      {
        populate: [
          { path: 'userId', select: 'name email phone address' },
          { path: 'serviceId', select: 'name category icon' },
        ],
        sort: { createdAt: -1 },
      }
    );
  }

  async getBookingById(bookingId) {
    const booking = await bookingRepository.findById(bookingId, {
      populate: [
        { path: 'userId', select: 'name email phone' },
        { path: 'serviceId', select: 'name category icon basePrice' },
        { path: 'providerId', populate: { path: 'userId', select: 'name phone profilePicture' } },
      ],
    });
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }
    return booking;
  }

  async updateBookingStatus(bookingId, status, userId, note = '') {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const validTransitions = {
      pending: ['confirmed', 'cancelled', 'rejected'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      rejected: [],
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      const err = new Error(`Cannot transition from '${booking.status}' to '${status}'`);
      err.statusCode = 400;
      throw err;
    }

    const updated = await bookingRepository.updateStatus(bookingId, status, userId, note);

    // Update provider earnings on completion
    if (status === 'completed' && booking.providerId) {
      await providerRepository.incrementEarnings(booking.providerId, booking.amount);
    }

    return updated;
  }

  async cancelBooking(bookingId, userId, reason) {
    return this.updateBookingStatus(bookingId, 'cancelled', userId, reason);
  }

  async getAllBookings(page = 1, limit = 20, filters = {}) {
    const skip = (page - 1) * limit;
    const filter = {};
    if (filters.status) filter.status = filters.status;
    if (filters.paymentStatus) filter.paymentStatus = filters.paymentStatus;

    const [bookings, total] = await Promise.all([
      bookingRepository.findMany(filter, {
        populate: [
          { path: 'userId', select: 'name email' },
          { path: 'serviceId', select: 'name category' },
          { path: 'providerId', populate: { path: 'userId', select: 'name' } },
        ],
        sort: { createdAt: -1 },
        limit,
        skip,
      }),
      bookingRepository.count(filter),
    ]);
    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getAnalytics() {
    return bookingRepository.getAdminAnalytics();
  }
}

module.exports = new BookingService();
