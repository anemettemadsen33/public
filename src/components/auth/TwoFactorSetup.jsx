import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const TwoFactorSetup = ({ onSuccess, onError }) => {
  const { twoFactorEnabled, enableTwoFactor, disableTwoFactor } = useAuth()
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [secret, setSecret] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')

  const handleEnable = async () => {
    setLoading(true)
    try {
      const result = await enableTwoFactor()

      if (result.success) {
        setQrCode(result.qrCode)
        setSecret(result.secret)
        onSuccess?.({ enabled: true })
      } else {
        onError?.(result.error)
      }
    } catch (error) {
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    if (!verificationCode) {
      onError?.('Please enter verification code')
      return
    }

    setLoading(true)
    try {
      const result = await disableTwoFactor(verificationCode)

      if (result.success) {
        setQrCode(null)
        setSecret(null)
        setVerificationCode('')
        onSuccess?.({ enabled: false })
      } else {
        onError?.(result.error)
      }
    } catch (error) {
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (twoFactorEnabled && !qrCode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔐</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Two-Factor Authentication Enabled
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your account is protected with 2FA
              </p>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="disable-code"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter code to disable 2FA
          </label>
          <input
            id="disable-code"
            type="text"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <button
          onClick={handleDisable}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Disabling...' : 'Disable 2FA'}
        </button>
      </div>
    )
  }

  if (qrCode) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Scan QR Code
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Use your authenticator app to scan this QR code
          </p>

          <div className="inline-block p-4 bg-white rounded-lg">
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
          </div>

          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Or enter this code manually:
            </p>
            <code className="text-sm font-mono text-gray-900 dark:text-gray-100">{secret}</code>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ✅ Two-factor authentication has been enabled. You'll need to enter a code from your
            authenticator app when signing in.
          </p>
        </div>

        <button
          onClick={() => setQrCode(null)}
          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          🔐 Secure Your Account
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Two-factor authentication adds an extra layer of security to your account. You'll need
          your password and a code from your phone to sign in.
        </p>
      </div>

      <button
        onClick={handleEnable}
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Demo: Use code <strong>123456</strong> for testing
      </p>
    </div>
  )
}

export default TwoFactorSetup
