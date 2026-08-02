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
            <h3>2. Share your links</h3>
            <p>
              Refer businesses with your signup link, or recruit other partners
              with your apply link.
            </p>
          </article>
          <article className="card">
            <h3>3. Earn on paid plans</h3>
            <p>
              Default: 20% of each paid subscription invoice for 12 months.
              Recruit partners and earn a 5% override on their business referrals
              too (single level).
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
