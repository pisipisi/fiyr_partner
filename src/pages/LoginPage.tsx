import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getMePartner, login } from '../api/partners';
import { useAuth } from '../auth/AuthContext';
import { applyPathWithReferral } from '../utils/partnerReferral';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useAuth();
  const sessionExpired = searchParams.get('session') === 'expired';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await login(String(fd.get('email') || ''), String(fd.get('password') || ''));
      await getMePartner();
      refresh();
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Apply first if you do not have a partner account.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell section">
      <h2>Partner login</h2>
      <p className="lead">
        No account yet? <Link to={applyPathWithReferral()}>Apply here</Link>.
      </p>
      {sessionExpired ? (
        <p className="warn-card" style={{ maxWidth: '28rem', marginBottom: '1rem' }}>
          Your session expired. Please sign in again.
        </p>
      ) : null}
      <form className="form card" onSubmit={onSubmit}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
