import { useMemo } from 'react'
import {
  MainCategory,
  getSubCategoriesForMainCategory,
  MAIN_CATEGORIES,
} from '../utils/vehicleSubCategories'

/**
 * Hook for managing vehicle subcategories
 * Returns subcategories filtered by main category
 */
export const useVehicleSubCategories = (mainCategory: MainCategory | '') => {
  const subCategories = useMemo(() => {
    return getSubCategoriesForMainCategory(mainCategory)
  }, [mainCategory])

  const mainCategories = useMemo(() => MAIN_CATEGORIES, [])

  return {
    subCategories,
    mainCategories,
  }
}
