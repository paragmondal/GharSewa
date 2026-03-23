const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate a signed JWT access token.
 * @param {object} payload - { id, role }
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpires,
  });
};

/**
 * Generate a signed JWT refresh token.
 * @param {object} payload - { id }
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpires,
  });
};

/**
 * Verify an access token.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret);
};

/**
 * Verify a refresh token.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
