import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import vinCheckService from '../services/vinCheck';
import ocrService from '../services/ocrService';

const VINCheckModal = ({ isOpen, onClose, vehicle }) => {
  const { t } = useTranslation();
  const [vin, setVin] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [_error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError(null);

    try {
      // Use the real VIN check service
      const result = await vinCheckService.getVehicleHistory(vin);
      setCheckResult(result);
    } catch (err) {
      setError(err.message || 'Failed to check VIN. Please try again.');
      console.error('VIN check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setVin('');
    setCheckResult(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);
    setScanProgress(0);

    try {
      // Extract VIN from document using OCR
      const extracted = await ocrService.extractVINFromDocument(file, (progress) => {
        setScanProgress(progress);
      });

      // Set VIN in form
      setVin(extracted.vin);
      setScanProgress(100);

      // Show success message briefly
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to scan document. Please try manual entry.');
      console.error('OCR Error:', err);
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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
                
                {/* OCR Scanner Button */}
                <div className="mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileUpload}
                    disabled={isScanning}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {isScanning ? (
                      <span>Scanning document... {scanProgress}%</span>
                    ) : (
                      <span>📸 Scan Registration Document (OCR)</span>
                    )}
                  </button>
                  {isScanning && (
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  or enter manually
                </div>
                
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
                  {t('details.vinValidation')}
                </p>
              </div>

              {/* What you'll get */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t('details.whatYouGet')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('details.accidentHistory')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('details.numberOfOwners')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('details.serviceRecords')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('details.openRecalls')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('details.mileageVerification')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('details.titleStatus')}
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
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.vehicle?.make || checkResult.specifications?.make}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Model:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.vehicle?.model || checkResult.specifications?.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Year:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.vehicle?.year || checkResult.specifications?.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Engine:</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{checkResult.vehicle?.engine || checkResult.specifications?.engine}</p>
                  </div>
                </div>
              </div>

              {/* History Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {checkResult.accidents?.totalAccidents || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accidents</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {checkResult.ownership?.totalOwners || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Owners</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {checkResult.serviceRecords?.totalRecords || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Service Records</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {checkResult.recalls?.openRecalls || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Open Recalls</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl">
                    {checkResult.odometer?.verified ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mileage Verified</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {checkResult.titleInfo?.status || 'Unknown'}
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
