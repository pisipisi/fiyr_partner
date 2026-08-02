import LegalLayout from '../components/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Partner Privacy Policy">
      <p className="legal-lead">
        This Partner Privacy Policy explains how Fiyr, Inc. (“
        <strong>Fiyr</strong>,” “<strong>we</strong>,” “<strong>us</strong>,” or “
        <strong>our</strong>”) collects, uses, and protects personal information
        when you use the Fiyr Partner Portal at{' '}
        <strong>partner.fiyr.io</strong> and related partner tools (the “
        <strong>Partner Portal</strong>”).
      </p>
      <p>
        This policy supplements our general{' '}
        <a href="https://fiyr.io/privacy.html" target="_blank" rel="noopener noreferrer">
          Fiyr Privacy Policy
        </a>
        , which applies to Fiyr’s main products and websites. If there is a conflict
        for partner-specific processing, this Partner Privacy Policy controls for
        the Partner Portal.
      </p>

      <h2>1. Information we collect</h2>
      <h3>1.1 Account and application data</h3>
      <ul>
        <li>Name, email address, password, company name, website, and application notes you submit when applying or updating your profile.</li>
        <li>Partner referral codes, recruiter relationships, and account status.</li>
      </ul>
      <h3>1.2 Tax and payout information</h3>
      <ul>
        <li>
          W-9 data such as legal name, business name, tax classification, address,
          and taxpayer identification number (TIN). TINs are encrypted at rest.
        </li>
        <li>Payout method details such as PayPal email or bank account and routing information for commission payments.</li>
      </ul>
      <h3>1.3 Program activity</h3>
      <ul>
        <li>Referral link clicks, attributions, commission records, payout history, and custom pricing requests.</li>
        <li>Support messages and communications related to your partner account.</li>
      </ul>
      <h3>1.4 Technical data</h3>
      <ul>
        <li>IP address, browser type, device information, session tokens, and usage logs when you access the Partner Portal.</li>
        <li>Referral cookies and session storage used to attribute partner signups and business referrals.</li>
      </ul>

      <h2>2. How we use information</h2>
      <ul>
        <li>Review applications and operate your partner account.</li>
        <li>Track referrals, calculate commissions, and process payouts.</li>
        <li>Collect and validate tax forms required for U.S. payout compliance.</li>
        <li>Prevent fraud, enforce program rules, and secure the Partner Portal.</li>
        <li>Communicate about approvals, pricing decisions, payouts, and program updates.</li>
      </ul>

      <h2>3. How we share information</h2>
      <p>We may share partner information with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> that help us host, secure, email,
          store documents (such as W-9 PDFs), and process payouts.
        </li>
        <li>
          <strong>Payment processors</strong> needed to send commission payments
          you request.
        </li>
        <li>
          <strong>Professional advisors or authorities</strong> when required for
          tax reporting, legal compliance, or to protect rights and safety.
        </li>
      </ul>
      <p>We do not sell partner personal information.</p>

      <h2>4. Retention</h2>
      <p>
        We retain partner account, tax, and payout records as long as needed to
        operate the Partner Program, meet legal and tax obligations (including IRS
        recordkeeping), resolve disputes, and enforce agreements. W-9 and payout
        records may be kept for several years after your last payout as required by
        law.
      </p>

      <h2>5. Security</h2>
      <p>
        We use administrative, technical, and organizational measures to protect
        partner data, including encryption for sensitive tax identifiers and
        access controls for admin review workflows. No method of transmission or
        storage is completely secure.
      </p>

      <h2>6. Your choices and rights</h2>
      <p>
        You may update profile and payout details in Settings. Depending on your
        location, you may have rights to access, correct, delete, or restrict
        certain processing of your personal information. Tax and payout records may
        need to be retained even if you request deletion. Contact us to exercise
        privacy rights.
      </p>

      <h2>7. Cookies and referral tracking</h2>
      <p>
        The Partner Portal and Fiyr referral flows use cookies and similar
        technologies to remember referral codes, attribute signups, and maintain
        login sessions. You can control cookies through your browser settings,
        though some features may not work correctly if cookies are disabled.
      </p>

      <h2>8. International users</h2>
      <p>
        If you access the Partner Portal from outside the United States, your
        information may be processed in the U.S. or other countries where Fiyr or
        its providers operate.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update this Partner Privacy Policy from time to time. We will post
        the revised policy on this page with an updated date.
      </p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions:{' '}
        <a href="mailto:privacy@fiyr.io">privacy@fiyr.io</a>
        <br />
        Partner program:{' '}
        <a href="mailto:partners@fiyr.io">partners@fiyr.io</a>
      </p>
    </LegalLayout>
  );
}
