// VIN Check API Integration Service
// Integrates with NHTSA API and commercial VIN check services

class VINCheckService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '/api';
    // NHTSA (National Highway Traffic Safety Administration) - Free API
    this.nhtsaUrl = 'https://vpic.nhtsa.dot.gov/api';
    // Commercial VIN Check API (e.g., Carfax, AutoCheck, VINCheckPro)
    this.vinApiKey = import.meta.env.VITE_VIN_API_KEY;
    this.vinApiUrl = import.meta.env.VITE_VIN_API_URL || 'https://api.vindecoder.eu/3.2';
  }

  /**
   * Decode VIN using NHTSA free API
   * @param {string} vin - Vehicle Identification Number
   * @returns {Promise<object>} Vehicle specifications
   */
  async decodeVIN(vin) {
    try {
      // Validate VIN format
      if (!this.validateVIN(vin)) {
        throw new Error('Invalid VIN format. VIN must be 17 characters.');
      }

      // Call NHTSA API
      const response = await fetch(
        `${this.nhtsaUrl}/vehicles/DecodeVinValues/${vin}?format=json`
      );

      if (!response.ok) {
        throw new Error('Failed to decode VIN');
      }

      const data = await response.json();
      const result = data.Results[0];

      return {
        vin: vin,
        make: result.Make || 'Unknown',
        model: result.Model || 'Unknown',
        year: result.ModelYear || 'Unknown',
        manufacturer: result.Manufacturer || 'Unknown',
        vehicleType: result.VehicleType || 'Unknown',
        bodyClass: result.BodyClass || 'Unknown',
        engineCylinders: result.EngineCylinders || 'Unknown',
        engineDisplacement: result.DisplacementL || 'Unknown',
        fuelType: result.FuelTypePrimary || 'Unknown',
        transmission: result.TransmissionStyle || 'Unknown',
        driveType: result.DriveType || 'Unknown',
        trim: result.Trim || 'Unknown',
        doors: result.Doors || 'Unknown',
        plantCountry: result.PlantCountry || 'Unknown',
        errorCode: result.ErrorCode,
        errorText: result.ErrorText,
      };
    } catch (error) {
      console.error('Error decoding VIN:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive vehicle history report
   * @param {string} vin - Vehicle Identification Number
   * @returns {Promise<object>} Complete vehicle history
   */
  async getVehicleHistory(vin) {
    try {
      if (!this.validateVIN(vin)) {
        throw new Error('Invalid VIN format. VIN must be 17 characters.');
      }

      // In production, this would call a commercial API like:
      // - Carfax API
      // - AutoCheck API
      // - VINCheckPro
      // - ClearVin

      /* Production implementation example:
      const response = await fetch(`${this.vinApiUrl}/decode/${vin}`, {
        headers: {
          'Authorization': `Bearer ${this.vinApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicle history');
      }

      return await response.json();
      */

      // Demo mode: Generate realistic mock data based on VIN decode
      const specs = await this.decodeVIN(vin);
      
      return {
        vin: vin,
        status: Math.random() > 0.2 ? 'clean' : 'caution',
        vehicle: {
          make: specs.make,
          model: specs.model,
          year: specs.year,
          trim: specs.trim,
          engine: `${specs.engineDisplacement}L ${specs.engineCylinders}-cyl`,
          transmission: specs.transmission,
          fuelType: specs.fuelType,
          driveType: specs.driveType,
        },
        ownership: {
          totalOwners: Math.floor(Math.random() * 4) + 1,
          ownershipHistory: this.generateOwnershipHistory(),
          currentOwnerSince: this.generateRandomDate(5),
        },
        accidents: {
          totalAccidents: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
          accidentHistory: Math.random() > 0.7 ? this.generateAccidentHistory() : [],
        },
        serviceRecords: {
          totalRecords: Math.floor(Math.random() * 20) + 5,
          lastService: this.generateRandomDate(1),
          nextServiceDue: this.generateFutureDate(0.5),
          services: this.generateServiceHistory(),
        },
        recalls: {
          totalRecalls: Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0,
          openRecalls: Math.random() > 0.9 ? 1 : 0,
          recallHistory: Math.random() > 0.8 ? this.generateRecallHistory() : [],
        },
        titleInfo: {
          status: Math.random() > 0.1 ? 'Clean' : 'Salvage',
          brandHistory: [],
          lienRecords: Math.random() > 0.7 ? 'Active' : 'None',
        },
        odometer: {
          currentReading: Math.floor(Math.random() * 150000) + 10000,
          verified: true,
          history: this.generateOdometerHistory(),
          averageYearlyMileage: Math.floor(Math.random() * 15000) + 5000,
        },
        marketValue: {
          estimatedValue: this.generateMarketValue(specs.year),
          priceRange: {
            low: this.generateMarketValue(specs.year) * 0.85,
            high: this.generateMarketValue(specs.year) * 1.15,
          },
          condition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
        },
        specifications: specs,
        lastReported: new Date().toISOString().split('T')[0],
        reportGenerated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting vehicle history:', error);
      throw error;
    }
  }

  /**
   * Check for open recalls
   * @param {string} vin - Vehicle Identification Number
   * @returns {Promise<object[]>} List of open recalls
   */
  async checkRecalls(vin) {
    try {
      if (!this.validateVIN(vin)) {
        throw new Error('Invalid VIN format. VIN must be 17 characters.');
      }

      // NHTSA Recalls API
      const response = await fetch(
        `${this.nhtsaUrl}/vehicles/GetRecalls?vin=${vin}&format=json`
      );

      if (!response.ok) {
        throw new Error('Failed to check recalls');
      }

      const data = await response.json();
      return data.Results || [];
    } catch (error) {
      console.error('Error checking recalls:', error);
      throw error;
    }
  }

  /**
   * Validate VIN format
   * @param {string} vin - VIN to validate
   * @returns {boolean}
   */
  validateVIN(vin) {
    if (!vin || typeof vin !== 'string') return false;
    
    // VIN must be exactly 17 characters
    if (vin.length !== 17) return false;
    
    // VIN cannot contain I, O, or Q
    if (/[IOQ]/i.test(vin)) return false;
    
    // VIN must be alphanumeric
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return false;
    
    return true;
  }

  // Helper methods for generating mock data
  generateOwnershipHistory() {
    const count = Math.floor(Math.random() * 3) + 1;
    const history = [];
    for (let i = 0; i < count; i++) {
      history.push({
        ownerNumber: i + 1,
        startDate: this.generateRandomDate(10 - i * 3),
        endDate: i === 0 ? 'Current' : this.generateRandomDate(10 - (i + 1) * 3),
        state: ['CA', 'TX', 'FL', 'NY', 'PA'][Math.floor(Math.random() * 5)],
      });
    }
    return history;
  }

  generateAccidentHistory() {
    return [
      {
        date: this.generateRandomDate(3),
        severity: ['Minor', 'Moderate'][Math.floor(Math.random() * 2)],
        damage: 'Front bumper',
        repairCost: Math.floor(Math.random() * 3000) + 500,
      },
    ];
  }

  generateServiceHistory() {
    const services = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Battery Replacement', 'Air Filter'];
    return services.slice(0, Math.floor(Math.random() * 3) + 2).map(service => ({
      type: service,
      date: this.generateRandomDate(2),
      mileage: Math.floor(Math.random() * 100000) + 10000,
    }));
  }

  generateRecallHistory() {
    return [
      {
        campaign: `NHTSA Campaign #${Math.floor(Math.random() * 900000) + 100000}`,
        date: this.generateRandomDate(1),
        component: 'Airbag',
        status: 'Completed',
      },
    ];
  }

  generateOdometerHistory() {
    const current = Math.floor(Math.random() * 150000) + 10000;
    return [
      { date: this.generateRandomDate(3), reading: Math.floor(current * 0.5) },
      { date: this.generateRandomDate(2), reading: Math.floor(current * 0.7) },
      { date: this.generateRandomDate(1), reading: Math.floor(current * 0.9) },
      { date: new Date().toISOString().split('T')[0], reading: current },
    ];
  }

  generateMarketValue(year) {
    const age = new Date().getFullYear() - parseInt(year);
    return Math.floor((35000 - age * 2000) + Math.random() * 5000);
  }

  generateRandomDate(yearsAgo) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    date.setMonth(Math.floor(Math.random() * 12));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    return date.toISOString().split('T')[0];
  }

  generateFutureDate(yearsAhead) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + yearsAhead);
    return date.toISOString().split('T')[0];
  }
}

// Export singleton instance
const vinCheckService = new VINCheckService();
export default vinCheckService;
