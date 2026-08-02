import LegalLayout from '../components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Partner Program Terms">
      <p className="legal-lead">
        These Partner Program Terms (“<strong>Partner Terms</strong>”) govern your
        participation in the Fiyr partner and affiliate program through{' '}
        <strong>partner.fiyr.io</strong> and related referral tools (the “
        <strong>Partner Program</strong>”). By applying, logging in, or promoting
        Fiyr as a partner, you agree to these Partner Terms and our{' '}
        <a href="/privacy">Partner Privacy Policy</a>.
      </p>

      <h2>1. Eligibility and approval</h2>
      <p>
        You must be at least 18 years old and able to enter a binding agreement.
        Partner accounts require Fiyr approval. We may approve, reject, suspend,
        or terminate participation at any time, with or without cause.
      </p>

      <h2>2. Program overview</h2>
      <p>
        Approved partners receive unique referral links to promote Fiyr to
        businesses and, separately, to recruit other partners. Commissions apply
        only to qualifying <strong>SaaS subscription payments</strong> by referred
        businesses—not to one-off bookings, POS transactions, or other non-subscription
        revenue unless Fiyr explicitly states otherwise in writing.
      </p>

      <h2>3. Commissions</h2>
      <h3>3.1 Business referrals</h3>
      <p>
        Default rate: <strong>20%</strong> of paid subscription invoices from a
        referred business for <strong>12 months</strong> from the date of
        attribution, unless a different rate is shown in your partner dashboard.
      </p>
      <h3>3.2 Partner recruitment override</h3>
      <p>
        When you recruit another approved partner using your recruit link, you
        may earn a default <strong>5% override</strong> on paid subscription
        invoices from businesses that recruited partner refers, for the same
        12-month attribution window. Overrides are <strong>single-level only</strong>{' '}
        (no multi-level or pyramid-style compensation).
      </p>
      <h3>3.3 Custom pricing</h3>
      <p>
        If Fiyr approves your custom pricing sheet, you may set retail
        subscription prices at or above Fiyr wholesale for businesses you refer.
        On partner-priced plans, your earnings generally include{' '}
        <strong>retail markup</strong> plus the <strong>20% program commission</strong>{' '}
        on the subscription invoice. If you recruited the selling partner, your
        override applies to the <strong>base wholesale amount</strong>, not the
        full retail invoice.
      </p>
      <h3>3.4 Adjustments</h3>
      <p>
        Commissions may be reversed or adjusted if an invoice is refunded,
        charged back, or found invalid before payout. Self-referrals, duplicate
        accounts, and fraudulent attributions are not eligible.
      </p>

      <h2>4. Attribution</h2>
      <p>
        Business referrals use first-touch attribution via referral parameters and
        cookies for up to <strong>90 days</strong> on Fiyr marketing and
        registration flows. The first valid partner touch within that window
        receives credit unless Fiyr determines the attribution is invalid.
      </p>

      <h2>5. Promotion rules</h2>
      <ul>
        <li>Do not misrepresent Fiyr features, pricing, or availability.</li>
        <li>Do not use spam, deceptive ads, trademark bidding without permission, or incentivized clicks that violate platform policies.</li>
        <li>Do not imply you are Fiyr, an employee, or an official representative unless authorized in writing.</li>
        <li>Comply with applicable advertising, disclosure, and consumer-protection laws, including clear affiliate disclosures where required.</li>
      </ul>

      <h2>6. Payouts and tax</h2>
      <p>
        Payouts are processed manually after review. Before your first payout,
        you must submit a completed <strong>W-9</strong> (online or signed PDF)
        and valid payout details (PayPal or bank transfer). You are responsible
        for your own taxes on partner earnings. Fiyr may issue IRS Form 1099 or
        other tax forms when required by law.
      </p>

      <h2>7. Confidentiality and brand use</h2>
      <p>
        Non-public commission rates, wholesale pricing, and dashboard data are
        confidential. You may use Fiyr name and approved marketing assets only as
        permitted by Fiyr. Do not modify logos or create confusingly similar
        branding.
      </p>

      <h2>8. Suspension and termination</h2>
      <p>
        Fiyr may withhold unpaid commissions and suspend or terminate your account
        for fraud, policy violations, misleading promotion, or abuse of referral
        tracking. Upon termination, your right to earn new commissions ends
        immediately, except for commissions already earned and approved for
        payout under these Partner Terms.
      </p>

      <h2>9. Disclaimers and liability</h2>
      <p>
        The Partner Program is provided “as is.” Fiyr does not guarantee any
        particular volume of referrals, conversions, or earnings. To the maximum
        extent permitted by law, Fiyr is not liable for indirect or consequential
        damages arising from your participation in the Partner Program.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these Partner Terms from time to time. Material changes will
        be posted on this page with an updated date. Continued participation after
        changes become effective constitutes acceptance.
      </p>

      <h2>11. Contact</h2>
      <p>
        Partner program questions:{' '}
        <a href="mailto:partners@fiyr.io">partners@fiyr.io</a>
        <br />
        Legal: <a href="mailto:legal@fiyr.io">legal@fiyr.io</a>
      </p>
    </LegalLayout>
  );
}
