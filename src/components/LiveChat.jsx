import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const LiveChat = ({ dealerId: _dealerId, dealerName = 'Dealer', isOnline = true }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      sender: 'dealer',
      text: `Hello! I'm ${dealerName}. How can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = e => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const timestamp = new Date()
    const messageId = `msg-${timestamp.getTime()}`

    // Add user message
    const userMessage = {
      id: messageId,
      sender: 'user',
      text: inputMessage,
      timestamp: timestamp,
    }
    setMessages([...messages, userMessage])
    setInputMessage('')

    // Simulate dealer typing and response
    setIsTyping(true)
    setTimeout(() => {
      const dealerMessage = {
        id: `${messageId}-dealer`,
        sender: 'dealer',
        text: getDealerResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, dealerMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getDealerResponse = message => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'The price is negotiable. Would you like to schedule a test drive to discuss further?'
    } else if (lowerMessage.includes('available') || lowerMessage.includes('when')) {
      return 'The vehicle is currently available. We can arrange a viewing at your convenience!'
    } else if (lowerMessage.includes('test drive')) {
      return 'Great! I can schedule a test drive for you. What day works best?'
    } else if (lowerMessage.includes('condition') || lowerMessage.includes('mileage')) {
      return 'The vehicle is in excellent condition with full service history. Would you like detailed inspection reports?'
    } else {
      return 'Thank you for your message. Let me get back to you with more details shortly!'
    }
  }

  const quickReplies = [
    t('chat.quickReply.price', 'What is the price?'),
    t('chat.quickReply.testDrive', 'Schedule a test drive'),
    t('chat.quickReply.condition', 'Vehicle condition?'),
    t('chat.quickReply.availability', 'Is it available?'),
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
            }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className={`bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 group relative ${
              isOnline ? 'animate-pulse-slow' : ''
            }`}
          >
            {isOnline && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
            )}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="hidden group-hover:inline-block font-medium">
              {t('chat.chatWithDealer', 'Chat with Dealer')}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-96 h-[500px] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {dealerName}
                    {isOnline && <span className="text-xs">🟢</span>}
                  </div>
                  <div className="text-xs text-white/80">
                    {isOnline
                      ? t('chat.online', 'Online') +
                        ' • ' +
                        t('chat.typicallyReplies', 'Typically replies instantly')
                      : t('chat.offline', 'Offline')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-white/70 text-right'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(reply)
                    }}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full whitespace-nowrap transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder={t('chat.typeMessage', 'Type a message...')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LiveChat
