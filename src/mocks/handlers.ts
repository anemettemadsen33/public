import { http, HttpResponse } from 'msw'
import { mockVehicles, mockDealers, mockBrands, mockModels } from './data'

// API base URL
const API_BASE = '/api'

export const handlers = [
  // Get all vehicles with filters and pagination
  http.get(`${API_BASE}/vehicles`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const brand = url.searchParams.get('brand')
    const model = url.searchParams.get('model')
    const minPrice = parseInt(url.searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(url.searchParams.get('maxPrice') || '999999999')
    const minYear = parseInt(url.searchParams.get('minYear') || '1900')
    const maxYear = parseInt(url.searchParams.get('maxYear') || '2100')
    const fuel = url.searchParams.get('fuel')
    const transmission = url.searchParams.get('transmission')
    const bodyType = url.searchParams.get('bodyType')
    const condition = url.searchParams.get('condition')
    const search = url.searchParams.get('search')

    let filtered = [...mockVehicles]

    // Apply filters
    if (brand) {
      filtered = filtered.filter(v => v.brand === brand)
    }
    if (model) {
      filtered = filtered.filter(v => v.model === model)
    }
    if (minPrice > 0 || maxPrice < 999999999) {
      filtered = filtered.filter(v => v.price >= minPrice && v.price <= maxPrice)
    }
    if (minYear > 1900 || maxYear < 2100) {
      filtered = filtered.filter(v => v.year >= minYear && v.year <= maxYear)
    }
    if (fuel) {
      filtered = filtered.filter(v => v.fuel === fuel)
    }
    if (transmission) {
      filtered = filtered.filter(v => v.transmission === transmission)
    }
    if (bodyType) {
      filtered = filtered.filter(v => v.bodyType === bodyType)
    }
    if (condition) {
      filtered = filtered.filter(v => v.condition === condition)
    }
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        v =>
          v.title.toLowerCase().includes(searchLower) ||
          v.brand.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filtered.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginated = filtered.slice(startIndex, endIndex)

    return HttpResponse.json({
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  }),

  // Get single vehicle by ID
  http.get(`${API_BASE}/vehicles/:id`, ({ params }) => {
    const { id } = params
    const vehicle = mockVehicles.find(v => v.id === parseInt(id as string))

    if (!vehicle) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(vehicle)
  }),

  // Get all brands
  http.get(`${API_BASE}/brands`, () => {
    return HttpResponse.json(mockBrands)
  }),

  // Get models for a brand
  http.get(`${API_BASE}/models`, ({ request }) => {
    const url = new URL(request.url)
    const brandId = url.searchParams.get('brandId')

    let models = mockModels
    if (brandId) {
      models = models.filter(m => m.brandId === parseInt(brandId))
    }

    return HttpResponse.json(models)
  }),

  // Get all dealers
  http.get(`${API_BASE}/dealers`, () => {
    return HttpResponse.json(mockDealers)
  }),

  // Get single dealer by ID
  http.get(`${API_BASE}/dealers/:id`, ({ params }) => {
    const { id } = params
    const dealer = mockDealers.find(d => d.id === parseInt(id as string))

    if (!dealer) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(dealer)
  }),

  // Get recommendations based on a vehicle ID
  http.get(`${API_BASE}/recommendations`, ({ request }) => {
    const url = new URL(request.url)
    const vehicleId = url.searchParams.get('for')

    if (!vehicleId) {
      return HttpResponse.json([])
    }

    const currentVehicle = mockVehicles.find(v => v.id === parseInt(vehicleId))
    if (!currentVehicle) {
      return HttpResponse.json([])
    }

    // Simple recommendation logic: same brand or similar price
    const recommendations = mockVehicles
      .filter(v => v.id !== currentVehicle.id)
      .map(v => {
        let score = 0
        if (v.brand === currentVehicle.brand) score += 30
        if (v.fuel === currentVehicle.fuel) score += 20
        if (Math.abs(v.price - currentVehicle.price) < 10000) score += 50
        if (v.bodyType === currentVehicle.bodyType) score += 25
        return { ...v, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    return HttpResponse.json(recommendations)
  }),

  // Search suggestions (for autosuggest)
  http.get(`${API_BASE}/search/suggest`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')

    if (!query || query.length < 2) {
      return HttpResponse.json([])
    }

    const queryLower = query.toLowerCase()
    const suggestions: string[] = []

    // Add matching brands
    mockBrands
      .filter(b => b.name.toLowerCase().includes(queryLower))
      .forEach(b => suggestions.push(b.name))

    // Add matching models
    mockModels
      .filter(m => m.name.toLowerCase().includes(queryLower))
      .forEach(m => suggestions.push(m.name))

    // Add matching locations
    const locations = Array.from(new Set(mockVehicles.map(v => v.location)))
    locations.filter(l => l.toLowerCase().includes(queryLower)).forEach(l => suggestions.push(l))

    return HttpResponse.json(Array.from(new Set(suggestions)).slice(0, 10))
  }),
]
