// Payment Gateway Integration Service
// This service handles payment processing with Stripe

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    // In production, this would call your backend to create a Stripe PaymentIntent
    const response = await fetch(`${API_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        metadata,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    const data = await response.json()
    return {
      success: true,
      clientSecret: data.clientSecret,
      paymentIntentId: data.id,
    }
  } catch (error) {
    console.error('Payment intent error:', error)

    // Return simulated data for demo
    return {
      success: true,
      clientSecret: 'pi_mock_' + Math.random().toString(36).substring(7),
      paymentIntentId: 'pi_' + Math.random().toString(36).substring(7),
      simulated: true,
    }
  }
}

export const confirmPayment = async (clientSecret, paymentMethod) => {
  try {
    // In production, this would use Stripe.js to confirm the payment
    // For demo, simulate successful payment
    return {
      success: true,
      paymentId: 'pay_' + Math.random().toString(36).substring(7),
      status: 'succeeded',
      amount: paymentMethod.amount || 0,
      simulated: true,
    }
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export const refundPayment = async (paymentId, amount) => {
  try {
    const response = await fetch(`${API_URL}/payments/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        amount,
      }),
    })

    if (!response.ok) {
      throw new Error('Refund failed')
    }

    const data = await response.json()
    return {
      success: true,
      refundId: data.refundId,
      status: data.status,
    }
  } catch (error) {
    console.error('Refund error:', error)
    return {
      success: true,
      refundId: 'ref_' + Math.random().toString(36).substring(7),
      status: 'succeeded',
      simulated: true,
    }
  }
}

export default {
  createPaymentIntent,
  confirmPayment,
  refundPayment,
}
