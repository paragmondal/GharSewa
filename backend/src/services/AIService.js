const OpenAI = require('openai');
const config = require('../config');
const providerRepository = require('../repositories/ProviderRepository');
const bookingRepository = require('../repositories/BookingRepository');
const serviceRepository = require('../repositories/ServiceRepository');
const logger = require('../utils/logger');

// ─── AI Function Definitions ───────────────────────────────────
const AI_FUNCTIONS = [
  {
    name: 'searchProviders',
    description: 'Search for available service providers by skill and optional city',
    parameters: {
      type: 'object',
      properties: {
        skill: {
          type: 'string',
          enum: ['plumber', 'electrician', 'ac_mechanic', 'gas_delivery', 'cleaning', 'carpenter', 'painter'],
          description: 'The type of service/skill required',
        },
        city: { type: 'string', description: 'City name for location-based search (optional)' },
      },
      required: ['skill'],
    },
  },
  {
    name: 'getServiceList',
    description: 'Get the list of all available services on GharSewa',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'getBookingStatus',
    description: 'Get the current status of a specific booking by booking number',
    parameters: {
      type: 'object',
      properties: {
        bookingNumber: { type: 'string', description: 'The GS-XXXXX booking reference number' },
      },
      required: ['bookingNumber'],
    },
  },
  {
    name: 'createBookingIntent',
    description: 'Signal intent to book a service — returns what information is needed to proceed',
    parameters: {
      type: 'object',
      properties: {
        serviceType: {
          type: 'string',
          enum: ['plumber', 'electrician', 'ac_mechanic', 'gas_delivery', 'cleaning', 'carpenter', 'painter'],
        },
        date: { type: 'string', description: 'Preferred date (e.g. "tomorrow", "2024-04-15")' },
      },
      required: ['serviceType'],
    },
  },
];

// ─── Function Executors ────────────────────────────────────────
const executeFunctionCall = async (name, args, userId) => {
  try {
    if (name === 'searchProviders') {
      const providers = await providerRepository.findAvailableBySkill(args.skill, args.city);
      return {
        count: providers.length,
        providers: providers.slice(0, 3).map((p) => ({
          name: p.userId?.name || 'Provider',
          rating: p.rating?.average || 0,
          skills: p.skills,
          baseRate: p.pricing?.baseRate,
          available: p.availability?.isAvailable,
        })),
      };
    }

    if (name === 'getServiceList') {
      const services = await serviceRepository.findActive();
      return {
        services: services.map((s) => ({
          name: s.name,
          category: s.category,
          basePrice: s.basePrice,
          priceUnit: s.priceUnit,
          icon: s.icon,
        })),
      };
    }

    if (name === 'getBookingStatus') {
      const booking = await bookingRepository.findOne(
        { bookingNumber: args.bookingNumber },
        { populate: [{ path: 'serviceId', select: 'name icon' }] }
      );
      if (!booking) return { error: 'Booking not found' };
      return {
        bookingNumber: booking.bookingNumber,
        service: booking.serviceId?.name,
        status: booking.status,
        scheduledDate: booking.scheduledDate,
        paymentStatus: booking.paymentStatus,
      };
    }

    if (name === 'createBookingIntent') {
      return {
        action: 'redirect_to_booking',
        serviceType: args.serviceType,
        message: `Great! To book a ${args.serviceType}, please provide your address and preferred time. You can also go to the Services page to book now.`,
        url: `/services`,
      };
    }
  } catch (err) {
    logger.error(`AI function ${name} failed: ${err.message}`);
    return { error: 'Could not fetch data' };
  }
};

// ─── Mock responses (when no API key) ─────────────────────────
const getMockResponse = (messages) => {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (lastMessage.includes('plumb') || lastMessage.includes('pipe') || lastMessage.includes('leak')) {
    return "I can help you book a **plumber**! 🔧 Our certified plumbers are available for leak repair, pipe installation, and drainage solutions starting at ₹299. Would you like me to find available plumbers in your area?";
  }
  if (lastMessage.includes('clean')) {
    return "Let me help with **home cleaning**! 🧹 Our professional cleaners offer deep cleaning, bathroom, kitchen and sofa cleaning starting at ₹599. Shall I check availability in your city?";
  }
  if (lastMessage.includes('electrici') || lastMessage.includes('wiring') || lastMessage.includes('light')) {
    return "Need an **electrician**? ⚡ Our certified electricians handle wiring, switchboard repair, and installations starting at ₹349. Want me to find one near you?";
  }
  if (lastMessage.includes('ac') || lastMessage.includes('air condition')) {
    return "Need **AC service or repair**? ❄️ We offer AC servicing, gas refill, and installation starting at ₹499. Shall I look for AC mechanics in your area?";
  }
  if (lastMessage.includes('book') && (lastMessage.includes('status') || lastMessage.includes('track'))) {
    return "To track your booking, please share your **booking number** (format: GS-XXXXX-XXXX) and I'll fetch the latest status for you!";
  }
  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
    return "Hello! 👋 Welcome to **GharSewa** AI Assistant! I can help you:\n\n• 🔧 Book home services (plumber, electrician, AC, cleaning, etc.)\n• 📊 Track your bookings\n• 🔍 Find the best service providers near you\n• 💰 Get pricing information\n\nWhat can I help you with today?";
  }
  return "I'm here to help with home services! You can ask me to:\n\n• Book a **plumber, electrician, AC mechanic, cleaner** and more\n• Track your **booking status**\n• Find **providers near you**\n• Get **pricing information**\n\nHow can I assist you?";
};

class AIService {
  async chat(messages, userId) {
    const systemPrompt = {
      role: 'system',
      content: `You are GharSewa AI Assistant — a helpful, friendly assistant for a home services platform. You help users book services like plumbing, electrical, AC repair, cleaning, carpentry, painting, and gas delivery. Always be helpful, concise, and proactive. When users ask to book a service, use the appropriate function calls. Respond in the same language the user writes in. Keep replies friendly and use emojis where appropriate.`,
    };

    const fullMessages = [systemPrompt, ...messages];

    // Use mock if no API key
    if (!config.openai.apiKey || config.openai.apiKey === 'sk-...') {
      logger.warn('No OpenAI API key — using mock AI responses');
      return { role: 'assistant', content: getMockResponse(messages) };
    }

    try {
      const openai = new OpenAI({ apiKey: config.openai.apiKey });

      let response = await openai.chat.completions.create({
        model: config.openai.model,
        messages: fullMessages,
        functions: AI_FUNCTIONS,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 500,
      });

      let msg = response.choices[0].message;

      // Handle function calls
      while (msg.function_call) {
        const funcName = msg.function_call.name;
        const funcArgs = JSON.parse(msg.function_call.arguments || '{}');
        const funcResult = await executeFunctionCall(funcName, funcArgs, userId);

        fullMessages.push(msg); // add assistant function call msg
        fullMessages.push({
          role: 'function',
          name: funcName,
          content: JSON.stringify(funcResult),
        });

        response = await openai.chat.completions.create({
          model: config.openai.model,
          messages: fullMessages,
          functions: AI_FUNCTIONS,
          function_call: 'auto',
          temperature: 0.7,
          max_tokens: 500,
        });
        msg = response.choices[0].message;
      }

      return { role: 'assistant', content: msg.content };
    } catch (err) {
      logger.error(`OpenAI API error: ${err.message}`);
      return { role: 'assistant', content: getMockResponse(messages) };
    }
  }
}

module.exports = new AIService();
