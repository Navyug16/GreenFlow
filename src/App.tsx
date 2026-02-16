import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';

// Lazy Load Pages
const Overview = lazy(() => import('./pages/Overview'));
const Login = lazy(() => import('./pages/Login'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const AssetsPage = lazy(() => import('./pages/Assets'));

const FacilitiesPage = lazy(() => import('./pages/Facilities'));
const IncidentsPage = lazy(() => import('./pages/Incidents'));
const CCTV = lazy(() => import('./pages/CCTV'));
const MachineryPage = lazy(() => import('./pages/Machinery'));
const AdminPage = lazy(() => import('./pages/Admin'));
const FinancePage = lazy(() => import('./pages/Finance'));

// Loading Fallback
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--bg-main)',
    color: 'var(--text-primary)'
  }}>
    Loading GreenFlow...
  </div>
);

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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Overview />} />

                  {/* Admin Routes */}
                  <Route path="routes" element={<RoutesPage />} />
                  <Route path="fleet" element={<AssetsPage />} />
                  <Route path="facilities" element={<FacilitiesPage />} />
                  <Route path="incidents" element={<IncidentsPage />} />
                  <Route path="cctv" element={<CCTV />} />
                  <Route path="admin-users" element={<AdminPage />} />
                  <Route path="finance" element={<FinancePage />} />

                  {/* Engineer Routes */}
                  <Route path="bins" element={<AssetsPage defaultTab="bins" hideTabs={true} />} />
                  <Route path="trucks" element={<AssetsPage defaultTab="trucks" hideTabs={true} />} />
                  <Route path="machinery" element={<MachineryPage />} />
                </Route >
              </Route >
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes >
          </Suspense>
        </BrowserRouter >
      </DataProvider >
    </AuthProvider >
  );
}

export default App;
