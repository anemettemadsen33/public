/**
 * AI Auto-tagging Service
 * Analyzes vehicle descriptions and images to generate relevant tags
 * Uses keyword matching and pattern recognition
 */

class AutoTaggingService {
  constructor() {
    // Define tag categories and keywords
    this.tagCategories = {
      // Comfort & Interior
      comfort: {
        keywords: [
          'leather', 'piele', 'heated seats', 'scaune incalzite', 'climate control', 'climatizare',
          'dual zone', 'ventilation', 'ventilatie', 'massage', 'masaj', 'electric seats',
          'scaune electrice', 'memory seats', 'ambient lighting', 'iluminare ambientala',
          'panoramic', 'panoramic sunroof', 'trapa', 'premium audio', 'sound system',
          'keyless entry', 'acces fara cheie', 'push button start', 'start stop',
        ],
        tags: ['Comfort', 'Premium Interior', 'Heated Seats', 'Climate Control', 'Panoramic Roof', 'Leather Seats'],
      },
      // Technology & Safety
      technology: {
        keywords: [
          'navigation', 'navigatie', 'gps', 'touchscreen', 'ecran tactil', 'apple carplay',
          'android auto', 'bluetooth', 'wireless charging', 'incarcare wireless', 'digital dashboard',
          'digital cockpit', 'head-up display', 'hud', 'camera', 'parking sensors', 'senzori parcare',
          'parking assist', 'asistenta parcare', 'adaptive cruise', 'cruise control adapti',
          'lane assist', 'blind spot', 'unghi mort', 'collision', 'coliziune', 'abs',
          'esp', 'airbag', 'autonomous', 'autonom',
        ],
        tags: ['Navigation', 'Touchscreen', 'CarPlay/Android Auto', 'Parking Camera', 'Cruise Control', 'Safety Pack'],
      },
      // Performance & Engine
      performance: {
        keywords: [
          'turbo', 'supercharged', 'v6', 'v8', 'diesel', 'hybrid', 'hibrid', 'electric',
          'electric', 'plug-in', 'awd', '4x4', '4wd', 'quattro', 'xdrive', 'sport mode',
          'mod sport', 'paddle shifters', 'padele', 'launch control', 'drift mode',
          'performance', 'performanta', 'hp', 'cp', 'bhp', 'torque', 'tuning', 'modified',
          'modificat', 'chip tuning', 'exhaust', 'evacuare', 'sports suspension',
        ],
        tags: ['Turbo', 'AWD/4x4', 'Sport Mode', 'High Performance', 'Hybrid/Electric', 'Modified'],
      },
      // Exterior & Design
      exterior: {
        keywords: [
          'led', 'xenon', 'headlights', 'faruri', 'matrix', 'adaptive lights', 'daytime running',
          'alloy wheels', 'jante aliaj', 'sports package', 'pachet sport', 'm sport', 's-line',
          'amg', 'rs', 'carbon', 'spoiler', 'body kit', 'paint protection', 'ceramic coating',
          'tinted windows', 'geamuri fumurii', 'roof rails', 'bare', 'chrome', 'black edition',
        ],
        tags: ['LED Headlights', 'Alloy Wheels', 'Sport Package', 'Tinted Windows', 'Premium Design'],
      },
      // Condition & History
      condition: {
        keywords: [
          'pristine', 'impecabil', 'excellent', 'excelent', 'mint condition', 'stare perfecta',
          'well maintained', 'intretinut', 'service history', 'istoric service', 'single owner',
          'un proprietar', 'no accidents', 'fara accidente', 'damage-free', 'fara daune',
          'warranty', 'garantie', 'certified', 'certificat', 'inspected', 'inspectat',
          'new tires', 'anvelope noi', 'recent service', 'service recent',
        ],
        tags: ['Excellent Condition', 'Full Service History', 'Accident Free', 'Single Owner', 'Warranty'],
      },
      // Special Features
      special: {
        keywords: [
          'rare', 'rar', 'limited edition', 'editie limitata', 'collector', 'colectie',
          'classic', 'clasic', 'vintage', 'sports car', 'masina sport', 'supercar',
          'luxury', 'lux', 'premium', 'exclusive', 'exclusiv', 'custom', 'personalizat',
          'imported', 'importat', 'low mileage', 'kilometraj redus', 'one of a kind',
        ],
        tags: ['Rare Find', 'Limited Edition', 'Collector\'s Item', 'Low Mileage', 'Exclusive'],
      },
    };
  }

  /**
   * Analyze vehicle listing and generate tags
   * @param {Object} vehicle - Vehicle object with description, features, etc.
   * @returns {Array<string>} Generated tags
   */
  generateTags(vehicle) {
    const tags = new Set();

    // Combine all text fields
    const textToAnalyze = [
      vehicle.description || '',
      vehicle.title || '',
      (vehicle.features || []).join(' '),
      vehicle.condition || '',
      vehicle.fuelType || '',
      vehicle.transmission || '',
      vehicle.bodyType || '',
    ].join(' ').toLowerCase();

    // Analyze each category
    for (const [_category, data] of Object.entries(this.tagCategories)) {
      for (const keyword of data.keywords) {
        if (textToAnalyze.includes(keyword.toLowerCase())) {
          // Add relevant tags from this category
          data.tags.forEach((tag) => tags.add(tag));
          break; // Found match in this category, move to next
        }
      }
    }

    // Add tags based on vehicle specifications
    this.addSpecificationTags(vehicle, tags);

    // Add year-based tags
    this.addYearTags(vehicle, tags);

    // Add price-based tags
    this.addPriceTags(vehicle, tags);

    // Add mileage-based tags
    this.addMileageTags(vehicle, tags);

    return Array.from(tags);
  }

  /**
   * Add tags based on specifications
   */
  addSpecificationTags(vehicle, tags) {
    // Fuel type tags
    if (vehicle.fuelType) {
      const fuelType = vehicle.fuelType.toLowerCase();
      if (fuelType.includes('electric') || fuelType.includes('ev')) {
        tags.add('Electric Vehicle');
      } else if (fuelType.includes('hybrid')) {
        tags.add('Hybrid');
      } else if (fuelType.includes('diesel')) {
        tags.add('Diesel');
      } else if (fuelType.includes('petrol') || fuelType.includes('gasoline') || fuelType.includes('benzina')) {
        tags.add('Petrol');
      }
    }

    // Transmission tags
    if (vehicle.transmission) {
      const trans = vehicle.transmission.toLowerCase();
      if (trans.includes('automatic') || trans.includes('automat')) {
        tags.add('Automatic');
      } else if (trans.includes('manual')) {
        tags.add('Manual');
      }
    }

    // Body type tags
    if (vehicle.bodyType) {
      const bodyType = vehicle.bodyType.toLowerCase();
      if (bodyType.includes('suv')) {
        tags.add('SUV');
      } else if (bodyType.includes('sedan') || bodyType.includes('berlina')) {
        tags.add('Sedan');
      } else if (bodyType.includes('coupe')) {
        tags.add('Coupe');
      } else if (bodyType.includes('convertible') || bodyType.includes('cabriolet')) {
        tags.add('Convertible');
      } else if (bodyType.includes('wagon') || bodyType.includes('estate') || bodyType.includes('break')) {
        tags.add('Estate/Wagon');
      } else if (bodyType.includes('hatchback')) {
        tags.add('Hatchback');
      }
    }

    // Power-based tags
    if (vehicle.horsePower) {
      const hp = parseInt(vehicle.horsePower, 10);
      if (hp >= 300) {
        tags.add('High Performance');
      } else if (hp >= 200) {
        tags.add('Sporty');
      } else if (hp <= 100) {
        tags.add('Economical');
      }
    }
  }

  /**
   * Add tags based on year
   */
  addYearTags(vehicle, tags) {
    if (vehicle.year) {
      const year = parseInt(vehicle.year, 10);
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;

      if (age === 0) {
        tags.add('Brand New');
      } else if (age <= 1) {
        tags.add('Nearly New');
      } else if (age <= 3) {
        tags.add('Recent Model');
      } else if (age >= 25) {
        tags.add('Classic');
      } else if (age >= 15) {
        tags.add('Vintage');
      }
    }
  }

  /**
   * Add tags based on price
   */
  addPriceTags(vehicle, tags) {
    if (vehicle.price) {
      const price = parseInt(vehicle.price, 10);

      if (price >= 100000) {
        tags.add('Luxury');
        tags.add('Premium');
      } else if (price >= 50000) {
        tags.add('Premium');
      } else if (price <= 10000) {
        tags.add('Budget Friendly');
      } else if (price <= 20000) {
        tags.add('Affordable');
      }
    }
  }

  /**
   * Add tags based on mileage
   */
  addMileageTags(vehicle, tags) {
    if (vehicle.mileage) {
      const mileage = parseInt(vehicle.mileage, 10);

      if (mileage < 10000) {
        tags.add('Low Mileage');
      } else if (mileage < 50000) {
        tags.add('Low to Medium Mileage');
      } else if (mileage > 200000) {
        tags.add('High Mileage');
      }
    }
  }

  /**
   * Analyze images and generate visual tags
   * This is a simplified version - in production, use ML/CV API
   * @param {Array<string>} imageUrls - Array of image URLs
   * @returns {Promise<Array<string>>} Generated visual tags
   */
  async analyzeImages(imageUrls) {
    // In production, call ML service like Google Vision API, AWS Rekognition, etc.
    // For now, return placeholder tags
    const visualTags = [];

    // Mock analysis based on number of images
    if (imageUrls && imageUrls.length > 0) {
      visualTags.push('Professional Photos');
      
      if (imageUrls.length >= 10) {
        visualTags.push('Comprehensive Gallery');
      }

      // In production:
      // const response = await fetch('https://api.ml-service.com/analyze', {
      //   method: 'POST',
      //   body: JSON.stringify({ images: imageUrls }),
      // });
      // const data = await response.json();
      // return data.tags;
    }

    return visualTags;
  }

  /**
   * Get tag color based on tag type
   * @param {string} tag - Tag name
   * @returns {string} Tailwind color class
   */
  getTagColor(tag) {
    const colorMap = {
      'Electric Vehicle': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Hybrid': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'High Performance': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Luxury': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Premium': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Low Mileage': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Brand New': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Classic': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Rare Find': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Excellent Condition': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    };

    return colorMap[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

// Export singleton instance
const autoTaggingService = new AutoTaggingService();
export default autoTaggingService;
