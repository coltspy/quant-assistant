import { BarChart, LineChart, PieChart } from 'lucide-react'

export default function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Revenue Analytics</h3>
        <BarChart className="w-full h-64" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">User Growth</h3>
        <LineChart className="w-full h-64" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Market Share</h3>
        <PieChart className="w-full h-64" />
      </div>
    </div>
  )
}