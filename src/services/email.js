// Email Notification Service
// Handles sending various types of email notifications to users

class EmailService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '/api';
    this.fromEmail = import.meta.env.VITE_EMAIL_FROM || 'noreply@automarketplace.com';
  }

  /**
   * Send welcome email to new user
   * @param {string} email - User's email
   * @param {string} name - User's name
   */
  async sendWelcomeEmail(email, name) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Auto Marketplace! 🚗',
      template: 'welcome',
      data: { name },
    });
  }

  /**
   * Send magic link for passwordless login
   * @param {string} email - User's email
   * @param {string} magicLink - Magic link URL
   */
  async sendMagicLink(email, magicLink) {
    return this.sendEmail({
      to: email,
      subject: 'Your Login Link - Auto Marketplace',
      template: 'magic_link',
      data: { magicLink, expiresIn: '15 minutes' },
    });
  }

  /**
   * Send vehicle match notification
   * @param {string} email - User's email
   * @param {object} vehicle - Vehicle details
   */
  async sendVehicleMatch(email, vehicle) {
    return this.sendEmail({
      to: email,
      subject: `New Vehicle Match: ${vehicle.make} ${vehicle.model}`,
      template: 'vehicle_match',
      data: {
        vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        price: vehicle.price,
        imageUrl: vehicle.images?.[0] || '',
        detailsUrl: `${window.location.origin}/vehicle/${vehicle.id}`,
      },
    });
  }

  /**
   * Send price drop alert
   * @param {string} email - User's email
   * @param {object} vehicle - Vehicle details
   * @param {number} oldPrice - Previous price
   * @param {number} newPrice - New price
   */
  async sendPriceDropAlert(email, vehicle, oldPrice, newPrice) {
    const savings = oldPrice - newPrice;
    const percentage = Math.round((savings / oldPrice) * 100);

    return this.sendEmail({
      to: email,
      subject: `Price Drop Alert: Save $${savings.toLocaleString()} on ${vehicle.make} ${vehicle.model}! 💰`,
      template: 'price_drop',
      data: {
        vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        oldPrice,
        newPrice,
        savings,
        percentage,
        imageUrl: vehicle.images?.[0] || '',
        detailsUrl: `${window.location.origin}/vehicle/${vehicle.id}`,
      },
    });
  }

  /**
   * Send test drive confirmation
   * @param {string} email - User's email
   * @param {object} booking - Test drive booking details
   */
  async sendTestDriveConfirmation(email, booking) {
    return this.sendEmail({
      to: email,
      subject: `Test Drive Confirmed - ${booking.vehicle}`,
      template: 'test_drive_confirmation',
      data: {
        vehicleName: booking.vehicle,
        date: booking.date,
        time: booking.time,
        location: booking.location,
        confirmationCode: booking.confirmationCode || this.generateConfirmationCode(),
      },
    });
  }

  /**
   * Send new message notification
   * @param {string} email - User's email
   * @param {string} dealerName - Dealer name
   * @param {string} messagePreview - Preview of the message
   */
  async sendMessageNotification(email, dealerName, messagePreview) {
    return this.sendEmail({
      to: email,
      subject: `New Message from ${dealerName}`,
      template: 'new_message',
      data: {
        dealerName,
        messagePreview,
        messagesUrl: `${window.location.origin}/messages`,
      },
    });
  }

  /**
   * Send VIN check report
   * @param {string} email - User's email
   * @param {object} report - VIN check report data
   */
  async sendVINReport(email, report) {
    return this.sendEmail({
      to: email,
      subject: `Vehicle History Report - ${report.vehicle}`,
      template: 'vin_report',
      data: {
        vehicleName: report.vehicle,
        vin: report.vin,
        status: report.status,
        reportUrl: report.reportUrl,
      },
    });
  }

  /**
   * Send saved search alert
   * @param {string} email - User's email
   * @param {object[]} vehicles - Matching vehicles
   * @param {object} searchCriteria - Search criteria
   */
  async sendSavedSearchAlert(email, vehicles, searchCriteria) {
    return this.sendEmail({
      to: email,
      subject: `${vehicles.length} New Vehicles Match Your Search`,
      template: 'saved_search_alert',
      data: {
        count: vehicles.length,
        vehicles: vehicles.slice(0, 5), // Top 5 matches
        searchCriteria,
        searchUrl: this.buildSearchUrl(searchCriteria),
      },
    });
  }

  /**
   * Core email sending function
   * @private
   */
  async sendEmail({ to, subject, template, data }) {
    try {
      // In production, this would call your backend API which uses a service like:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Postmark
      // - Resend
      
      /* Production implementation:
      const response = await fetch(`${this.apiUrl}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          to,
          from: this.fromEmail,
          subject,
          template,
          templateData: data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.statusText}`);
      }

      return await response.json();
      */

      // Demo mode: Log email details
      console.group('📧 Email Notification');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Template:', template);
      console.log('Data:', data);
      console.groupEnd();

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        messageId: this.generateMessageId(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Build search URL from criteria
   * @private
   */
  buildSearchUrl(criteria) {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return `${window.location.origin}/listings?${params.toString()}`;
  }

  /**
   * Generate confirmation code
   * @private
   */
  generateConfirmationCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  /**
   * Generate message ID
   * @private
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;
