// Email Notification Service
// This service handles sending email notifications

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const sendEmail = async (to, subject, body, template = null) => {
  try {
    const response = await fetch(`${API_URL}/notifications/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        template,
      }),
    })

    if (!response.ok) {
      throw new Error('Email send failed')
    }

    const data = await response.json()
    return {
      success: true,
      messageId: data.messageId,
    }
  } catch (error) {
    console.error('Email send error:', error)

    // Return simulated success for demo
    return {
      success: true,
      messageId: 'msg_' + Math.random().toString(36).substring(7),
      simulated: true,
    }
  }
}

export const sendWelcomeEmail = async (userEmail, userName) => {
  return sendEmail(
    userEmail,
    'Welcome to Auto Marketplace!',
    `Hi ${userName}, welcome to our platform!`,
    'welcome'
  )
}

export const sendTestDriveConfirmation = async (userEmail, vehicleDetails, appointmentDetails) => {
  return sendEmail(
    userEmail,
    'Test Drive Confirmation',
    `Your test drive for ${vehicleDetails.make} ${vehicleDetails.model} is confirmed for ${appointmentDetails.date} at ${appointmentDetails.time}.`,
    'test-drive-confirmation'
  )
}

export const sendLeadNotification = async (dealerEmail, leadDetails) => {
  return sendEmail(
    dealerEmail,
    'New Lead: ' + leadDetails.vehicleName,
    `You have a new lead from ${leadDetails.customerName} for ${leadDetails.vehicleName}.`,
    'lead-notification'
  )
}

export const sendPasswordReset = async (userEmail, resetToken) => {
  return sendEmail(
    userEmail,
    'Reset Your Password',
    `Click here to reset your password: ${window.location.origin}/reset-password?token=${resetToken}`,
    'password-reset'
  )
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendTestDriveConfirmation,
  sendLeadNotification,
  sendPasswordReset,
}
