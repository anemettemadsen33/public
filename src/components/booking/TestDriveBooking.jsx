import { useState } from 'react'
import { sendTestDriveConfirmation } from '../../services/email'

const TestDriveBooking = ({ vehicle, _dealerId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ]

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      // Send confirmation email
      await sendTestDriveConfirmation(formData.email, vehicle, formData)

      // Save booking to localStorage (in production, save to backend)
      const bookings = JSON.parse(localStorage.getItem('testDriveBookings') || '[]')
      const newBooking = {
        id: Date.now(),
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.make} ${vehicle.model}`,
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      bookings.push(newBooking)
      localStorage.setItem('testDriveBookings', JSON.stringify(bookings))

      setSubmitted(true)
      onSuccess?.(newBooking)
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Test Drive Booked!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your test drive for{' '}
          <strong>
            {vehicle.make} {vehicle.model}
          </strong>{' '}
          is confirmed for <strong>{formData.date}</strong> at <strong>{formData.time}</strong>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We've sent a confirmation email to {formData.email}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Book a Test Drive
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preferred Time *
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setFormData({ ...formData, time })}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  formData.time === time
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-primary-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Any special requests or questions?"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.time}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking...' : 'Book Test Drive'}
        </button>
      </form>
    </div>
  )
}

export default TestDriveBooking
