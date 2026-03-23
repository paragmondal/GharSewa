const MongoBaseRepository = require('./MongoBaseRepository');
const Review = require('../models/Review');

class ReviewRepository extends MongoBaseRepository {
  constructor() {
    super(Review);
  }

  async findByProvider(providerId, options = {}) {
    return this.findMany({ providerId, isVisible: true }, {
      populate: { path: 'userId', select: 'name profilePicture' },
      sort: { createdAt: -1 },
      ...options,
    });
  }

  async findByBooking(bookingId) {
    return this.findOne({ bookingId });
  }

  async getProviderRatingStats(providerId) {
    const result = await this.aggregate([
      { $match: { providerId: providerId, isVisible: true } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          total: { $sum: 1 },
          ratingBreakdown: { $push: '$rating' },
        },
      },
    ]);
    return result[0] || { average: 0, total: 0 };
  }
}

module.exports = new ReviewRepository();
