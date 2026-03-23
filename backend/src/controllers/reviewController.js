const reviewService = require('../services/ReviewService');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user._id, req.body);
    return sendCreated(res, { review }, 'Review submitted');
  } catch (err) { next(err); }
};

const getProviderReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await reviewService.getProviderReviews(req.params.providerId, +page, +limit);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

module.exports = { createReview, getProviderReviews };
