import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const KYCVerification = ({ onComplete }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState('pending') // pending, in_progress, approved, rejected
  const [uploadedDoc, setUploadedDoc] = useState(null)
  const [uploadedSelfie, setUploadedSelfie] = useState(null)

  const handleDocUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedDoc(URL.createObjectURL(file))
    }
  }

  const handleSelfieUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedSelfie(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    setStatus('in_progress')
    // Simulate verification process
    setTimeout(() => {
      setStatus('approved')
      onComplete?.()
    }, 3000)
  }

  const getStatusConfig = () => {
    const configs = {
      pending: {
        label: t('kyc.pending', 'Pending'),
        color: 'bg-yellow-500',
        icon: '⏳',
      },
      in_progress: {
        label: t('kyc.inProgress', 'In Progress'),
        color: 'bg-blue-500',
        icon: '🔄',
      },
      approved: {
        label: t('kyc.approved', 'Approved'),
        color: 'bg-green-500',
        icon: '✅',
      },
      rejected: {
        label: t('kyc.rejected', 'Rejected'),
        color: 'bg-red-500',
        icon: '❌',
      },
    }
    return configs[status] || configs.pending
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{t('kyc.title', 'Identity Verification')}</h2>
          <p className="text-primary-100">
            {t('kyc.subtitle', 'Verify your identity to unlock premium features')}
          </p>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('kyc.verificationStatus', 'Verification Status')}
            </span>
            <span
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${statusConfig.color}`}
            >
              <span>{statusConfig.icon}</span>
              {statusConfig.label}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${statusConfig.color}`}
              initial={{ width: '0%' }}
              animate={{
                width: status === 'pending' ? '0%' : status === 'in_progress' ? '50%' : '100%',
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="p-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-8">
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
                      ? t('kyc.upload', 'Upload')
                      : stepNum === 2
                        ? t('kyc.selfie', 'Selfie')
                        : t('kyc.confirm', 'Confirm')}
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
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('kyc.step1Title', 'Upload Identity Document')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t(
                    'kyc.step1Desc',
                    "Upload a clear photo of your ID card, passport, or driver's license"
                  )}
                </p>

                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDocUpload}
                    className="hidden"
                    id="doc-upload"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer">
                    {uploadedDoc ? (
                      <div className="space-y-3">
                        <img
                          src={uploadedDoc}
                          alt="Document"
                          className="max-h-40 mx-auto rounded"
                        />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          ✅ {t('kyc.documentUploaded', 'Document uploaded successfully')}
                        </p>
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
                          {t('kyc.clickToUpload', 'Click to upload or drag and drop')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                <button
                  onClick={() => setStep(2)}
                  disabled={!uploadedDoc}
                  className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.continue', 'Continue')}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('kyc.step2Title', 'Take a Selfie')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('kyc.step2Desc', 'Take a selfie holding your document next to your face')}
                </p>

                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleSelfieUpload}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer">
                    {uploadedSelfie ? (
                      <div className="space-y-3">
                        <img
                          src={uploadedSelfie}
                          alt="Selfie"
                          className="max-h-40 mx-auto rounded"
                        />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          ✅ {t('kyc.selfieUploaded', 'Selfie uploaded successfully')}
                        </p>
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
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('kyc.takeSelfie', 'Click to take a selfie')}
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 btn-secondary">
                    {t('common.back', 'Back')}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!uploadedSelfie}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.continue', 'Continue')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('kyc.step3Title', 'Review & Submit')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('kyc.step3Desc', 'Please review your information before submitting')}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {t('kyc.document', 'Document')}
                    </p>
                    <img src={uploadedDoc} alt="Document" className="w-full rounded" />
                  </div>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {t('kyc.selfie', 'Selfie')}
                    </p>
                    <img src={uploadedSelfie} alt="Selfie" className="w-full rounded" />
                  </div>
                </div>

                {status === 'approved' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6 text-center mb-6"
                  >
                    <div className="text-6xl mb-3">✅</div>
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                      {t('kyc.verified', 'Verified!')}
                    </h4>
                    <p className="text-green-700 dark:text-green-400">
                      {t('kyc.verifiedDesc', 'Your identity has been successfully verified')}
                    </p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={status !== 'pending'}
                    className="flex-1 btn-secondary disabled:opacity-50"
                  >
                    {t('common.back', 'Back')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={status !== 'pending'}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'in_progress' && (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {status === 'pending'
                      ? t('kyc.submit', 'Submit for Verification')
                      : status === 'in_progress'
                        ? t('kyc.verifying', 'Verifying...')
                        : t('common.done', 'Done')}
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

export default KYCVerification
