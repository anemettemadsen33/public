import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const ImportWizard = ({ onComplete }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [importType, setImportType] = useState('upload') // upload, url
  const [fileType, setFileType] = useState('csv') // csv, xml
  const [uploadedFile, setUploadedFile] = useState(null)
  const [feedUrl, setFeedUrl] = useState('')
  const [fieldMapping, setFieldMapping] = useState({})
  const [previewData, setPreviewData] = useState([])

  // Available fields for mapping
  const targetFields = [
    { id: 'make', label: 'Make', required: true },
    { id: 'model', label: 'Model', required: true },
    { id: 'year', label: 'Year', required: true },
    { id: 'price', label: 'Price', required: true },
    { id: 'mileage', label: 'Mileage', required: false },
    { id: 'fuelType', label: 'Fuel Type', required: false },
    { id: 'transmission', label: 'Transmission', required: false },
    { id: 'color', label: 'Color', required: false },
    { id: 'description', label: 'Description', required: false },
    { id: 'images', label: 'Images', required: false },
  ]

  // Sample source fields (simulated from uploaded file)
  const sourceFields = [
    'car_brand',
    'car_model',
    'production_year',
    'selling_price',
    'km_driven',
    'fuel',
    'gearbox',
    'exterior_color',
    'notes',
    'photo_urls',
  ]

  const handleFileUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate parsing file and extracting sample data
      setTimeout(() => {
        setPreviewData([
          { car_brand: 'BMW', car_model: 'X5', production_year: '2020', selling_price: '45000' },
          { car_brand: 'Audi', car_model: 'A4', production_year: '2019', selling_price: '28000' },
        ])
      }, 1000)
    }
  }

  const handleFieldMap = (targetField, sourceField) => {
    setFieldMapping({
      ...fieldMapping,
      [targetField]: sourceField,
    })
  }

  const handleImport = () => {
    // Simulate import process
    onComplete?.()
  }

  const getMissingRequiredFields = () => {
    return targetFields
      .filter(field => field.required && !fieldMapping[field.id])
      .map(field => field.label)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{t('import.title', 'Import Listings')}</h2>
          <p className="text-primary-100">
            {t('import.subtitle', 'Import your vehicle listings from CSV, XML, or feed URL')}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900">
          {[1, 2, 3].map(stepNum => (
            <div key={stepNum} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= stepNum
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {stepNum}
                </motion.div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    step >= stepNum
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {stepNum === 1
                    ? t('import.step1', 'Upload/URL')
                    : stepNum === 2
                      ? t('import.step2', 'Map Fields')
                      : t('import.step3', 'Preview')}
                </span>
              </div>
              {stepNum < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > stepNum ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload/URL */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('import.chooseSource', 'Choose Import Source')}
                </h3>

                {/* Import Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setImportType('upload')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      importType === 'upload'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-primary-600 dark:text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('import.uploadFile', 'Upload File')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CSV, XML</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setImportType('url')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      importType === 'url'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-primary-600 dark:text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('import.feedUrl', 'Feed URL')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">HTTP/HTTPS</p>
                  </motion.button>
                </div>

                {/* Upload Area */}
                {importType === 'upload' && (
                  <div className="space-y-4">
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => setFileType('csv')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                          fileType === 'csv'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <svg
                          className="w-6 h-6 mx-auto mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        CSV
                      </button>
                      <button
                        onClick={() => setFileType('xml')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                          fileType === 'xml'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <svg
                          className="w-6 h-6 mx-auto mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        XML
                      </button>
                    </div>

                    <label className="block">
                      <input
                        type="file"
                        accept={fileType === 'csv' ? '.csv' : '.xml'}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer">
                        {uploadedFile ? (
                          <div className="space-y-3">
                            <svg
                              className="w-12 h-12 mx-auto text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              {uploadedFile.name}
                            </p>
                            <button
                              onClick={e => {
                                e.preventDefault()
                                setUploadedFile(null)
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              {t('common.remove', 'Remove')}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <svg
                              className="w-12 h-12 mx-auto text-gray-400 mb-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t('import.clickUpload', 'Click to upload or drag and drop')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {fileType.toUpperCase()} up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                )}

                {/* URL Input */}
                {importType === 'url' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('import.feedUrlLabel', 'Feed URL')}
                      </label>
                      <input
                        type="url"
                        value={feedUrl}
                        onChange={e => setFeedUrl(e.target.value)}
                        placeholder="https://example.com/feed.xml"
                        className="input-field"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('import.feedUrlHelp', 'Enter the URL of your XML or CSV feed')}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!uploadedFile && !feedUrl}
                  className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.continue', 'Continue')}
                </button>
              </motion.div>
            )}

            {/* Step 2: Field Mapping */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('import.mapFields', 'Map Your Fields')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('import.mapFieldsDesc', 'Match your file columns to our system fields')}
                </p>

                <div className="space-y-3 mb-6">
                  {targetFields.map(field => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      <div className="flex-1">
                        <select
                          value={fieldMapping[field.id] || ''}
                          onChange={e => handleFieldMap(field.id, e.target.value)}
                          className="input-field"
                        >
                          <option value="">{t('import.selectField', '-- Select Field --')}</option>
                          {sourceFields.map(sourceField => (
                            <option key={sourceField} value={sourceField}>
                              {sourceField}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Missing Fields Warning */}
                {getMissingRequiredFields().length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">
                          {t('import.missingFields', 'Missing Required Fields')}
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-400">
                          {t('import.pleaseMap', 'Please map:')}{' '}
                          {getMissingRequiredFields().join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 btn-secondary">
                    {t('common.back', 'Back')}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={getMissingRequiredFields().length > 0}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.continue', 'Continue')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preview & Confirm */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('import.preview', 'Preview Listings')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('import.previewDesc', 'Review your listings before import')}
                </p>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Make
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Model
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Year
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {previewData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 text-gray-900 dark:text-white">
                              {row.car_brand}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">
                              {row.car_model}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">
                              {row.production_year}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">
                              {row.selling_price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                        {t('import.ready', 'Ready to Import')}
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        {t('import.readyDesc', 'Found')} {previewData.length}{' '}
                        {t('import.listings', 'listings ready to import')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 btn-secondary">
                    {t('common.back', 'Back')}
                  </button>
                  <button onClick={handleImport} className="flex-1 btn-primary">
                    {t('import.importListings', 'Import Listings')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ImportWizard
