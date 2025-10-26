import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

// Gamification store using localStorage
const getGamificationData = () => {
  const saved = localStorage.getItem('gamification')
  if (saved) {
    return JSON.parse(saved)
  }
  return {
    points: 0,
    level: 1,
    badges: [],
    achievements: [],
    stats: {
      vehiclesViewed: 0,
      vehiclesSaved: 0,
      vehiclesCompared: 0,
      searchesPerformed: 0,
      reviewsWritten: 0,
      messagesExchanged: 0,
      vehiclesListed: 0,
    },
  }
}

const saveGamificationData = data => {
  localStorage.setItem('gamification', JSON.stringify(data))
}

// Badge definitions
const BADGES = [
  {
    id: 'first_view',
    name: 'First Glance',
    description: 'View your first vehicle',
    icon: '👀',
    color: 'from-blue-400 to-blue-600',
    requirement: stats => stats.vehiclesViewed >= 1,
    points: 10,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'View 10 vehicles',
    icon: '🔍',
    color: 'from-purple-400 to-purple-600',
    requirement: stats => stats.vehiclesViewed >= 10,
    points: 50,
  },
  {
    id: 'car_enthusiast',
    name: 'Car Enthusiast',
    description: 'View 50 vehicles',
    icon: '🚗',
    color: 'from-green-400 to-green-600',
    requirement: stats => stats.vehiclesViewed >= 50,
    points: 100,
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Save 10 vehicles to favorites',
    icon: '💝',
    color: 'from-pink-400 to-pink-600',
    requirement: stats => stats.vehiclesSaved >= 10,
    points: 75,
  },
  {
    id: 'comparison_master',
    name: 'Comparison Master',
    description: 'Compare 5 different sets of vehicles',
    icon: '⚖️',
    color: 'from-yellow-400 to-yellow-600',
    requirement: stats => stats.vehiclesCompared >= 5,
    points: 60,
  },
  {
    id: 'search_guru',
    name: 'Search Guru',
    description: 'Perform 20 searches',
    icon: '🔎',
    color: 'from-cyan-400 to-cyan-600',
    requirement: stats => stats.searchesPerformed >= 20,
    points: 40,
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Write 5 reviews',
    icon: '✍️',
    color: 'from-orange-400 to-orange-600',
    requirement: stats => stats.reviewsWritten >= 5,
    points: 100,
  },
  {
    id: 'communicator',
    name: 'Communicator',
    description: 'Exchange 10 messages with dealers',
    icon: '💬',
    color: 'from-indigo-400 to-indigo-600',
    requirement: stats => stats.messagesExchanged >= 10,
    points: 80,
  },
  {
    id: 'expert_poster',
    name: '🌟 Expert Poster',
    description: 'List 10 vehicles',
    icon: '⭐',
    color: 'from-premium-400 to-premium-600',
    requirement: stats => stats.vehiclesListed >= 10,
    points: 150,
  },
]

// Level thresholds
const LEVELS = [
  { level: 1, minPoints: 0, name: 'Novice', icon: '🌱' },
  { level: 2, minPoints: 100, name: 'Enthusiast', icon: '🚗' },
  { level: 3, minPoints: 300, name: 'Expert', icon: '⭐' },
  { level: 4, minPoints: 600, name: 'Master', icon: '🏆' },
  { level: 5, minPoints: 1000, name: 'Legend', icon: '👑' },
]

const Gamification = ({ userId: _userId }) => {
  const { t } = useTranslation()
  const [data, setData] = useState(getGamificationData())
  const [showNewBadge, setShowNewBadge] = useState(null)

  // Calculate current level
  const currentLevel = LEVELS.reduce((acc, level) => {
    return data.points >= level.minPoints ? level : acc
  }, LEVELS[0])

  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1)
  const progressToNext = nextLevel
    ? ((data.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) *
      100
    : 100

  // Check for new badges
  useEffect(() => {
    BADGES.forEach(badge => {
      if (!data.badges.includes(badge.id) && badge.requirement(data.stats)) {
        // Award badge
        const newData = {
          ...data,
          badges: [...data.badges, badge.id],
          points: data.points + badge.points,
        }
        setData(newData)
        saveGamificationData(newData)
        setShowNewBadge(badge)

        // Hide badge notification after 5 seconds
        setTimeout(() => setShowNewBadge(null), 5000)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.stats])

  // Public methods to track achievements
  useEffect(() => {
    const gamificationAPI = {
      trackVehicleView: () => {
        setData(prev => {
          const newData = {
            ...prev,
            stats: { ...prev.stats, vehiclesViewed: prev.stats.vehiclesViewed + 1 },
            points: prev.points + 5,
          }
          saveGamificationData(newData)
          return newData
        })
      },
      trackVehicleSave: () => {
        setData(prev => {
          const newData = {
            ...prev,
            stats: { ...prev.stats, vehiclesSaved: prev.stats.vehiclesSaved + 1 },
            points: prev.points + 10,
          }
          saveGamificationData(newData)
          return newData
        })
      },
      trackVehicleCompare: () => {
        setData(prev => {
          const newData = {
            ...prev,
            stats: { ...prev.stats, vehiclesCompared: prev.stats.vehiclesCompared + 1 },
            points: prev.points + 15,
          }
          saveGamificationData(newData)
          return newData
        })
      },
      trackSearch: () => {
        setData(prev => {
          const newData = {
            ...prev,
            stats: { ...prev.stats, searchesPerformed: prev.stats.searchesPerformed + 1 },
            points: prev.points + 3,
          }
          saveGamificationData(newData)
          return newData
        })
      },
      trackReview: () => {
        setData(prev => {
          const newData = {
            ...prev,
            stats: { ...prev.stats, reviewsWritten: prev.stats.reviewsWritten + 1 },
            points: prev.points + 20,
          }
          saveGamificationData(newData)
          return newData
        })
      },
      trackMessage: () => {
        setData(prev => {
          const newData = {
            ...prev,
            stats: { ...prev.stats, messagesExchanged: prev.stats.messagesExchanged + 1 },
            points: prev.points + 8,
          }
          saveGamificationData(newData)
          return newData
        })
      },
    }

    window.gamification = gamificationAPI

    return () => {
      delete window.gamification
    }
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* New Badge Notification */}
      {showNewBadge && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-2xl p-6 min-w-[300px]"
        >
          <div className="text-center">
            <div className="text-6xl mb-2">{showNewBadge.icon}</div>
            <h3 className="text-xl font-bold">
              {t('gamification.newBadge', 'New Badge Unlocked!')}
            </h3>
            <p className="text-lg font-semibold mt-1">{showNewBadge.name}</p>
            <p className="text-sm mt-1">{showNewBadge.description}</p>
            <p className="text-xs mt-2">
              +{showNewBadge.points} {t('gamification.points', 'points')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('gamification.title', 'Your Achievements')}
        </h2>
        <div className="text-right">
          <div className="text-3xl">{currentLevel.icon}</div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {currentLevel.name}
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Level {currentLevel.level}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {data.points} {t('gamification.points', 'points')}
            {nextLevel && ` / ${nextLevel.minPoints}`}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full"
          />
        </div>
        {nextLevel && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {nextLevel.minPoints - data.points}{' '}
            {t('gamification.pointsToNextLevel', 'points to next level')}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {data.stats.vehiclesViewed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('gamification.viewed', 'Viewed')}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {data.stats.vehiclesSaved}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('gamification.saved', 'Saved')}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {data.stats.searchesPerformed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('gamification.searches', 'Searches')}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {data.stats.reviewsWritten}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('gamification.reviews', 'Reviews')}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {t('gamification.badges', 'Badges')} ({data.badges.length}/{BADGES.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map(badge => {
            const unlocked = data.badges.includes(badge.id)
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: unlocked ? 1.05 : 1 }}
                className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                  unlocked
                    ? 'border-transparent bg-gradient-to-br shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 grayscale'
                }`}
                style={
                  unlocked
                    ? {
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      }
                    : {}
                }
              >
                {unlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10`} />
                )}
                <div className="relative z-10">
                  <div className="text-4xl text-center mb-2">{badge.icon}</div>
                  <div className="text-xs font-semibold text-center text-gray-900 dark:text-white">
                    {badge.name}
                  </div>
                  <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                    {badge.description}
                  </div>
                  {unlocked && (
                    <div
                      className={`text-xs text-center font-bold mt-2 bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}
                    >
                      +{badge.points} pts
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Gamification
