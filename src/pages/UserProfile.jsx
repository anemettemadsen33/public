import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import twoFactorService from '../services/twoFactor';
import emailService from '../services/email';

const UserProfile = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    avatar: user?.avatar || '',
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    priceAlerts: true,
    newListings: true,
    savedSearches: true,
    language: 'en',
    currency: 'USD',
    distanceUnit: 'miles',
  });

  // 2FA state
  const [twoFASetup, setTwoFASetup] = useState({
    enabled: false,
    showSetup: false,
    secret: null,
    qrCode: null,
    backupCodes: [],
    verificationCode: '',
  });

  useEffect(() => {
    if (user?.id) {
      const isEnabled = twoFactorService.is2FAEnabled(user.id);
      if (isEnabled !== twoFASetup.enabled) {
        setTwoFASetup(prev => ({
          ...prev,
          enabled: isEnabled,
        }));
      }
    }
  }, [user, twoFASetup.enabled]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update user in auth context
      const updatedUser = {
        ...user,
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        phone: profileData.phone,
      };
      login(updatedUser);

      // Send confirmation email
      emailService.sendEmail({
        to: profileData.email,
        subject: 'Profile Updated Successfully',
        template: 'profile_updated',
        data: { name: profileData.firstName },
      });

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleGenerate2FA = async () => {
    try {
      const result = await twoFactorService.generateSecret(user.id, user.email);
      setTwoFASetup(prev => ({
        ...prev,
        showSetup: true,
        secret: result.secret,
        qrCode: result.qrCode,
        backupCodes: result.backupCodes,
      }));
    } catch (_error) {
      console.error('Error generating 2FA:', _error);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const result = await twoFactorService.enable2FA(user.id, twoFASetup.verificationCode);
      if (result.success) {
        setTwoFASetup(prev => ({
          ...prev,
          enabled: true,
          showSetup: false,
          verificationCode: '',
        }));
        alert('2FA enabled successfully!');
      } else {
        alert(result.error || 'Invalid verification code');
      }
    } catch (error) {
      alert('Failed to enable 2FA');
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt('Enter your 2FA code to disable:');
    if (!code) return;

    try {
      const result = await twoFactorService.disable2FA(user.id, code);
      if (result.success) {
        setTwoFASetup(prev => ({ ...prev, enabled: false }));
        alert('2FA disabled successfully');
      } else {
        alert(result.error || 'Invalid verification code');
      }
    } catch (_error) {
      alert('Failed to disable 2FA');
    }
  };

  const tabs = [
    { id: 'profile', label: t('profile.tabs.profile', 'Profile'), icon: '👤' },
    { id: 'preferences', label: t('profile.tabs.preferences', 'Preferences'), icon: '⚙️' },
    { id: 'security', label: t('profile.tabs.security', 'Security'), icon: '🔒' },
    { id: 'saved', label: t('profile.tabs.saved', 'Saved Vehicles'), icon: '❤️' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('profile.title', 'My Profile')}
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('profile.personalInfo', 'Personal Information')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">{t('profile.firstName', 'First Name')}</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">{t('profile.lastName', 'Last Name')}</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">{t('profile.email', 'Email')}</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">{t('profile.phone', 'Phone')}</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">{t('profile.address', 'Address')}</label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">{t('profile.city', 'City')}</label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">{t('profile.state', 'State')}</label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                onChange={handleProfileChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn-primary disabled:opacity-50"
            >
              {isSaving ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
            </button>
            {saveSuccess && (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('common.saved', 'Saved!')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('profile.notificationPreferences', 'Notification Preferences')}
          </h2>

          <div className="space-y-4">
            {Object.entries(preferences).map(([key, value]) => (
              typeof value === 'boolean' && (
                <label key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-gray-100 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handlePreferenceChange(key)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              )
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('profile.securitySettings', 'Security Settings')}
          </h2>

          {/* 2FA Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              {twoFASetup.enabled ? (
                <button onClick={handleDisable2FA} className="btn-outline text-red-600">
                  Disable
                </button>
              ) : (
                <button onClick={handleGenerate2FA} className="btn-primary">
                  Enable
                </button>
              )}
            </div>

            {/* 2FA Setup Modal */}
            {twoFASetup.showSetup && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-4">
                <h4 className="font-semibold mb-4">Setup Two-Factor Authentication</h4>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Scan this QR code with your authenticator app:
                  </p>
                  <div className="bg-white p-4 inline-block rounded">
                    <div className="text-sm font-mono break-all">{twoFASetup.qrCode}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Or enter this code manually:
                  </p>
                  <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm">
                    {twoFASetup.secret}
                  </code>
                </div>

                <div className="mb-4">
                  <label className="label">Enter verification code:</label>
                  <input
                    type="text"
                    value={twoFASetup.verificationCode}
                    onChange={(e) => setTwoFASetup(prev => ({ ...prev, verificationCode: e.target.value }))}
                    className="input-field"
                    placeholder="000000"
                    maxLength="6"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Backup Codes (save these!):</p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                    {twoFASetup.backupCodes.map((code, idx) => (
                      <div key={idx} className="font-mono text-sm">{code}</div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleEnable2FA} className="btn-primary">
                    Verify & Enable
                  </button>
                  <button
                    onClick={() => setTwoFASetup(prev => ({ ...prev, showSetup: false }))}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {twoFASetup.enabled && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center text-green-800 dark:text-green-400">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Two-Factor Authentication is enabled
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Vehicles Tab */}
      {activeTab === 'saved' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('profile.savedVehicles', 'Saved Vehicles')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved vehicles will appear here...
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
