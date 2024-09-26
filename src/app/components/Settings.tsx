import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

export default function SettingsTab() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Enable Notifications</span>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
        <div className="pt-4">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}