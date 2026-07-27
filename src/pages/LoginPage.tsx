import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMePartner, login } from '../api/partners';

export default function LoginPage() {
  const navigate = useNavigate();
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
        No account yet? <Link to="/apply">Apply here</Link>.
      </p>
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
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
