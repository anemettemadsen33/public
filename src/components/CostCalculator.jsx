import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Cost Calculator Component
 * Calculates ownership costs including taxes, insurance, fuel, etc.
 */
const CostCalculator = ({ vehicle }) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    purchasePrice: vehicle?.price || 0,
    year: vehicle?.year || new Date().getFullYear(),
    engineCapacity: vehicle?.engineCapacity || 2000,
    fuelType: vehicle?.fuelType || 'Petrol',
    location: 'București',
    annualMileage: 15000,
    financingTerm: 0, // 0 = cash purchase
    downPayment: 0,
    interestRate: 7.5,
  });

  const [results, setResults] = useState(null);

  // Romanian counties for tax calculation
  const counties = [
    'București', 'Cluj', 'Timiș', 'Iași', 'Constanța', 'Brașov', 'Sibiu',
    'Prahova', 'Argeș', 'Dolj', 'Bihor', 'Bacău', 'Mureș', 'Galați',
  ];

  // Fuel types
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];

  /**
   * Calculate road tax (Impozit auto)
   * Based on engine capacity and age
   */
  const calculateRoadTax = () => {
    const { engineCapacity, year } = inputs;
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // Tax per cm³ based on engine size
    let taxPerCm3;
    if (engineCapacity <= 1600) {
      taxPerCm3 = 0.7;
    } else if (engineCapacity <= 2000) {
      taxPerCm3 = 1.0;
    } else if (engineCapacity <= 2600) {
      taxPerCm3 = 1.5;
    } else if (engineCapacity <= 3000) {
      taxPerCm3 = 2.0;
    } else {
      taxPerCm3 = 2.5;
    }

    // Age reduction (50% reduction after 3 years)
    let ageMultiplier = 1.0;
    if (age >= 3) {
      ageMultiplier = 0.5;
    }

    const annualTax = Math.round(engineCapacity * taxPerCm3 * ageMultiplier);
    return Math.max(annualTax, 100); // Minimum 100 RON
  };

  /**
   * Calculate RCA (mandatory insurance)
   * Simplified calculation
   */
  const calculateRCA = () => {
    const { engineCapacity, fuelType } = inputs;

    let basePrice = 600; // RON

    // Adjust based on engine size
    if (engineCapacity > 2500) {
      basePrice += 400;
    } else if (engineCapacity > 2000) {
      basePrice += 200;
    }

    // Adjust based on fuel type
    if (fuelType === 'Diesel') {
      basePrice += 100;
    } else if (fuelType === 'Electric') {
      basePrice -= 200;
    }

    return Math.round(basePrice);
  };

  /**
   * Calculate CASCO (optional insurance)
   */
  const calculateCASCO = () => {
    const { purchasePrice } = inputs;
    // Typically 3-5% of vehicle value
    const percentage = 0.04;
    return Math.round(purchasePrice * percentage);
  };

  /**
   * Calculate annual fuel cost
   */
  const calculateFuelCost = () => {
    const { annualMileage, fuelType } = inputs;

    // Average consumption (L/100km)
    const consumptionMap = {
      Petrol: 8.0,
      Diesel: 6.5,
      Hybrid: 5.0,
      Electric: 0, // kWh instead
      LPG: 9.0,
    };

    // Fuel prices (RON/L or RON/kWh)
    const priceMap = {
      Petrol: 7.5,
      Diesel: 7.8,
      Hybrid: 6.5, // Averaged
      Electric: 0.7, // per kWh
      LPG: 3.5,
    };

    const consumption = consumptionMap[fuelType] || 7.0;
    const fuelPrice = priceMap[fuelType] || 7.0;

    let annualCost;
    if (fuelType === 'Electric') {
      // Electric: kWh/100km
      const kwhPer100km = 16; // Average
      annualCost = (annualMileage / 100) * kwhPer100km * fuelPrice;
    } else {
      annualCost = (annualMileage / 100) * consumption * fuelPrice;
    }

    return Math.round(annualCost);
  };

  /**
   * Calculate annual maintenance cost
   */
  const calculateMaintenance = () => {
    const { year, purchasePrice } = inputs;
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // Newer cars: ~1-2% of value
    // Older cars: ~3-5% of value
    let percentage = 0.02;
    if (age > 5) {
      percentage = 0.03;
    }
    if (age > 10) {
      percentage = 0.05;
    }

    return Math.round(purchasePrice * percentage);
  };

  /**
   * Calculate financing costs
   */
  const calculateFinancing = () => {
    const { purchasePrice, financingTerm, downPayment, interestRate } = inputs;

    if (financingTerm === 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 };
    }

    const principal = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = financingTerm * 12;

    // Monthly payment formula
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment + downPayment),
    };
  };

  /**
   * Calculate all costs
   */
  const calculateCosts = () => {
    const roadTax = calculateRoadTax();
    const rca = calculateRCA();
    const casco = calculateCASCO();
    const fuel = calculateFuelCost();
    const maintenance = calculateMaintenance();
    const financing = calculateFinancing();

    const annualOperatingCost = roadTax + rca + casco + fuel + maintenance;
    const monthlyOperatingCost = Math.round(annualOperatingCost / 12);

    setResults({
      roadTax,
      rca,
      casco,
      fuel,
      maintenance,
      financing,
      annualOperatingCost,
      monthlyOperatingCost,
    });
  };

  const formatCurrency = (amount, currency = 'RON') => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="cost-calculator bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        💰 {t('calculator.title') || 'Intelligent Cost Calculator'}
      </h2>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.purchasePrice') || 'Purchase Price'}
          </label>
          <input
            type="number"
            value={inputs.purchasePrice}
            onChange={(e) => setInputs({ ...inputs, purchasePrice: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.year') || 'Year'}
          </label>
          <input
            type="number"
            value={inputs.year}
            onChange={(e) => setInputs({ ...inputs, year: parseInt(e.target.value) || new Date().getFullYear() })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Engine Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.engineCapacity') || 'Engine Capacity (cm³)'}
          </label>
          <input
            type="number"
            value={inputs.engineCapacity}
            onChange={(e) => setInputs({ ...inputs, engineCapacity: parseInt(e.target.value) || 2000 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.fuelType') || 'Fuel Type'}
          </label>
          <select
            value={inputs.fuelType}
            onChange={(e) => setInputs({ ...inputs, fuelType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.location') || 'Location'}
          </label>
          <select
            value={inputs.location}
            onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>

        {/* Annual Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.annualMileage') || 'Annual Mileage (km)'}
          </label>
          <input
            type="number"
            value={inputs.annualMileage}
            onChange={(e) => setInputs({ ...inputs, annualMileage: parseInt(e.target.value) || 15000 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Financing Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.financingTerm') || 'Financing Term (years)'}
          </label>
          <select
            value={inputs.financingTerm}
            onChange={(e) => setInputs({ ...inputs, financingTerm: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="0">Cash Purchase</option>
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="4">4 Years</option>
            <option value="5">5 Years</option>
            <option value="7">7 Years</option>
          </select>
        </div>

        {/* Down Payment */}
        {inputs.financingTerm > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('calculator.downPayment') || 'Down Payment'}
            </label>
            <input
              type="number"
              value={inputs.downPayment}
              onChange={(e) => setInputs({ ...inputs, downPayment: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateCosts}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-8"
      >
        {t('calculator.calculate') || 'Calculate Costs'}
      </button>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Annual Costs Breakdown */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              📊 Annual Operating Costs
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Road Tax (Impozit auto):</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(results.roadTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">RCA (Mandatory Insurance):</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(results.rca)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">CASCO (Optional Insurance):</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(results.casco)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fuel:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(results.fuel)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Maintenance & Repairs:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(results.maintenance)}</span>
              </div>
              <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-gray-100">Total Annual Cost:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">
                    {formatCurrency(results.annualOperatingCost)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600 dark:text-gray-400">Monthly Average:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(results.monthlyOperatingCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Costs */}
          {inputs.financingTerm > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                💳 Financing Costs
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monthly Payment:</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-xl">
                    {formatCurrency(results.financing.monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Interest:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(results.financing.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Payment:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(results.financing.totalPayment)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Export Option */}
          <div className="flex gap-4">
            <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              📧 Email Results
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              📄 Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculator;
