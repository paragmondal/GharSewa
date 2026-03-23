const MongoBaseRepository = require('./MongoBaseRepository');
const Provider = require('../models/Provider');

class ProviderRepository extends MongoBaseRepository {
  constructor() {
    super(Provider);
  }

  async findByUserId(userId) {
    return this.findOne({ userId });
  }

  async findApproved(filter = {}, options = {}) {
    return this.findMany({ ...filter, isApproved: true }, options);
  }

  async findAvailableBySkill(skill, city = null) {
    const filter = {
      isApproved: true,
      'availability.isAvailable': true,
      skills: skill,
    };
    if (city) filter['serviceArea.cities'] = { $regex: city, $options: 'i' };
    return this.findMany(filter, {
      populate: { path: 'userId', select: 'name email phone profilePicture' },
      sort: { 'rating.average': -1 },
    });
  }

  async updateRating(providerId, newAverage, totalReviews) {
    return this.update(providerId, {
      'rating.average': newAverage,
      'rating.totalReviews': totalReviews,
    });
  }

  async incrementEarnings(providerId, amount) {
    return this.model.findByIdAndUpdate(
      providerId,
      {
        $inc: { totalEarnings: amount, completedJobs: 1 },
      },
      { new: true }
    );
  }
}

module.exports = new ProviderRepository();
