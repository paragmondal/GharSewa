const providerRepository = require('../repositories/ProviderRepository');
const userRepository = require('../repositories/UserRepository');

class ProviderService {
  async createProfile(userId, profileData) {
    const existing = await providerRepository.findByUserId(userId);
    if (existing) {
      const err = new Error('Provider profile already exists');
      err.statusCode = 409;
      throw err;
    }
    return providerRepository.create({ userId, ...profileData });
  }

  async getProfile(userId) {
    const provider = await providerRepository.findOne({ userId }, {
      populate: { path: 'userId', select: 'name email phone profilePicture address' },
      lean: true,
    });
    if (!provider) {
      const err = new Error('Provider profile not found');
      err.statusCode = 404;
      throw err;
    }
    return provider;
  }

  async getProfileById(providerId) {
    const provider = await providerRepository.findById(providerId, {
      populate: { path: 'userId', select: 'name email phone profilePicture' },
    });
    if (!provider) {
      const err = new Error('Provider not found');
      err.statusCode = 404;
      throw err;
    }
    return provider;
  }

  async updateProfile(userId, updateData) {
    const provider = await providerRepository.findByUserId(userId);
    if (!provider) {
      const err = new Error('Provider profile not found');
      err.statusCode = 404;
      throw err;
    }
    return providerRepository.update(provider._id, updateData);
  }

  async toggleAvailability(userId) {
    const provider = await providerRepository.findByUserId(userId);
    if (!provider) {
      const err = new Error('Provider profile not found');
      err.statusCode = 404;
      throw err;
    }
    const currentStatus = provider.availability?.isAvailable ?? true;
    return providerRepository.update(
      provider._id, 
      { $set: { 'availability.isAvailable': !currentStatus } },
      { new: true, runValidators: false }
    );
  }

  async getAllProviders(page = 1, limit = 20, filters = {}) {
    const skip = (page - 1) * limit;
    const filter = {};
    if (filters.isApproved !== undefined) filter.isApproved = filters.isApproved;
    if (filters.skill) filter.skills = filters.skill;

    const [providers, total] = await Promise.all([
      providerRepository.findMany(filter, {
        populate: { path: 'userId', select: 'name email phone' },
        sort: { createdAt: -1 },
        limit,
        skip,
      }),
      providerRepository.count(filter),
    ]);
    return { providers, total, page, totalPages: Math.ceil(total / limit) };
  }

  async approveProvider(providerId, adminId) {
    const provider = await providerRepository.findById(providerId);
    if (!provider) {
      const err = new Error('Provider not found');
      err.statusCode = 404;
      throw err;
    }
    // Update user role to 'provider'
    await userRepository.update(provider.userId, { role: 'provider' });
    return providerRepository.update(providerId, {
      isApproved: true,
      approvedAt: new Date(),
      approvedBy: adminId,
    });
  }

  async searchProviders(skill, city) {
    return providerRepository.findAvailableBySkill(skill, city);
  }
}

module.exports = new ProviderService();
