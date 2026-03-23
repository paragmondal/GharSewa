const serviceRepository = require('../repositories/ServiceRepository');

class ServiceCatalogService {
  async getAllServices() {
    return serviceRepository.findActive();
  }

  async getServiceById(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    return service;
  }

  async getServiceBySlug(slug) {
    const service = await serviceRepository.findBySlug(slug);
    if (!service) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    return service;
  }

  async getServicesByCategory(category) {
    return serviceRepository.findByCategory(category);
  }

  async createService(data) {
    const existing = await serviceRepository.findOne({ name: data.name });
    if (existing) {
      const err = new Error('Service with this name already exists');
      err.statusCode = 409;
      throw err;
    }
    return serviceRepository.create(data);
  }

  async updateService(id, data) {
    const service = await serviceRepository.update(id, data);
    if (!service) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    return service;
  }

  async deleteService(id) {
    const service = await serviceRepository.update(id, { isActive: false });
    if (!service) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    return { message: 'Service deactivated' };
  }

  async seedDefaultServices() {
    const defaults = [
      { name: 'Plumbing', category: 'plumber', description: 'Professional plumbing services including leak repair, pipe installation, and drainage solutions.', basePrice: 299, icon: '🔧', features: ['Leak repair', 'Pipe installation', 'Drain cleaning', 'Tap replacement'] },
      { name: 'Electrical Repair', category: 'electrician', description: 'Certified electrician for wiring, switchboard repair, and electrical installations.', basePrice: 349, icon: '⚡', features: ['Wiring', 'Switchboard repair', 'Lighting installation', 'MCB replacement'] },
      { name: 'AC Service & Repair', category: 'ac_mechanic', description: 'Complete AC maintenance, gas refill, and installation services.', basePrice: 499, icon: '❄️', features: ['AC servicing', 'Gas refill', 'Installation', 'Deep cleaning'] },
      { name: 'Gas Cylinder Delivery', category: 'gas_delivery', description: 'Quick and safe LPG gas cylinder delivery at your doorstep.', basePrice: 50, priceUnit: 'per delivery', icon: '🔥', features: ['Same-day delivery', 'Safety-certified', 'Empty cylinder pickup'] },
      { name: 'Home Cleaning', category: 'cleaning', description: 'Professional home cleaning services for a spotless and hygienic home.', basePrice: 599, icon: '🧹', features: ['Deep cleaning', 'Bathroom cleaning', 'Kitchen cleaning', 'Sofa cleaning'] },
      { name: 'Carpentry', category: 'carpenter', description: 'Expert carpentry for furniture assembly, repair, and custom woodwork.', basePrice: 399, icon: '🪚', features: ['Furniture assembly', 'Door repair', 'Custom woodwork', 'Cabinet installation'] },
      { name: 'Painting', category: 'painter', description: 'Interior and exterior painting services with premium paints.', basePrice: 799, priceUnit: 'per day', icon: '🎨', features: ['Interior painting', 'Exterior painting', 'Texture coating', 'Waterproofing'] },
    ];

    for (const svc of defaults) {
      const exists = await serviceRepository.findOne({ name: svc.name });
      if (!exists) await serviceRepository.create(svc);
    }
  }
}

module.exports = new ServiceCatalogService();
