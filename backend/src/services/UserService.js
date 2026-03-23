const userRepository = require('../repositories/UserRepository');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Prevent role/password changes via this endpoint
    const { role, password, refreshToken, ...safeData } = updateData;
    const user = await userRepository.update(userId, safeData);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.findMany({ role: { $ne: 'admin' } }, {
        sort: { createdAt: -1 },
        limit,
        skip,
        select: '-refreshToken',
      }),
      userRepository.count({ role: { $ne: 'admin' } }),
    ]);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async toggleUserStatus(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return userRepository.update(userId, { isActive: !user.isActive });
  }
}

module.exports = new UserService();
