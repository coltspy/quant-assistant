'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BarChart2, TrendingUp, Settings, Menu, X } from 'lucide-react'
import Link from 'next/link'
import DashboardTab from './components/Dashboard'
import AnalyticsTab from './components/Analytics'
import StocksTab from './components/Stocks'
import SettingsTab from './components/Settings'

const menuItems = [
  { icon: Home, text: 'Dashboard' },
  { icon: BarChart2, text: 'Analytics' },
  { icon: TrendingUp, text: 'Stocks' },
  { icon: Settings, text: 'Settings' },
]

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeItem, setActiveItem] = useState('Dashboard')

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const renderActiveTab = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardTab />
      case 'Analytics':
        return <AnalyticsTab />
      case 'Stocks':
        return <StocksTab />
      case 'Settings':
        return <SettingsTab />
      default:
        return <DashboardTab />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-64 min-h-screen p-4 shadow-lg"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-indigo-600">QuanTech</h1>
              <button onClick={toggleSidebar} className="lg:hidden">
                <X size={24} />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.text}>
                    <Link
                      href="#"
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
                        activeItem === item.text
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveItem(item.text)}
                    >
                      <item.icon size={20} />
                      <span>{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleSidebar} className="lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">{activeItem}</h2>
            <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderActiveTab()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}