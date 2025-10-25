# ✅ Checklist Rapid - Auto Marketplace

## 🎯 PRIORITATE MAXIMĂ (Acum!)

### Fix Linting Errors (60 min)

- [ ] Remove `zustandCompareList` din `src/components/Navbar.jsx`
- [ ] Remove unused `t` din `src/components/VoiceSearch.jsx`
- [ ] Remove unused `t` din `src/pages/AdminDashboard.jsx`
- [ ] Remove `BarChart, Bar` imports din `src/pages/AdminDashboard.jsx`
- [ ] Fix `setState` în `useEffect` (6 fișiere):
  - [ ] `src/pages/DealersPage.jsx`
  - [ ] `src/pages/HomePage.jsx`
  - [ ] `src/pages/ListingPage.jsx`
  - [ ] `src/pages/VehicleDetailsPage.jsx`
  - [ ] `src/components/VoiceSearch.jsx`
  - [ ] `src/pages/ComparePage.jsx` (dacă există)
- [ ] Add `onSearch` la dependencies în `src/components/VoiceSearch.jsx`

**Cum să fix setState în useEffect**:

```javascript
// ❌ ÎNAINTE (BAD)
const [data, setData] = useState([])
useEffect(() => {
  setData(mockData)
}, [])

// ✅ DUPĂ (GOOD) - Opțiunea 1
const [data] = useState(mockData)

// ✅ DUPĂ (GOOD) - Opțiunea 2
const data = useMemo(() => mockData, [])

// ✅ DUPĂ (GOOD) - Opțiunea 3 (dacă e async)
const [data, setData] = useState([])
useEffect(() => {
  async function loadData() {
    const result = await fetchData()
    setData(result)
  }
  loadData()
}, [])
```

### Fix E2E Test (30 min)

- [ ] Update `vitest.config.ts`:
  ```typescript
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/e2e/**', // ← Add this line
    '**/.{idea,git,cache,output,temp}/**',
  ]
  ```
- [ ] Run `npm test` (should pass)
- [ ] Run `npm run test:e2e` separately

### Verificare Finală (30 min)

- [ ] `npm run typecheck` ✅
- [ ] `npm run lint` ✅ (0 errors, 0 warnings)
- [ ] `npm test` ✅
- [ ] `npm run build` ✅
- [ ] Commit & Push

---

## 🚀 PRIORITATE ÎNALTĂ (Ziua 2-3)

### Bundle Optimization (3 ore)

- [ ] Lazy load `AdminDashboard` în `src/App.jsx`
- [ ] Lazy load `Recharts` components
- [ ] Update `vite.config.ts` cu `chunkSizeWarningLimit: 200`
- [ ] Run `npm run build` și verifică sizes
- [ ] Target: charts.js și index.js < 200 KB each

### Image Optimization (1 oră)

- [ ] Add `srcSet` pentru responsive images
- [ ] Add `loading="lazy"` pe toate imaginile
- [ ] Create `useIntersectionObserver` hook
- [ ] Implement lazy loading pentru car cards

### Lighthouse Audit (1 oră)

- [ ] Build: `npm run build`
- [ ] Preview: `npm run preview`
- [ ] Run Lighthouse în Chrome DevTools
- [ ] Target: Performance 95+, Accessibility 100
- [ ] Fix any issues identified

---

## 📝 PRIORITATE MEDIE (Ziua 4-5)

### Testing Coverage (6-8 ore)

- [ ] `FiltersPanel.test.jsx` (search, voice, filters)
- [ ] `CarCard.test.jsx` (favorite, compare, hover)
- [ ] `Navbar.test.jsx` (dark mode, language)
- [ ] `useRecommendations.test.js`
- [ ] `useFilterStore.test.js`
- [ ] `useCompareStore.test.js`
- [ ] `usePreferencesStore.test.js`
- [ ] E2E: User journey test
- [ ] E2E: Dark mode test
- [ ] E2E: Language switching test
- [ ] Target: 80%+ coverage

---

## 📚 PRIORITATE SCĂZUTĂ (Ziua 6-7)

### Documentation (2 ore)

- [ ] Update README.md cu instrucțiuni complete
- [ ] Create DEPLOYMENT.md
- [ ] Create API.md (când backend ready)
- [ ] Add screenshots în docs/

### Deployment (1-2 ore)

- [ ] Choose platform (Vercel/Netlify/AWS)
- [ ] Configure environment variables
- [ ] Deploy to staging
- [ ] Test production build
- [ ] Deploy to production
- [ ] Configure domain (dacă există)

---

## 🔄 POST-DEPLOYMENT (Săptămâna 2+)

### Real API Integration (4-8 ore)

- [ ] Obține API URL de la backend team
- [ ] Update `src/api/client.js`
- [ ] Remove MSW handlers
- [ ] Add JWT authentication
- [ ] Implement error handling
- [ ] Test all endpoints

### User Authentication (8-12 ore)

- [ ] Login/Signup forms
- [ ] OAuth integration (Google, Facebook)
- [ ] JWT token management
- [ ] Protected routes
- [ ] User profile page
- [ ] Password reset

### Analytics (3-4 ore)

- [ ] Google Analytics 4 setup
- [ ] Google Tag Manager
- [ ] Event tracking
- [ ] Conversion tracking

---

## 🎯 KPI-uri de Urmărit

### Performance

- [ ] Build time < 15s ✅ (current: 10.94s)
- [ ] Bundle size < 300 KB gzipped ✅ (current: 255 KB)
- [ ] Lighthouse Performance 95+ ⏳ (target)
- [ ] First Contentful Paint < 1.5s ⏳
- [ ] Time to Interactive < 3.5s ⏳

### Code Quality

- [ ] ESLint errors: 0 ⏳ (current: 7)
- [ ] ESLint warnings: 0 ⏳ (current: 5)
- [ ] TypeScript errors: 0 ✅
- [ ] Test coverage: 80%+ ⏳ (current: ~10%)
- [ ] E2E tests: All passing ⏳

### Features

- [ ] All 18 features functional ✅
- [ ] Dark mode working ✅
- [ ] 5 languages working ✅
- [ ] PWA installable ✅
- [ ] Mock API working ✅

---

## 📞 Quick Commands

```bash
# Development
npm install
npm run dev

# Quality Checks
npm run typecheck
npm run lint
npm run lint:fix
npm run format

# Testing
npm test
npm run test:ui
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui

# Build
npm run build
npm run preview

# Analysis
npm run analyze
```

---

## 🚨 Red Flags

**Stop & Fix Immediately Dacă**:

- ❌ `npm run build` fails
- ❌ `npm run typecheck` has errors
- ❌ `npm run lint` has >10 warnings
- ❌ Bundle size > 500 KB gzipped
- ❌ Lighthouse Performance < 80
- ❌ Tests failing in CI/CD

---

## ✅ Definition of Done

**O Task este Done când**:

- ✅ Code compiles (`npm run build`)
- ✅ Types check (`npm run typecheck`)
- ✅ Linting passes (`npm run lint`)
- ✅ Tests pass (`npm test`)
- ✅ E2E tests pass (`npm run test:e2e`)
- ✅ Code reviewed
- ✅ Committed & pushed
- ✅ Documentation updated (dacă e relevant)

---

**Ultima actualizare**: 25 Octombrie 2025  
**Status**: 📋 Ready to execute
