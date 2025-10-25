import { useState } from 'react'
import { createPaymentIntent, confirmPayment } from '../../services/payment'

const PaymentCheckout = ({ amount, itemName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create payment intent
      const intent = await createPaymentIntent(amount * 100, 'usd', {
        itemName,
      })

      if (!intent.success) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment
      const payment = await confirmPayment(intent.clientSecret, {
        type: paymentMethod,
        amount,
        card: cardDetails,
      })

      if (payment.success) {
        onSuccess?.(payment)
      } else {
        setError(payment.error || 'Payment failed')
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = value => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19)
  }

  const formatExpiry = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Secure Checkout</h2>
          <p className="text-green-100">Complete your purchase</p>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Item</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{itemName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t dark:border-gray-600">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['card', 'paypal', 'apple'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                    paymentMethod === method
                      ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={e =>
                    setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })
                  }
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={e =>
                      setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })
                    }
                    placeholder="MM/YY"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvc}
                    onChange={e =>
                      setCardDetails({
                        ...cardDetails,
                        cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                      })
                    }
                    placeholder="123"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay $${amount.toLocaleString()}`}
                </button>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                🔒 Demo Mode: Payments are simulated for testing. Use test card 4242 4242 4242 4242
              </p>
            </form>
          )}

          {paymentMethod !== 'card' && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} integration coming
                soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentCheckout
