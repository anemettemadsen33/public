import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const DailyMissions = () => {
  const { t } = useTranslation()
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('dailyMissions')
    if (saved) {
      const data = JSON.parse(saved)
      // Check if missions are from today
      const today = new Date().toDateString()
      if (data.date === today) {
        return data.missions
      }
    }
    // Generate new missions for today
    return [
      {
        id: 'view_3_vehicles',
        title: t('missions.view3', 'View 3 Vehicles'),
        description: t('missions.view3Desc', 'Browse and view at least 3 different vehicles'),
        icon: '👀',
        progress: 0,
        target: 3,
        xp: 15,
        completed: false,
      },
      {
        id: 'save_vehicle',
        title: t('missions.saveVehicle', 'Save a Vehicle'),
        description: t('missions.saveVehicleDesc', 'Add a vehicle to your favorites'),
        icon: '💝',
        progress: 0,
        target: 1,
        xp: 10,
        completed: false,
      },
      {
        id: 'search',
        title: t('missions.search', 'Perform a Search'),
        description: t('missions.searchDesc', 'Use the search function to find vehicles'),
        icon: '🔍',
        progress: 0,
        target: 1,
        xp: 5,
        completed: false,
      },
      {
        id: 'compare',
        title: t('missions.compare', 'Compare Vehicles'),
        description: t('missions.compareDesc', 'Add vehicles to comparison'),
        icon: '⚖️',
        progress: 0,
        target: 2,
        xp: 20,
        completed: false,
      },
    ]
  })

  const [showReward, setShowReward] = useState(null)

  useEffect(() => {
    // Save missions to localStorage
    const data = {
      date: new Date().toDateString(),
      missions: missions,
    }
    localStorage.setItem('dailyMissions', JSON.stringify(data))
  }, [missions])

  const updateMissionProgress = (missionId, increment = 1) => {
    setMissions(prevMissions =>
      prevMissions.map(mission => {
        if (mission.id === missionId && !mission.completed) {
          const newProgress = Math.min(mission.progress + increment, mission.target)
          const isCompleted = newProgress >= mission.target

          if (isCompleted && !mission.completed) {
            // Show reward animation
            setShowReward(mission)
            setTimeout(() => setShowReward(null), 3000)

            // Award XP (this would integrate with gamification system)
            if (window.gamification) {
              // Award bonus XP
            }
          }

          return {
            ...mission,
            progress: newProgress,
            completed: isCompleted,
          }
        }
        return mission
      })
    )
  }

  // Expose API for other components to update mission progress
  useEffect(() => {
    window.updateMissionProgress = updateMissionProgress
    return () => {
      delete window.updateMissionProgress
    }
  })

  const completedMissions = missions.filter(m => m.completed).length
  const totalMissions = missions.length
  const totalXP = missions.reduce((sum, m) => sum + (m.completed ? m.xp : 0), 0)
  const possibleXP = missions.reduce((sum, m) => sum + m.xp, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Reward Notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl shadow-2xl p-6 min-w-[300px]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-2"
              >
                {showReward.icon}
              </motion.div>
              <h3 className="text-xl font-bold">{t('missions.completed', 'Mission Completed!')}</h3>
              <p className="text-lg font-semibold mt-1">{showReward.title}</p>
              <p className="text-sm mt-2">+{showReward.xp} XP</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            {t('missions.dailyMissions', 'Daily Missions')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('missions.subtitle', 'Complete missions to earn XP')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {completedMissions}/{totalMissions}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t('missions.completed', 'Completed')}
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('missions.todayProgress', "Today's Progress")}
          </span>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            {totalXP} / {possibleXP} XP
          </span>
        </div>
        <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / totalMissions) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-full rounded-full"
          />
        </div>
      </div>

      {/* Mission Cards */}
      <div className="space-y-3">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              mission.completed
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{mission.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{mission.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mission.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      +{mission.xp} XP
                    </div>
                    {mission.completed && (
                      <div className="text-green-600 dark:text-green-400 text-xs font-semibold mt-1">
                        ✓ {t('missions.done', 'Done')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {t('missions.progress', 'Progress')}: {mission.progress}/{mission.target}
                    </span>
                    <span>{Math.round((mission.progress / mission.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        mission.completed
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : 'bg-gradient-to-r from-primary-400 to-primary-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Completed Celebration */}
      {completedMissions === totalMissions && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg text-center"
        >
          <div className="text-6xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('missions.allCompleted', 'All Missions Completed!')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {t('missions.comeBackTomorrow', 'Come back tomorrow for new missions')}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default DailyMissions
