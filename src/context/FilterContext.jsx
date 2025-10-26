import { createContext, useContext, useState } from 'react'

const FilterContext = createContext()

export const useFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider')
  }
  return context
}

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    fuelType: '',
    transmission: '',
    make: '',
    model: '',
    searchQuery: '',
    mainCategory: '',
    subCategory: '',
  })

  const [sortBy, setSortBy] = useState('newest')

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateFilters = newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      fuelType: '',
      transmission: '',
      make: '',
      model: '',
      searchQuery: '',
      mainCategory: '',
      subCategory: '',
    })
  }

  const setMainCategory = mainCategory => {
    setFilters(prev => ({
      ...prev,
      mainCategory,
      subCategory: '', // Reset subcategory when main category changes
    }))
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        sortBy,
        updateFilter,
        updateFilters,
        resetFilters,
        setMainCategory,
        setSortBy,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
