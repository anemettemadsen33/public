import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import TwoFactorSetup from '../auth/TwoFactorSetup'

const UserProfile = () => {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    avatar: user?.avatar || '',
    bio: '',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
    },
  })

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem('userProfile')
      if (saved) {
        const savedProfile = JSON.parse(saved)
        setProfile(prev => ({ ...prev, ...savedProfile }))
      }
    }
    loadProfile()
  }, [])

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    setEditing(false)
    setMessage({ type: 'success', text: 'Profile updated successfully!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleAvatarUpload = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-primary-100">Manage your account settings and preferences</p>
        </div>

        {message.text && (
          <div
            className={`p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'}`}
          >
            {message.text}
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={
                  profile.avatar ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name)
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-600"
              />
              {editing && (
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
              <div className="flex gap-2 mt-2">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Security Settings
            </h3>
            <TwoFactorSetup
              onSuccess={result =>
                setMessage({
                  type: 'success',
                  text: result.enabled ? '2FA enabled!' : '2FA disabled!',
                })
              }
              onError={error => setMessage({ type: 'error', text: error })}
            />
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
