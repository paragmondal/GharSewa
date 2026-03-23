const { z } = require('zod');
const { sendBadRequest } = require('../utils/apiResponse');

/**
 * Middleware factory — validates req.body against a Zod schema.
 * @param {z.ZodSchema} schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return sendBadRequest(res, 'Validation failed', errors);
    }
    req.body = result.data; // use parsed/coerced data
    next();
  };
};

// ─── Schemas ───────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
  role: z.enum(['user', 'provider']).default('user'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const bookingSchema = z.object({
  serviceId: z.string().min(24).max(24),
  scheduledDate: z.string().datetime().or(z.string().min(1)),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  address: z.object({
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  }),
  notes: z.string().max(500).optional(),
});

const reviewSchema = z.object({
  bookingId: z.string().min(24).max(24),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  tags: z.array(z.enum(['on_time', 'professional', 'quality_work', 'good_communication', 'fair_pricing'])).optional(),
});

const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['plumber', 'electrician', 'ac_mechanic', 'gas_delivery', 'cleaning', 'carpenter', 'painter']),
  description: z.string().min(10).max(1000),
  basePrice: z.number().positive(),
  priceUnit: z.enum(['per visit', 'per hour', 'per day', 'fixed']).default('per visit'),
  icon: z.string().optional(),
  features: z.array(z.string()).optional(),
  estimatedDuration: z.string().optional(),
});

module.exports = {
  validate,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    booking: bookingSchema,
    review: reviewSchema,
    service: serviceSchema,
  },
};
