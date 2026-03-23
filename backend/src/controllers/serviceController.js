const serviceCatalogService = require('../services/ServiceCatalogService');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');

const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceCatalogService.getAllServices();
    return sendSuccess(res, { services });
  } catch (err) { next(err); }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceCatalogService.getServiceById(req.params.id);
    return sendSuccess(res, { service });
  } catch (err) { next(err); }
};

const getServicesByCategory = async (req, res, next) => {
  try {
    const services = await serviceCatalogService.getServicesByCategory(req.params.category);
    return sendSuccess(res, { services });
  } catch (err) { next(err); }
};

const createService = async (req, res, next) => {
  try {
    const service = await serviceCatalogService.createService(req.body);
    return sendCreated(res, { service }, 'Service created');
  } catch (err) { next(err); }
};

const updateService = async (req, res, next) => {
  try {
    const service = await serviceCatalogService.updateService(req.params.id, req.body);
    return sendSuccess(res, { service }, 'Service updated');
  } catch (err) { next(err); }
};

const deleteService = async (req, res, next) => {
  try {
    const result = await serviceCatalogService.deleteService(req.params.id);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
};

module.exports = { getAllServices, getServiceById, getServicesByCategory, createService, updateService, deleteService };
