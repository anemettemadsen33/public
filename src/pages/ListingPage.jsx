import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilters } from '../context/FilterContext';
import CarCard from '../components/CarCard';
import FiltersPanel from '../components/FiltersPanel';
import { mockVehicles } from '../utils/mockData';
import { filterVehicles, sortVehicles } from '../utils/helpers';

const ListingPage = ({ category, title }) => {
  const { t } = useTranslation();
  const { filters, sortBy, setSortBy } = useFilters();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  useEffect(() => {
    // Filter by category
    let categoryVehicles = category 
      ? mockVehicles.filter(v => v.category === category)
      : mockVehicles;
    
    setVehicles(categoryVehicles);
  }, [category]);

  useEffect(() => {
    // Apply filters and sorting
    let result = filterVehicles(vehicles, filters);
    result = sortVehicles(result, sortBy);
    setFilteredVehicles(result);
  }, [vehicles, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title || t(`nav.${category}`)}
        </h1>
        <p className="text-gray-600">
          {filteredVehicles.length} {t('listing.results')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <FiltersPanel />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('listing.sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option value="newest">{t('listing.newest')}</option>
                <option value="priceLowToHigh">{t('listing.priceLowToHigh')}</option>
                <option value="priceHighToLow">{t('listing.priceHighToLow')}</option>
                <option value="mileageLowToHigh">{t('listing.mileageLowToHigh')}</option>
                <option value="yearNewest">{t('listing.yearNewest')}</option>
              </select>
            </div>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <CarCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-lg text-gray-600">{t('listing.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
