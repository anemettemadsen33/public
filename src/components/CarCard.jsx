import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompare } from '../context/CompareContext';
import { formatPrice, formatMileage } from '../utils/helpers';

const CarCard = ({ vehicle }) => {
  const { t } = useTranslation();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(vehicle.id);

  const handleCompareToggle = (e) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(vehicle.id);
    } else {
      addToCompare(vehicle);
    }
  };

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/vehicle/${vehicle.id}`}>
          <img
            src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        {vehicle.featured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
        <button
          onClick={handleCompareToggle}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-colors ${
            inCompare ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title={t('common.compare')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/vehicle/${vehicle.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3">{vehicle.year}</p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{vehicle.power}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(vehicle.price)}
          </span>
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            {t('common.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
