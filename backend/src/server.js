require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { initSocket } = require('./config/socket');
const serviceCatalogService = require('./services/ServiceCatalogService');
const config = require('./config');
const logger = require('./utils/logger');

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed default services if DB is empty
    await serviceCatalogService.seedDefaultServices();
    logger.info('Default services seeded');

    // Start listening
    server.listen(config.port, () => {
      logger.info(`🚀 GharSewa server running on port ${config.port} [${config.nodeEnv}]`);
      logger.info(`📍 API: http://localhost:${config.port}/api/v1`);
      logger.info(`❤️  Health: http://localhost:${config.port}/health`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

// ─── Graceful shutdown ─────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

startServer();
