import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const VINCheckModal = ({ isOpen, onClose, vehicle }) => {
  const { t } = useTranslation();
  const [vin, setVin] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);

    // Simulate API call
    setTimeout(() => {
      setIsChecking(false);
      setCheckResult({
        vin: vin,
        status: 'clean',
        accidents: 0,
        owners: 2,
        serviceRecords: 12,
        recalls: 0,
        mileageVerified: true,
        titleStatus: 'Clean',
        lastReported: '2023-08-15',
        details: {
          manufacturer: vehicle?.make || 'Unknown',
          model: vehicle?.model || 'Unknown',
          year: vehicle?.year || 'Unknown',
          engine: vehicle?.engine || 'Unknown',
          transmission: vehicle?.transmission || 'Unknown'
        }
      });
    }, 2000);
  };

  const handleReset = () => {
    setVin('');
    setCheckResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('details.vinCheck')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!checkResult ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Info */}
              {vehicle && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h3>
                </div>
              )}

              {/* Description */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {t('details.vinCheckDescription')}
                  </p>
                </div>
              </div>

              {/* VIN Input */}
              <div>
                <label className="label">{t('details.enterVin')} *</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="1HGBH41JXMN109186"
                  required
                  maxLength="17"
                  minLength="17"
                  pattern="[A-HJ-NPR-Z0-9]{17}"
                  className="input-field font-mono text-lg"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  VIN must be 17 characters (no I, O, or Q)
                </p>
              </div>

              {/* What you'll get */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  What you'll get:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accident history
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Number of previous owners
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Service and maintenance records
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Open recalls
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mileage verification
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Title status
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isChecking || vin.length !== 17}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking...
                    </span>
                  ) : (
                    t('details.checkHistory')
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Result Header */}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  checkResult.status === 'clean' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-yellow-100 dark:bg-yellow-900'
                }`}>
                  <svg className={`w-8 h-8 ${
                    checkResult.status === 'clean' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {checkResult.status === 'clean' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {checkResult.status === 'clean' ? 'Clean Report' : 'Check Details'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  VIN: {checkResult.vin}
                </p>
              </div>

              {/* Vehicle Details */}
              <div className="card p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Vehicle Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.details.manufacturer}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Model:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.details.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Year:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.details.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Engine:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.details.engine}</p>
                  </div>
                </div>
              </div>

              {/* History Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {checkResult.accidents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accidents</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {checkResult.owners}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Owners</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {checkResult.serviceRecords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Service Records</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {checkResult.recalls}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Open Recalls</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl">
                    {checkResult.mileageVerified ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mileage Verified</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {checkResult.titleStatus}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Title Status</div>
                </div>
              </div>

              {/* Last Reported */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Last reported: {new Date(checkResult.lastReported).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleReset}
                  className="btn-outline flex-1"
                >
                  Check Another VIN
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary flex-1"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VINCheckModal;
