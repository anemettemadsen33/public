// Dealer CRM and Lead Management Service
// Manages dealer leads, follow-ups, and customer relationships

class DealerCRMService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '/api';
  }

  /**
   * Get all leads for a dealer
   * @param {string} dealerId - Dealer ID
   * @param {object} filters - Filter options (status, date range, source, etc.)
   * @returns {Promise<Array>} List of leads
   */
  async getLeads(dealerId, filters = {}) {
    try {
      // In production, this would call your backend API
      // const params = new URLSearchParams(filters);
      // const response = await fetch(`${this.apiUrl}/dealer/${dealerId}/leads?${params}`);
      // return await response.json();

      // Demo mode: Generate mock leads
      const leads = this.generateMockLeads(20);
      
      // Apply filters
      let filtered = leads;
      if (filters.status) {
        filtered = filtered.filter(lead => lead.status === filters.status);
      }
      if (filters.source) {
        filtered = filtered.filter(lead => lead.source === filters.source);
      }
      if (filters.vehicle) {
        filtered = filtered.filter(lead => 
          lead.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase())
        );
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  /**
   * Get a specific lead by ID
   * @param {string} leadId - Lead ID
   * @returns {Promise<object>} Lead details
   */
  async getLead(leadId) {
    try {
      // In production:
      // const response = await fetch(`${this.apiUrl}/leads/${leadId}`);
      // return await response.json();

      // Demo mode: Generate a detailed lead
      return this.generateDetailedLead(leadId);
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  /**
   * Create a new lead
   * @param {object} leadData - Lead information
   * @returns {Promise<object>} Created lead
   */
  async createLead(leadData) {
    try {
      // In production:
      // const response = await fetch(`${this.apiUrl}/leads`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(leadData),
      // });
      // return await response.json();

      // Demo mode: Create mock lead
      const lead = {
        id: this.generateLeadId(),
        ...leadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'new',
        priority: this.calculatePriority(leadData),
        score: this.calculateLeadScore(leadData),
      };

      console.log('New lead created:', lead);
      return lead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  /**
   * Update lead status and details
   * @param {string} leadId - Lead ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated lead
   */
  async updateLead(leadId, updates) {
    try {
      // In production:
      // const response = await fetch(`${this.apiUrl}/leads/${leadId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates),
      // });
      // return await response.json();

      // Demo mode: Return updated lead
      const lead = await this.getLead(leadId);
      return {
        ...lead,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  /**
   * Add note to lead
   * @param {string} leadId - Lead ID
   * @param {string} note - Note text
   * @param {string} userId - User adding the note
   * @returns {Promise<object>} Added note
   */
  async addNote(leadId, note, userId) {
    try {
      const noteObj = {
        id: this.generateNoteId(),
        leadId,
        userId,
        text: note,
        createdAt: new Date().toISOString(),
      };

      console.log('Note added to lead:', leadId, noteObj);
      return noteObj;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  /**
   * Schedule follow-up for lead
   * @param {string} leadId - Lead ID
   * @param {object} followUp - Follow-up details
   * @returns {Promise<object>} Scheduled follow-up
   */
  async scheduleFollowUp(leadId, followUp) {
    try {
      const followUpObj = {
        id: this.generateFollowUpId(),
        leadId,
        type: followUp.type, // call, email, meeting, test_drive
        scheduledFor: followUp.scheduledFor,
        notes: followUp.notes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };

      console.log('Follow-up scheduled:', followUpObj);
      return followUpObj;
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      throw error;
    }
  }

  /**
   * Get lead analytics for dealer
   * @param {string} dealerId - Dealer ID
   * @param {object} _dateRange - Date range for analytics
   * @returns {Promise<object>} Analytics data
   */
  async getLeadAnalytics(dealerId, _dateRange = {}) {
    try {
      // In production:
      // const response = await fetch(`${this.apiUrl}/dealer/${dealerId}/analytics?...`);
      // return await response.json();

      // Demo mode: Generate analytics
      return {
        totalLeads: 156,
        newLeads: 23,
        activeLeads: 45,
        convertedLeads: 12,
        lostLeads: 8,
        conversionRate: 7.7, // percentage
        averageResponseTime: 2.5, // hours
        leadsBySource: {
          website: 89,
          phone: 34,
          email: 18,
          chat: 15,
        },
        leadsByStatus: {
          new: 23,
          contacted: 32,
          qualified: 13,
          test_drive_scheduled: 8,
          negotiating: 7,
          converted: 12,
          lost: 8,
        },
        topVehicles: [
          { vehicle: '2023 Toyota Camry', leads: 15 },
          { vehicle: '2022 Honda CR-V', leads: 12 },
          { vehicle: '2024 Ford F-150', leads: 10 },
          { vehicle: '2023 Tesla Model 3', leads: 8 },
        ],
        revenueProjection: {
          potential: 487500,
          committed: 156000,
        },
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  /**
   * Send email to lead
   * @param {string} leadId - Lead ID
   * @param {object} emailData - Email subject, body, template
   * @returns {Promise<object>} Email sent confirmation
   */
  async sendEmail(leadId, emailData) {
    try {
      // This would integrate with email service
      console.log('Email sent to lead:', leadId, emailData);
      return {
        success: true,
        messageId: this.generateMessageId(),
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Helper methods for generating mock data
  generateMockLeads(count) {
    const leads = [];
    const sources = ['website', 'phone', 'email', 'chat', 'referral'];
    const statuses = ['new', 'contacted', 'qualified', 'test_drive_scheduled', 'negotiating', 'converted', 'lost'];
    const vehicles = [
      '2023 Toyota Camry',
      '2022 Honda CR-V',
      '2024 Ford F-150',
      '2023 Tesla Model 3',
      '2022 Chevrolet Silverado',
      '2023 Mazda CX-5',
    ];

    for (let i = 0; i < count; i++) {
      leads.push({
        id: this.generateLeadId(),
        firstName: this.getRandomName(),
        lastName: this.getRandomLastName(),
        email: `customer${i}@email.com`,
        phone: this.generatePhone(),
        vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        score: Math.floor(Math.random() * 100),
        budget: Math.floor(Math.random() * 50000) + 15000,
        tradeIn: Math.random() > 0.6,
        financing: Math.random() > 0.4,
        createdAt: this.generateRandomDate(30),
        lastContact: this.generateRandomDate(5),
        nextFollowUp: Math.random() > 0.5 ? this.generateFutureDate(3) : null,
      });
    }

    return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  generateDetailedLead(leadId) {
    return {
      id: leadId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      vehicle: '2023 Toyota Camry',
      source: 'website',
      status: 'qualified',
      priority: 'high',
      score: 85,
      budget: 28000,
      tradeIn: true,
      tradeInVehicle: '2018 Honda Accord',
      financing: true,
      creditScore: 720,
      downPayment: 5000,
      monthlyBudget: 450,
      timeframe: 'Within 2 weeks',
      interests: ['Fuel efficiency', 'Safety features', 'Reliability'],
      createdAt: this.generateRandomDate(7),
      lastContact: this.generateRandomDate(2),
      nextFollowUp: this.generateFutureDate(1),
      notes: [
        {
          id: 'note1',
          text: 'Customer very interested in hybrid models',
          createdAt: this.generateRandomDate(6),
          author: 'Sales Rep',
        },
        {
          id: 'note2',
          text: 'Test drive scheduled for Saturday',
          createdAt: this.generateRandomDate(2),
          author: 'Sales Rep',
        },
      ],
      activities: [
        {
          id: 'act1',
          type: 'email',
          subject: 'Vehicle information sent',
          timestamp: this.generateRandomDate(7),
        },
        {
          id: 'act2',
          type: 'call',
          duration: '15 min',
          timestamp: this.generateRandomDate(5),
        },
        {
          id: 'act3',
          type: 'test_drive',
          status: 'scheduled',
          timestamp: this.generateFutureDate(2),
        },
      ],
    };
  }

  calculatePriority(leadData) {
    // Calculate based on budget, timeframe, financing readiness
    const score = this.calculateLeadScore(leadData);
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  calculateLeadScore(leadData) {
    let score = 0;
    
    // Budget ready
    if (leadData.budget > 20000) score += 30;
    if (leadData.downPayment > 3000) score += 20;
    
    // Financing ready
    if (leadData.creditScore > 700) score += 25;
    
    // Timeline
    if (leadData.timeframe && leadData.timeframe.includes('week')) score += 15;
    
    // Engagement
    if (leadData.testDriveScheduled) score += 10;
    
    return Math.min(score, 100);
  }

  // Utility methods
  generateLeadId() {
    return `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  generateNoteId() {
    return `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  generateFollowUpId() {
    return `followup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  getRandomName() {
    const names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
    return names[Math.floor(Math.random() * names.length)];
  }

  getRandomLastName() {
    const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return names[Math.floor(Math.random() * names.length)];
  }

  generatePhone() {
    return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  generateRandomDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString();
  }

  generateFutureDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
    return date.toISOString();
  }
}

// Export singleton instance
const dealerCRMService = new DealerCRMService();
export default dealerCRMService;
