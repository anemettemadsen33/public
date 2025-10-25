// Real-time Chat Service
// This service handles WebSocket connections for real-time chat with dealers

class ChatService {
  constructor() {
    this.ws = null
    this.connected = false
    this.messageHandlers = []
    this.connectionHandlers = []
  }

  connect(_userId) {
    try {
      // In production, connect to actual WebSocket server
      // For demo, use simulated connection
      this.connected = true
      this.notifyConnectionHandlers(true)

      // Simulate receiving messages
      this.simulateIncomingMessages()

      return { success: true }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      return { success: false, error: error.message }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.connected = false
    this.notifyConnectionHandlers(false)
  }

  sendMessage(chatId, message) {
    try {
      if (!this.connected) {
        throw new Error('Not connected to chat server')
      }

      // In production, send via WebSocket
      // For demo, simulate successful send
      const messageData = {
        id: Date.now().toString(),
        chatId,
        text: message.text,
        senderId: message.senderId,
        timestamp: new Date().toISOString(),
      }

      // Simulate dealer response after a delay
      setTimeout(() => {
        this.simulateDealerResponse(chatId)
      }, 2000)

      return { success: true, message: messageData }
    } catch (error) {
      console.error('Send message error:', error)
      return { success: false, error: error.message }
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler)
  }

  onConnectionChange(handler) {
    this.connectionHandlers.push(handler)
  }

  notifyMessageHandlers(message) {
    this.messageHandlers.forEach(handler => handler(message))
  }

  notifyConnectionHandlers(connected) {
    this.connectionHandlers.forEach(handler => handler(connected))
  }

  simulateIncomingMessages() {
    // Simulate dealer messages for demo
    setTimeout(() => {
      const welcomeMessage = {
        id: Date.now().toString(),
        chatId: 'demo',
        text: 'Hello! How can I help you today?',
        senderId: 'dealer',
        senderName: 'John (Dealer)',
        timestamp: new Date().toISOString(),
      }
      this.notifyMessageHandlers(welcomeMessage)
    }, 1000)
  }

  simulateDealerResponse(_chatId) {
    const responses = [
      'Thanks for your message! Let me check that for you.',
      "That's a great question. This vehicle has excellent features.",
      "I'd be happy to arrange a test drive. When works best for you?",
      'The vehicle is in excellent condition and well-maintained.',
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const message = {
      id: Date.now().toString(),
      chatId,
      text: randomResponse,
      senderId: 'dealer',
      senderName: 'John (Dealer)',
      timestamp: new Date().toISOString(),
    }

    this.notifyMessageHandlers(message)
  }

  getChatHistory(_chatId) {
    // In production, fetch from server
    // For demo, return empty history
    return {
      success: true,
      messages: [],
      simulated: true,
    }
  }
}

export const chatService = new ChatService()

export default chatService
