import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

/**
 * Sortable Vehicle Card for Drag & Drop
 */
const SortableVehicleCard = ({ vehicle, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: vehicle.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute top-2 left-2 z-10 cursor-move bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
        title="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(vehicle.id)}
        className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
        title="Remove from comparison"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Vehicle Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        <img
          src={vehicle.image || '/placeholder-car.jpg'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            €{vehicle.price?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Vehicle Comparison Component with Drag & Drop
 */
const EnhancedComparison = ({ initialVehicles = [] }) => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState(initialVehicles.slice(0, 4)); // Max 4 vehicles
  const [aiScores, setAiScores] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag end event
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setVehicles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  /**
   * Remove vehicle from comparison
   */
  const removeVehicle = (vehicleId) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  /**
   * Calculate AI score for a vehicle
   */
  const calculateAIScore = (vehicle) => {
    if (aiScores[vehicle.id]) {
      return aiScores[vehicle.id];
    }

    let score = 50; // Base score

    // Price to value ratio
    const avgPrice = vehicles.reduce((sum, v) => sum + (v.price || 0), 0) / vehicles.length;
    if (vehicle.price < avgPrice * 0.9) {
      score += 10; // Good value
    } else if (vehicle.price > avgPrice * 1.1) {
      score -= 5; // Premium price
    }

    // Mileage
    if (vehicle.mileage < 50000) {
      score += 15;
    } else if (vehicle.mileage < 100000) {
      score += 10;
    } else if (vehicle.mileage > 200000) {
      score -= 10;
    }

    // Age
    const currentYear = new Date().getFullYear();
    const age = currentYear - (vehicle.year || currentYear);
    if (age <= 2) {
      score += 15;
    } else if (age <= 5) {
      score += 10;
    } else if (age > 10) {
      score -= 10;
    }

    // Condition
    if (vehicle.condition === 'New') {
      score += 10;
    } else if (vehicle.condition === 'Used - Excellent') {
      score += 5;
    }

    // Fuel type (eco-friendly bonus)
    if (vehicle.fuelType === 'Electric') {
      score += 15;
    } else if (vehicle.fuelType === 'Hybrid') {
      score += 10;
    }

    // Features count
    if (vehicle.features && vehicle.features.length > 15) {
      score += 10;
    } else if (vehicle.features && vehicle.features.length > 10) {
      score += 5;
    }

    // Cap score at 0-100
    score = Math.max(0, Math.min(100, score));

    setAiScores((prev) => ({ ...prev, [vehicle.id]: score }));
    return score;
  };

  /**
   * Get score color
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  /**
   * Comparison criteria
   */
  const comparisonCriteria = [
    { key: 'year', label: 'Year', format: (v) => v },
    { key: 'mileage', label: 'Mileage', format: (v) => `${v?.toLocaleString()} km` },
    { key: 'fuelType', label: 'Fuel Type', format: (v) => v },
    { key: 'transmission', label: 'Transmission', format: (v) => v },
    { key: 'horsePower', label: 'Horse Power', format: (v) => `${v} HP` },
    { key: 'engineCapacity', label: 'Engine', format: (v) => `${v} cm³` },
    { key: 'bodyType', label: 'Body Type', format: (v) => v },
    { key: 'color', label: 'Color', format: (v) => v },
    { key: 'condition', label: 'Condition', format: (v) => v },
  ];

  /**
   * Find best value for a criterion
   */
  const findBestValue = (key) => {
    if (!vehicles.length) return null;

    const numericKeys = ['year', 'horsePower'];
    const lowerIsBetter = ['mileage'];

    const values = vehicles.map((v) => v[key]).filter((v) => v != null);
    if (!values.length) return null;

    if (numericKeys.includes(key)) {
      return Math.max(...values.map((v) => parseInt(v, 10) || 0));
    }
    if (lowerIsBetter.includes(key)) {
      return Math.min(...values.map((v) => parseInt(v, 10) || 0));
    }

    return null;
  };

  /**
   * Check if value is the best
   */
  const isBestValue = (vehicle, key) => {
    const bestValue = findBestValue(key);
    if (bestValue === null) return false;
    return parseInt(vehicle[key], 10) === bestValue;
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('compare.noVehicles') || 'No vehicles to compare'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('compare.addVehicles') || 'Add vehicles from the listing page to start comparing'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🔄 {t('compare.title') || 'Vehicle Comparison'} ({vehicles.length}/4)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 Drag vehicles to reorder • Click ✕ to remove
        </p>
      </div>

      {/* Draggable Vehicle Cards */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={vehicles.map((v) => v.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <SortableVehicleCard key={vehicle.id} vehicle={vehicle} onRemove={removeVehicle} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* AI Scores */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          🤖 AI Value Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => {
            const score = calculateAIScore(vehicle);
            return (
              <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {vehicle.brand} {vehicle.model}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Specification
                </th>
                {vehicles.map((vehicle) => (
                  <th key={vehicle.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {vehicle.brand} {vehicle.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {comparisonCriteria.map((criterion) => (
                <tr key={criterion.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {criterion.label}
                  </td>
                  {vehicles.map((vehicle) => {
                    const value = vehicle[criterion.key];
                    const isBest = isBestValue(vehicle, criterion.key);
                    return (
                      <td key={vehicle.id} className="px-6 py-4 text-center">
                        <span
                          className={`text-sm ${
                            isBest
                              ? 'font-bold text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {value ? criterion.format(value) : 'N/A'}
                          {isBest && ' ⭐'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Differences Highlight */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          ⚡ Key Differences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Newest:</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {vehicles.sort((a, b) => (b.year || 0) - (a.year || 0))[0]?.brand}{' '}
              {vehicles.sort((a, b) => (b.year || 0) - (a.year || 0))[0]?.model} ({vehicles[0]?.year})
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Lowest Mileage:</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {vehicles.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))[0]?.brand}{' '}
              {vehicles.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))[0]?.model} (
              {vehicles.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))[0]?.mileage?.toLocaleString()} km)
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Best Value:</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {vehicles.sort((a, b) => calculateAIScore(b) - calculateAIScore(a))[0]?.brand}{' '}
              {vehicles.sort((a, b) => calculateAIScore(b) - calculateAIScore(a))[0]?.model} (Score:{' '}
              {calculateAIScore(vehicles.sort((a, b) => calculateAIScore(b) - calculateAIScore(a))[0])})
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Highest Power:</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {vehicles.sort((a, b) => (b.horsePower || 0) - (a.horsePower || 0))[0]?.brand}{' '}
              {vehicles.sort((a, b) => (b.horsePower || 0) - (a.horsePower || 0))[0]?.model} (
              {vehicles.sort((a, b) => (b.horsePower || 0) - (a.horsePower || 0))[0]?.horsePower} HP)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedComparison;
