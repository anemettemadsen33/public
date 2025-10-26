# Auto Marketplace Professional - Frontend

A modern, enterprise-level auto marketplace platform built with React + Tailwind CSS, featuring dark mode, PWA support, AI chatbot, and comprehensive internationalization.

## ✨ Features

### 🔥 UX & Frontend

- ✅ **Dark Mode + Theme Switcher**: Auto-detect system theme with persistent localStorage toggle
- ✅ **Real-Time Search + Filters**: 300ms debounce with instant visual feedback
- ✅ **Image Blur-Up Loading**: Placeholder blur effect for better perceived performance
- ✅ **Vehicle Card 3D Hover Effects**: Smooth framer-motion animations
- ✅ **Voice Search Integration**: Web Speech API for hands-free search
- ✅ **Responsive Design**: Mobile-first, fully responsive UI

### 💾 State & Data Management

- ✅ **Zustand State Management**: Lightweight, performant state for filters, comparisons, preferences
- ✅ **TanStack Query (React Query)**: Intelligent caching, auto-refetch, background updates
- ✅ **LocalStorage Persistence**: Automatic persistence for user preferences

### 🛠️ Feature Enhancements

- ✅ **Progressive Web App (PWA)**: Installable, offline support, service worker
- ✅ **Smart Recommendation Engine**: ML-based recommendations from user behavior
- ✅ **AI Chatbot**: Simulated GPT responses with quick questions and contextual help
- ✅ **Favorites/Save System**: Save vehicles to favorites with heart icon
- ✅ **Sponsored Listings**: Yellow "Sponsored" badges for dealer promotions
- ✅ **Vehicle Subcategories**: Mobile.de-compliant category codes with dependent dropdowns
  - 6 main categories (Car, Motorcycle, Van, Truck, ConstructionMachine, Agricultural)
  - 62 subcategories with official codes (e.g., Car.Cabrio, Motorcycle.Touring)
  - Cascade filtering with automatic reset
  - Full TypeScript support with Zod validation

### 🧑‍💼 Admin & Dealer Tools

- ✅ **Admin Dashboard**: Interactive charts (sales, leads, categories) with recharts
- ✅ **Analytics Tracking**: Views, clicks, saves tracked in Zustand store
- ✅ **Dealer Listings Management**: Table view with status filters

### 🌍 Internationalization

- ✅ **5 Languages**: English, Romanian, German, Arabic, Hebrew
- ✅ **Auto Language Detection**: Detect from browser settings
- ✅ **RTL Support**: Full right-to-left layout for Arabic & Hebrew
- ✅ **Localized Formatting**: Dates, currencies, numbers

### 📈 SEO & Performance

- ✅ **Sitemap.xml**: Complete sitemap for all routes
- ✅ **Robots.txt**: SEO-friendly robots file
- ✅ **JSON-LD Structured Data**: Schema.org markup helpers
- ✅ **Code Splitting**: Vendor, i18n, charts, animations chunks
- ✅ **Lazy Loading**: Images and components
- ✅ **Optimized Build**: Terser minification, CSS code splitting

## 🚀 Tech Stack

- **React 19** - Latest UI framework
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first styling with dark mode
- **React Router 7** - Client-side routing
- **i18next** - Internationalization (5 languages)
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts
- **Axios** - HTTP client

## 📊 Performance

### Build Output

```
dist/assets/manifest-q2dGo75m.json    0.91 kB
dist/index.html                       2.14 kB
dist/assets/index-BSfSWFXA.css       27.02 kB
dist/assets/vendor-BUVKZ7b6.js       44.22 kB (React, Router)
dist/assets/i18n-DrOztlv4.js         47.19 kB (Translations)
dist/assets/charts-*.js              ~80 kB (Recharts)
dist/assets/animations-*.js          ~60 kB (Framer Motion)
dist/assets/state-*.js               ~50 kB (Zustand, React Query)
dist/assets/index-*.js               ~450 kB (Main bundle)
```

### Optimizations

- Code splitting by feature (vendor, i18n, charts, animations, state)
- Tree shaking with ES modules
- CSS purging with Tailwind
- Image lazy loading
- Service worker caching
- Console.log removal in production
- Gzip compression

## 🎨 UI/UX Features

- **Dark Mode**: System preference detection + manual toggle
- **Theme Persistence**: Remembers user preference
- **Smooth Animations**: Framer Motion for cards, modals, transitions
- **Blur-Up Images**: Placeholder while loading
- **Skeleton Loading**: Better perceived performance
- **Voice Search**: Microphone icon for voice input
- **AI Chat Widget**: Floating chatbot with quick questions
- **Comparison Badge**: Visual counter in navbar
- **Favorite Heart**: Save vehicles to favorites
- **Sponsored Badges**: Highlight promoted listings

## 🗂️ Project Structure

```
src/
├── api/              # API client and React Query setup
├── assets/           # Icons, images, logo
├── components/       # Reusable UI components
│   ├── Navbar.jsx (Dark mode, 5 languages, mobile menu)
│   ├── CarCard.jsx (3D hover, blur-up, favorites, sponsored)
│   ├── FiltersPanel.jsx (Debounced search, voice search)
│   ├── VoiceSearch.jsx (Web Speech API)
│   └── AIChatbot.jsx (AI assistant)
├── context/          # React Context providers
│   ├── AuthContext.jsx
│   ├── FilterContext.jsx
│   ├── CompareContext.jsx
│   └── ThemeContext.jsx (Dark mode)
├── hooks/            # Custom React hooks
│   ├── useRecommendations.js (ML-based recommendations)
│   └── useVehicleSubCategories.ts (Category filtering)
├── i18n/             # Internationalization
│   ├── i18n.js (Auto-detection, RTL)
│   └── locales/ (en, ro, de, ar, he)
├── layouts/          # Layout wrappers
├── pages/            # Page components
│   ├── HomePage.jsx
│   ├── ListingPage.jsx
│   ├── VehicleDetailsPage.jsx
│   ├── ComparePage.jsx
│   ├── DealersPage.jsx
│   └── AdminDashboard.jsx (Charts, analytics)
├── store/            # Zustand stores
│   └── index.js (Filters, Compare, Preferences)
├── utils/            # Helper functions
│   ├── helpers.js
│   ├── mockData.js
│   ├── vehicleSubCategories.ts (Category definitions)
│   ├── validationSchema.ts (Zod schemas)
│   ├── languageDetection.js (Auto-detect, RTL)
│   └── structuredData.js (SEO JSON-LD)
├── App.jsx
├── main.jsx
└── index.css (Dark mode + RTL support)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd public
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Internationalization

The app supports 5 languages with auto-detection:

- **English (EN)** - Default
- **Romanian (RO)** - Romanian market
- **German (DE)** - German market
- **Arabic (AR)** - RTL layout
- **Hebrew (HE)** - RTL layout

Language is auto-detected from browser settings, or users can manually switch via the navbar.

## 📱 PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Service worker caches essential assets
- **App-like Experience**: Standalone display mode
- **Fast Loading**: Cached resources load instantly

## 🤖 AI Chatbot

The AI assistant helps users with:

- Vehicle recommendations
- Comparison guidance
- Buying advice
- Quick answers to common questions

**Quick Questions:**

- "What truck is best for heavy transport?"
- "Compare electric vs gasoline cars"
- "Best family SUV under $30,000"
- "What to check when buying used?"

## 📈 Admin Dashboard

Access at `/admin` (demo only, no auth):

**Features:**

- Sales & leads line chart
- Category distribution pie chart
- Recent listings table
- Key metrics (listings, dealers, revenue, views)
- Status filters (Active, Pending, Sold)

## 🎯 Smart Recommendations

The recommendation engine uses:

- Viewed vehicles history
- Clicked filter preferences
- Saved favorites
- Category affinity
- Price range similarity

Recommendations appear on:

- Homepage
- Vehicle detail pages
- After adding to comparison

## 🚗 Vehicle Categories & Subcategories

The application implements a comprehensive hierarchical categorization system based on **mobile.de official category codes**.

### Main Categories

- **Car** - Passenger cars (Autos)
- **Motorcycle** - Two-wheeled vehicles (Motorräder)
- **Van** - Light commercial vehicles up to 7.5t (Transporter)
- **Truck** - Heavy commercial vehicles over 7.5t (LKW)
- **ConstructionMachine** - Construction equipment (Baumaschinen)
- **Agricultural** - Farming machinery (Landmaschinen)

### Features

- **62 Subcategories**: Official mobile.de codes (e.g., `Car.Cabrio`, `Motorcycle.Touring`, `ConstructionMachine.MiniExcavator`)
- **Dependent Dropdowns**: Subcategory options filtered by selected main category
- **Cascade Reset**: Changing main category automatically clears subcategory
- **TypeScript Support**: Full type safety with enums and interfaces
- **Zod Validation**: Runtime validation ensuring subcategory belongs to main category
- **LocalStorage Persistence**: Category preferences saved across sessions
- **Bilingual Labels**: English and German (Deutsch) labels for all categories

### Usage Example

```typescript
import { useVehicleSubCategories } from '@/hooks/useVehicleSubCategories'

function FilterComponent() {
  const { mainCategories, subCategories } = useVehicleSubCategories('Car')
  // subCategories contains all Car.* subcategories
}
```

📖 **Full Documentation**: See [docs/vehicleCategories.md](docs/vehicleCategories.md) for complete reference tables and code examples.

## 🔐 Security & Privacy

- No sensitive data stored
- LocalStorage only for preferences
- No backend authentication (yet)
- Console logs removed in production
- HTTPS recommended for production

## 📊 Analytics Tracking

The app tracks (locally, no backend yet):

- Vehicle views
- Filter usage
- Saved favorites
- Comparison selections
- Click patterns

This data powers the smart recommendation engine.

## 🎨 Dark Mode

**Features:**

- Auto-detect system preference
- Manual toggle in navbar
- Smooth transitions
- Persistent preference
- All components dark-mode aware

**Implementation:**

- Tailwind's dark mode (class strategy)
- ThemeContext for state
- CSS transitions for smooth switching

## 🌍 RTL Support

**Supported Languages:**

- Arabic (ar)
- Hebrew (he)

**Features:**

- Auto-detect RTL languages
- Flip layout direction
- Mirror spacing utilities
- Right-aligned text
- Reversed flex/grid directions

## 🚧 Future Enhancements

Planned features (not yet implemented):

- [ ] User authentication (OAuth, Magic Link, 2FA)
- [ ] Advanced user profiles
- [ ] Real AI integration (OpenAI GPT)
- [ ] Dealer CRM with lead management
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] VIN check API integration
- [ ] Test drive booking system
- [ ] Real-time chat with dealers
- [ ] Gamification system

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, Tailwind, and modern web technologies**
