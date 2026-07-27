import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { applyPartner } from '../api/partners';

export default function ApplyPage() {
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await applyPartner({
        email: String(fd.get('email') || ''),
        password: String(fd.get('password') || ''),
        fullName: String(fd.get('fullName') || '') || undefined,
        companyName: String(fd.get('companyName') || '') || undefined,
        website: String(fd.get('website') || '') || undefined,
        preferredCode: String(fd.get('preferredCode') || '') || undefined,
        applicationNote: String(fd.get('applicationNote') || '') || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="shell section">
        <div className="card" style={{ maxWidth: 480 }}>
          <h2>Application received</h2>
          <p className="success" style={{ marginTop: '0.75rem' }}>
            We will email you when your partner account is approved. You can then
            log in to get your links.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/login" className="btn btn-primary">
              Go to login
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="shell section">
      <h2>Apply to partner with Fiyr</h2>
      <p className="lead">Create your partner account. Approval required before payouts.</p>
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
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label>
          Full name
          <input name="fullName" type="text" autoComplete="name" />
        </label>
        <label>
          Company
          <input name="companyName" type="text" />
        </label>
        <label>
          Website
          <input name="website" type="url" placeholder="https://" />
        </label>
        <label>
          Preferred code
          <input
            name="preferredCode"
            type="text"
            pattern="[a-zA-Z0-9_-]{3,32}"
            placeholder="maria20"
          />
        </label>
        <label>
          How will you promote Fiyr?
          <textarea name="applicationNote" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </main>
  );
}
