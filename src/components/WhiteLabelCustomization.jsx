import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const PreviewCard = ({ customization, templates }) => {
  const selectedTemplate = templates.find(t => t.id === customization.template) || templates[3]
  const { t } = useTranslation()

  return (
    <div
      className="rounded-xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: selectedTemplate.colors.bg }}
    >
      {/* Header */}
      <div
        className="p-6"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          color: '#ffffff',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          {customization.logoUrl ? (
            <img src={customization.logoUrl} alt="Logo" className="w-12 h-12 rounded" />
          ) : (
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center text-2xl">
              🚗
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{customization.brandName}</h2>
            <p className="text-sm opacity-90">{t('whitelabel.preview', 'Preview')}</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{customization.headline}</h1>
        <p className="opacity-90">{customization.subheadline}</p>
      </div>

      {/* Content */}
      <div className="p-6" style={{ color: selectedTemplate.colors.text }}>
        {/* Sample Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
          <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-4xl">🚙</span>
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-1" style={{ color: selectedTemplate.colors.text }}>
              BMW X5 2020
            </h3>
            <p
              className="text-sm mb-3"
              style={{ color: selectedTemplate.colors.text, opacity: 0.7 }}
            >
              Premium SUV with low mileage
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold" style={{ color: customization.primaryColor }}>
                €45,000
              </span>
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: customization.primaryColor }}
              >
                {t('common.viewDetails', 'View Details')}
              </button>
            </div>
          </div>
        </div>

        {/* Sample Button */}
        <button
          className="w-full py-3 rounded-lg text-white font-semibold"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          }}
        >
          {t('whitelabel.sampleButton', 'Browse All Vehicles')}
        </button>
      </div>
    </div>
  )
}

const WhiteLabelCustomization = ({ onSave }) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('personalizare')

  const [customization, setCustomization] = useState({
    primaryColor: '#0284c7',
    secondaryColor: '#7c3aed',
    logoUrl: '',
    brandName: 'My Dealership',
    headline: 'Find Your Dream Car',
    subheadline: 'Premium selection of quality vehicles',
    template: 'modern', // light, dark, classic, modern
  })

  const templates = [
    {
      id: 'light',
      name: 'Light',
      icon: '☀️',
      colors: {
        primary: '#0284c7',
        secondary: '#06b6d4',
        bg: '#ffffff',
        text: '#1f2937',
      },
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: '🌙',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        bg: '#111827',
        text: '#f9fafb',
      },
    },
    {
      id: 'classic',
      name: 'Classic',
      icon: '🎩',
      colors: {
        primary: '#991b1b',
        secondary: '#92400e',
        bg: '#fef3c7',
        text: '#78350f',
      },
    },
    {
      id: 'modern',
      name: 'Modern',
      icon: '✨',
      colors: {
        primary: '#7c3aed',
        secondary: '#ec4899',
        bg: '#f9fafb',
        text: '#111827',
      },
    },
  ]

  const handleTemplateSelect = template => {
    setCustomization({
      ...customization,
      template: template.id,
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
    })
  }

  const handleSave = () => {
    onSave?.(customization)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            {t('whitelabel.title', 'White-Label Customization')}
          </h2>
          <p className="text-primary-100">
            {t('whitelabel.subtitle', 'Customize your dealership portal')}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('personalizare')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'personalizare'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t('whitelabel.customization', 'Personalizare')}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t('whitelabel.preview', 'Preview')}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'personalizare' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Settings Panel */}
              <div className="space-y-6">
                {/* Brand Name */}
                <div>
                  <label className="label">{t('whitelabel.brandName', 'Brand Name')}</label>
                  <input
                    type="text"
                    value={customization.brandName}
                    onChange={e =>
                      setCustomization({ ...customization, brandName: e.target.value })
                    }
                    className="input-field"
                    placeholder="My Dealership"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="label">{t('whitelabel.logoUrl', 'Logo URL')}</label>
                  <input
                    type="url"
                    value={customization.logoUrl}
                    onChange={e => setCustomization({ ...customization, logoUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('whitelabel.logoHelp', 'Recommended size: 200x200px')}
                  </p>
                </div>

                {/* Headline */}
                <div>
                  <label className="label">{t('whitelabel.headline', 'Headline')}</label>
                  <input
                    type="text"
                    value={customization.headline}
                    onChange={e => setCustomization({ ...customization, headline: e.target.value })}
                    className="input-field"
                    placeholder="Find Your Dream Car"
                  />
                </div>

                {/* Subheadline */}
                <div>
                  <label className="label">{t('whitelabel.subheadline', 'Subheadline')}</label>
                  <input
                    type="text"
                    value={customization.subheadline}
                    onChange={e =>
                      setCustomization({ ...customization, subheadline: e.target.value })
                    }
                    className="input-field"
                    placeholder="Premium selection of quality vehicles"
                  />
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('whitelabel.primaryColor', 'Primary Color')}</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customization.primaryColor}
                        onChange={e =>
                          setCustomization({ ...customization, primaryColor: e.target.value })
                        }
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.primaryColor}
                        onChange={e =>
                          setCustomization({ ...customization, primaryColor: e.target.value })
                        }
                        className="input-field flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      {t('whitelabel.secondaryColor', 'Secondary Color')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customization.secondaryColor}
                        onChange={e =>
                          setCustomization({ ...customization, secondaryColor: e.target.value })
                        }
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.secondaryColor}
                        onChange={e =>
                          setCustomization({ ...customization, secondaryColor: e.target.value })
                        }
                        className="input-field flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="label">{t('whitelabel.template', 'Template')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map(template => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(template)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          customization.template === template.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-3xl mb-2">{template.icon}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button onClick={handleSave} className="w-full btn-primary">
                  {t('whitelabel.saveChanges', 'Save Changes')}
                </button>
              </div>

              {/* Live Preview Panel */}
              <div className="lg:sticky lg:top-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('whitelabel.livePreview', 'Live Preview')}
                </h3>
                <PreviewCard customization={customization} templates={templates} />
              </div>
            </div>
          ) : (
            /* Full Preview */
            <div className="max-w-4xl mx-auto">
              <PreviewCard customization={customization} templates={templates} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WhiteLabelCustomization
