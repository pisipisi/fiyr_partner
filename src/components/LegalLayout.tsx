import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LEGAL_LINKS = [
  { to: '/terms', label: 'Partner terms' },
  { to: '/privacy', label: 'Partner privacy' },
] as const;

type LegalLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  const { pathname } = useLocation();

  return (
    <main className="shell section legal-page">
      <div className="legal-layout">
        <nav className="legal-nav card" aria-label="Legal documents">
          <p className="legal-nav-label">Legal</p>
          <ul className="legal-nav-list">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={pathname === link.to ? 'active' : undefined}
                  aria-current={pathname === link.to ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="legal-nav-note muted">
            General Fiyr policies:{' '}
            <a href="https://fiyr.io/privacy.html" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            {' · '}
            <a href="https://fiyr.io/terms.html" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
          </p>
        </nav>
        <article className="legal-prose card">
          <p className="legal-updated muted">Last updated: August 2, 2026</p>
          <h1>{title}</h1>
          {children}
        </article>
      </div>
    </main>
  );
}
