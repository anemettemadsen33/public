# Vehicle Categories and Subcategories

This document provides a complete reference for vehicle categories and subcategories used in the Auto Marketplace application, based on mobile.de official category codes.

## Overview

The application supports hierarchical vehicle categorization with:

- **Main Categories**: Top-level vehicle types (Car, Motorcycle, Van, Truck, etc.)
- **Subcategories**: Specific vehicle subtypes within each main category

All category codes follow the mobile.de standard (e.g., `Car.Cabrio`, `Motorcycle.Touring`, `ConstructionMachine.MiniExcavator`).

## Main Categories

| Value                 | English Label          | German Label           | Description                          |
| --------------------- | ---------------------- | ---------------------- | ------------------------------------ |
| `Car`                 | Cars                   | Autos                  | Passenger cars and personal vehicles |
| `Motorcycle`          | Motorcycles            | Motorräder             | Two-wheeled motor vehicles           |
| `Van`                 | Vans (up to 7.5t)      | Transporter (bis 7,5t) | Light commercial vehicles            |
| `Truck`               | Trucks (over 7.5t)     | LKW (über 7,5t)        | Heavy commercial vehicles            |
| `ConstructionMachine` | Construction Machinery | Baumaschinen           | Construction equipment and machinery |
| `Agricultural`        | Agricultural Machinery | Landmaschinen          | Farming equipment and machinery      |

## Subcategories by Main Category

### 🚗 Car Subcategories

| Code              | English Label    | German Label       | Description                  |
| ----------------- | ---------------- | ------------------ | ---------------------------- |
| `Car.Cabrio`      | Convertible      | Cabrio             | Open-top or retractable roof |
| `Car.Limousine`   | Sedan            | Limousine          | Traditional four-door sedan  |
| `Car.Kombi`       | Station Wagon    | Kombi              | Extended cargo area          |
| `Car.SUV`         | SUV / Off-road   | SUV / Geländewagen | Sport utility vehicle        |
| `Car.Coupe`       | Coupé            | Coupé              | Two-door sports car          |
| `Car.SmallCar`    | Small Car        | Kleinwagen         | Compact city car             |
| `Car.OffRoad`     | Off-Road Vehicle | Geländewagen       | 4x4 capable vehicle          |
| `Car.SportsCar`   | Sports Car       | Sportwagen         | High-performance vehicle     |
| `Car.Transporter` | Transporter      | Transporter        | Small commercial vehicle     |

### 🏍️ Motorcycle Subcategories

| Code                      | English Label | German Label | Description                            |
| ------------------------- | ------------- | ------------ | -------------------------------------- |
| `Motorcycle.Touring`      | Touring       | Tourer       | Long-distance comfort bikes            |
| `Motorcycle.Chopper`      | Chopper       | Chopper      | Custom style motorcycles               |
| `Motorcycle.Cruiser`      | Cruiser       | Cruiser      | Laid-back riding position              |
| `Motorcycle.Bagger`       | Bagger        | Bagger       | Touring bikes with saddlebags          |
| `Motorcycle.Naked`        | Naked Bike    | Naked Bike   | Minimal bodywork sports bikes          |
| `Motorcycle.Enduro`       | Enduro        | Enduro       | Off-road capable motorcycles           |
| `Motorcycle.SportTouring` | Sport Touring | Sport-Tourer | Sport bikes with touring capability    |
| `Motorcycle.Scooter`      | Scooter       | Roller       | Step-through motorcycles               |
| `Motorcycle.Trial`        | Trial         | Trial        | Specialized off-road competition bikes |
| `Motorcycle.Quad`         | Quad/ATV      | Quad/ATV     | Four-wheeled all-terrain vehicles      |

### 🚐 Van Subcategories (up to 7.5t)

| Code              | English Label | German Label | Description                  |
| ----------------- | ------------- | ------------ | ---------------------------- |
| `Van.PanelVan`    | Panel Van     | Kastenwagen  | Enclosed cargo van           |
| `Van.Transporter` | Transporter   | Transporter  | Multi-purpose commercial van |
| `Van.MiniBus`     | Minibus       | Kleinbus     | Passenger transport van      |
| `Van.PickUp`      | Pick-up       | Pick-up      | Open cargo bed van           |
| `Van.BoxVan`      | Box Van       | Kofferwagen  | Large enclosed cargo area    |
| `Van.CamperVan`   | Camper Van    | Wohnmobil    | Recreational vehicle         |

### 🚚 Truck Subcategories (over 7.5t)

| Code                 | English Label      | German Label      | Description                      |
| -------------------- | ------------------ | ----------------- | -------------------------------- |
| `Truck.HeavyDuty`    | Heavy Duty Truck   | Schwere LKW       | Large cargo trucks               |
| `Truck.SemiTractor`  | Semi-Tractor       | Sattelzugmaschine | Truck tractor for trailers       |
| `Truck.Tanker`       | Tanker             | Tankwagen         | Liquid cargo transport           |
| `Truck.Tipper`       | Tipper Truck       | Kipper            | Dump truck                       |
| `Truck.Refrigerated` | Refrigerated Truck | Kühlwagen         | Temperature-controlled transport |
| `Truck.Flatbed`      | Flatbed Truck      | Pritschenwagen    | Open platform truck              |

### 🚜 Construction Machine Subcategories

| Code                                | English Label  | German Label  | Description                      |
| ----------------------------------- | -------------- | ------------- | -------------------------------- |
| `ConstructionMachine.MiniExcavator` | Mini Excavator | Minibagger    | Compact excavator (up to 6 tons) |
| `ConstructionMachine.Excavator`     | Excavator      | Bagger        | Full-size excavator              |
| `ConstructionMachine.WheelLoader`   | Wheel Loader   | Radlader      | Front-loading equipment          |
| `ConstructionMachine.Forklift`      | Forklift       | Gabelstapler  | Material handling equipment      |
| `ConstructionMachine.Bulldozer`     | Bulldozer      | Planierraupe  | Tracked dozer                    |
| `ConstructionMachine.Crane`         | Crane          | Kran          | Lifting equipment                |
| `ConstructionMachine.Telehandler`   | Telehandler    | Teleskoplader | Telescopic handler               |
| `ConstructionMachine.Compactor`     | Compactor      | Verdichter    | Soil compaction equipment        |

### 🌾 Agricultural Subcategories

| Code                     | English Label        | German Label | Description             |
| ------------------------ | -------------------- | ------------ | ----------------------- |
| `Agricultural.Tractor`   | Tractor              | Traktor      | Farm tractor            |
| `Agricultural.Harvester` | Harvester            | Mähdrescher  | Combine harvester       |
| `Agricultural.Sprayer`   | Sprayer              | Feldspritze  | Crop spraying equipment |
| `Agricultural.Trailer`   | Agricultural Trailer | Anhänger     | Farm trailer            |

## Usage in Code

### Importing

```typescript
import {
  MAIN_CATEGORIES,
  VEHICLE_SUB_CATEGORIES,
  getSubCategoriesForMainCategory,
  isValidSubCategory,
} from '@/utils/vehicleSubCategories'
```

### Getting Subcategories for a Main Category

```typescript
const subCategories = getSubCategoriesForMainCategory('Car')
// Returns all Car.* subcategories
```

### Using the Hook

```typescript
import { useVehicleSubCategories } from '@/hooks/useVehicleSubCategories'

function MyComponent() {
  const { mainCategories, subCategories } = useVehicleSubCategories('Car')
  // subCategories will contain all Car subcategories
}
```

### Validation

```typescript
import { validateVehicleCategory } from '@/utils/validationSchema'

const result = validateVehicleCategory({
  mainCategory: 'Car',
  subCategory: 'Car.SUV',
})

if (result.success) {
  // Valid combination
} else {
  // Invalid - subcategory doesn't belong to main category
}
```

## Filtering

The filtering system automatically filters vehicles by:

1. **Main Category**: When selected, shows only vehicles in that category
2. **Subcategory**: When selected (after main category), further filters to specific subcategory
3. **Cascade Reset**: Changing main category automatically resets subcategory

## Data Persistence

Both `mainCategory` and `subCategory` are persisted in localStorage via Zustand store, maintaining user preferences across sessions.

## References

- [mobile.de API Upload-Interface CSV](https://services.mobile.de/manual/upload-interface-csv_en.html)
- Source: `src/utils/vehicleSubCategories.ts`
- Hook: `src/hooks/useVehicleSubCategories.ts`
- Validation: `src/utils/validationSchema.ts`

## Notes

- Category codes are case-sensitive
- Subcategory selection is only available after main category selection
- Empty values are allowed (shows all vehicles)
- All codes follow mobile.de official naming conventions
