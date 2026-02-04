import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Login from './pages/Login';
import RoutesPage from './pages/Routes';
import AssetsPage from './pages/Assets';
import PlaceholderPage from './components/PlaceholderPage';
import FacilitiesPage from './pages/Facilities';
import IncidentsPage from './pages/Incidents';
import MachineryPage from './pages/Machinery';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Overview />} />

                {/* Admin Routes */}
                <Route path="routes" element={<RoutesPage />} />
                <Route path="assets" element={<AssetsPage />} />
                <Route path="facilities" element={<FacilitiesPage />} />
                <Route path="incidents" element={<IncidentsPage />} />
                <Route path="cctv" element={<PlaceholderPage title="CCTV" />} />
                <Route path="admin-users" element={<PlaceholderPage title="Admin Users" />} />

                {/* Engineer Routes */}
                <Route path="bins" element={<AssetsPage defaultTab="bins" />} />
                <Route path="trucks" element={<AssetsPage defaultTab="trucks" />} />
                <Route path="machinery" element={<MachineryPage />} />
              </Route >
            </Route >
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes >
        </BrowserRouter >
      </DataProvider >
    </AuthProvider >
  );
}

export default App;
