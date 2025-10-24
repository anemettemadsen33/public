import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompare } from '../context/CompareContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { compareList } = useCompare();
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">🚗 AutoMarket</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/dealers"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.dealers')}
            </Link>
            <Link
              to="/compare"
              className="relative text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.compare')}
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>
          </div>

          {/* Language Selector */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'en' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('ro')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'ro' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              RO
            </button>
            <button
              onClick={() => changeLanguage('de')}
              className={`px-2 py-1 text-sm rounded ${
                currentLang === 'de' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              DE
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
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
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/dealers"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.dealers')}
            </Link>
            <Link
              to="/compare"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.compare')} {compareList.length > 0 && `(${compareList.length})`}
            </Link>
            <div className="flex space-x-2 px-3 py-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('ro')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'ro' ? 'bg-primary-600 text-white' : 'bg-gray-100'
                }`}
              >
                RO
              </button>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'de' ? 'bg-primary-600 text-white' : 'bg-gray-100'
                }`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
