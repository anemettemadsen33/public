# Auto Marketplace Professional - Frontend

A modern, multi-category auto marketplace platform built with React + Tailwind CSS.

## Features

- ✅ **Multi-Category Support**: Cars, Trucks, Vans, Campers, Motorcycles, Electric, Construction, Agricultural vehicles
- ✅ **Vehicle Listings**: Browse and filter vehicles with advanced search capabilities
- ✅ **Vehicle Details**: Comprehensive vehicle information with image galleries
- ✅ **Vehicle Comparison**: Compare up to 3 vehicles side-by-side
- ✅ **Multi-Language Support**: English, Romanian, and German (i18n)
- ✅ **Dealer Marketplace**: Browse verified dealers and their listings
- ✅ **Responsive Design**: Mobile-first, fully responsive UI
- ✅ **Modern UI/UX**: Clean, professional interface with Tailwind CSS

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **Axios** - HTTP client (API ready)

## Project Structure

```
src/
├── assets/          # Icons, images, logo
├── components/      # Reusable UI components
│   ├── Navbar.jsx
│   ├── CarCard.jsx
│   └── FiltersPanel.jsx
├── layouts/         # Layout wrappers
│   └── MainLayout.jsx
├── pages/           # Page components
│   ├── HomePage.jsx
│   ├── ListingPage.jsx
│   ├── VehicleDetailsPage.jsx
│   ├── ComparePage.jsx
│   └── DealersPage.jsx
├── context/         # React Context providers
│   ├── AuthContext.jsx
│   ├── FilterContext.jsx
│   └── CompareContext.jsx
├── api/             # API integration
│   ├── client.js
│   └── vehicles.js
├── hooks/           # Custom React hooks
├── utils/           # Helper functions and mock data
│   ├── helpers.js
│   └── mockData.js
├── i18n/            # Internationalization
│   ├── i18n.js
│   └── locales/
│       ├── en.json
│       ├── ro.json
│       └── de.json
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

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

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features in Detail

### Vehicle Categories

The platform supports 8 vehicle categories:
- Cars (🚗)
- Trucks (🚚)
- Vans (🚐)
- Campers (🚙)
- Motorcycles (🏍️)
- Electric (⚡)
- Construction (🚜)
- Agricultural (🚜)

Each category has its own dedicated listing page with category-specific filters.

### Filtering & Sorting

Users can filter vehicles by:
- Price range
- Year range
- Maximum mileage
- Fuel type (Gasoline, Diesel, Electric, Hybrid, LPG)
- Transmission type (Manual, Automatic, Semi-Automatic)

Sort options include:
- Newest first
- Price: Low to High
- Price: High to Low
- Mileage: Low to High
- Year: Newest first

### Vehicle Comparison

Users can select up to 3 vehicles to compare side-by-side, viewing:
- Pricing
- Specifications
- Features
- Performance metrics

Comparison selections are persisted in localStorage.

### Multi-Language Support

The application supports:
- English (EN)
- Romanian (RO)
- German (DE)

Language preference is saved and all UI elements are fully translated.

### API Integration

The app is ready for backend integration with:
- API client configuration
- Axios interceptors for auth tokens
- Service functions for all endpoints
- Mock data for development

## Backend Integration

To connect to a backend API:

1. Set the API URL in environment variables:
```bash
VITE_API_URL=http://your-api-url.com/api
```

2. The app uses the following endpoints (ready to connect):
- `GET /vehicles` - List vehicles with filters
- `GET /vehicles/:id` - Get vehicle details
- `GET /vehicles/featured` - Get featured vehicles
- `POST /orders/buy` - Submit buy request
- `POST /orders/leasing` - Submit leasing request
- `POST /test-drives` - Book test drive
- `GET /vin-check/:vin` - Check vehicle history
- `GET /dealers` - List dealers
- `GET /dealers/:id` - Get dealer details
- `POST /chat` - AI chat endpoint

## Future Enhancements

Planned features for future releases:
- [ ] Buy Now & Leasing forms
- [ ] Test Drive booking system
- [ ] VIN check integration
- [ ] AI Chat widget
- [ ] Gamification system
- [ ] ERP/CRM integration
- [ ] Advanced dealer dashboard
- [ ] User authentication & profiles
- [ ] Favorites & saved searches
- [ ] Email notifications

## Performance Optimizations

- Code splitting by route
- Lazy loading of images
- Vendor and i18n bundle separation
- React.memo for expensive components
- Debounced search and filters
- Optimized Tailwind CSS (treeshaking)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
