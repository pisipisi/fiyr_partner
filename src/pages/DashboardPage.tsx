import { useEffect, useState, type FormEvent } from 'react';
import {
  getDashboard,
  updatePayoutDetails,
} from '../api/partners';

type Dashboard = {
  partner: {
    code: string;
    status: string;
    businessCommissionPercent: number;
    partnerOverridePercent?: number;
    recurringMonths: number;
    payoutDetails?: {
      method?: string;
      paypalEmail?: string;
      notes?: string;
    } | null;
  };
  links: {
    business: string;
    register: string;
    recruit: string;
  };
  stats: {
    clicks: number;
    attributions: number;
    businessAttributions: number;
    partnerReferrals: number;
    overrideEarnedCents: number;
    earnedCents: number;
    pendingCents: number;
    paidCents: number;
  };
  referredPartners: Array<{
    id: string;
    email: string;
    fullName?: string | null;
    companyName?: string | null;
    code: string;
    status: string;
    referredAt?: string | null;
    createdAt: string;
  }>;
  recentCommissions: Array<{
    id: string;
    source: string;
    amountCents: number;
    status: string;
    createdAt: string;
  }>;
  payouts: Array<{
    id: string;
    amountCents: number;
    period: string;
    status: string;
    paidAt?: string | null;
  }>;
};

function commissionLabel(source: string) {
  if (source === 'subscription_invoice') return 'Business subscription';
  if (source === 'subscription_override') return 'Partner override';
  if (source === 'booking') return 'Booking';
  return source;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');
  const [payoutMsg, setPayoutMsg] = useState('');

  useEffect(() => {
    getDashboard<Dashboard>()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load dashboard'),
      );
  }, []);

  async function onPayoutSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPayoutMsg('');
    const fd = new FormData(e.currentTarget);
    try {
      await updatePayoutDetails({
        method: String(fd.get('method') || 'paypal'),
        paypalEmail: String(fd.get('paypalEmail') || ''),
        notes: String(fd.get('notes') || ''),
      });
      setPayoutMsg('Payout details saved.');
      const refreshed = await getDashboard<Dashboard>();
      setData(refreshed);
    } catch (err) {
      setPayoutMsg(err instanceof Error ? err.message : 'Save failed');
    }
  }

  if (error) {
    return (
      <main className="shell section">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="shell section">
        <p>Loading dashboard…</p>
      </main>
    );
  }

  return (
    <main className="shell section">
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <span className={`badge ${data.partner.status}`}>{data.partner.status}</span>
      </div>
      <p className="lead">
        Code <strong>{data.partner.code}</strong> ·{' '}
        {data.partner.businessCommissionPercent}% of paid subscriptions ·{' '}
        {data.partner.recurringMonths} months
      </p>

      {data.partner.status !== 'approved' ? (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          Your account is <strong>{data.partner.status}</strong>. Links work after
          approval.
        </div>
      ) : null}

      <div className="stats" style={{ marginBottom: '1.5rem' }}>
        <div className="stat">
          <div className="label">Clicks</div>
          <div className="value">{data.stats.clicks}</div>
        </div>
        <div className="stat">
          <div className="label">Business referrals</div>
          <div className="value">{data.stats.businessAttributions}</div>
        </div>
        <div className="stat">
          <div className="label">Partner referrals</div>
          <div className="value">{data.stats.partnerReferrals}</div>
        </div>
        <div className="stat">
          <div className="label">Override earned</div>
          <div className="value">{money(data.stats.overrideEarnedCents)}</div>
        </div>
        <div className="stat">
          <div className="label">Pending</div>
          <div className="value">{money(data.stats.pendingCents)}</div>
        </div>
        <div className="stat">
          <div className="label">Paid</div>
          <div className="value">{money(data.stats.paidCents)}</div>
        </div>
      </div>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <h3>Your links</h3>
        <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1rem' }}>
          Share business links to earn on subscriptions. Share your recruit link
          to earn a {data.partner.partnerOverridePercent ?? 5}% override when
          partners you refer bring paying businesses.
        </p>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          <div>
            <div className="label">Business landing</div>
            <div className="link-row">
              <code>{data.links.business}</code>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => copyText(data.links.business)}
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <div className="label">Register</div>
            <div className="link-row">
              <code>{data.links.register}</code>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => copyText(data.links.register)}
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <div className="label">Recruit partners</div>
            <div className="link-row">
              <code>{data.links.recruit}</code>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => copyText(data.links.recruit)}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <h3>Referred partners</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Code</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.referredPartners.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  No partner referrals yet. Share your recruit link to grow your
                  network.
                </td>
              </tr>
            ) : (
              data.referredPartners.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.fullName || p.email}</strong>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {p.email}
                    </div>
                  </td>
                  <td>{p.code}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.referredAt || p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <h3>Payout method</h3>
        <form className="form" onSubmit={onPayoutSubmit} style={{ marginTop: '0.75rem' }}>
          <label>
            Method
            <select name="method" defaultValue={data.partner.payoutDetails?.method || 'paypal'}>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            PayPal email
            <input
              name="paypalEmail"
              type="email"
              defaultValue={data.partner.payoutDetails?.paypalEmail || ''}
            />
          </label>
          <label>
            Notes
            <textarea
              name="notes"
              defaultValue={data.partner.payoutDetails?.notes || ''}
            />
          </label>
          {payoutMsg ? <p className="success">{payoutMsg}</p> : null}
          <button type="submit" className="btn btn-primary">
            Save payout details
          </button>
        </form>
      </section>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <h3>Recent commissions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentCommissions.length === 0 ? (
              <tr>
                <td colSpan={4}>No commissions yet. Earn when referred businesses pay.</td>
              </tr>
            ) : (
              data.recentCommissions.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{commissionLabel(c.source)}</td>
                  <td>{money(c.amountCents)}</td>
                  <td>{c.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Payouts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.payouts.length === 0 ? (
              <tr>
                <td colSpan={3}>No payouts yet.</td>
              </tr>
            ) : (
              data.payouts.map((p) => (
                <tr key={p.id}>
                  <td>{p.period}</td>
                  <td>{money(p.amountCents)}</td>
                  <td>{p.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
