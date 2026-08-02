import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/partners';
import {
  IconCopy,
  IconDollar,
  IconMousePointer,
  IconTrending,
  IconUsers,
  IconWallet,
} from '../components/Icons';

type Dashboard = {
  partner: {
    code: string;
    status: string;
    businessCommissionPercent: number;
    partnerOverridePercent?: number;
    recurringMonths: number;
    w9Submitted?: boolean;
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

const LINKS = [
  { key: 'business', label: 'Landing page', desc: 'Share on your website or social' },
  { key: 'register', label: 'App signup', desc: 'Direct link to Fiyr registration' },
  { key: 'recruit', label: 'Recruit partners', desc: 'Invite other affiliates to join' },
] as const;

function commissionLabel(source: string) {
  if (source === 'subscription_invoice') return 'Business subscription';
  if (source === 'subscription_override') return 'Partner override';
  if (source === 'subscription_markup') return 'Subscription markup';
  if (source === 'booking') return 'Booking';
  return source;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function statusBadge(status: string) {
  const cls = ['paid', 'approved', 'pending'].includes(status) ? status : status;
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    getDashboard<Dashboard>()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load dashboard'),
      );
  }, []);

  async function handleCopy(key: string, text: string) {
    await copyText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  }

  if (error && !data) {
    return (
      <main className="shell dashboard-page">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="shell dashboard-page">
        <div className="loading-state" role="status">
          <div className="loading-spinner" aria-hidden />
          Loading dashboard…
        </div>
      </main>
    );
  }

  const linkMap = data.links;

  return (
    <main className="shell dashboard-page">
      <div className="dashboard-top">
        <div>
          <h1>Dashboard</h1>
          <div className="dashboard-meta">
            <span className={`badge ${data.partner.status}`}>{data.partner.status}</span>
            <span>
              Code <code>{data.partner.code}</code>
            </span>
            <span>·</span>
            <span>{data.partner.businessCommissionPercent}% commission</span>
            <span>·</span>
            <span>{data.partner.recurringMonths} months</span>
          </div>
        </div>
        <div className="dashboard-actions">
          <Link to="/pricing" className="btn btn-ghost btn-sm">
            Custom pricing
          </Link>
          <Link to="/settings" className="btn btn-ghost btn-sm">
            Settings
          </Link>
        </div>
      </div>

      {!data.partner.w9Submitted ? (
        <div className="warn-card" style={{ marginBottom: '1.25rem' }}>
          Submit your W-9 tax form in{' '}
          <Link to="/settings?tab=w9" style={{ color: 'inherit', textDecoration: 'underline' }}>
            Settings
          </Link>{' '}
          before you can receive payouts.
        </div>
      ) : null}

      <div className="stats">
        <div className="stat">
          <div className="stat-icon clicks">
            <IconMousePointer />
          </div>
          <div className="stat-body">
            <div className="label">Clicks</div>
            <div className="value">{data.stats.clicks.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon referrals">
            <IconUsers />
          </div>
          <div className="stat-body">
            <div className="label">Referrals</div>
            <div className="value">{data.stats.businessAttributions}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon earned">
            <IconTrending />
          </div>
          <div className="stat-body">
            <div className="label">Earned</div>
            <div className="value">{money(data.stats.earnedCents)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon pending">
            <IconDollar />
          </div>
          <div className="stat-body">
            <div className="label">Pending</div>
            <div className="value">{money(data.stats.pendingCents)}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <section className="card">
          <div className="card-head">
            <div>
              <h3>Referral links</h3>
              <p className="card-desc">Copy and share anywhere you promote Fiyr</p>
            </div>
          </div>
          <div className="link-list">
            {LINKS.map(({ key, label, desc }) => {
              const url = linkMap[key];
              return (
                <div key={key} className="link-item">
                  <div className="link-item-label">{label}</div>
                  <div className="muted" style={{ fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    {desc}
                  </div>
                  <div className="link-row">
                    <code>{url}</code>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      aria-label={`Copy ${label}`}
                      onClick={() => void handleCopy(key, url)}
                    >
                      <IconCopy />
                    </button>
                  </div>
                  {copiedKey === key ? (
                    <span className="success" style={{ fontSize: '0.82rem' }}>Copied!</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h3>Recent commissions</h3>
              <p className="card-desc">Latest earnings from your referrals</p>
            </div>
          </div>
          <div className="table-wrap">
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
                  <tr className="table-empty">
                    <td colSpan={4}>No commissions yet. Earn when referred businesses pay.</td>
                  </tr>
                ) : (
                  data.recentCommissions.map((c) => (
                    <tr key={c.id}>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>{commissionLabel(c.source)}</td>
                      <td style={{ fontWeight: 600 }}>{money(c.amountCents)}</td>
                      <td>{statusBadge(c.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h3>Referred partners</h3>
              <p className="card-desc">
                {data.stats.partnerReferrals} recruited ·{' '}
                {money(data.stats.overrideEarnedCents)} override earned
              </p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Referred</th>
                </tr>
              </thead>
              <tbody>
                {data.referredPartners.length === 0 ? (
                  <tr className="table-empty">
                    <td colSpan={4}>No partner referrals yet.</td>
                  </tr>
                ) : (
                  data.referredPartners.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.fullName || p.email}
                        <div className="muted" style={{ fontSize: '0.82rem' }}>
                          {p.email}
                        </div>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.82rem' }}>{p.code}</code>
                      </td>
                      <td>{statusBadge(p.status)}</td>
                      <td>{new Date(p.referredAt || p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h3>Payout history</h3>
              <p className="card-desc">{money(data.stats.paidCents)} total paid out</p>
            </div>
            <IconWallet className="card-head-icon" />
          </div>
          <div className="table-wrap">
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
                  <tr className="table-empty">
                    <td colSpan={3}>No payouts yet.</td>
                  </tr>
                ) : (
                  data.payouts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.period}</td>
                      <td style={{ fontWeight: 600 }}>{money(p.amountCents)}</td>
                      <td>{statusBadge(p.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
