import { describe, it, expect } from 'vitest'

// Import services
import { chatWithAI } from '../ai'
import { decodeVIN } from '../vin'
import { createPaymentIntent } from '../payment'
import { sendEmail } from '../email'

describe('Services', () => {
  it('AI service should return response', async () => {
    const result = await chatWithAI('test question')
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.message).toBeDefined()
  })

  it('VIN service should decode VIN', async () => {
    const result = await decodeVIN('1HGBH41JXMN109186')
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  it('Payment service should create intent', async () => {
    const result = await createPaymentIntent(1000, 'usd')
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.clientSecret).toBeDefined()
  })

  it('Email service should send email', async () => {
    const result = await sendEmail('test@example.com', 'Test', 'Test body')
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.messageId).toBeDefined()
  })

  it('VIN service should reject invalid VIN length', async () => {
    const result = await decodeVIN('123')
    expect(result).toBeDefined()
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
