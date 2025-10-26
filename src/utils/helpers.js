// Format price with currency
export const formatPrice = (price, currency = '€') => {
  return `${currency}${price.toLocaleString('en-US')}`
}

// Format mileage
export const formatMileage = mileage => {
  return `${mileage.toLocaleString('en-US')} km`
}

// Format date
export const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

// Validate email
export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
export const isValidPhone = phone => {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Validate VIN
export const isValidVIN = vin => {
  return vin && vin.length === 17
}

// Calculate monthly payment (simple estimation)
export const calculateMonthlyPayment = (price, downPayment, months, interestRate = 0.05) => {
  const principal = price - downPayment
  const monthlyRate = interestRate / 12
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(payment)
}

// Filter vehicles by criteria
export const filterVehicles = (vehicles, filters) => {
  return vehicles.filter(vehicle => {
    if (filters.priceMin && vehicle.price < parseFloat(filters.priceMin)) return false
    if (filters.priceMax && vehicle.price > parseFloat(filters.priceMax)) return false
    if (filters.yearMin && vehicle.year < parseInt(filters.yearMin)) return false
    if (filters.yearMax && vehicle.year > parseInt(filters.yearMax)) return false
    if (filters.mileageMax && vehicle.mileage > parseInt(filters.mileageMax)) return false
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false
    if (filters.make && vehicle.make !== filters.make) return false
    if (filters.model && vehicle.model !== filters.model) return false
    if (filters.mainCategory && vehicle.mainCategory !== filters.mainCategory) return false
    if (filters.subCategory && vehicle.subCategory !== filters.subCategory) return false
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const searchable =
        `${vehicle.make} ${vehicle.model} ${vehicle.description || ''}`.toLowerCase()
      if (!searchable.includes(query)) return false
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const searchable =
        `${vehicle.make} ${vehicle.model} ${vehicle.description || ''}`.toLowerCase()
      if (!searchable.includes(query)) return false
    }
    return true
  })
}

// Sort vehicles
export const sortVehicles = (vehicles, sortBy) => {
  const sorted = [...vehicles]
  switch (sortBy) {
    case 'priceLowToHigh':
      return sorted.sort((a, b) => a.price - b.price)
    case 'priceHighToLow':
      return sorted.sort((a, b) => b.price - a.price)
    case 'mileageLowToHigh':
      return sorted.sort((a, b) => a.mileage - b.mileage)
    case 'yearNewest':
      return sorted.sort((a, b) => b.year - a.year)
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

// Lazy load image
export const lazyLoadImage = (src, placeholder = '/placeholder.jpg') => {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(src)
    img.onerror = () => resolve(placeholder)
  })
}
