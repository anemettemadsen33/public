// Mock data types
export interface Vehicle {
  id: number
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  bodyType: string
  color: string
  features: string[]
  location: string
  images: string[]
  description: string
  vin: string
  sponsored: boolean
  dealerId: number
  condition: 'new' | 'used' | 'certified'
  views: number
  favorites: number
}

export interface Dealer {
  id: number
  name: string
  logo: string
  rating: number
  reviews: number
  location: string
  phone: string
  email: string
  verified: boolean
  inventory: number
}

export interface Brand {
  id: number
  name: string
  logo: string
  count: number
}

export interface Model {
  id: number
  brandId: number
  name: string
  count: number
}

// Generate 300+ realistic vehicles
const brands = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Nissan',
  'Hyundai',
  'Kia',
  'Mazda',
  'Subaru',
  'Tesla',
  'Porsche',
  'Lexus',
]

const models: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V'],
  Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco'],
  Chevrolet: ['Silverado', 'Equinox', 'Traverse', 'Tahoe', 'Camaro', 'Malibu'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', 'X7', 'M4'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'AMG GT'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'Q8', 'e-tron'],
  Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'ID.4', 'Golf'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Maxima'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona'],
  Kia: ['Forte', 'Optima', 'Sorento', 'Sportage', 'Telluride', 'Soul'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5', 'CX-30'],
  Subaru: ['Impreza', 'Legacy', 'Outback', 'Forester', 'Ascent', 'WRX'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  Lexus: ['ES', 'IS', 'RX', 'NX', 'GX', 'LX'],
}

const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
const transmissions = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch']
const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Wagon', 'Convertible']
const colors = [
  'Black',
  'White',
  'Silver',
  'Gray',
  'Blue',
  'Red',
  'Green',
  'Brown',
  'Orange',
  'Yellow',
]
const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
]
const conditions: ('new' | 'used' | 'certified')[] = ['new', 'used', 'certified']

const featuresList = [
  'Leather Seats',
  'Sunroof',
  'Navigation',
  'Backup Camera',
  'Bluetooth',
  'Heated Seats',
  'Apple CarPlay',
  'Android Auto',
  'Parking Sensors',
  'Blind Spot Monitor',
  'Lane Keep Assist',
  'Adaptive Cruise Control',
  'Keyless Entry',
  'Remote Start',
  'Premium Sound',
  'Third Row Seats',
  'All-Wheel Drive',
  'Tow Package',
  'Sport Package',
  'Technology Package',
]

export const generateVehicles = (count: number = 300): Vehicle[] => {
  const vehicles: Vehicle[] = []

  for (let i = 1; i <= count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)]!
    const modelList = models[brand] || []
    const model = modelList[Math.floor(Math.random() * modelList.length)] || 'Unknown'
    const year = 2015 + Math.floor(Math.random() * 10)
    const isElectric = Math.random() < 0.15
    const fuel = isElectric ? 'Electric' : fuelTypes[Math.floor(Math.random() * fuelTypes.length)]!
    const condition = conditions[Math.floor(Math.random() * conditions.length)]!

    let basePrice = 15000 + Math.floor(Math.random() * 80000)
    if (brand === 'Tesla' || brand === 'Porsche' || brand === 'Mercedes-Benz' || brand === 'BMW') {
      basePrice += 30000
    }
    if (condition === 'new') {
      basePrice = Math.floor(basePrice * 1.5)
    }

    const randomFeatures = featuresList
      .sort(() => 0.5 - Math.random())
      .slice(0, 5 + Math.floor(Math.random() * 8))

    vehicles.push({
      id: i,
      title: `${year} ${brand} ${model}`,
      brand,
      model,
      year,
      price: basePrice,
      mileage: condition === 'new' ? 0 : Math.floor(Math.random() * 100000),
      fuel: fuel!,
      transmission: transmissions[Math.floor(Math.random() * transmissions.length)]!,
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)]!,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      features: randomFeatures,
      location: locations[Math.floor(Math.random() * locations.length)]!,
      images: [
        `https://picsum.photos/seed/${i}-1/800/600`,
        `https://picsum.photos/seed/${i}-2/800/600`,
        `https://picsum.photos/seed/${i}-3/800/600`,
        `https://picsum.photos/seed/${i}-4/800/600`,
      ],
      description: `Beautiful ${condition} ${year} ${brand} ${model} in ${colors[Math.floor(Math.random() * colors.length)]}. Well maintained with ${randomFeatures.slice(0, 3).join(', ')} and more.`,
      vin: `VIN${String(i).padStart(14, '0')}`,
      sponsored: Math.random() < 0.1,
      dealerId: 1 + Math.floor(Math.random() * 20),
      condition,
      views: Math.floor(Math.random() * 1000),
      favorites: Math.floor(Math.random() * 50),
    })
  }

  return vehicles
}

export const generateDealers = (count: number = 20): Dealer[] => {
  const dealerNames = [
    'Premium Auto Group',
    'Elite Motors',
    'City Auto Sales',
    'Highway Auto Mall',
    'Prestige Automotive',
    'Metro Car Center',
    'Quality Auto',
    'Best Deal Motors',
    'Luxury Car Gallery',
    'Auto Plaza',
    'CarMax Pro',
    'Prime Auto Sales',
    'Superior Motors',
    'Apex Automotive',
    'Diamond Auto Group',
    'Golden Gate Auto',
    'Sunrise Motors',
    'Victory Auto',
    'Crown Auto Sales',
    'Platinum Motors',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: dealerNames[i] || `Dealer ${i + 1}`,
    logo: `https://picsum.photos/seed/dealer-${i}/200/200`,
    rating: 3.5 + Math.random() * 1.5,
    reviews: Math.floor(Math.random() * 500) + 50,
    location: locations[Math.floor(Math.random() * locations.length)]!,
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    email: `contact@${dealerNames[i]?.toLowerCase().replace(/\s+/g, '') || `dealer${i}`}.com`,
    verified: Math.random() > 0.3,
    inventory: Math.floor(Math.random() * 50) + 10,
  }))
}

export const generateBrands = (): Brand[] => {
  return brands.map((brand, index) => ({
    id: index + 1,
    name: brand,
    logo: `https://logo.clearbit.com/${brand.toLowerCase().replace(/\s+/g, '')}.com`,
    count: Math.floor(Math.random() * 30) + 5,
  }))
}

export const generateModels = (): Model[] => {
  const allModels: Model[] = []
  let modelId = 1

  brands.forEach((brand, brandIndex) => {
    const brandModels = models[brand] || []
    brandModels.forEach(modelName => {
      allModels.push({
        id: modelId++,
        brandId: brandIndex + 1,
        name: modelName,
        count: Math.floor(Math.random() * 20) + 1,
      })
    })
  })

  return allModels
}

// Initialize data
export const mockVehicles = generateVehicles(300)
export const mockDealers = generateDealers(20)
export const mockBrands = generateBrands()
export const mockModels = generateModels()
