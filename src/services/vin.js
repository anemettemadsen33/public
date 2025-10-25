// VIN Check API Integration Service
// This service integrates with VIN decoder APIs to get vehicle information

const VIN_API_URL = import.meta.env.VITE_VIN_API_URL || 'https://vpic.nhtsa.dot.gov/api'

export const decodeVIN = async vin => {
  try {
    if (!vin || vin.length !== 17) {
      return {
        success: false,
        error: 'VIN must be 17 characters long',
      }
    }

    // Use NHTSA's free VIN decoder API
    const response = await fetch(`${VIN_API_URL}/vehicles/DecodeVin/${vin}?format=json`)

    if (!response.ok) {
      throw new Error('VIN API request failed')
    }

    const data = await response.json()

    const results = data.Results || []
    const extractValue = variableName => {
      const item = results.find(r => r.Variable === variableName)
      return item?.Value || 'N/A'
    }

    return {
      success: true,
      data: {
        vin,
        make: extractValue('Make'),
        model: extractValue('Model'),
        year: extractValue('Model Year'),
        trim: extractValue('Trim'),
        bodyClass: extractValue('Body Class'),
        engineSize: extractValue('Displacement (L)'),
        engineCylinders: extractValue('Engine Number of Cylinders'),
        fuelType: extractValue('Fuel Type - Primary'),
        transmission: extractValue('Transmission Style'),
        driveType: extractValue('Drive Type'),
        manufacturer: extractValue('Manufacturer Name'),
        plantCity: extractValue('Plant City'),
        plantCountry: extractValue('Plant Country'),
        vehicleType: extractValue('Vehicle Type'),
      },
    }
  } catch (error) {
    console.error('VIN decode error:', error)

    // Return simulated data for demo
    return {
      success: true,
      data: {
        vin,
        make: 'Toyota',
        model: 'Camry',
        year: '2020',
        trim: 'LE',
        bodyClass: 'Sedan',
        engineSize: '2.5L',
        engineCylinders: '4',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        driveType: 'FWD',
        manufacturer: 'Toyota Motor Corporation',
        plantCity: 'Georgetown',
        plantCountry: 'United States',
        vehicleType: 'Passenger Car',
      },
      simulated: true,
    }
  }
}

export const getVehicleHistory = async vin => {
  try {
    // In production, this would call services like Carfax or AutoCheck
    // For now, return simulated history data
    return {
      success: true,
      data: {
        vin,
        reportDate: new Date().toISOString(),
        ownerCount: 2,
        accidentCount: 0,
        serviceRecords: 12,
        titleStatus: 'Clean',
        lastOdometerReading: {
          value: 45000,
          date: '2024-01-15',
        },
        events: [
          {
            date: '2024-01-15',
            type: 'Service',
            description: 'Oil change and tire rotation',
            mileage: 45000,
          },
          {
            date: '2023-08-20',
            type: 'Service',
            description: 'Brake inspection',
            mileage: 42000,
          },
          {
            date: '2023-03-10',
            type: 'Ownership',
            description: 'Vehicle sold',
            mileage: 38000,
          },
        ],
      },
      simulated: true,
    }
  } catch (error) {
    console.error('Vehicle history error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export default {
  decodeVIN,
  getVehicleHistory,
}
