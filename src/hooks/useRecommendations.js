import { usePreferencesStore } from '../store';
import { mockVehicles } from '../utils/mockData';

export const useRecommendations = () => {
  const { viewedVehicles, clickedFilters, savedVehicles } = usePreferencesStore();

  const getRecommendations = (currentVehicleId = null, limit = 4) => {
    // Get all vehicles except current one
    const availableVehicles = currentVehicleId
      ? mockVehicles.filter(v => v.id !== currentVehicleId)
      : mockVehicles;

    // Score each vehicle based on user preferences
    const scoredVehicles = availableVehicles.map(vehicle => {
      let score = 0;

      // Boost score for similar fuel types
      if (clickedFilters.fuelType && clickedFilters.fuelType.includes(vehicle.fuelType)) {
        score += 30;
      }

      // Boost score for similar transmission
      if (clickedFilters.transmission && clickedFilters.transmission.includes(vehicle.transmission)) {
        score += 20;
      }

      // Boost score for similar price range (viewed vehicles)
      if (viewedVehicles.length > 0) {
        const viewedPrices = viewedVehicles
          .map(id => mockVehicles.find(v => v.id === id))
          .filter(Boolean)
          .map(v => v.price);
        
        if (viewedPrices.length > 0) {
          const avgPrice = viewedPrices.reduce((a, b) => a + b, 0) / viewedPrices.length;
          const priceDiff = Math.abs(vehicle.price - avgPrice);
          const priceScore = Math.max(0, 50 - (priceDiff / 1000)); // Closer price = higher score
          score += priceScore;
        }
      }

      // Boost score for similar categories
      const viewedCategories = viewedVehicles
        .map(id => mockVehicles.find(v => v.id === id))
        .filter(Boolean)
        .map(v => v.category);
      
      if (viewedCategories.includes(vehicle.category)) {
        score += 25;
      }

      // Boost score for popular vehicles (high views in our mock data)
      if (vehicle.featured) {
        score += 15;
      }

      // Add some randomness to avoid always showing the same recommendations
      score += Math.random() * 10;

      return { ...vehicle, score };
    });

    // Sort by score and return top recommendations
    return scoredVehicles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  const trackView = (vehicleId) => {
    usePreferencesStore.getState().addViewedVehicle(vehicleId);
  };

  const trackFilterUse = (filterType, value) => {
    usePreferencesStore.getState().trackFilterClick(filterType, value);
  };

  return {
    getRecommendations,
    trackView,
    trackFilterUse,
    viewedVehicles,
    savedVehicles,
  };
};

export default useRecommendations;
