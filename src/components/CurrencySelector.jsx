import { useState, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'

const currencies = [
  { code: 'RON', symbol: 'lei', flag: '🇷🇴', name: 'Romanian Leu' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'CHF', symbol: 'CHF', flag: '🇨🇭', name: 'Swiss Franc' },
]

const CurrencySelector = ({ onCurrencyChange }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  const handleCurrencyChange = currency => {
    setSelectedCurrency(currency)
    onCurrencyChange?.(currency)
    // Save to localStorage
    localStorage.setItem('selectedCurrency', JSON.stringify(currency))
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
          <span className="text-lg">{selectedCurrency.flag}</span>
          <span className="font-semibold">{selectedCurrency.code}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-1 py-1">
            {currencies.map(currency => (
              <Menu.Item key={currency.code}>
                {({ active }) => (
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => handleCurrencyChange(currency)}
                    className={`${active ? 'bg-primary-50 dark:bg-primary-900/20' : ''} ${
                      selectedCurrency.code === currency.code
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                        : 'text-gray-900 dark:text-gray-100'
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors`}
                  >
                    <span className="text-lg mr-3">{currency.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{currency.code}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {currency.name}
                      </div>
                    </div>
                    {selectedCurrency.code === currency.code && (
                      <svg
                        className="w-5 h-5 text-primary-600 dark:text-primary-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </motion.button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// Helper function to format price with selected currency
export const formatCurrency = (amount, currencyCode = 'RON') => {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0]

  // Exchange rates (example - in production, fetch from API)
  const rates = {
    RON: 1,
    EUR: 0.2,
    USD: 0.22,
    GBP: 0.17,
    CHF: 0.19,
  }

  const convertedAmount = amount * rates[currencyCode]

  try {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedAmount)
  } catch {
    // Fallback if currency not supported
    return `${currency.symbol}${convertedAmount.toFixed(0)}`
  }
}

export default CurrencySelector
