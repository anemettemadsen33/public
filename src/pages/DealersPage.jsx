import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mockDealers } from '../utils/mockData';

const DealersPage = () => {
  const { t } = useTranslation();
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    setDealers(mockDealers);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dealers.allDealers')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealers.map((dealer) => (
          <div key={dealer.id} className="card p-6">
            <div className="flex items-center mb-4">
              <img
                src={dealer.logo}
                alt={dealer.name}
                className="w-20 h-12 object-contain mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{dealer.name}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-sm text-gray-600">
                    {dealer.rating} ({dealer.reviewsCount} {t('dealers.reviews')})
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{dealer.description}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {dealer.location}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {dealer.phone}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {dealer.openingHours}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                {dealer.vehiclesCount} {t('dealers.vehiclesInStock')}
              </div>
            </div>

            <button className="btn-primary w-full">
              {t('dealers.contactDealer')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealersPage;
