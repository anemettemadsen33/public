// OpenAI GPT Integration Service
// This service handles real AI integration with OpenAI's GPT API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export const chatWithAI = async (message, conversationHistory = []) => {
  try {
    // In development, use simulated responses
    if (!OPENAI_API_KEY) {
      return simulateAIResponse(message)
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful auto marketplace assistant. Help users find vehicles, compare options, and provide buying advice.',
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    return {
      success: true,
      message: data.choices[0].message.content,
      usage: data.usage,
    }
  } catch (error) {
    console.error('AI chat error:', error)
    return simulateAIResponse(message)
  }
}

// Simulated AI response for development/demo
const simulateAIResponse = question => {
  const lowerQ = question.toLowerCase()

  if (lowerQ.includes('truck') && lowerQ.includes('heavy')) {
    return {
      success: true,
      message:
        'For heavy transport, I recommend looking at trucks with:\n• Diesel engines (better torque)\n• Payload capacity over 3,000 lbs\n• Strong suspension systems\n\nPopular choices: Ford F-250, RAM 2500, Chevy Silverado 2500HD',
      simulated: true,
    }
  }

  if (lowerQ.includes('electric') || lowerQ.includes('gasoline')) {
    return {
      success: true,
      message:
        'Electric vs Gasoline comparison:\n\n**Electric:**\n• Lower running costs\n• Less maintenance\n• Better for environment\n• Limited range\n\n**Gasoline:**\n• Longer range\n• More charging stations\n• Lower upfront cost\n• Higher fuel costs',
      simulated: true,
    }
  }

  if (lowerQ.includes('family') || lowerQ.includes('suv')) {
    return {
      success: true,
      message:
        'Great family SUVs under $30k:\n• Honda CR-V - Reliable & spacious\n• Toyota RAV4 - Great safety ratings\n• Mazda CX-5 - Fun to drive\n• Hyundai Tucson - Good warranty\n\nAll offer 3rd row seating options!',
      simulated: true,
    }
  }

  return {
    success: true,
    message:
      "That's a great question! I recommend:\n1. Check vehicle history report\n2. Inspect for rust and damage\n3. Test drive thoroughly\n4. Get a mechanic inspection\n5. Review maintenance records\n\nWould you like more specific advice?",
    simulated: true,
  }
}

export default {
  chatWithAI,
}
