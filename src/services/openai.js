// OpenAI GPT Integration Service
// Real AI chatbot integration with OpenAI API

class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    this.useRealAPI = !!this.apiKey && import.meta.env.VITE_USE_REAL_AI === 'true';
    
    // System prompt for auto marketplace context
    this.systemPrompt = `You are an AI assistant for Auto Marketplace, a vehicle buying and selling platform. 
Your role is to help users find the perfect vehicle, answer questions about vehicles, and guide them through the buying process.

Key capabilities:
- Provide vehicle recommendations based on user needs and budget
- Compare different vehicles and explain pros/cons
- Answer questions about vehicle features, specifications, and history
- Guide users through financing, insurance, and purchasing steps
- Help with test drive scheduling and dealer communication
- Explain vehicle terminology and technical specifications

Be friendly, professional, and concise. Always prioritize user safety and informed decision-making.`;
  }

  /**
   * Send a message to OpenAI and get a response
   * @param {string} userMessage - User's message
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise<{message: string, usage?: object}>}
   */
  async sendMessage(userMessage, conversationHistory = []) {
    if (!this.useRealAPI) {
      // Fallback to simulated responses
      return this.getSimulatedResponse(userMessage);
    }

    try {
      // Build messages array with system prompt and conversation history
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      
      return {
        message: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Fallback to simulated response on error
      return this.getSimulatedResponse(userMessage);
    }
  }

  /**
   * Get vehicle recommendations using AI
   * @param {object} preferences - User preferences (budget, type, features, etc.)
   * @returns {Promise<{recommendations: string, reasoning: string}>}
   */
  async getVehicleRecommendations(preferences) {
    const prompt = `Based on these preferences, recommend 3-5 vehicles:
Budget: $${preferences.budget?.toLocaleString() || 'Not specified'}
Vehicle Type: ${preferences.type || 'Any'}
Fuel Type: ${preferences.fuelType || 'Any'}
Key Features: ${preferences.features?.join(', ') || 'None specified'}
Usage: ${preferences.usage || 'Daily commute'}

Provide specific vehicle models with brief explanations why they match.`;

    const response = await this.sendMessage(prompt);
    return {
      recommendations: response.message,
      reasoning: 'AI-powered analysis based on your preferences',
    };
  }

  /**
   * Compare vehicles using AI
   * @param {Array<object>} vehicles - Vehicles to compare
   * @returns {Promise<{comparison: string, winner?: string}>}
   */
  async compareVehicles(vehicles) {
    const vehicleList = vehicles.map((v, i) => 
      `${i + 1}. ${v.year} ${v.make} ${v.model} - $${v.price?.toLocaleString()}`
    ).join('\n');

    const prompt = `Compare these vehicles and provide a detailed analysis:

${vehicleList}

Consider:
- Value for money
- Reliability and maintenance costs
- Features and technology
- Fuel efficiency
- Safety ratings
- Resale value

Provide a balanced comparison and suggest which might be best for different use cases.`;

    const response = await this.sendMessage(prompt);
    return {
      comparison: response.message,
    };
  }

  /**
   * Analyze vehicle description and extract insights
   * @param {object} vehicle - Vehicle object
   * @returns {Promise<{insights: string[]}>}
   */
  async analyzeVehicle(vehicle) {
    const prompt = `Analyze this vehicle and provide key insights:

${vehicle.year} ${vehicle.make} ${vehicle.model}
Price: $${vehicle.price?.toLocaleString()}
Mileage: ${vehicle.mileage?.toLocaleString()} miles
Fuel: ${vehicle.fuelType}
Transmission: ${vehicle.transmission}
Features: ${vehicle.features?.join(', ')}

Provide 3-5 bullet points covering:
- Value assessment
- Notable features or concerns
- Best suited for
- Potential issues to check`;

    const response = await this.sendMessage(prompt);
    
    // Extract bullet points from response
    const insights = response.message
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.trim().replace(/^[-•]\s*/, ''));

    return { insights: insights.length > 0 ? insights : [response.message] };
  }

  /**
   * Get buying advice using AI
   * @param {object} context - Context about the situation
   * @returns {Promise<{advice: string}>}
   */
  async getBuyingAdvice(context) {
    const prompt = `User situation:
Budget: $${context.budget?.toLocaleString() || 'Not specified'}
Experience: ${context.experience || 'First-time buyer'}
Concerns: ${context.concerns || 'None specified'}
Timeline: ${context.timeline || 'Flexible'}

Provide practical advice for buying a vehicle in this situation. Include:
- Important steps in the buying process
- What to look for during inspection
- Financing options
- Negotiation tips
- Red flags to avoid`;

    const response = await this.sendMessage(prompt);
    return { advice: response.message };
  }

  /**
   * Simulated AI responses for demo mode or fallback
   * @private
   */
  getSimulatedResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      response = "Based on your preferences, I'd recommend looking at:\n\n1. Toyota Camry - Excellent reliability and fuel efficiency\n2. Honda CR-V - Great family SUV with good resale value\n3. Mazda CX-5 - Sporty handling with premium feel\n\nAll three offer strong value and low maintenance costs. Would you like more details on any of these?";
    } else if (lowerMessage.includes('compare')) {
      response = "Great question! When comparing vehicles, consider:\n\n• Reliability ratings (check Consumer Reports)\n• Total cost of ownership (fuel, insurance, maintenance)\n• Safety features (IIHS and NHTSA ratings)\n• Resale value\n• Your specific needs (cargo space, fuel efficiency, towing)\n\nWould you like me to compare specific models?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('budget')) {
      response = "For your budget, you have great options! I recommend:\n\n• Setting aside 10-15% for taxes and fees\n• Getting pre-approved for financing\n• Comparing dealer prices with private sellers\n• Checking vehicle history reports\n• Having a trusted mechanic inspect before buying\n\nWhat's your budget range?";
    } else if (lowerMessage.includes('test drive')) {
      response = "Test driving is crucial! Here's what to check:\n\n✓ Acceleration and braking responsiveness\n✓ Steering feel and handling\n✓ Visibility (blind spots, mirrors)\n✓ Comfort (seats, noise level, ride quality)\n✓ Technology features (infotainment, safety systems)\n✓ Parking ease and turning radius\n\nI can help you schedule a test drive!";
    } else if (lowerMessage.includes('electric') || lowerMessage.includes('ev')) {
      response = "Electric vehicles are a great choice! Key considerations:\n\n• Range (200-300+ miles typical)\n• Charging infrastructure in your area\n• Home charging setup costs ($500-2000)\n• Federal tax credit (up to $7,500)\n• Lower maintenance costs\n• Instant torque and quiet operation\n\nPopular EVs: Tesla Model 3, Chevy Bolt, Hyundai Ioniq 5, Ford Mustang Mach-E";
    } else if (lowerMessage.includes('suv') || lowerMessage.includes('family')) {
      response = "For families, SUVs offer great versatility:\n\n**Compact SUVs:**\n• Honda CR-V - Best overall value\n• Mazda CX-5 - Most fun to drive\n• Toyota RAV4 - Top reliability\n\n**Mid-size SUVs:**\n• Honda Pilot - 3rd row seating\n• Toyota Highlander - Best resale value\n• Hyundai Palisade - Loaded with features\n\nWhat's your must-have feature?";
    } else if (lowerMessage.includes('finance') || lowerMessage.includes('loan')) {
      response = "Smart financing tips:\n\n1. Check your credit score first (700+ gets best rates)\n2. Get pre-approved from multiple lenders\n3. Aim for loan term ≤ 60 months\n4. Put down 10-20% if possible\n5. Calculate total cost, not just monthly payment\n6. Compare APR from dealer vs bank/credit union\n\nTypical rates: 4-8% for good credit on new cars, slightly higher for used.";
    } else if (lowerMessage.includes('truck')) {
      response = "Great trucks for different needs:\n\n**Light Duty:**\n• Ford F-150 - Best-selling, versatile\n• Toyota Tacoma - Outstanding reliability\n• Chevrolet Colorado - Good mid-size option\n\n**Heavy Duty:**\n• Ford F-250/350 - Best towing capacity\n• Ram 2500/3500 - Smoothest ride\n• Chevy Silverado HD - Strong powertrain\n\nWhat will you use the truck for primarily?";
    } else {
      response = "I'm here to help with your vehicle search! I can assist with:\n\n• Vehicle recommendations based on your needs\n• Comparing different models\n• Understanding features and specifications\n• Financing and budgeting advice\n• Test drive preparation\n• Inspection tips\n\nWhat would you like to know?";
    }

    return Promise.resolve({
      message: response,
      simulated: true,
    });
  }

  /**
   * Check if real API is available
   */
  isRealAPIAvailable() {
    return this.useRealAPI;
  }

  /**
   * Get current model being used
   */
  getModel() {
    return this.model;
  }
}

// Export singleton instance
const openAIService = new OpenAIService();
export default openAIService;
