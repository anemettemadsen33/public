import { useState, useEffect, useRef } from 'react'
import { chatService } from '../../services/chat'

const DealerChat = ({ _dealerId, dealerName, _vehicleId }) => {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Connect to chat service
    chatService.connect('user123')

    // Listen for connection changes
    chatService.onConnectionChange(isConnected => {
      setConnected(isConnected)
    })

    // Listen for incoming messages
    chatService.onMessage(message => {
      setMessages(prev => [...prev, message])
      setTyping(false)
    })

    return () => {
      chatService.disconnect()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      chatId: dealerId,
      text: input,
      senderId: 'user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setTyping(true)

    chatService.sendMessage(dealerId, {
      text: input,
      senderId: 'user',
    })
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{dealerName}</h3>
          <div className="flex items-center gap-2 text-sm text-primary-100">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            {connected ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Start a conversation with {dealerName}</p>
            <p className="text-sm mt-2">
              Ask about vehicle availability, pricing, or schedule a test drive
            </p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.senderId === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {msg.senderId !== 'user' && (
                <div className="text-xs font-medium mb-1 opacity-75">{msg.senderName}</div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-xs mt-1 opacity-75`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600">
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

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={!connected}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default DealerChat
