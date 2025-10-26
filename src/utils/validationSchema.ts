import { z } from 'zod'
import { MainCategory, VehicleSubCategoryCode, isValidSubCategory } from './vehicleSubCategories'

/**
 * Validation schema for vehicle categories using Zod
 */

// Main category enum
const mainCategorySchema = z.enum([
  'Car',
  'Motorcycle',
  'Van',
  'Truck',
  'ConstructionMachine',
  'Agricultural',
])

// Subcategory enum with all possible values
const subCategorySchema = z.enum([
  'Car.Cabrio',
  'Car.Limousine',
  'Car.Kombi',
  'Car.SUV',
  'Car.Coupe',
  'Car.SmallCar',
  'Car.OffRoad',
  'Car.SportsCar',
  'Car.Transporter',
  'Motorcycle.Touring',
  'Motorcycle.Chopper',
  'Motorcycle.Cruiser',
  'Motorcycle.Bagger',
  'Motorcycle.Naked',
  'Motorcycle.Enduro',
  'Motorcycle.SportTouring',
  'Motorcycle.Scooter',
  'Motorcycle.Trial',
  'Motorcycle.Quad',
  'Van.PanelVan',
  'Van.Transporter',
  'Van.MiniBus',
  'Van.PickUp',
  'Van.BoxVan',
  'Van.CamperVan',
  'Truck.HeavyDuty',
  'Truck.SemiTractor',
  'Truck.Tanker',
  'Truck.Tipper',
  'Truck.Refrigerated',
  'Truck.Flatbed',
  'ConstructionMachine.MiniExcavator',
  'ConstructionMachine.Excavator',
  'ConstructionMachine.WheelLoader',
  'ConstructionMachine.Forklift',
  'ConstructionMachine.Bulldozer',
  'ConstructionMachine.Crane',
  'ConstructionMachine.Telehandler',
  'ConstructionMachine.Compactor',
  'Agricultural.Tractor',
  'Agricultural.Harvester',
  'Agricultural.Sprayer',
  'Agricultural.Trailer',
])

/**
 * Vehicle category validation schema
 * Ensures subcategory belongs to the selected main category
 */
export const vehicleCategorySchema = z
  .object({
    mainCategory: mainCategorySchema.optional(),
    subCategory: subCategorySchema.optional(),
  })
  .refine(
    data => {
      // If both are provided, validate they match
      if (data.mainCategory && data.subCategory) {
        return isValidSubCategory(
          data.mainCategory as MainCategory,
          data.subCategory as VehicleSubCategoryCode
        )
      }
      return true
    },
    {
      message: 'Subcategory must belong to the selected main category',
      path: ['subCategory'],
    }
  )

/**
 * Complete vehicle filter validation schema
 */
export const vehicleFilterSchema = z
  .object({
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    yearMin: z.string().optional(),
    yearMax: z.string().optional(),
    mileageMax: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    search: z.string().optional(),
    mainCategory: mainCategorySchema.optional(),
    subCategory: subCategorySchema.optional(),
  })
  .refine(
    data => {
      // Validate subcategory belongs to main category
      if (data.mainCategory && data.subCategory) {
        return isValidSubCategory(
          data.mainCategory as MainCategory,
          data.subCategory as VehicleSubCategoryCode
        )
      }
      return true
    },
    {
      message: 'Subcategory must belong to the selected main category',
      path: ['subCategory'],
    }
  )

/**
 * Validate vehicle category data
 */
export const validateVehicleCategory = (data: { mainCategory?: string; subCategory?: string }) => {
  return vehicleCategorySchema.safeParse(data)
}

/**
 * Validate complete filter data
 */
export const validateVehicleFilters = (data: Record<string, unknown>) => {
  return vehicleFilterSchema.safeParse(data)
}
