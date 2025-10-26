import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCompare } from '../context/CompareContext'
import { usePreferencesStore } from '../store'
import { formatPrice, formatMileage } from '../utils/helpers'

const CarCard = ({ vehicle, sponsored = false }) => {
  const { t } = useTranslation()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { isSaved, saveVehicle, unsaveVehicle } = usePreferencesStore()
  const [imageLoaded, setImageLoaded] = useState(false)

  const inCompare = isInCompare(vehicle.id)
  const saved = isSaved(vehicle.id)

  const handleCompareToggle = e => {
    e.preventDefault()
    if (inCompare) {
      removeFromCompare(vehicle.id)
    } else {
      addToCompare(vehicle)
    }
  }

  const handleSaveToggle = e => {
    e.preventDefault()
    if (saved) {
      unsaveVehicle(vehicle.id)
    } else {
      saveVehicle(vehicle)
    }
  }

  return (
    <motion.div
      className={`card overflow-hidden group relative ${
        sponsored
          ? 'ring-2 ring-premium-500 bg-gradient-to-br from-premium-50/30 to-white dark:from-premium-900/10 dark:to-gray-800'
          : ''
      }`}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={sponsored ? { boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)' } : {}}
    >
      {/* Image with Blur-up Loading */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Link to={`/vehicle/${vehicle.id}`}>
          {/* Low quality placeholder (simulated with blur) */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse" />
          )}

          <motion.img
            src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Sponsored Badge */}
        {sponsored && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute top-2 left-2 group/badge"
          >
            <span className="flex items-center gap-1 bg-gradient-to-r from-premium-400 to-premium-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg relative overflow-hidden">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Sponsored</span>
              <div
                className="absolute inset-0 bg-white/20 animate-pulse-slow"
                style={{ animationDuration: '2s' }}
              />
            </span>
            {/* Tooltip */}
            <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              Această mașină este sponsorizată de dealer
              <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
            </div>
          </motion.div>
        )}

        {/* Featured Badge */}
        {!sponsored && vehicle.featured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.button
            onClick={handleSaveToggle}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              saved
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={saved ? 'Remove from favorites' : 'Save to favorites'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-5 h-5"
              fill={saved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.button>

          <motion.button
            onClick={handleCompareToggle}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              inCompare
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={t('common.compare')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/vehicle/${vehicle.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{vehicle.year}</p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>{vehicle.power}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(vehicle.price)}
          </span>
          <Link to={`/vehicle/${vehicle.id}`} className="btn-primary text-sm py-2 px-4">
            {t('common.viewDetails')}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default CarCard
