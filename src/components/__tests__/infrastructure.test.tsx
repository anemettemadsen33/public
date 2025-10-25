import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Simple smoke test to verify testing infrastructure works
describe('Testing Infrastructure', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello Test</div>
    render(<TestComponent />)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })

  it('should work with Router components', () => {
    const TestComponent = () => (
      <BrowserRouter>
        <div>Router Test</div>
      </BrowserRouter>
    )
    render(<TestComponent />)
    expect(screen.getByText('Router Test')).toBeInTheDocument()
  })
})
