import { useTranslation } from 'react-i18next';
import { useFilters } from '../context/FilterContext';
import { fuelTypes, transmissionTypes } from '../utils/mockData';

const FiltersPanel = () => {
  const { t } = useTranslation();
  const { filters, updateFilter, resetFilters } = useFilters();

  const handleChange = (key, value) => {
    updateFilter(key, value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('common.filter')}</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {t('common.reset')}
        </button>
      </div>

      <div className="space-y-6">
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
