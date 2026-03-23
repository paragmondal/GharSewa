const aiService = require('../services/AIService');
const { sendSuccess } = require('../utils/apiResponse');

const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const err = new Error('messages array is required');
      err.statusCode = 400;
      throw err;
    }

    const reply = await aiService.chat(messages, req.user._id);
    return sendSuccess(res, { message: reply });
  } catch (err) { next(err); }
};

module.exports = { chat };
