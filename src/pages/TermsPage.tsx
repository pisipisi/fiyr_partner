export default function TermsPage() {
  return (
    <main className="shell section">
      <h2>Partner program terms</h2>
      <div className="card" style={{ maxWidth: 720, display: 'grid', gap: '0.85rem' }}>
        <p>
          Partners earn commissions for referred businesses that complete a new
          Fiyr signup and pay for a subscription. Default rate: 20% of paid
          subscription invoices for 12 months from attribution.
        </p>
        <p>
          Partners may also recruit other partners with a unique apply link.
          When a recruited partner refers a paying business, the recruiting
          partner earns a default 5% override on that business’s paid subscription
          invoices for the same 12-month window (single level only).
        </p>
        <p>
          Attribution uses first-touch cookies for 90 days on marketing and
          register flows. Self-referrals are not eligible. Commissions reverse if
          a subscription invoice is refunded and the commission has not yet been
          paid.
        </p>
        <p>
          Customer booking traffic is not part of this partner program.
          Commissions apply only to SaaS subscription payments.
        </p>
        <p>
          Approved custom pricing lets you set retail subscription rates at or
          above Fiyr wholesale for businesses you refer. Your earnings on
          partner-priced plans are retail markup plus 20% program commission.
          If you recruit other partners, you earn a 5% override on the base
          wholesale price (not the full invoice) when they sell partner-priced
          plans.
        </p>
        <p>
          Fiyr may approve, reject, suspend, or adjust partner rates. Payouts are
          processed manually after review. You must complete the W-9 form (online
          or upload a signed PDF) and valid payout details (PayPal or bank)
          before your first payout. Fraudulent traffic or misleading ads may
          result in forfeiture of unpaid commissions and account suspension.
        </p>
        <p>
          These MVP terms may be updated. Continued participation after notice
          constitutes acceptance.
        </p>
      </div>
    </main>
  );
}
