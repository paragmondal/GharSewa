const reviewRepository = require('../repositories/ReviewRepository');
const bookingRepository = require('../repositories/BookingRepository');
const providerRepository = require('../repositories/ProviderRepository');

class ReviewService {
  async createReview(userId, { bookingId, rating, comment, tags }) {
    // Validate booking belongs to user and is completed
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }
    if (booking.userId.toString() !== userId.toString()) {
      const err = new Error('You can only review your own bookings');
      err.statusCode = 403;
      throw err;
    }
    if (booking.status !== 'completed') {
      const err = new Error('You can only review completed bookings');
      err.statusCode = 400;
      throw err;
    }
    if (booking.isReviewed) {
      const err = new Error('This booking has already been reviewed');
      err.statusCode = 409;
      throw err;
    }

    const review = await reviewRepository.create({
      bookingId,
      userId,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      rating,
      comment,
      tags,
    });

    // Mark booking reviewed
    await bookingRepository.update(bookingId, { isReviewed: true });

    // Recalculate provider rating
    const stats = await reviewRepository.getProviderRatingStats(booking.providerId);
    await providerRepository.updateRating(
      booking.providerId,
      Math.round(stats.average * 10) / 10,
      stats.total
    );

    return review;
  }

  async getProviderReviews(providerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const reviews = await reviewRepository.findByProvider(providerId, { limit, skip });
    const total = await reviewRepository.count({ providerId, isVisible: true });
    return { reviews, total, page, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = new ReviewService();
