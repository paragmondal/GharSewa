const providerService = require('../services/ProviderService');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');

const createProfile = async (req, res, next) => {
  try {
    const provider = await providerService.createProfile(req.user._id, req.body);
    return sendCreated(res, { provider }, 'Provider profile created. Awaiting admin approval.');
  } catch (err) { next(err); }
};

const getMyProfile = async (req, res, next) => {
  try {
    const provider = await providerService.getProfile(req.user._id);
    return sendSuccess(res, { provider });
  } catch (err) { next(err); }
};

const getProviderById = async (req, res, next) => {
  try {
    const provider = await providerService.getProfileById(req.params.id);
    return sendSuccess(res, { provider });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const provider = await providerService.updateProfile(req.user._id, req.body);
    return sendSuccess(res, { provider }, 'Profile updated');
  } catch (err) { next(err); }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const provider = await providerService.toggleAvailability(req.user._id);
    return sendSuccess(res, { provider }, 'Availability toggled');
  } catch (err) { next(err); }
};

const getAllProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved, skill } = req.query;
    const result = await providerService.getAllProviders(+page, +limit, {
      isApproved: isApproved !== undefined ? isApproved === 'true' : undefined,
      skill,
    });
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

const approveProvider = async (req, res, next) => {
  try {
    const provider = await providerService.approveProvider(req.params.id, req.user._id);
    return sendSuccess(res, { provider }, 'Provider approved');
  } catch (err) { next(err); }
};

const searchProviders = async (req, res, next) => {
  try {
    const { skill, city } = req.query;
    const providers = await providerService.searchProviders(skill, city);
    return sendSuccess(res, { providers, count: providers.length });
  } catch (err) { next(err); }
};

module.exports = {
  createProfile, getMyProfile, getProviderById, updateProfile,
  toggleAvailability, getAllProviders, approveProvider, searchProviders,
};
