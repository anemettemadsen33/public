import Tesseract from 'tesseract.js';

/**
 * OCR Service for document scanning and text extraction
 * Supports VIN extraction from vehicle registration documents
 */

class OCRService {
  constructor() {
    this.worker = null;
  }

  /**
   * Initialize Tesseract worker
   */
  async initialize() {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker('eng+ron', 1, {
        logger: (m) => {
          // Progress logging
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
    }
    return this.worker;
  }

  /**
   * Extract text from image file
   * @param {File} imageFile - Image file to process
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<string>} Extracted text
   */
  async extractText(imageFile, onProgress = null) {
    try {
      await this.initialize();

      const { data } = await this.worker.recognize(imageFile, {
        logger: (m) => {
          if (onProgress && m.status === 'recognizing text') {
            onProgress(Math.round(m.progress * 100));
          }
        },
      });

      return data.text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract VIN from document image
   * VIN is 17 characters: letters (except I, O, Q) and numbers
   * @param {File} imageFile - Vehicle registration document
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Extracted vehicle information
   */
  async extractVINFromDocument(imageFile, onProgress = null) {
    try {
      const text = await this.extractText(imageFile, onProgress);

      // VIN pattern: 17 characters, alphanumeric, no I, O, Q
      const vinPattern = /\b[A-HJ-NPR-Z0-9]{17}\b/g;
      const matches = text.match(vinPattern);

      if (!matches || matches.length === 0) {
        throw new Error('No VIN found in document');
      }

      const vin = matches[0]; // Take first match

      // Extract other information with patterns
      const extracted = {
        vin,
        rawText: text,
        ...this.extractVehicleDetails(text),
      };

      return extracted;
    } catch (error) {
      console.error('VIN Extraction Error:', error);
      throw error;
    }
  }

  /**
   * Extract vehicle details from text using patterns
   * @param {string} text - OCR extracted text
   * @returns {Object} Extracted details
   */
  extractVehicleDetails(text) {
    const details = {};

    // Common patterns for Romanian documents
    const patterns = {
      // Brand patterns
      brand: /(?:marca|brand|make)[:\s]+([A-Z][a-zA-Z\s]+?)(?:\s|$)/i,
      // Model patterns  
      model: /(?:model|tip)[:\s]+([A-Z0-9][a-zA-Z0-9\s-]+?)(?:\s|$)/i,
      // Year patterns
      year: /(?:an fabricat|an|year)[:\s]+(\d{4})/i,
      // Mileage patterns
      mileage: /(?:km|kilometraj|mileage)[:\s]+([\d.,]+)/i,
      // Engine capacity
      engineCapacity: /(?:capacitate cilindrica|cm³|cc)[:\s]+([\d.,]+)/i,
      // Color
      color: /(?:culoare|color)[:\s]+([a-zA-Z\s]+?)(?:\s|$)/i,
      // Registration number
      registration: /(?:nr\.|numar)[:\s]*(?:inmatriculare)?[:\s]*([A-Z]{1,2}[-\s]?\d{2,3}[-\s]?[A-Z]{3})/i,
    };

    // Extract each field
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        details[key] = match[1].trim();
      }
    }

    // Parse numbers
    if (details.year) {
      details.year = parseInt(details.year, 10);
    }
    if (details.mileage) {
      details.mileage = parseInt(details.mileage.replace(/[.,\s]/g, ''), 10);
    }
    if (details.engineCapacity) {
      details.engineCapacity = parseInt(details.engineCapacity.replace(/[.,\s]/g, ''), 10);
    }

    return details;
  }

  /**
   * Decode VIN to extract basic information
   * @param {string} vin - 17-character VIN
   * @returns {Object} Decoded VIN information
   */
  decodeVIN(vin) {
    if (!vin || vin.length !== 17) {
      throw new Error('Invalid VIN format');
    }

    // Basic VIN decoding (simplified)
    const worldManufacturer = vin.substring(0, 3);
    const vehicleDescriptor = vin.substring(3, 9);
    const checkDigit = vin.charAt(8);
    const modelYear = vin.charAt(9);
    const plantCode = vin.charAt(10);
    const sequentialNumber = vin.substring(11, 17);

    // Map year code to year
    const yearMap = {
      'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
      'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
      'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
      'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
      'Y': 2030,
      '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
      '6': 2006, '7': 2007, '8': 2008, '9': 2009,
    };

    // Common manufacturer codes
    const manufacturerMap = {
      '1F': 'Ford (USA)',
      '1G': 'General Motors (USA)',
      '1H': 'Honda (USA)',
      '1J': 'Jeep',
      '1N': 'Nissan (USA)',
      '2F': 'Ford (Canada)',
      '2G': 'General Motors (Canada)',
      '2H': 'Honda (Canada)',
      '3F': 'Ford (Mexico)',
      '3G': 'General Motors (Mexico)',
      '4F': 'Mazda (USA)',
      '5F': 'Honda (USA)',
      'JM': 'Mazda (Japan)',
      'JH': 'Honda (Japan)',
      'JT': 'Toyota (Japan)',
      'KM': 'Hyundai (South Korea)',
      'KN': 'Kia (South Korea)',
      'SAJ': 'Jaguar',
      'SAL': 'Land Rover',
      'SAR': 'Rover',
      'SCC': 'Lotus',
      'TRU': 'Audi',
      'VF': 'Renault/Peugeot/Citroën',
      'VW': 'Volkswagen',
      'WA': 'Audi',
      'WBA': 'BMW',
      'WDB': 'Mercedes-Benz',
      'WDC': 'DaimlerChrysler',
      'WDD': 'Mercedes-Benz',
      'WMW': 'BMW',
      'WP': 'Porsche',
      'WUA': 'Audi Quattro',
      'WVW': 'Volkswagen',
      'YS': 'Saab',
      'YV': 'Volvo',
      'ZAR': 'Alfa Romeo',
      'ZFA': 'Fiat',
      'ZFF': 'Ferrari',
      'ZLA': 'Lancia',
    };

    const wmi2 = worldManufacturer.substring(0, 2);
    const wmi3 = worldManufacturer;

    return {
      vin,
      worldManufacturerIdentifier: worldManufacturer,
      manufacturer: manufacturerMap[wmi3] || manufacturerMap[wmi2] || 'Unknown',
      vehicleDescriptor,
      checkDigit,
      modelYear: yearMap[modelYear] || 'Unknown',
      plantCode,
      sequentialNumber,
    };
  }

  /**
   * Validate VIN checksum
   * @param {string} vin - VIN to validate
   * @returns {boolean} True if valid
   */
  validateVIN(vin) {
    if (!vin || vin.length !== 17) {
      return false;
    }

    // VIN should not contain I, O, Q
    if (/[IOQ]/.test(vin)) {
      return false;
    }

    // All characters should be alphanumeric
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return false;
    }

    // Additional checksum validation can be implemented here
    return true;
  }

  /**
   * Cleanup worker
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

// Export singleton instance
const ocrService = new OCRService();
export default ocrService;
