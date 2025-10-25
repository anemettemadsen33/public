import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const TwoFactorVerify = ({ onSuccess, onError, onCancel }) => {
  const { verifyTwoFactor } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (code.length !== 6) {
      onError?.('Please enter a 6-digit code')
      return
    }

    setLoading(true)
    try {
      const result = await verifyTwoFactor(code)

      if (result.success) {
        onSuccess?.(result)
      } else {
        onError?.(result.error)
        setCode('')
      }
    } catch (error) {
      onError?.(error.message)
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            autoFocus
            className="w-full px-6 py-4 text-center text-2xl font-mono tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
          >
            Cancel
          </button>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Demo: Use code <strong>123456</strong> for testing
        </p>
      </form>
    </div>
  )
}

export default TwoFactorVerify
