import { Link } from 'react-router-dom';
import {
  IconArrowRight,
  IconCheckCircle,
  IconClock,
  IconDollar,
  IconShield,
  IconSpark,
  IconTrending,
  IconUsers,
} from '../components/Icons';
import { applyPathWithReferral } from '../utils/partnerReferral';

const STEPS = [
  {
    title: 'Apply & get approved',
    body: 'Tell us how you promote salons and wellness businesses. We review applications quickly.',
  },
  {
    title: 'Share your links',
    body: 'Send businesses your signup link, or recruit other partners with your apply link.',
  },
  {
    title: 'Earn on paid plans',
    body: '20% of each paid subscription invoice for 12 months, plus 5% override on recruited partners.',
  },
] as const;

export default function HomePage() {
  const applyHref = applyPathWithReferral();

  return (
    <main>
      <section className="shell landing-hero">
        <div>
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden />
            Partner program · Now accepting applications
          </div>
          <h1>
            Grow Fiyr.
            <br />
            <span>Earn recurring commissions.</span>
          </h1>
          <p className="hero-lead">
            Share your referral link, bring new businesses to Fiyr, and earn when
            they subscribe — for up to 12 months on every paid invoice.
          </p>
          <div className="hero-actions">
            <Link to={applyHref} className="btn btn-primary">
              Become a partner
              <IconArrowRight />
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Partner login
            </Link>
          </div>
          <div className="trust-row" style={{ justifyContent: 'flex-start' }}>
            <span className="trust-item">
              <IconShield />
              Secure payouts
            </span>
            <span className="trust-item">
              <IconCheckCircle />
              Transparent dashboard
            </span>
            <span className="trust-item">
              <IconTrending />
              Recurring revenue
            </span>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Commission highlights">
          <div className="hero-panel-title">What you earn</div>
          <div className="hero-metrics">
            <div className="hero-metric">
              <div className="hero-metric-icon gold">
                <IconDollar />
              </div>
              <div>
                <div className="hero-metric-value">20%</div>
                <div className="hero-metric-label">Of paid subscription invoices</div>
              </div>
            </div>
            <div className="hero-metric">
              <div className="hero-metric-icon purple">
                <IconClock />
              </div>
              <div>
                <div className="hero-metric-value">12 mo</div>
                <div className="hero-metric-label">Recurring commission window</div>
              </div>
            </div>
            <div className="hero-metric">
              <div className="hero-metric-icon green">
                <IconUsers />
              </div>
              <div>
                <div className="hero-metric-value">5%</div>
                <div className="hero-metric-label">Override on recruited partners</div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>How it works</h2>
          <p>One referral code. Paid subscriptions only. Full visibility in your dashboard.</p>
        </div>
        <div className="grid-3">
          {STEPS.map((step, i) => (
            <article key={step.title} className="step-card">
              <div className="step-num">{i + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section" style={{ paddingTop: 0 }}>
        <div className="cta-band">
          <div className="hero-eyebrow" style={{ margin: '0 auto 1rem' }}>
            <IconSpark />
            Start earning today
          </div>
          <h2>Ready to partner with Fiyr?</h2>
          <p>Apply in minutes. Get your links after approval and start referring businesses.</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to={applyHref} className="btn btn-accent">
              Apply now
              <IconArrowRight />
            </Link>
            <Link to="/terms" className="btn btn-ghost">
              Partner terms
            </Link>
            <Link to="/privacy" className="btn btn-ghost">
              Privacy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
