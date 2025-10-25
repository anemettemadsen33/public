import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilters } from '../context/FilterContext';
import { useFilterStore } from '../store';
import { fuelTypes, transmissionTypes } from '../utils/mockData';
import VoiceSearch from './VoiceSearch';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const FiltersPanel = () => {
  const { t } = useTranslation();
  const { filters, updateFilter, resetFilters } = useFilters();
  const { setFilter, resetFilters: zustandReset } = useFilterStore();
  
  // Local state for immediate input feedback
  const [searchInput, setSearchInput] = useState(filters.search || '');
  
  // Debounced search value (300ms delay)
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update filter when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilter('search', debouncedSearch);
      setFilter('search', debouncedSearch);
    }
  }, [debouncedSearch, filters.search, setFilter, updateFilter]);

  const handleChange = (key, value) => {
    updateFilter(key, value);
    setFilter(key, value);
  };

  const handleReset = () => {
    setSearchInput('');
    resetFilters();
    zustandReset();
  };

  const handleVoiceSearch = (transcript) => {
    setSearchInput(transcript);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('common.filter')}</h3>
        <button
          onClick={handleReset}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          {t('common.reset')}
        </button>
      </div>

      <div className="space-y-6">
        {/* Real-Time Search with Debounce */}
        <div>
          <label className="label">🔍 {t('common.search')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by make, model, or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field flex-1"
            />
            <VoiceSearch onSearch={handleVoiceSearch} />
          </div>
          {searchInput && searchInput !== debouncedSearch && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Searching...
            </p>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="label">{t('common.price')}</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder={t('common.from')}
              value={filters.priceMin}
              onChange={(e) => handleChange('priceMin', e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder={t('common.to')}
              value={filters.priceMax}
              onChange={(e) => handleChange('priceMax', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="label">{t('common.year')}</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder={t('common.from')}
              value={filters.yearMin}
              onChange={(e) => handleChange('yearMin', e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder={t('common.to')}
              value={filters.yearMax}
              onChange={(e) => handleChange('yearMax', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label className="label">{t('common.mileage')} (max)</label>
          <input
            type="number"
            placeholder="150000"
            value={filters.mileageMax}
            onChange={(e) => handleChange('mileageMax', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="label">{t('common.fuelType')}</label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            {fuelTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="label">{t('common.transmission')}</label>
          <select
            value={filters.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            {transmissionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
