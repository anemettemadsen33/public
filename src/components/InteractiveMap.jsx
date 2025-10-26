import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Note: In production, integrate with Google Maps or Mapbox
// For demo, we'll create a simple map placeholder with markers

const InteractiveMap = ({ vehicles = [], center = { lat: 51.5074, lng: -0.1278 }, zoom: _zoom = 10 }) => {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapView, setMapView] = useState('map'); // 'map' or 'list'

  // Mock vehicle locations (in production, these would come from vehicle data)
  const vehiclesWithLocations = vehicles.map((v, idx) => ({
    ...v,
    location: {
      lat: center.lat + ((idx * 0.017) % 0.1) - 0.05,
      lng: center.lng + ((idx * 0.023) % 0.1) - 0.05,
      address: `${v.dealer || 'Dealer'}, ${v.city || 'City'}`,
    },
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('map.title', 'Vehicle Locations')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setMapView('map')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mapView === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('map.mapView', 'Map View')}
            </button>
            <button
              onClick={() => setMapView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mapView === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('map.listView', 'List View')}
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {t('map.description', 'Showing')} {vehiclesWithLocations.length} {t('map.vehicles', 'vehicles nearby')}
        </p>
      </div>

      {/* Map/List Content */}
      <div className="relative">
        {mapView === 'map' ? (
          <div className="relative h-[500px] bg-gray-200 dark:bg-gray-700">
            {/* Map Placeholder - In production, integrate Google Maps/Mapbox */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t('map.placeholder', 'Interactive Map')}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  {t('map.integration', 'Integrate with Google Maps or Mapbox in production')}
                </p>
              </div>
            </div>

            {/* Vehicle Markers */}
            {vehiclesWithLocations.map((vehicle, idx) => {
              const x = 20 + (idx % 5) * 18;
              const y = 20 + Math.floor(idx / 5) * 25;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="relative">
                    <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-xs font-bold">
                        ${Math.round(vehicle.price / 1000)}k
                      </span>
                    </div>
                    {selectedVehicle?.id === vehicle.id && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-700 z-10">
                        <div className="flex gap-3">
                          <img
                            src={vehicle.image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-primary-600 font-bold text-sm">
                              ${vehicle.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              📍 {vehicle.location.address}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => (window.location.href = `/vehicle/${vehicle.id}`)}
                          className="w-full mt-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded transition-colors"
                        >
                          {t('map.viewDetails', 'View Details')}
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="max-h-[500px] overflow-y-auto">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {vehiclesWithLocations.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/vehicle/${vehicle.id}`)}
                >
                  <div className="flex gap-4">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-primary-600 font-bold mt-1">
                        ${vehicle.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {vehicle.location.address}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>📅 {vehicle.year}</span>
                        <span>🛣️ {vehicle.mileage?.toLocaleString()} mi</span>
                        <span>⚙️ {vehicle.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {t('map.available', 'Available')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {t('map.featured', 'Featured')}
              </span>
            </div>
          </div>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            {t('map.searchThisArea', 'Search this area')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
