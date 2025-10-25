import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LeasingModal = ({ isOpen, onClose, vehicle }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    monthlyBudget: '',
    downPayment: '',
    leasingPeriod: '36',
    estimatedMileage: '15000',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          monthlyBudget: '',
          downPayment: '',
          leasingPeriod: '36',
          estimatedMileage: '15000',
          comments: ''
        });
      }, 2000);
    }, 1500);
  };

  // Calculate estimated monthly payment
  const calculateMonthlyPayment = () => {
    if (!vehicle?.price || !formData.leasingPeriod) return 0;
    const downPayment = parseFloat(formData.downPayment) || 0;
    const remainingAmount = vehicle.price - downPayment;
    const monthly = remainingAmount / parseInt(formData.leasingPeriod);
    return Math.round(monthly);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('forms.leasing.title')}
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

          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Leasing Request Submitted!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our leasing specialist will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Info */}
              {vehicle && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h3>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ${vehicle.price?.toLocaleString()}
                  </p>
                  {formData.leasingPeriod && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Estimated monthly: <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${calculateMonthlyPayment().toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('forms.buyNow.firstName')} *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">{t('forms.buyNow.lastName')} *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('forms.buyNow.email')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">{t('forms.buyNow.phone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Leasing Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('forms.leasing.monthlyBudget')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                    <input
                      type="number"
                      name="monthlyBudget"
                      value={formData.monthlyBudget}
                      onChange={handleChange}
                      placeholder="500"
                      className="input-field pl-8"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">{t('forms.leasing.downPayment')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleChange}
                      placeholder="5000"
                      className="input-field pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('forms.leasing.leasingPeriod')} *</label>
                  <select
                    name="leasingPeriod"
                    value={formData.leasingPeriod}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
                <div>
                  <label className="label">{t('forms.leasing.estimatedMileage')} *</label>
                  <select
                    name="estimatedMileage"
                    value={formData.estimatedMileage}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="10000">10,000 km/year</option>
                    <option value="15000">15,000 km/year</option>
                    <option value="20000">20,000 km/year</option>
                    <option value="25000">25,000 km/year</option>
                    <option value="30000">30,000 km/year</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="label">{t('forms.buyNow.comments')}</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Any additional information or questions..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : t('common.submit')}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LeasingModal;
