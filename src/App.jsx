import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { CompareProvider } from './context/CompareContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import ComparePage from './pages/ComparePage';
import DealersPage from './pages/DealersPage';
import './i18n/i18n';

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <CompareProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<ListingPage category="cars" />} />
                <Route path="/trucks" element={<ListingPage category="trucks" />} />
                <Route path="/vans" element={<ListingPage category="vans" />} />
                <Route path="/campers" element={<ListingPage category="campers" />} />
                <Route path="/motorcycles" element={<ListingPage category="motorcycles" />} />
                <Route path="/electric" element={<ListingPage category="electric" />} />
                <Route path="/construction" element={<ListingPage category="construction" />} />
                <Route path="/agricultural" element={<ListingPage category="agricultural" />} />
                <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/dealers" element={<DealersPage />} />
              </Routes>
            </MainLayout>
          </Router>
        </CompareProvider>
      </FilterProvider>
    </AuthProvider>
  );
}

export default App;
