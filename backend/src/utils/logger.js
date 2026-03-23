const winston = require('winston');
const config = require('../config');

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format:
        config.nodeEnv === 'production'
          ? combine(timestamp(), json())
          : combine(colorize(), simple()),
    }),
  ],
});

module.exports = logger;
