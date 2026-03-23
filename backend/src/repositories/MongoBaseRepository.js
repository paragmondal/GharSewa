/**
 * MongoBaseRepository — abstract base for all Mongoose repositories.
 * To swap to PostgreSQL/Supabase: create a new base that implements
 * the same interface, then update concrete repos to extend it.
 */
class MongoBaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, options = {}) {
    const query = this.model.findById(id);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    return query.lean(options.lean !== false);
  }

  async findOne(filter, options = {}) {
    const query = this.model.findOne(filter);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    return query.lean(options.lean !== false);
  }

  async findMany(filter = {}, options = {}) {
    const query = this.model.find(filter);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    if (options.sort) query.sort(options.sort);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    return query.lean(options.lean !== false);
  }

  async create(data) {
    const doc = await this.model.create(data);
    return doc.toJSON ? doc.toJSON() : doc;
  }

  async update(id, data, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, data, options).lean();
  }

  async updateOne(filter, data, options = { new: true, runValidators: true }) {
    return this.model.findOneAndUpdate(filter, data, options).lean();
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id).lean();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async exists(filter) {
    return this.model.exists(filter);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}

module.exports = MongoBaseRepository;
