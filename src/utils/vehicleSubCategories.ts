/**
 * Vehicle Subcategories based on mobile.de official category codes
 * Reference: https://services.mobile.de/manual/upload-interface-csv_en.html
 */

// Main vehicle category types
export type MainCategory =
  | 'Car'
  | 'Motorcycle'
  | 'Van'
  | 'Truck'
  | 'ConstructionMachine'
  | 'Agricultural'

// Subcategory codes following mobile.de conventions
export type VehicleSubCategoryCode =
  // Car subcategories
  | 'Car.Cabrio'
  | 'Car.Limousine'
  | 'Car.Kombi'
  | 'Car.SUV'
  | 'Car.Coupe'
  | 'Car.SmallCar'
  | 'Car.OffRoad'
  | 'Car.SportsCar'
  | 'Car.Transporter'
  // Motorcycle subcategories
  | 'Motorcycle.Touring'
  | 'Motorcycle.Chopper'
  | 'Motorcycle.Cruiser'
  | 'Motorcycle.Bagger'
  | 'Motorcycle.Naked'
  | 'Motorcycle.Enduro'
  | 'Motorcycle.SportTouring'
  | 'Motorcycle.Scooter'
  | 'Motorcycle.Trial'
  | 'Motorcycle.Quad'
  // Van subcategories (up to 7500kg)
  | 'Van.PanelVan'
  | 'Van.Transporter'
  | 'Van.MiniBus'
  | 'Van.PickUp'
  | 'Van.BoxVan'
  | 'Van.CamperVan'
  // Truck subcategories (over 7500kg)
  | 'Truck.HeavyDuty'
  | 'Truck.SemiTractor'
  | 'Truck.Tanker'
  | 'Truck.Tipper'
  | 'Truck.Refrigerated'
  | 'Truck.Flatbed'
  // Construction Machine subcategories
  | 'ConstructionMachine.MiniExcavator'
  | 'ConstructionMachine.Excavator'
  | 'ConstructionMachine.WheelLoader'
  | 'ConstructionMachine.Forklift'
  | 'ConstructionMachine.Bulldozer'
  | 'ConstructionMachine.Crane'
  | 'ConstructionMachine.Telehandler'
  | 'ConstructionMachine.Compactor'
  // Agricultural subcategories
  | 'Agricultural.Tractor'
  | 'Agricultural.Harvester'
  | 'Agricultural.Sprayer'
  | 'Agricultural.Trailer'

export interface VehicleSubCategory {
  code: VehicleSubCategoryCode
  mainCategory: MainCategory
  labelEn: string
  labelDe: string
}

/**
 * Complete list of vehicle subcategories with mobile.de codes
 */
export const VEHICLE_SUB_CATEGORIES: VehicleSubCategory[] = [
  // Car subcategories
  {
    code: 'Car.Cabrio',
    mainCategory: 'Car',
    labelEn: 'Convertible',
    labelDe: 'Cabrio',
  },
  {
    code: 'Car.Limousine',
    mainCategory: 'Car',
    labelEn: 'Sedan',
    labelDe: 'Limousine',
  },
  {
    code: 'Car.Kombi',
    mainCategory: 'Car',
    labelEn: 'Station Wagon',
    labelDe: 'Kombi',
  },
  {
    code: 'Car.SUV',
    mainCategory: 'Car',
    labelEn: 'SUV / Off-road',
    labelDe: 'SUV / Geländewagen',
  },
  {
    code: 'Car.Coupe',
    mainCategory: 'Car',
    labelEn: 'Coupé',
    labelDe: 'Coupé',
  },
  {
    code: 'Car.SmallCar',
    mainCategory: 'Car',
    labelEn: 'Small Car',
    labelDe: 'Kleinwagen',
  },
  {
    code: 'Car.OffRoad',
    mainCategory: 'Car',
    labelEn: 'Off-Road Vehicle',
    labelDe: 'Geländewagen',
  },
  {
    code: 'Car.SportsCar',
    mainCategory: 'Car',
    labelEn: 'Sports Car',
    labelDe: 'Sportwagen',
  },
  {
    code: 'Car.Transporter',
    mainCategory: 'Car',
    labelEn: 'Transporter',
    labelDe: 'Transporter',
  },

  // Motorcycle subcategories
  {
    code: 'Motorcycle.Touring',
    mainCategory: 'Motorcycle',
    labelEn: 'Touring',
    labelDe: 'Tourer',
  },
  {
    code: 'Motorcycle.Chopper',
    mainCategory: 'Motorcycle',
    labelEn: 'Chopper',
    labelDe: 'Chopper',
  },
  {
    code: 'Motorcycle.Cruiser',
    mainCategory: 'Motorcycle',
    labelEn: 'Cruiser',
    labelDe: 'Cruiser',
  },
  {
    code: 'Motorcycle.Bagger',
    mainCategory: 'Motorcycle',
    labelEn: 'Bagger',
    labelDe: 'Bagger',
  },
  {
    code: 'Motorcycle.Naked',
    mainCategory: 'Motorcycle',
    labelEn: 'Naked Bike',
    labelDe: 'Naked Bike',
  },
  {
    code: 'Motorcycle.Enduro',
    mainCategory: 'Motorcycle',
    labelEn: 'Enduro',
    labelDe: 'Enduro',
  },
  {
    code: 'Motorcycle.SportTouring',
    mainCategory: 'Motorcycle',
    labelEn: 'Sport Touring',
    labelDe: 'Sport-Tourer',
  },
  {
    code: 'Motorcycle.Scooter',
    mainCategory: 'Motorcycle',
    labelEn: 'Scooter',
    labelDe: 'Roller',
  },
  {
    code: 'Motorcycle.Trial',
    mainCategory: 'Motorcycle',
    labelEn: 'Trial',
    labelDe: 'Trial',
  },
  {
    code: 'Motorcycle.Quad',
    mainCategory: 'Motorcycle',
    labelEn: 'Quad/ATV',
    labelDe: 'Quad/ATV',
  },

  // Van subcategories (up to 7500kg)
  {
    code: 'Van.PanelVan',
    mainCategory: 'Van',
    labelEn: 'Panel Van',
    labelDe: 'Kastenwagen',
  },
  {
    code: 'Van.Transporter',
    mainCategory: 'Van',
    labelEn: 'Transporter',
    labelDe: 'Transporter',
  },
  {
    code: 'Van.MiniBus',
    mainCategory: 'Van',
    labelEn: 'Minibus',
    labelDe: 'Kleinbus',
  },
  {
    code: 'Van.PickUp',
    mainCategory: 'Van',
    labelEn: 'Pick-up',
    labelDe: 'Pick-up',
  },
  {
    code: 'Van.BoxVan',
    mainCategory: 'Van',
    labelEn: 'Box Van',
    labelDe: 'Kofferwagen',
  },
  {
    code: 'Van.CamperVan',
    mainCategory: 'Van',
    labelEn: 'Camper Van',
    labelDe: 'Wohnmobil',
  },

  // Truck subcategories (over 7500kg)
  {
    code: 'Truck.HeavyDuty',
    mainCategory: 'Truck',
    labelEn: 'Heavy Duty Truck',
    labelDe: 'Schwere LKW',
  },
  {
    code: 'Truck.SemiTractor',
    mainCategory: 'Truck',
    labelEn: 'Semi-Tractor',
    labelDe: 'Sattelzugmaschine',
  },
  {
    code: 'Truck.Tanker',
    mainCategory: 'Truck',
    labelEn: 'Tanker',
    labelDe: 'Tankwagen',
  },
  {
    code: 'Truck.Tipper',
    mainCategory: 'Truck',
    labelEn: 'Tipper Truck',
    labelDe: 'Kipper',
  },
  {
    code: 'Truck.Refrigerated',
    mainCategory: 'Truck',
    labelEn: 'Refrigerated Truck',
    labelDe: 'Kühlwagen',
  },
  {
    code: 'Truck.Flatbed',
    mainCategory: 'Truck',
    labelEn: 'Flatbed Truck',
    labelDe: 'Pritschenwagen',
  },

  // Construction Machine subcategories
  {
    code: 'ConstructionMachine.MiniExcavator',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Mini Excavator',
    labelDe: 'Minibagger',
  },
  {
    code: 'ConstructionMachine.Excavator',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Excavator',
    labelDe: 'Bagger',
  },
  {
    code: 'ConstructionMachine.WheelLoader',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Wheel Loader',
    labelDe: 'Radlader',
  },
  {
    code: 'ConstructionMachine.Forklift',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Forklift',
    labelDe: 'Gabelstapler',
  },
  {
    code: 'ConstructionMachine.Bulldozer',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Bulldozer',
    labelDe: 'Planierraupe',
  },
  {
    code: 'ConstructionMachine.Crane',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Crane',
    labelDe: 'Kran',
  },
  {
    code: 'ConstructionMachine.Telehandler',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Telehandler',
    labelDe: 'Teleskoplader',
  },
  {
    code: 'ConstructionMachine.Compactor',
    mainCategory: 'ConstructionMachine',
    labelEn: 'Compactor',
    labelDe: 'Verdichter',
  },

  // Agricultural subcategories
  {
    code: 'Agricultural.Tractor',
    mainCategory: 'Agricultural',
    labelEn: 'Tractor',
    labelDe: 'Traktor',
  },
  {
    code: 'Agricultural.Harvester',
    mainCategory: 'Agricultural',
    labelEn: 'Harvester',
    labelDe: 'Mähdrescher',
  },
  {
    code: 'Agricultural.Sprayer',
    mainCategory: 'Agricultural',
    labelEn: 'Sprayer',
    labelDe: 'Feldspritze',
  },
  {
    code: 'Agricultural.Trailer',
    mainCategory: 'Agricultural',
    labelEn: 'Agricultural Trailer',
    labelDe: 'Anhänger',
  },
]

/**
 * Get subcategories for a specific main category
 */
export const getSubCategoriesForMainCategory = (
  mainCategory: MainCategory | ''
): VehicleSubCategory[] => {
  if (!mainCategory) return []
  return VEHICLE_SUB_CATEGORIES.filter(subCat => subCat.mainCategory === mainCategory)
}

/**
 * Get main categories list
 */
export const MAIN_CATEGORIES: Array<{
  value: MainCategory
  labelEn: string
  labelDe: string
}> = [
  { value: 'Car', labelEn: 'Cars', labelDe: 'Autos' },
  { value: 'Motorcycle', labelEn: 'Motorcycles', labelDe: 'Motorräder' },
  { value: 'Van', labelEn: 'Vans (up to 7.5t)', labelDe: 'Transporter (bis 7,5t)' },
  { value: 'Truck', labelEn: 'Trucks (over 7.5t)', labelDe: 'LKW (über 7,5t)' },
  {
    value: 'ConstructionMachine',
    labelEn: 'Construction Machinery',
    labelDe: 'Baumaschinen',
  },
  {
    value: 'Agricultural',
    labelEn: 'Agricultural Machinery',
    labelDe: 'Landmaschinen',
  },
]

/**
 * Validate if a subcategory belongs to a main category
 */
export const isValidSubCategory = (
  mainCategory: MainCategory | '',
  subCategory: VehicleSubCategoryCode | ''
): boolean => {
  if (!mainCategory || !subCategory) return true
  const subCat = VEHICLE_SUB_CATEGORIES.find(sc => sc.code === subCategory)
  return subCat ? subCat.mainCategory === mainCategory : false
}
