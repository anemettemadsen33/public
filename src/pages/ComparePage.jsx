import { useTranslation } from 'react-i18next';
import { useCompare } from '../context/CompareContext';
import { formatPrice, formatMileage } from '../utils/helpers';
import { Link } from 'react-router-dom';

const ComparePage = () => {
  const { t } = useTranslation();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('compare.title')}</h2>
        <p className="text-gray-600 mb-8">{t('compare.selectVehicles')}</p>
        <Link to="/" className="btn-primary">
          {t('nav.home')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('compare.title')}</h1>
        <button onClick={clearCompare} className="btn-secondary">
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-sm">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Specification</th>
              {compareList.map((vehicle) => (
                <th key={vehicle.id} className="p-4">
                  <div className="text-center">
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-semibold">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600">{vehicle.year}</p>
                    <button
                      onClick={() => removeFromCompare(vehicle.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      {t('compare.removeVehicle')}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-semibold">{t('common.price')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center text-primary-600 font-bold">
                  {formatPrice(vehicle.price)}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-4 font-semibold">{t('common.year')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  {vehicle.year}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">{t('common.mileage')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  {formatMileage(vehicle.mileage)}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-4 font-semibold">{t('common.fuelType')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  {vehicle.fuelType}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">{t('common.transmission')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  {vehicle.transmission}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-4 font-semibold">{t('compare.engine')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  {vehicle.engine}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">{t('compare.power')}</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  {vehicle.power}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold">Action</td>
              {compareList.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-center">
                  <Link to={`/vehicle/${vehicle.id}`} className="btn-primary inline-block">
                    {t('common.viewDetails')}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
