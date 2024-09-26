import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StocksTab() {
  const stocks = [
    { name: 'AAPL', price: 150.25, change: 2.5 },
    { name: 'GOOGL', price: 2750.80, change: -1.2 },
    { name: 'MSFT', price: 305.15, change: 0.8 },
    { name: 'AMZN', price: 3380.50, change: -0.5 },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stocks.map((stock) => (
            <tr key={stock.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${stock.price.toFixed(2)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="flex items-center">
                  {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {stock.change.toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}