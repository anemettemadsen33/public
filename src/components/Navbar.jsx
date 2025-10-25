import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompare } from '../context/CompareContext';
import { useTheme } from '../context/ThemeContext';
import { useCompareStore } from '../store';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { compareList } = useCompare();
  const { compareList: zustandCompareList } = useCompareStore();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  const categories = [
    { path: '/cars', label: t('nav.cars') },
    { path: '/trucks', label: t('nav.trucks') },
    { path: '/vans', label: t('nav.vans') },
    { path: '/motorcycles', label: t('nav.motorcycles') },
    { path: '/electric', label: t('nav.electric') },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">🚗 AutoMarket</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/dealers"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.dealers')}
            </Link>
            <Link
              to="/compare"
              className="relative text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.compare')}
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 dark:bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>
          </div>

          {/* Theme Toggle & Language Selector */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Language Buttons */}
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'en' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('ro')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'ro' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              RO
            </button>
            <button
              onClick={() => changeLanguage('de')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'de' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'ar' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              AR
            </button>
            <button
              onClick={() => changeLanguage('he')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'he' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              HE
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/dealers"
              className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.dealers')}
            </Link>
            <Link
              to="/compare"
              className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.compare')} {compareList.length > 0 && `(${compareList.length})`}
            </Link>
            
            {/* Theme toggle in mobile */}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            
            <div className="flex flex-wrap gap-2 px-3 py-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('ro')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'ro' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                RO
              </button>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'de' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                AR
              </button>
              <button
                onClick={() => changeLanguage('he')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'he' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                HE
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
