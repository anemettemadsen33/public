import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockVehicles } from '../utils/mockData';
import { formatPrice, formatMileage } from '../utils/helpers';
import BuyNowModal from '../components/BuyNowModal';
import LeasingModal from '../components/LeasingModal';
import TestDriveModal from '../components/TestDriveModal';
import VINCheckModal from '../components/VINCheckModal';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showLeasingModal, setShowLeasingModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showVINCheckModal, setShowVINCheckModal] = useState(false);

  useEffect(() => {
    const foundVehicle = mockVehicles.find(v => v.id === parseInt(id));
    setVehicle(foundVehicle);
  }, [id]);

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Vehicle not found</p>
        <Link to="/" className="btn-primary mt-4 inline-block">
          {t('nav.home')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="card overflow-hidden mb-4">
            <img
              src={vehicle.images[currentImage] || vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-96 object-cover"
            />
          </div>
          {vehicle.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    currentImage === idx ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{vehicle.year}</p>
          <p className="text-4xl font-bold text-primary-600 mb-6">
            {formatPrice(vehicle.price)}
          </p>

          {/* Specifications */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('details.specifications')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">{t('common.year')}:</span>
                <p className="font-semibold">{vehicle.year}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('common.mileage')}:</span>
                <p className="font-semibold">{formatMileage(vehicle.mileage)}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('common.fuelType')}:</span>
                <p className="font-semibold">{vehicle.fuelType}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('common.transmission')}:</span>
                <p className="font-semibold">{vehicle.transmission}</p>
              </div>
              <div>
                <span className="text-gray-600">Engine:</span>
                <p className="font-semibold">{vehicle.engine}</p>
              </div>
              <div>
                <span className="text-gray-600">Power:</span>
                <p className="font-semibold">{vehicle.power}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('details.description')}</h2>
            <p className="text-gray-700">{vehicle.description}</p>
          </div>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('details.features')}</h2>
              <ul className="grid grid-cols-2 gap-2">
                {vehicle.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button 
              onClick={() => setShowBuyNowModal(true)}
              className="btn-primary w-full"
            >
              {t('common.buyNow')}
            </button>
            <button 
              onClick={() => setShowLeasingModal(true)}
              className="btn-secondary w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {t('common.leasing')}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowTestDriveModal(true)}
              className="btn-outline w-full"
            >
              {t('common.testDrive')}
            </button>
            <button 
              onClick={() => setShowVINCheckModal(true)}
              className="btn-outline w-full"
            >
              {t('details.vinCheck')}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BuyNowModal 
        isOpen={showBuyNowModal} 
        onClose={() => setShowBuyNowModal(false)} 
        vehicle={vehicle}
      />
      <LeasingModal 
        isOpen={showLeasingModal} 
        onClose={() => setShowLeasingModal(false)} 
        vehicle={vehicle}
      />
      <TestDriveModal 
        isOpen={showTestDriveModal} 
        onClose={() => setShowTestDriveModal(false)} 
        vehicle={vehicle}
      />
      <VINCheckModal 
        isOpen={showVINCheckModal} 
        onClose={() => setShowVINCheckModal(false)} 
        vehicle={vehicle}
      />
    </div>
  );
};

export default VehicleDetailsPage;
