import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const PricePrediction = ({ currentPrice }) => {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)

  // Simulate AI prediction (in production, this would call an ML API)
  const predictedPrice = currentPrice ? currentPrice * 0.95 : 0 // 5% below asking price
  const minPrice = predictedPrice * 0.9
  const maxPrice = predictedPrice * 1.1

  const priceDifference = currentPrice - predictedPrice
  const percentDifference = ((priceDifference / currentPrice) * 100).toFixed(1)

  const isOverpriced = priceDifference > 0
  const isUnderpriced = priceDifference < 0
  const isFairPrice = Math.abs(percentDifference) < 5

  // Historical price trend (simulated sparkline data)
  const historicalPrices = [
    currentPrice * 1.15,
    currentPrice * 1.12,
    currentPrice * 1.08,
    currentPrice * 1.05,
    currentPrice * 1.02,
    currentPrice,
  ]

  const getPriceRecommendation = () => {
    if (isFairPrice) {
      return {
        status: 'fair',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: '✅',
        message: t('pricing.fair', 'Fair market price'),
      }
    } else if (isOverpriced) {
      return {
        status: 'high',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        icon: '📈',
        message: t('pricing.high', 'Above market average'),
      }
    } else {
      return {
        status: 'low',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: '🎯',
        message: t('pricing.goodDeal', 'Great deal!'),
      }
    }
  }

  const recommendation = getPriceRecommendation()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header with Smart Badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {t('pricing.aiPrediction', 'AI Price Analysis')}
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            Smart
          </span>
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          {showDetails ? t('common.hideDetails', 'Hide') : t('common.showDetails', 'Details')}
        </button>
      </div>

      {/* Price Range Visualization */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            {t('pricing.marketRange', 'Market Range')}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
              minPrice
            )}{' '}
            -{' '}
            {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
              maxPrice
            )}
          </span>
        </div>

        {/* Price Bar */}
        <div className="relative h-12 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 dark:from-green-900/30 dark:via-yellow-900/30 dark:to-red-900/30 rounded-lg overflow-hidden">
          {/* Optimal Price Marker */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="absolute top-1/2 transform -translate-y-1/2"
            style={{ left: '50%' }}
          >
            <div className="relative">
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded shadow-lg whitespace-nowrap">
                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
                  predictedPrice
                )}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-primary-600"></div>
              </div>
              <div className="w-1 h-12 bg-primary-600" />
            </div>
          </motion.div>

          {/* Current Price Marker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 transform -translate-y-1/2"
            style={{ left: `${50 + percentDifference / 2}%` }}
          >
            <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white ring-4 ring-white dark:ring-gray-800" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{t('pricing.low', 'Low')}</span>
          <span>{t('pricing.optimal', 'Optimal')}</span>
          <span>{t('pricing.high', 'High')}</span>
        </div>
      </div>

      {/* Recommendation */}
      <div
        className={`${recommendation.bgColor} ${recommendation.borderColor} border-2 rounded-lg p-4 mb-4`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{recommendation.icon}</span>
          <div className="flex-1">
            <h4 className={`font-semibold ${recommendation.color} mb-1`}>
              {recommendation.message}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {isOverpriced && (
                <span>
                  {t('pricing.overpricedDesc', 'This vehicle is priced')}{' '}
                  <strong>{Math.abs(percentDifference)}%</strong>{' '}
                  {t('pricing.aboveMarket', 'above market average')}
                </span>
              )}
              {isUnderpriced && (
                <span>
                  {t('pricing.underpricedDesc', 'This vehicle is priced')}{' '}
                  <strong>{Math.abs(percentDifference)}%</strong>{' '}
                  {t('pricing.belowMarket', 'below market average - great opportunity!')}
                </span>
              )}
              {isFairPrice && (
                <span>
                  {t(
                    'pricing.fairDesc',
                    'This price is within normal market range based on similar vehicles'
                  )}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tooltip Info */}
      <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p>
          {t(
            'pricing.aiTooltip',
            'AI sugerează acest preț pe baza istoricului de vânzări și caracteristicilor vehiculului'
          )}
        </p>
      </div>

      {/* Sparkline Chart - Historical Trend */}
      <div className="mb-4">
        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t('pricing.priceHistory', 'Price History (Last 6 Months)')}
        </h5>
        <div className="flex items-end h-16 gap-1">
          {historicalPrices.map((price, index) => {
            const height = (price / Math.max(...historicalPrices)) * 100
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                title={new Intl.NumberFormat('ro-RO', {
                  style: 'currency',
                  currency: 'RON',
                }).format(price)}
              />
            )
          })}
        </div>
      </div>

      {/* Detailed Analytics */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('pricing.avgPrice', 'Average Market Price')}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
                  predictedPrice
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('pricing.yourPrice', 'Your Price')}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
                  currentPrice
                )}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('pricing.basedOn', 'Based on:')}
            </h6>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• {t('pricing.factor1', 'Analysis of 150+ similar vehicles')}</li>
              <li>• {t('pricing.factor2', 'Current market demand trends')}</li>
              <li>• {t('pricing.factor3', 'Vehicle condition and mileage')}</li>
              <li>• {t('pricing.factor4', 'Seasonal pricing patterns')}</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PricePrediction
