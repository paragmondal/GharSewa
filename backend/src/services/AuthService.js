const userRepository = require('../repositories/UserRepository');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

class AuthService {
  /**
   * Register a new user.
   */
  async register({ name, email, password, phone, role = 'user' }) {
    // Check if email already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await userRepository.create({ name, email, password, phone, role });
    const tokens = this._generateTokens(user);
    await userRepository.setRefreshToken(user._id, tokens.refreshToken);
    return { user, ...tokens };
  }

  /**
   * Login with email + password.
   */
  async login({ email, password }) {
    // Need password for comparison — select:false in schema
    const userWithPassword = await userRepository.findByEmail(email, true);
    if (!userWithPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!userWithPassword.isActive) {
      const error = new Error('Account is deactivated. Contact support.');
      error.statusCode = 403;
      throw error;
    }

    // bcrypt compare via model method
    const { comparePassword } = require('../models/User').schema.methods;
    // Recreate doc to call the instance method
    const User = require('../models/User');
    const userDoc = await User.findById(userWithPassword._id).select('+password');
    const isMatch = await userDoc.comparePassword(password);

    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const user = userDoc.toJSON();
    const tokens = this._generateTokens(user);
    await userRepository.setRefreshToken(user._id, tokens.refreshToken);
    return { user, ...tokens };
  }

  /**
   * Issue new access token from a valid refresh token.
   */
  async refreshToken(token) {
    if (!token) {
      const error = new Error('Refresh token is required');
      error.statusCode = 401;
      throw error;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const user = await userRepository.findByIdWithRefreshToken(decoded.id);
    if (!user || user.refreshToken !== token) {
      const error = new Error('Refresh token mismatch');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    return { accessToken };
  }

  /**
   * Logout — clear the refresh token.
   */
  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
  }

  _generateTokens(user) {
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });
    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
