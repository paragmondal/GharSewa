const OpenAI = require('openai');
const config = require('../config');
const providerRepository = require('../repositories/ProviderRepository');
const bookingRepository = require('../repositories/BookingRepository');
const serviceRepository = require('../repositories/ServiceRepository');
const bookingService = require('./BookingService');
const logger = require('../utils/logger');

// ─── AI Tools Definitions ───────────────────────────────────
const AI_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'book_service',
      description: 'Executes a booking for a specific home service. Do NOT call this until you have all required parameters.',
      parameters: {
        type: 'object',
        properties: {
          serviceCategory: {
            type: 'string',
            enum: ['plumber', 'electrician', 'ac_mechanic', 'gas_delivery', 'cleaning', 'carpenter', 'painter'],
            description: 'The category of service to book.',
          },
          date: { type: 'string', description: 'Date of booking in YYYY-MM-DD format based on user intent.' },
          time: { type: 'string', description: 'Time of booking in HH:mm format.' },
          city: { type: 'string', description: 'City for the service.' },
          street: { type: 'string', description: 'Street address for the service.' },
          notes: { type: 'string', description: 'Any extra notes or problems described by the user.' }
        },
        required: ['serviceCategory', 'date', 'time', 'city', 'street'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancel_booking',
      description: 'Cancels an existing booking via its ID.',
      parameters: {
        type: 'object',
        properties: {
          bookingId: { type: 'string', description: 'The MongoDB ObjectId of the booking.' },
          reason: { type: 'string', description: 'Reason for cancellation.' }
        },
        required: ['bookingId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'reschedule_booking',
      description: 'Reschedules an existing booking to a new date and time.',
      parameters: {
        type: 'object',
        properties: {
          bookingId: { type: 'string', description: 'The MongoDB ObjectId of the booking.' },
          newDate: { type: 'string', description: 'New date in YYYY-MM-DD format.' },
          newTime: { type: 'string', description: 'New time in HH:mm format.' }
        },
        required: ['bookingId', 'newDate', 'newTime'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'suggest_provider',
      description: 'Suggests the best available providers for a specific service.',
      parameters: {
        type: 'object',
        properties: {
          skill: {
            type: 'string',
            enum: ['plumber', 'electrician', 'ac_mechanic', 'gas_delivery', 'cleaning', 'carpenter', 'painter'],
          },
          city: { type: 'string', description: 'City for the service (optional)' }
        },
        required: ['skill'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_booking_status',
      description: 'Checks the exact status of a booking using its ID.',
      parameters: {
        type: 'object',
        properties: {
          bookingId: { type: 'string', description: 'The MongoDB ObjectId of the booking.' }
        },
        required: ['bookingId'],
      },
    },
  }
];

// ─── Function Executors ────────────────────────────────────────
const executeFunctionCall = async (name, args, userId) => {
  try {
    if (name === 'book_service') {
      const activeServices = await serviceRepository.findByCategory(args.serviceCategory);
      if (!activeServices.length) return { error: `No active services found for category ${args.serviceCategory}` };
      
      const { booking } = await bookingService.createBooking(userId, {
        serviceId: activeServices[0]._id,
        scheduledDate: args.date,
        scheduledTime: args.time,
        address: { city: args.city, street: args.street, state: 'N/A', pincode: '000000' },
        notes: args.notes || '',
      });
      
      return { 
        success: true, 
        action: 'book_service', 
        data: { 
          bookingId: booking._id, 
          service: args.serviceCategory, 
          date: booking.scheduledDate, 
          time: booking.scheduledTime, 
          status: booking.status 
        },
        message: `Successfully booked a ${args.serviceCategory} for ${args.date} at ${args.time}.` 
      };
    }

    if (name === 'cancel_booking') {
      await bookingService.cancelBooking(args.bookingId, userId, args.reason || 'Cancelled by user via AI');
      return { 
        success: true, 
        action: 'cancel_booking', 
        data: { bookingId: args.bookingId }, 
        message: `Booking ${args.bookingId} has been successfully cancelled.` 
      };
    }

    if (name === 'reschedule_booking') {
      await bookingRepository.update(args.bookingId, {
        scheduledDate: new Date(args.newDate),
        scheduledTime: args.newTime,
      });
      return { 
        success: true, 
        action: 'reschedule_booking', 
        data: { bookingId: args.bookingId, newDate: args.newDate, newTime: args.newTime }, 
        message: `Booking rescheduled to ${args.newDate} at ${args.newTime}.` 
      };
    }

    if (name === 'suggest_provider') {
      const providers = await providerRepository.findAvailableBySkill(args.skill, args.city);
      const topProviders = providers.slice(0, 3).map((p) => ({
        id: p._id,
        name: p.userId?.name || 'Top Provider',
        rating: p.rating?.average || 5.0,
        baseRate: p.pricing?.baseRate || 299,
      }));
      return { 
        success: true, 
        action: 'suggest_provider', 
        data: topProviders,
        message: `Here are the top providers for ${args.skill}:` 
      };
    }

    if (name === 'check_booking_status') {
      const booking = await bookingService.getBookingById(args.bookingId);
      return { 
        success: true, 
        action: 'check_booking_status', 
        data: { bookingId: booking._id, status: booking.status, payment: booking.paymentStatus, service: booking.serviceId?.name },
        message: `Your booking status is currently: ${booking.status.replace('_', ' ')}.` 
      };
    }
  } catch (err) {
    logger.error(`AI Action ${name} failed: ${err.message}`);
    return { success: false, action: 'error', message: err.message || 'Execution failed.' };
  }
};

// ─── Format Final JSON Response ────────────────────────────────
// The user mandate states AI must ALWAYS respond in structured JSON
const formatJsonResponse = (action, data, message) => {
  return JSON.stringify({
    action: action || 'chat',
    data: data || {},
    message: message || ''
  });
};

class AIAgentService {
  async chat(messages, userId) {
    // Strip frontend JSON string wrappers to get raw text for OpenAI
    const parsedMessages = messages.map(msg => {
      let rawContent = msg.content;
      try {
        const parsed = JSON.parse(msg.content);
        rawContent = parsed.message || parsed.content;
      } catch (e) { /* ignore JSON parse error, it's just raw text */ }
      return { role: msg.role, content: rawContent };
    });

    const systemPrompt = {
      role: 'system',
      content: `You are an absolute expert Auto-Booking Agent for GharSewa home services. Your core goal is to natively DO things, not just chat.
If you need to book a service, you MUST ask for: Service Category, Date (YYYY-MM-DD), Time (HH:mm), City, and Street Address.
Never hallucinate IDs. You must ALWAYS use tools when you have the relevant data.
Always keep messages concise, action-oriented, and highly polite.`,
    };

    const fullMessages = [systemPrompt, ...parsedMessages];

    // Fallback Mock Logic
    if (!config.openai.apiKey || config.openai.apiKey === 'sk-...') {
      logger.warn('No OpenAI API key — using advanced mock agent');
      const last = parsedMessages[parsedMessages.length - 1]?.content?.toLowerCase() || '';
      let mockRes = { action: 'chat', data: {}, message: 'How can I assist you today?' };
      
      if (last.includes('book') && last.includes('plumber')) {
        mockRes = { action: 'chat', data: {}, message: 'Sure! I can book a plumber. What date, time, city, and street address do you prefer? (Type "tomorrow" to confirm)' };
        return { role: 'assistant', content: JSON.stringify(mockRes) };
      } else if (last.includes('tomorrow') || last.includes('confirm')) {
        // Automatically mock a booking confirmation and natively write it to DB
        const mockArgs = {
          serviceCategory: 'plumber',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          city: 'Test City',
          street: 'Test Avenue',
          notes: 'AI Mock Autopilot Booking'
        };
        const result = await executeFunctionCall('book_service', mockArgs, userId);
        return { role: 'assistant', content: formatJsonResponse(result.action, result.data, result.message) };
      }
      return { role: 'assistant', content: JSON.stringify(mockRes) };
    }

    try {
      const openai = new OpenAI({ apiKey: config.openai.apiKey });

      let response = await openai.chat.completions.create({
        model: config.openai.model,
        messages: fullMessages,
        tools: AI_TOOLS,
        tool_choice: 'auto',
        temperature: 0.2, // precise agent
      });

      let msg = response.choices[0].message;

      // Handle tool calls
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        const toolCall = msg.tool_calls[0]; // grab first action
        const funcName = toolCall.function.name;
        const funcArgs = JSON.parse(toolCall.function.arguments || '{}');
        
        // EXECUTE BACKEND ACTION
        const result = await executeFunctionCall(funcName, funcArgs, userId);

        // Natively return the explicit structured JSON from execution
        return { 
          role: 'assistant', 
          content: formatJsonResponse(result.action, result.data, result.message) 
        };
      }

      // If no tool was called, return standard chat JSON
      return { 
        role: 'assistant', 
        content: formatJsonResponse('chat', {}, msg.content) 
      };
    } catch (err) {
      logger.error(`OpenAI API error: ${err.message}`);
      return { role: 'assistant', content: formatJsonResponse('error', {}, 'Sorry, I encountered an internal system error.') };
    }
  }
}

module.exports = new AIAgentService();
