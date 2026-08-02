import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/partners';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await forgotPassword(String(fd.get('email') || ''));
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not send reset email.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="shell section">
        <div className="card" style={{ maxWidth: 480 }}>
          <h2>Check your email</h2>
          <p className="success" style={{ marginTop: '0.75rem' }}>
            If that email exists in our system, we have sent a password reset
            link. It expires in one hour.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/login" className="btn btn-primary">
              Back to login
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="shell section">
      <h2>Forgot password</h2>
      <p className="lead">
        Enter your partner email and we will send a reset link.
      </p>
      <form className="form card" onSubmit={onSubmit}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </main>
  );
}
