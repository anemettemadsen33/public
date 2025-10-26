import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Leaderboard = () => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('week') // week, month, all-time
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Simulate fetching leaderboard data
    const mockUsers = [
      { id: 1, name: 'Alex M.', avatar: '👨‍💼', points: 2450, level: 5, badge: '👑' },
      { id: 2, name: 'Maria S.', avatar: '👩‍💼', points: 2380, level: 5, badge: '⭐' },
      { id: 3, name: 'Ion P.', avatar: '👨‍🔧', points: 2120, level: 4, badge: '🏆' },
      { id: 4, name: 'Elena D.', avatar: '👩‍🎓', points: 1890, level: 4, badge: '🌟' },
      { id: 5, name: 'Andrei V.', avatar: '👨‍💻', points: 1650, level: 3, badge: '🎯' },
      { id: 6, name: 'Diana C.', avatar: '👩‍🎨', points: 1420, level: 3, badge: '🚀' },
      { id: 7, name: 'Mihai R.', avatar: '👨‍🏫', points: 1280, level: 3, badge: '💎' },
      { id: 8, name: 'Ana B.', avatar: '👩‍⚕️', points: 1150, level: 2, badge: '✨' },
      { id: 9, name: 'Cristian F.', avatar: '👨‍🎨', points: 980, level: 2, badge: '🎨' },
      { id: 10, name: 'Laura G.', avatar: '👩‍🔬', points: 850, level: 2, badge: '🔥' },
    ]

    // Use a timeout to avoid setState during render
    const timer = setTimeout(() => {
      setUsers(mockUsers)
    }, 0)

    return () => clearTimeout(timer)
  }, [period])

  const getRankColor = rank => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600' // Gold
    if (rank === 2) return 'from-gray-300 to-gray-500' // Silver
    if (rank === 3) return 'from-orange-400 to-orange-600' // Bronze
    return 'from-gray-200 to-gray-400' // Default
  }

  const getRankIcon = rank => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <span className="text-3xl">🏆</span>
          {t('leaderboard.title', 'Leaderboard')}
        </h2>
        <p className="text-primary-100">{t('leaderboard.subtitle', 'Top users this period')}</p>
      </div>

      {/* Period Selector */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === 'week'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t('leaderboard.thisWeek', 'This Week')}
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === 'month'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t('leaderboard.thisMonth', 'This Month')}
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === 'all-time'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t('leaderboard.allTime', 'All Time')}
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6">
        {/* Top 3 - Special Display */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {users.slice(0, 3).map((user, index) => {
            const rank = index + 1
            // Display order: 2nd, 1st, 3rd for podium effect
            const displayOrder = rank === 1 ? 1 : rank === 2 ? 0 : 2
            const actualUser = rank === 1 ? users[0] : rank === 2 ? users[1] : users[2]

            return (
              <motion.div
                key={actualUser.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: displayOrder * 0.1 }}
                className={`text-center ${displayOrder === 1 ? 'order-2' : displayOrder === 0 ? 'order-1' : 'order-3'}`}
              >
                <div className={`relative inline-block ${displayOrder === 1 ? 'scale-110' : ''}`}>
                  <div className="text-6xl mb-2">{actualUser.avatar}</div>
                  <div
                    className={`absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(rank === 1 ? 1 : rank === 2 ? 2 : 3)} flex items-center justify-center text-white font-bold shadow-lg text-lg`}
                  >
                    {getRankIcon(rank === 1 ? 1 : rank === 2 ? 2 : 3)}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mt-2">{actualUser.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {actualUser.points.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">XP</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t('leaderboard.level', 'Level')} {actualUser.level}
                  </span>
                  <span className="text-sm">{actualUser.badge}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Rest of the leaderboard */}
        <div className="space-y-2">
          {users.slice(3).map((user, index) => {
            const rank = index + 4
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 3) * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
                  #{rank}
                </div>
                <div className="text-4xl">{user.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {t('leaderboard.level', 'Level')} {user.level}
                    </span>
                    <span>•</span>
                    <span>{user.badge}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600 dark:text-primary-400">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Your Rank (if not in top 10) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center font-bold text-white">
              #15
            </div>
            <div className="text-4xl">👤</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {t('leaderboard.you', 'You')}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('leaderboard.level', 'Level')} 2
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary-600 dark:text-primary-400">720</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-center text-gray-600 dark:text-gray-400">
            {t('leaderboard.keepGoing', 'Keep earning XP to climb the leaderboard!')}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Leaderboard
