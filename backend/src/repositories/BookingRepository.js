const MongoBaseRepository = require('./MongoBaseRepository');
const Booking = require('../models/Booking');

class BookingRepository extends MongoBaseRepository {
  constructor() {
    super(Booking);
  }

  async findByUser(userId, options = {}) {
    return this.findMany({ userId }, {
      populate: [
        { path: 'serviceId', select: 'name category icon basePrice' },
        { path: 'providerId', populate: { path: 'userId', select: 'name phone profilePicture' } },
      ],
      sort: { createdAt: -1 },
      ...options,
    });
  }

  async findByProvider(providerId, options = {}) {
    return this.findMany({ providerId }, {
      populate: [
        { path: 'userId', select: 'name email phone address' },
        { path: 'serviceId', select: 'name category icon' },
      ],
      sort: { createdAt: -1 },
      ...options,
    });
  }

  async findPendingBookings() {
    return this.findMany({ status: 'pending', providerId: null }, {
      populate: [
        { path: 'userId', select: 'name phone' },
        { path: 'serviceId', select: 'name category' },
      ],
      sort: { createdAt: 1 },
    });
  }

  async updateStatus(bookingId, status, changedBy = null, note = '') {
    const update = {
      status,
      $push: {
        statusHistory: { status, changedAt: new Date(), changedBy, note },
      },
    };
    if (status === 'completed') update.completedAt = new Date();
    return this.model.findByIdAndUpdate(bookingId, update, { new: true }).lean();
  }

  async getAdminAnalytics() {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      this.count(),
      this.count({ status: 'pending' }),
      this.count({ status: 'confirmed' }),
      this.count({ status: 'completed' }),
      this.count({ status: 'cancelled' }),
    ]);
    return { total, pending, confirmed, completed, cancelled };
  }
}

module.exports = new BookingRepository();
