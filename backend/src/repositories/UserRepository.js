const MongoBaseRepository = require('./MongoBaseRepository');
const User = require('../models/User');

class UserRepository extends MongoBaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find a user by email, optionally selecting the password field.
   */
  async findByEmail(email, includePassword = false) {
    const query = this.model.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select('+password');
    return query.lean();
  }

  /**
   * Find user and include refreshToken (needed for auth flow).
   */
  async findByIdWithRefreshToken(id) {
    return this.model.findById(id).select('+refreshToken').lean();
  }

  /**
   * Update the stored refresh token for a user.
   */
  async setRefreshToken(userId, token) {
    return this.model.findByIdAndUpdate(
      userId,
      { refreshToken: token, lastLogin: new Date() },
      { new: true }
    );
  }

  /**
   * Clear the refresh token (logout).
   */
  async clearRefreshToken(userId) {
    return this.model.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async findByRole(role, options = {}) {
    return this.findMany({ role }, options);
  }
}

module.exports = new UserRepository();
