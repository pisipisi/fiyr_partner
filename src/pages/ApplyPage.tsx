import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { applyPartner } from '../api/partners';
import {
  capturePartnerReferralCode,
  getStoredPartnerReferralCode,
} from '../utils/partnerReferral';

export default function ApplyPage() {
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | undefined>();

  useEffect(() => {
    capturePartnerReferralCode();
    const code = getStoredPartnerReferralCode();
    if (code) setReferralCode(code);
  }, []);

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
        referralCode,
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
      {referralCode ? (
        <p className="success" style={{ marginBottom: '1rem' }}>
          Referred by partner code <strong>{referralCode}</strong>.
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
            minLength={8}
            autoComplete="new-password"
            placeholder="e.g. StrongP@ss1"
          />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 400 }}>
            At least 8 characters with uppercase, lowercase, a number, and one of
            @ $ ! % * ? & .
          </span>
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
          <input name="website" type="text" placeholder="https://example.com" />
        </label>
        <label>
          Preferred code
          <input
            name="preferredCode"
            type="text"
            pattern="[a-zA-Z0-9_-]{3,32}"
            title="3-32 letters, numbers, underscore, or hyphen"
            placeholder="maria20"
          />
        </label>
        <label>
          How will you promote Fiyr?
          <textarea name="applicationNote" />
        </label>
        <label className="legal-consent">
          <input name="acceptTerms" type="checkbox" required />
          <span>
            I agree to the <Link to="/terms">Partner Program Terms</Link> and{' '}
            <Link to="/privacy">Partner Privacy Policy</Link>.
          </span>
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </main>
  );
}
