import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const KPICard = ({ title, value, change, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
        <div className="text-3xl">{icon}</div>
      </div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}
      >
        {change >= 0 ? '↗' : '↘'}
        {Math.abs(change)}%
      </div>
    </div>
    <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
    <p className="text-3xl font-bold">{value.toLocaleString()}</p>
  </motion.div>
)

const KPIDashboard = () => {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState('week') // week, month, year

  // Mock KPI data (in production, fetch from API)
  const kpiData = {
    views: 1234,
    viewsChange: 12.5,
    clicks: 456,
    clicksChange: 8.3,
    saves: 89,
    savesChange: -2.1,
    leads: 23,
    leadsChange: 15.7,
  }

  // Performance data for chart
  const performanceData = [
    { date: 'Mon', views: 180, clicks: 45, saves: 12, leads: 3 },
    { date: 'Tue', views: 220, clicks: 58, saves: 15, leads: 5 },
    { date: 'Wed', views: 195, clicks: 52, saves: 11, leads: 4 },
    { date: 'Thu', views: 245, clicks: 68, saves: 18, leads: 6 },
    { date: 'Fri', views: 210, clicks: 55, saves: 14, leads: 4 },
    { date: 'Sat', views: 165, clicks: 38, saves: 9, leads: 2 },
    { date: 'Sun', views: 145, clicks: 35, saves: 8, leads: 1 },
  ]

  // Top 3 listings
  const topListings = [
    { id: 1, title: 'BMW X5 2020', views: 345, clicks: 89, saves: 23, leads: 8 },
    { id: 2, title: 'Audi A4 2019', views: 298, clicks: 76, saves: 19, leads: 6 },
    { id: 3, title: 'Mercedes C-Class 2021', views: 267, clicks: 68, saves: 17, leads: 5 },
  ]

  // Traffic sources
  const trafficSources = [
    { name: 'Direct', value: 35, color: '#3b82f6' },
    { name: 'Search', value: 28, color: '#10b981' },
    { name: 'Social', value: 22, color: '#f59e0b' },
    { name: 'Referral', value: 15, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.kpi', 'Performance Dashboard')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('dashboard.subtitle', 'Monitor your listings performance')}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t(`dashboard.${range}`, range.charAt(0).toUpperCase() + range.slice(1))}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t('dashboard.views', 'Total Views')}
          value={kpiData.views}
          change={kpiData.viewsChange}
          icon="👁️"
          color="from-blue-500 to-blue-600"
        />
        <KPICard
          title={t('dashboard.clicks', 'Total Clicks')}
          value={kpiData.clicks}
          change={kpiData.clicksChange}
          icon="🖱️"
          color="from-cyan-500 to-cyan-600"
        />
        <KPICard
          title={t('dashboard.saves', 'Saved')}
          value={kpiData.saves}
          change={kpiData.savesChange}
          icon="💝"
          color="from-pink-500 to-pink-600"
        />
        <KPICard
          title={t('dashboard.leads', 'Leads Generated')}
          value={kpiData.leads}
          change={kpiData.leadsChange}
          icon="📧"
          color="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.performance', 'Performance Meter')}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t('dashboard.views', 'Views')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t('dashboard.clicks', 'Clicks')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t('dashboard.leads', 'Leads')}
              </span>
            </div>
          </div>
        </div>

        {/* Traffic Sources Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.trafficSources', 'Traffic Sources')}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {trafficSources.map(source => (
              <div key={source.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: source.color }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{source.name}</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white ml-auto">
                  {source.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Listings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dashboard.topListings', 'Top 3 Performing Listings')}
        </h3>
        <div className="space-y-3">
          {topListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                  index === 0
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                    : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}
              >
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{listing.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>👁️</span>
                    <span>{listing.views}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>🖱️</span>
                    <span>{listing.clicks}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>💝</span>
                    <span>{listing.saves}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>📧</span>
                    <span>{listing.leads}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {((listing.clicks / listing.views) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">CTR</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {((kpiData.clicks / kpiData.views) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.avgCTR', 'Avg. CTR')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {((kpiData.leads / kpiData.clicks) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.conversionRate', 'Conversion Rate')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">2.5m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.avgTime', 'Avg. Time on Page')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {((kpiData.saves / kpiData.views) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.saveRate', 'Save Rate')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KPIDashboard
