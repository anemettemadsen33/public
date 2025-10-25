import { useState } from 'react'
import { decodeVIN, getVehicleHistory } from '../../services/vin'

const VINChecker = () => {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(null)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    if (vin.length !== 17) {
      setError('VIN must be exactly 17 characters')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)
    setHistory(null)

    try {
      const [vinData, historyData] = await Promise.all([decodeVIN(vin), getVehicleHistory(vin)])

      if (vinData.success) {
        setResult(vinData)
      } else {
        setError(vinData.error)
      }

      if (historyData.success) {
        setHistory(historyData)
      }
    } catch {
      setError('Failed to check VIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h1 className="text-3xl font-bold">🔍 VIN Decoder</h1>
          <p className="text-blue-100">Check vehicle information and history</p>
        </div>

        <div className="p-6">
          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter VIN (17 characters)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vin}
                onChange={e => setVin(e.target.value.toUpperCase())}
                maxLength={17}
                placeholder="1HGBH41JXMN109186"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleCheck}
                disabled={loading || vin.length !== 17}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Check VIN'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-600 dark:text-red-400 text-sm">{error}</p>}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter the 17-character Vehicle Identification Number
            </p>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {result.simulated && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    ⚠️ Demo Mode: Showing simulated data. In production, this will use real VIN
                    decoder APIs.
                  </p>
                </div>
              )}

              {/* Vehicle Details */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Make</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.make}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Model</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.model}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Year</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.year}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Trim</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.trim}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Body Type</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.bodyClass}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Engine</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.engineSize}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fuel Type</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.fuelType}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Transmission</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.data.transmission}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle History */}
              {history && history.data && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Vehicle History
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {history.data.ownerCount}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Previous Owners
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {history.data.accidentCount}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Accidents Reported
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {history.data.serviceRecords}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Service Records
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {history.data.titleStatus}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Title Status</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      History Timeline
                    </h3>
                    <div className="space-y-3">
                      {history.data.events.map((event, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-24 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {event.type}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {event.description}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              Mileage: {event.mileage.toLocaleString()} miles
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VINChecker
