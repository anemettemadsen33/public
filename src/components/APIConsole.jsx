import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const APIConsole = () => {
  const { t } = useTranslation()
  const [activeEndpoint, setActiveEndpoint] = useState('list-vehicles')
  const [apiKey, setApiKey] = useState('sk_test_...')
  const [showKey, setShowKey] = useState(false)

  const endpoints = [
    {
      id: 'list-vehicles',
      method: 'GET',
      path: '/api/v1/vehicles',
      description: t('api.listVehicles', 'List all vehicles'),
      params: [
        { name: 'page', type: 'integer', required: false, description: 'Page number' },
        { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
        { name: 'make', type: 'string', required: false, description: 'Filter by manufacturer' },
      ],
      exampleRequest: `curl -X GET "https://api.example.com/v1/vehicles?page=1&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      exampleResponse: {
        status: 'success',
        data: [
          {
            id: 1,
            make: 'BMW',
            model: 'X5',
            year: 2020,
            price: 45000,
            mileage: 25000,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 150,
        },
      },
    },
    {
      id: 'get-vehicle',
      method: 'GET',
      path: '/api/v1/vehicles/{id}',
      description: t('api.getVehicle', 'Get vehicle details'),
      params: [{ name: 'id', type: 'integer', required: true, description: 'Vehicle ID' }],
      exampleRequest: `curl -X GET "https://api.example.com/v1/vehicles/1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      exampleResponse: {
        status: 'success',
        data: {
          id: 1,
          make: 'BMW',
          model: 'X5',
          year: 2020,
          price: 45000,
          mileage: 25000,
          fuelType: 'Diesel',
          transmission: 'Automatic',
          images: ['https://example.com/image1.jpg'],
        },
      },
    },
    {
      id: 'create-vehicle',
      method: 'POST',
      path: '/api/v1/vehicles',
      description: t('api.createVehicle', 'Create a new vehicle listing'),
      params: [
        { name: 'make', type: 'string', required: true, description: 'Vehicle manufacturer' },
        { name: 'model', type: 'string', required: true, description: 'Vehicle model' },
        { name: 'year', type: 'integer', required: true, description: 'Production year' },
        { name: 'price', type: 'number', required: true, description: 'Price in default currency' },
      ],
      exampleRequest: `curl -X POST "https://api.example.com/v1/vehicles" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "make": "BMW",
    "model": "X5",
    "year": 2020,
    "price": 45000
  }'`,
      exampleResponse: {
        status: 'success',
        data: {
          id: 2,
          make: 'BMW',
          model: 'X5',
          year: 2020,
          price: 45000,
          createdAt: '2024-01-01T12:00:00Z',
        },
      },
    },
  ]

  const activeEndpointData = endpoints.find(e => e.id === activeEndpoint)

  const getMethodColor = method => {
    const colors = {
      GET: 'bg-green-500',
      POST: 'bg-blue-500',
      PUT: 'bg-yellow-500',
      DELETE: 'bg-red-500',
    }
    return colors[method] || 'bg-gray-500'
  }

  const generateNewKey = () => {
    const newKey = `sk_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-3xl">🔧</span>
                {t('api.title', 'API Console')}
              </h2>
              <p className="text-gray-400">
                {t('api.subtitle', 'Integrate with our platform programmatically')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                v1.0
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                REST API
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Sidebar - Endpoints List */}
          <div className="lg:col-span-1 bg-gray-800 border-r border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">
              {t('api.endpoints', 'Endpoints')}
            </h3>
            <div className="space-y-2">
              {endpoints.map(endpoint => (
                <motion.button
                  key={endpoint.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveEndpoint(endpoint.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeEndpoint === endpoint.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 ${getMethodColor(endpoint.method)} text-white rounded text-xs font-bold`}
                    >
                      {endpoint.method}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">{endpoint.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{endpoint.description}</div>
                </motion.button>
              ))}
            </div>

            {/* API Key Section */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                {t('api.apiKey', 'API Key')}
              </h4>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono pr-20"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  title={showKey ? 'Hide' : 'Show'}
                >
                  {showKey ? '👁️' : '👁️‍🗨️'}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(apiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  title="Copy"
                >
                  📋
                </button>
              </div>
              <button
                onClick={generateNewKey}
                className="mt-2 w-full px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-semibold transition-colors"
              >
                {t('api.generateKey', 'Generate New Key')}
              </button>
            </div>
          </div>

          {/* Main Content - Documentation */}
          <div className="lg:col-span-2 p-6">
            <AnimatePresence mode="wait">
              {activeEndpointData && (
                <motion.div
                  key={activeEndpointData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Endpoint Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 ${getMethodColor(activeEndpointData.method)} text-white rounded font-bold`}
                      >
                        {activeEndpointData.method}
                      </span>
                      <code className="text-lg text-green-400">{activeEndpointData.path}</code>
                    </div>
                    <p className="text-gray-400">{activeEndpointData.description}</p>
                  </div>

                  {/* Parameters */}
                  {activeEndpointData.params.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase mb-3">
                        {t('api.parameters', 'Parameters')}
                      </h3>
                      <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left text-gray-300">
                                {t('api.name', 'Name')}
                              </th>
                              <th className="px-4 py-2 text-left text-gray-300">
                                {t('api.type', 'Type')}
                              </th>
                              <th className="px-4 py-2 text-left text-gray-300">
                                {t('api.required', 'Required')}
                              </th>
                              <th className="px-4 py-2 text-left text-gray-300">
                                {t('api.description', 'Description')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {activeEndpointData.params.map(param => (
                              <tr key={param.name} className="hover:bg-gray-700/50">
                                <td className="px-4 py-2">
                                  <code className="text-blue-400">{param.name}</code>
                                </td>
                                <td className="px-4 py-2 text-gray-400">{param.type}</td>
                                <td className="px-4 py-2">
                                  {param.required ? (
                                    <span className="text-red-400">✓</span>
                                  ) : (
                                    <span className="text-gray-600">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-gray-400">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Example Request */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase">
                        {t('api.exampleRequest', 'Example Request')}
                      </h3>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(activeEndpointData.exampleRequest)
                        }
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                      >
                        📋 {t('api.copy', 'Copy')}
                      </button>
                    </div>
                    <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">
                        {activeEndpointData.exampleRequest}
                      </code>
                    </pre>
                  </div>

                  {/* Example Response */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase">
                        {t('api.exampleResponse', 'Example Response')}
                      </h3>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            JSON.stringify(activeEndpointData.exampleResponse, null, 2)
                          )
                        }
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                      >
                        📋 {t('api.copy', 'Copy')}
                      </button>
                    </div>
                    <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-blue-400">
                        {JSON.stringify(activeEndpointData.exampleResponse, null, 2)}
                      </code>
                    </pre>
                  </div>

                  {/* Rate Limiting Info */}
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 text-xl">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">
                          {t('api.rateLimiting', 'Rate Limiting')}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {t(
                            'api.rateLimitDesc',
                            'API requests are limited to 1000 requests per hour per API key.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APIConsole
