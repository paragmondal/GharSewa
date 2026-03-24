/**
 * Socket.io configuration — singleton getter/setter.
 * Keeps socket instance accessible throughout the app without circular deps.
 */
let io = null;

const initSocket = (httpServer) => {
  const { Server } = require('socket.io');
  const config = require('./index');

  io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const logger = require('../utils/logger');
    logger.info(`Socket connected: ${socket.id}`);

    // Client joins their personal rooms after login
    socket.on('joinUserRoom', (userId) => {
      socket.join(`user_${userId}`);
      logger.info(`User ${userId} joined their room`);
    });

    socket.on('joinProviderRoom', (providerId) => {
      socket.join(`provider_${providerId}`);
      logger.info(`Provider ${providerId} joined their room`);
    });

    socket.on('joinAdminRoom', () => {
      socket.join('admin_room');
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
