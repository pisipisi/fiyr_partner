import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <h1>Earn recurring commissions by growing Fiyr.</h1>
        <p>
          Share your link, bring new businesses to Fiyr, and earn when they pay
          for a subscription — for up to 12 months.
        </p>
        <div className="hero-actions">
          <Link to="/apply" className="btn btn-primary">
            Become a partner
          </Link>
          <Link to="/login" className="btn btn-ghost">
            Partner login
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <p className="lead">
          One referral code. Paid subscriptions only. Transparent dashboard.
        </p>
        <div className="grid-3">
          <article className="card">
            <h3>1. Apply</h3>
            <p>Tell us how you promote. We review and approve partners quickly.</p>
          </article>
          <article className="card">
            <h3>2. Share your link</h3>
            <p>
              Use your unique signup link. New businesses that register through
              it are attributed to you.
            </p>
          </article>
          <article className="card">
            <h3>3. Earn on paid plans</h3>
            <p>
              Default: 20% of each paid subscription invoice for 12 months after
              signup. No commission until they pay.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
