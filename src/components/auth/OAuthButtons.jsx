import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const OAuthButtons = ({ onSuccess, onError }) => {
  const { loginWithOAuth } = useAuth()
  const [loading, setLoading] = useState(null)

  const handleOAuthLogin = async provider => {
    setLoading(provider)
    try {
      const result = await loginWithOAuth(provider)

      if (result.requiresTwoFactor) {
        onSuccess?.({ requiresTwoFactor: true })
      } else if (result.success) {
        onSuccess?.(result)
      } else {
        onError?.(result.error)
      }
    } catch (error) {
      onError?.(error.message)
    } finally {
      setLoading(null)
    }
  }

  const providers = [
    {
      name: 'google',
      label: 'Continue with Google',
      icon: '🔍',
      color: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300',
    },
    {
      name: 'github',
      label: 'Continue with GitHub',
      icon: '🐙',
      color: 'bg-gray-900 hover:bg-gray-800 text-white',
    },
    {
      name: 'facebook',
      label: 'Continue with Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  ]

  return (
    <div className="space-y-3">
      {providers.map(provider => (
        <button
          key={provider.name}
          onClick={() => handleOAuthLogin(provider.name)}
          disabled={loading !== null}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${provider.color} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="text-xl">{provider.icon}</span>
          {loading === provider.name ? 'Connecting...' : provider.label}
        </button>
      ))}
    </div>
  )
}

export default OAuthButtons
