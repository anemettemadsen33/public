import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TestDriveModal = ({ isOpen, onClose, vehicle }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    location: '',
    notes: ''
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
          date: '',
          time: '',
          location: '',
          notes: ''
        });
      }, 2000);
    }, 1500);
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 17) timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('forms.testDrive.title')}
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
                Test Drive Booked Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll send you a confirmation email shortly.
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

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('forms.testDrive.selectDate')} *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">{t('forms.testDrive.selectTime')} *</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">{t('forms.testDrive.preferredLocation')} *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select location...</option>
                  <option value="downtown">Downtown Showroom</option>
                  <option value="north">North Branch</option>
                  <option value="south">South Branch</option>
                  <option value="west">West Branch</option>
                  <option value="delivery">Home Delivery</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="label">{t('forms.testDrive.additionalNotes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Any special requirements or questions..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Booking...' : t('common.submit')}
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

export default TestDriveModal;
