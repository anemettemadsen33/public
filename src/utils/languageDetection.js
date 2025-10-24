// Language detection utilities

/**
 * Detect user's preferred language from browser settings
 */
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Map browser language codes to our supported languages
  const langMap = {
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'ro': 'ro',
    'ro-RO': 'ro',
    'de': 'de',
    'de-DE': 'de',
    'de-AT': 'de',
    'de-CH': 'de',
  };
  
  // Try exact match first
  if (langMap[browserLang]) {
    return langMap[browserLang];
  }
  
  // Try language prefix (e.g., 'en' from 'en-US')
  const langPrefix = browserLang.split('-')[0];
  if (langMap[langPrefix]) {
    return langMap[langPrefix];
  }
  
  // Default to English
  return 'en';
};

/**
 * Detect if the language is RTL (Right-to-Left)
 */
export const isRTL = (lang) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(lang);
};

/**
 * Get user's country from timezone (approximate)
 */
export const getCountryFromTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Map timezones to countries (simplified)
  const timezoneMap = {
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Europe/Bucharest': 'RO',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Australia/Sydney': 'AU',
  };
  
  return timezoneMap[timezone] || 'Unknown';
};

/**
 * Apply RTL direction to document
 */
export const applyRTL = (isRTL) => {
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
};

/**
 * Get localized date format
 */
export const getLocalizedDate = (date, locale = 'en-US') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

/**
 * Get localized currency format
 */
export const getLocalizedCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Initialize language detection and auto-switching
 */
export const initLanguageDetection = (i18n) => {
  // Check if user has a saved language preference
  const savedLang = localStorage.getItem('i18nextLng');
  
  if (!savedLang) {
    // No saved preference, detect from browser
    const detectedLang = detectBrowserLanguage();
    i18n.changeLanguage(detectedLang);
    
    // Log detection for debugging
    console.log('Auto-detected language:', detectedLang);
    console.log('Browser language:', navigator.language);
    console.log('Timezone country:', getCountryFromTimezone());
  }
  
  // Apply RTL if needed
  const currentLang = i18n.language;
  applyRTL(isRTL(currentLang));
  
  // Listen for language changes to update RTL
  i18n.on('languageChanged', (lng) => {
    applyRTL(isRTL(lng));
  });
};

export default {
  detectBrowserLanguage,
  isRTL,
  getCountryFromTimezone,
  applyRTL,
  getLocalizedDate,
  getLocalizedCurrency,
  initLanguageDetection,
};
