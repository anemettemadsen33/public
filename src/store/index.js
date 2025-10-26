import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Zustand store for filters - much simpler than Context API
export const useFilterStore = create(
  persist(
    set => ({
      // Filter state
      filters: {
        priceMin: '',
        priceMax: '',
        yearMin: '',
        yearMax: '',
        mileageMax: '',
        fuelType: '',
        transmission: '',
        search: '',
        mainCategory: '',
        subCategory: '',
      },
      sortBy: 'newest',

      // Actions
      setFilter: (key, value) =>
        set(state => ({
          filters: { ...state.filters, [key]: value },
        })),

      setFilters: newFilters => set({ filters: newFilters }),

      resetFilters: () =>
        set({
          filters: {
            priceMin: '',
            priceMax: '',
            yearMin: '',
            yearMax: '',
            mileageMax: '',
            fuelType: '',
            transmission: '',
            search: '',
            mainCategory: '',
            subCategory: '',
          },
        }),

      // Set main category and reset subcategory when changed
      setMainCategory: mainCategory =>
        set(state => ({
          filters: {
            ...state.filters,
            mainCategory,
            subCategory: '', // Reset subcategory when main category changes
          },
        })),

      setSortBy: sortBy => set({ sortBy }),
    }),
    {
      name: 'filter-storage', // localStorage key
      partialize: state => ({
        filters: state.filters,
        sortBy: state.sortBy,
      }),
    }
  )
)

// Zustand store for comparison
export const useCompareStore = create(
  persist(
    (set, get) => ({
      compareList: [],

      addToCompare: vehicle => {
        const { compareList } = get()
        if (compareList.length >= 3) {
          return false // Max 3 vehicles
        }
        if (compareList.find(v => v.id === vehicle.id)) {
          return false // Already in list
        }
        set({ compareList: [...compareList, vehicle] })
        return true
      },

      removeFromCompare: vehicleId =>
        set(state => ({
          compareList: state.compareList.filter(v => v.id !== vehicleId),
        })),

      clearCompare: () => set({ compareList: [] }),

      isInCompare: vehicleId => {
        const { compareList } = get()
        return compareList.some(v => v.id === vehicleId)
      },
    }),
    {
      name: 'compare-storage',
    }
  )
)

// Zustand store for user preferences and recommendations
export const usePreferencesStore = create(
  persist(
    (set, get) => ({
      viewedVehicles: [],
      clickedFilters: {},
      savedVehicles: [],

      addViewedVehicle: vehicleId =>
        set(state => ({
          viewedVehicles: [vehicleId, ...state.viewedVehicles.filter(id => id !== vehicleId)].slice(
            0,
            50
          ), // Keep last 50 views
        })),

      trackFilterClick: (filterType, value) =>
        set(state => ({
          clickedFilters: {
            ...state.clickedFilters,
            [filterType]: [...(state.clickedFilters[filterType] || []), value].slice(-10), // Keep last 10 per filter type
          },
        })),

      saveVehicle: vehicle =>
        set(state => ({
          savedVehicles: [vehicle, ...state.savedVehicles.filter(v => v.id !== vehicle.id)],
        })),

      unsaveVehicle: vehicleId =>
        set(state => ({
          savedVehicles: state.savedVehicles.filter(v => v.id !== vehicleId),
        })),

      isSaved: vehicleId => {
        const { savedVehicles } = get()
        return savedVehicles.some(v => v.id === vehicleId)
      },
    }),
    {
      name: 'preferences-storage',
    }
  )
)
