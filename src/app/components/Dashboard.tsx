import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Send, Bot, User } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface StockData {
  date: string;
  close: number;
}

interface NewsItem {
  title: string;
  url: string;
  sentiment: number;
}

export default function DashboardTab() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [stockData, setStockData] = useState<StockData[] | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      const botMessage: Message = { text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

      // Process the response for stock data or news
      if (response.data.stockData) {
        setStockData(response.data.stockData);
      }
      if (response.data.newsData) {
        setNewsData(response.data.newsData);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { text: 'Sorry, there was an error processing your request.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderStockChart = () => {
    if (!stockData) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Stock Performance</h3>
        <LineChart width={600} height={300} data={stockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" />
        </LineChart>
      </div>
    );
  };

  const renderNewsFeed = () => {
    if (newsData.length === 0) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Latest News</h3>
        <ul className="space-y-2">
          {newsData.map((article, index) => (
            <li key={index} className="border-b pb-2">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                <h4 className="font-medium">{article.title}</h4>
                <p className="text-sm text-gray-600">Sentiment: {article.sentiment.toFixed(2)}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

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
        {renderStockChart()}
        {renderNewsFeed()}
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
  );
}