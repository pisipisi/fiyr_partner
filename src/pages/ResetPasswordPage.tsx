import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/partners';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get('password') || '');
    const confirmPassword = String(fd.get('confirmPassword') || '');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Missing reset token. Open the link from your email again.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, password, confirmPassword });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not reset password.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="shell section">
        <div className="card" style={{ maxWidth: 480 }}>
          <h2>Invalid reset link</h2>
          <p className="error" style={{ marginTop: '0.75rem' }}>
            This password reset link is missing a token. Request a new one from
            the forgot password page.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/forgot-password" className="btn btn-primary">
              Forgot password
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="shell section">
      <h2>Reset password</h2>
      <p className="lead">Choose a new password for your partner account.</p>
      <form className="form card" onSubmit={onSubmit}>
        <label>
          New password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="e.g. StrongP@ss1"
          />
          <span
            style={{
              color: 'var(--muted)',
              fontSize: '0.85rem',
              fontWeight: 400,
            }}
          >
            At least 8 characters with uppercase, lowercase, a number, and one
            of @ $ ! % * ? & .
          </span>
        </label>
        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Update password'}
        </button>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </main>
  );
}
