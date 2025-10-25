import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [isDealer, setIsDealer] = useState(() => {
    const saved = localStorage.getItem('isDealer')
    return saved === 'true'
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    const saved = localStorage.getItem('twoFactorEnabled')
    return saved === 'true'
  })

  const [pendingTwoFactor, setPendingTwoFactor] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('isDealer', isDealer.toString())
  }, [isDealer])

  useEffect(() => {
    localStorage.setItem('twoFactorEnabled', twoFactorEnabled.toString())
  }, [twoFactorEnabled])

  const login = userData => {
    setUser(userData)
    setIsDealer(userData.role === 'dealer')
  }

  const logout = () => {
    setUser(null)
    setIsDealer(false)
    setPendingTwoFactor(null)
  }

  // OAuth Authentication
  const loginWithOAuth = async provider => {
    try {
      // Simulate OAuth flow - in production, this would redirect to OAuth provider
      const mockUser = {
        id: Date.now(),
        email: `user@${provider}.com`,
        name: `${provider} User`,
        provider: provider,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${provider}+User`,
      }

      if (twoFactorEnabled) {
        setPendingTwoFactor(mockUser)
        return { requiresTwoFactor: true }
      }

      login(mockUser)
      return { success: true, user: mockUser }
    } catch (error) {
      console.error(`OAuth login failed: ${error}`)
      return { success: false, error: error.message }
    }
  }

  // Magic Link Authentication
  const sendMagicLink = async email => {
    try {
      // Simulate sending magic link - in production, this would call backend API
      console.log(`Magic link sent to ${email}`)
      return {
        success: true,
        message: 'Magic link sent! Check your email.',
      }
    } catch (error) {
      console.error(`Magic link failed: ${error}`)
      return { success: false, error: error.message }
    }
  }

  const verifyMagicLink = async _token => {
    try {
      // Simulate verifying magic link token
      const mockUser = {
        id: Date.now(),
        email: 'user@example.com',
        name: 'Magic Link User',
        provider: 'magiclink',
        role: 'user',
      }

      if (twoFactorEnabled) {
        setPendingTwoFactor(mockUser)
        return { requiresTwoFactor: true }
      }

      login(mockUser)
      return { success: true, user: mockUser }
    } catch (error) {
      console.error(`Magic link verification failed: ${error}`)
      return { success: false, error: error.message }
    }
  }

  // Two-Factor Authentication
  const enableTwoFactor = async () => {
    try {
      // Simulate 2FA setup - in production, this would generate QR code
      const secret = 'MOCK_SECRET_' + Math.random().toString(36).substring(7)
      setTwoFactorEnabled(true)
      return {
        success: true,
        secret,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${secret}&size=200x200`,
      }
    } catch (error) {
      console.error(`2FA enable failed: ${error}`)
      return { success: false, error: error.message }
    }
  }

  const disableTwoFactor = async code => {
    try {
      // Simulate 2FA disable - in production, verify code first
      if (code !== '123456') {
        return { success: false, error: 'Invalid code' }
      }
      setTwoFactorEnabled(false)
      return { success: true }
    } catch (error) {
      console.error(`2FA disable failed: ${error}`)
      return { success: false, error: error.message }
    }
  }

  const verifyTwoFactor = async code => {
    try {
      // Simulate 2FA verification
      if (code !== '123456') {
        return { success: false, error: 'Invalid code' }
      }

      if (pendingTwoFactor) {
        login(pendingTwoFactor)
        setPendingTwoFactor(null)
        return { success: true, user: pendingTwoFactor }
      }

      return { success: false, error: 'No pending authentication' }
    } catch (error) {
      console.error(`2FA verification failed: ${error}`)
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isDealer,
        login,
        logout,
        isAuthenticated: !!user,
        // OAuth methods
        loginWithOAuth,
        // Magic Link methods
        sendMagicLink,
        verifyMagicLink,
        // 2FA methods
        twoFactorEnabled,
        pendingTwoFactor,
        enableTwoFactor,
        disableTwoFactor,
        verifyTwoFactor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
