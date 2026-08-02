import type { ReactNode } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { clearToken, getToken } from './api/partners';
import ApplyPage from './pages/ApplyPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TermsPage from './pages/TermsPage';

function Header() {
  const loggedIn = !!getToken();
  return (
    <header className="shell site-header">
      <Link to="/" className="brand">
        Fiyr Partners
      </Link>
      <nav className="nav">
        <Link to="/terms" className="btn btn-ghost">
          Terms
        </Link>
        {loggedIn ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                clearToken();
                window.location.href = '/';
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/apply" className="btn btn-primary">
              Apply
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
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
    </BrowserRouter>
  );
}
