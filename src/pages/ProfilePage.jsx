import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * User Profile Page Component
 * Shows user information, listings, favorites, and reviews
 */
const ProfilePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data
  const user = {
    id: 1,
    name: 'Ion Popescu',
    email: 'ion.popescu@example.com',
    phone: '+40 721 234 567',
    avatar: 'https://ui-avatars.com/api/?name=Ion+Popescu&size=200',
    joinedDate: '2024-01-15',
    verified: true,
    memberLevel: 'Gold',
    stats: {
      listings: 12,
      sold: 8,
      favorites: 24,
      reviews: 15,
    },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'listings', label: 'My Listings', icon: '🚗' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end space-x-6 -mt-16">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
                {user.verified && (
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {user.email} • {user.phone}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        ⭐ {user.memberLevel} Member
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Member since {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {user.stats.listings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Active Listings
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {user.stats.sold}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sold
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {user.stats.favorites}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Favorites
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {user.stats.reviews}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'listings' && <ListingsTab />}
            {activeTab === 'favorites' && <FavoritesTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Overview Tab Component
 */
const OverviewTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Listed', item: 'BMW 320d', time: '2 hours ago', icon: '✅' },
              { action: 'Favorited', item: 'Audi A4', time: '5 hours ago', icon: '❤️' },
              { action: 'Reviewed', item: 'Mercedes C-Class', time: '1 day ago', icon: '⭐' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.action} <span className="font-semibold">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/listings/new"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                New Listing
              </span>
            </Link>
            <button className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Schedule Test Drive
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Listings Tab Component
 */
const ListingsTab = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          My Active Listings
        </h3>
        <Link
          to="/listings/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Listing
        </Link>
      </div>
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Your listings will appear here
      </div>
    </div>
  );
};

/**
 * Favorites Tab Component
 */
const FavoritesTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Saved Vehicles
      </h3>
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Your favorite vehicles will appear here
      </div>
    </div>
  );
};

/**
 * Reviews Tab Component
 */
const ReviewsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        My Reviews
      </h3>
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Your reviews will appear here
      </div>
    </div>
  );
};

/**
 * Settings Tab Component
 */
const SettingsTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Account Settings
      </h3>
      
      {/* Notification Settings */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notifications
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
            <input type="checkbox" className="rounded" />
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Privacy
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show profile to public</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show email address</span>
            <input type="checkbox" className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show phone number</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-4">
          Danger Zone
        </h4>
        <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
