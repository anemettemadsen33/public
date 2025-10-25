import { useState, useEffect } from 'react'

const Gamification = () => {
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    achievements: [],
    badges: [],
  })

  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    const loadStats = () => {
      const saved = localStorage.getItem('gamificationStats')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setUserStats(parsed)
        } catch {
          // Ignore parse errors
        }
      } else {
        const defaultStats = {
          points: 150,
          level: 2,
          achievements: ['first_visit', 'first_search'],
          badges: ['explorer', 'searcher'],
        }
        setUserStats(defaultStats)
        localStorage.setItem('gamificationStats', JSON.stringify(defaultStats))
      }

      // Demo leaderboard
      setLeaderboard([
        { rank: 1, name: 'You', points: 150, level: 2 },
        { rank: 2, name: 'Sarah K.', points: 420, level: 4 },
        { rank: 3, name: 'Mike R.', points: 380, level: 4 },
        { rank: 4, name: 'Anna L.', points: 290, level: 3 },
        { rank: 5, name: 'Tom W.', points: 210, level: 3 },
      ])
    }
    loadStats()
  }, [])

  const achievements = [
    {
      id: 'first_visit',
      name: 'First Visit',
      description: 'Visited the marketplace',
      icon: '🎉',
      points: 10,
    },
    {
      id: 'first_search',
      name: 'Search Explorer',
      description: 'Performed first search',
      icon: '🔍',
      points: 20,
    },
    {
      id: 'first_favorite',
      name: 'Favorite Collector',
      description: 'Saved first favorite',
      icon: '❤️',
      points: 15,
    },
    {
      id: 'comparison_master',
      name: 'Comparison Master',
      description: 'Compared 3 vehicles',
      icon: '⚖️',
      points: 30,
    },
    {
      id: 'test_drive',
      name: 'Test Driver',
      description: 'Booked a test drive',
      icon: '🚗',
      points: 50,
    },
    {
      id: 'deal_maker',
      name: 'Deal Maker',
      description: 'Completed a purchase',
      icon: '💰',
      points: 100,
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Shared 5 listings',
      icon: '🦋',
      points: 25,
    },
    {
      id: 'review_writer',
      name: 'Review Writer',
      description: 'Left a review',
      icon: '⭐',
      points: 40,
    },
  ]

  const badges = [
    { id: 'explorer', name: 'Explorer', description: 'Viewed 10+ vehicles', icon: '🗺️' },
    { id: 'searcher', name: 'Active Searcher', description: 'Performed 20+ searches', icon: '🔍' },
    { id: 'saver', name: 'Smart Saver', description: 'Saved 5+ favorites', icon: '💾' },
    { id: 'negotiator', name: 'Negotiator', description: 'Contacted 3+ dealers', icon: '🤝' },
    { id: 'early_bird', name: 'Early Bird', description: 'Visited before 8 AM', icon: '🐦' },
    { id: 'night_owl', name: 'Night Owl', description: 'Visited after 10 PM', icon: '🦉' },
  ]

  const levelProgress = ((userStats.points % 100) / 100) * 100
  const nextLevelPoints = userStats.level * 100 - userStats.points

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h1 className="text-3xl font-bold">🏆 Achievements & Rewards</h1>
          <p className="text-purple-100">
            Level up by exploring vehicles and engaging with the platform
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <div className="text-4xl font-bold">{userStats.points}</div>
              <div className="text-blue-100">Total Points</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
              <div className="text-4xl font-bold">Level {userStats.level}</div>
              <div className="text-purple-100">{nextLevelPoints} points to next level</div>
              <div className="mt-2 bg-purple-700/50 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-lg text-white">
              <div className="text-4xl font-bold">{userStats.badges.length}</div>
              <div className="text-pink-100">Badges Earned</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map(achievement => {
                const earned = userStats.achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      earned
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-400'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {achievement.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </div>
                    <div className="mt-2 text-yellow-600 dark:text-yellow-400 font-bold">
                      {achievement.points} pts
                    </div>
                    {earned && (
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                        ✓ Unlocked
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map(badge => {
                const earned = userStats.badges.includes(badge.id)
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg text-center transition-all ${
                      earned
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20'
                        : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {badge.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🏅 Leaderboard
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Level
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {leaderboard.map(entry => (
                    <tr
                      key={entry.rank}
                      className={entry.name === 'You' ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                    >
                      <td className="px-4 py-3">
                        <span className={`text-2xl ${entry.rank <= 3 ? 'font-bold' : ''}`}>
                          {entry.rank === 1
                            ? '🥇'
                            : entry.rank === 2
                              ? '🥈'
                              : entry.rank === 3
                                ? '🥉'
                                : entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {entry.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        Level {entry.level}
                      </td>
                      <td className="px-4 py-3 font-bold text-primary-600 dark:text-primary-400">
                        {entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gamification
