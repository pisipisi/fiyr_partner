import type { ReactNode } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { hasValidSession } from './api/partners';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ApplyPage from './pages/ApplyPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PartnerReferralCapture from './components/PartnerReferralCapture';
import { applyPathWithReferral } from './utils/partnerReferral';

function Header() {
  const { authenticated, logout } = useAuth();
  const applyHref = applyPathWithReferral();

  return (
    <div className="site-header-wrap">
      <header className="shell site-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden>F</span>
          Fiyr Partners
        </Link>
        <nav className="nav" aria-label="Main">
          <Link to="/terms" className="btn btn-ghost btn-sm">
            Terms
          </Link>
          {authenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <Link to="/pricing" className="btn btn-ghost btn-sm">
                Pricing
              </Link>
              <Link to="/settings" className="btn btn-ghost btn-sm">
                Settings
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to={applyHref} className="btn btn-primary btn-sm">
                Apply
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  if (!hasValidSession()) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <PartnerReferralCapture />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/pricing"
          element={
            <RequireAuth>
              <PricingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
      </Routes>
      <footer className="shell site-footer">
        © {new Date().getFullYear()} Fiyr · partner.fiyr.io
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
