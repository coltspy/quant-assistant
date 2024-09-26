import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Send, Bot, User } from 'lucide-react'
import axios from 'axios'

export default function DashboardTab() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, sender: 'user' as const }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input })
      const botMessage = { text: response.data.response, sender: 'bot' as const }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = { text: 'Sorry, there was an error processing your request.', sender: 'bot' as const }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-gray-700 text-2xl font-medium mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Total Revenue', 'Active Users', 'New Clients', 'Satisfaction'].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                <BarChart2 className="h-8 w-8 text-white" />
              </div>
              <div className="mx-5">
                <h4 className="text-lg font-semibold text-gray-700">{item}</h4>
                <div className="text-gray-500">Lorem ipsum</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-700 text-2xl font-medium mb-4">Quant Trading Assistant</h3>
        <div className="h-[50vh] overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
                  <span className="font-semibold">{message.sender === 'user' ? 'You' : 'Assistant'}</span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stocks, financial data, or trading strategies..."
              className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              <Send size={18} />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}