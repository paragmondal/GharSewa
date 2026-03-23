const MongoBaseRepository = require('./MongoBaseRepository');
const Service = require('../models/Service');

class ServiceRepository extends MongoBaseRepository {
  constructor() {
    super(Service);
  }

  async findActive(options = {}) {
    return this.findMany({ isActive: true }, { sort: { popularityScore: -1 }, ...options });
  }

  async findByCategory(category) {
    return this.findMany({ category, isActive: true });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }

  async incrementPopularity(serviceId) {
    return this.model.findByIdAndUpdate(
      serviceId,
      { $inc: { popularityScore: 1 } },
      { new: true }
    );
  }
}

module.exports = new ServiceRepository();
