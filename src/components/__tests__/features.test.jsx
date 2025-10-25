import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'

// Import components
import OAuthButtons from '../../components/auth/OAuthButtons'
import MagicLinkForm from '../../components/auth/MagicLinkForm'
import TwoFactorSetup from '../../components/auth/TwoFactorSetup'
import VINChecker from '../../components/vin/VINChecker'
import Gamification from '../../components/gamification/Gamification'

describe('New Features Components', () => {
  const wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  )

  it('should render OAuthButtons', () => {
    render(<OAuthButtons />, { wrapper })
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue with GitHub/i)).toBeInTheDocument()
  })

  it('should render MagicLinkForm', () => {
    render(<MagicLinkForm />, { wrapper })
    expect(screen.getByText(/Send Magic Link/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
  })

  it('should render TwoFactorSetup', () => {
    render(<TwoFactorSetup />, { wrapper })
    expect(screen.getByText(/Secure Your Account/i)).toBeInTheDocument()
  })

  it('should render VINChecker', () => {
    render(<VINChecker />, { wrapper })
    expect(screen.getByText(/VIN Decoder/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/1HGBH41JXMN109186/i)).toBeInTheDocument()
  })

  it('should render Gamification', () => {
    render(<Gamification />, { wrapper })
    expect(screen.getByText(/Achievements & Rewards/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Points/i)).toBeInTheDocument()
  })
})
