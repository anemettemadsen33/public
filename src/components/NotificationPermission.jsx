import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import pushNotificationService from '../services/pushNotifications';

const NotificationPermission = () => {
  const { t } = useTranslation();
  const [permission, setPermission] = useState(pushNotificationService.getPermission());
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (!pushNotificationService.isSupported()) {
      return;
    }

    // Show prompt after 10 seconds if not already granted/denied
    if (permission === 'default') {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const handleEnableNotifications = async () => {
    try {
      await pushNotificationService.subscribe();
      setPermission('granted');
      setIsSubscribed(true);
      setShowPrompt(false);
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      setPermission('denied');
    }
  };

  const handleDisableNotifications = async () => {
    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    }
  };

  if (!pushNotificationService.isSupported()) {
    return null;
  }

  // Don't show if permission is denied
  if (permission === 'denied') {
    return null;
  }

  return (
    <>
      {/* Notification Prompt Banner */}
      {showPrompt && permission === 'default' && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('notifications.enableTitle', 'Get notified about new vehicles')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t(
                  'notifications.enableDescription',
                  'Receive instant alerts when vehicles matching your preferences become available.'
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleEnableNotifications}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {t('notifications.enable', 'Enable Notifications')}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  {t('notifications.later', 'Maybe Later')}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings (shown when granted) */}
      {permission === 'granted' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <div>
                <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                  {t('notifications.enabled', 'Notifications Enabled')}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  {t('notifications.enabledDescription', "You'll receive alerts for new matches")}
                </div>
              </div>
            </div>
            {isSubscribed && (
              <button
                onClick={handleDisableNotifications}
                className="text-xs text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 underline"
              >
                {t('notifications.disable', 'Disable')}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPermission;
