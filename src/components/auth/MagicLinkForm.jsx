import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const MagicLinkForm = ({ onSuccess, onError }) => {
  const { sendMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      onError?.('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const result = await sendMagicLink(email)

      if (result.success) {
        setSent(true)
        onSuccess?.(result)
      } else {
        onError?.(result.error)
      }
    } catch (error) {
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="text-5xl mb-4">📧</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Check your email!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a magic link to <strong>{email}</strong>
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        We'll email you a magic link for a password-free sign in
      </p>
    </form>
  )
}

export default MagicLinkForm
