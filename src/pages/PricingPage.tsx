import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  getPricingBasePlans,
  submitPricingRequest,
  updatePricingRequest,
  type PricingBasePlansResponse,
} from '../api/partners';

function money(cents: number, currency = 'usd') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function statusLabel(status: string) {
  if (status === 'pending') return 'Pending review';
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  if (status === 'superseded') return 'Superseded';
  return status;
}

function buildInitialRetail(
  data: PricingBasePlansResponse,
): Record<string, string> {
  const initial: Record<string, string> = {};
  const rejected = data.requests.find((r) => r.status === 'rejected');
  const pending = data.requests.find((r) => r.status === 'pending');

  if (rejected?.proposedPrices?.length) {
    for (const price of rejected.proposedPrices) {
      initial[price.basePriceId] = String(price.unitAmount / 100);
    }
  } else if (pending?.proposedPrices?.length) {
    for (const price of pending.proposedPrices) {
      initial[price.basePriceId] = String(price.unitAmount / 100);
    }
  }

  for (const plan of data.plans) {
    for (const price of plan.prices) {
      if (initial[price.basePriceId] != null) continue;
      if (price.retailUnitAmount != null) {
        initial[price.basePriceId] = String(price.retailUnitAmount / 100);
      } else {
        initial[price.basePriceId] = String(price.wholesaleUnitAmount / 100);
      }
    }
  }

  return initial;
}

export default function PricingPage() {
  const [data, setData] = useState<PricingBasePlansResponse | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [retailByBaseId, setRetailByBaseId] = useState<Record<string, string>>(
    {},
  );

  async function load() {
    setError('');
    try {
      const next = await getPricingBasePlans();
      setData(next);
      setRetailByBaseId(buildInitialRetail(next));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.plans.flatMap((plan) =>
      plan.prices.map((price) => ({
        planName: plan.name,
        basePriceId: price.basePriceId,
        billingPeriod: price.billingPeriod,
        wholesaleUnitAmount: price.wholesaleUnitAmount,
        approvedRetailUnitAmount: price.retailUnitAmount,
        currency: price.currency,
      })),
    );
  }, [data]);

  const preview = useMemo(() => {
    return rows.map((row) => {
      const retailDollars = Number(retailByBaseId[row.basePriceId] ?? '0');
      const retailCents = Math.round(retailDollars * 100);
      const belowWholesale =
        Number.isNaN(retailDollars) || retailCents < row.wholesaleUnitAmount;
      const markup = Math.max(0, retailCents - row.wholesaleUnitAmount);
      const program = Math.round(retailCents * 0.2);
      return {
        ...row,
        retailCents,
        belowWholesale,
        markup,
        estimatedEarnings: markup + program,
      };
    });
  }, [rows, retailByBaseId]);

  const hasInvalidRetail = preview.some((row) => row.belowWholesale);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const proposedPrices = rows.map((row) => {
        const dollars = Number(retailByBaseId[row.basePriceId]);
        if (Number.isNaN(dollars)) {
          throw new Error(`Enter a valid retail price for ${row.planName}`);
        }
        const unitAmount = Math.round(dollars * 100);
        if (unitAmount < row.wholesaleUnitAmount) {
          const period = row.billingPeriod === 'MONTH' ? 'monthly' : 'yearly';
          throw new Error(
            `Retail price for ${row.planName} (${period}) must be at least ${money(row.wholesaleUnitAmount, row.currency)}`,
          );
        }
        return {
          basePriceId: row.basePriceId,
          unitAmount,
          billingPeriod: row.billingPeriod as 'MONTH' | 'YEAR',
        };
      });
      const rejectedRequest = data.requests.find((r) => r.status === 'rejected');
      const hasApprovedSheet = Boolean(data.activeRequest);
      if (rejectedRequest) {
        await updatePricingRequest(rejectedRequest.id, { proposedPrices });
        setMessage('Updated pricing resubmitted for admin approval.');
      } else {
        await submitPricingRequest({ proposedPrices });
        setMessage(
          hasApprovedSheet
            ? 'Price change submitted for admin approval.'
            : 'Pricing submitted for admin approval.',
        );
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setBusy(false);
    }
  }

  const hasPending = data?.requests?.some((r) => r.status === 'pending');
  const hasApprovedSheet = Boolean(data?.activeRequest);

  return (
    <main className="shell section">
      <h2>Custom subscription pricing</h2>
      <p className="muted">
        {hasApprovedSheet
          ? 'Your approved retail prices are shown below with Fiyr wholesale for reference. Edit retail prices and submit a change request when you want admin review.'
          : 'Set retail prices at or above Fiyr wholesale. You earn markup plus 20% program commission on referred business subscriptions.'}
      </p>

      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="ok">{message}</p> : null}

      {hasApprovedSheet && data?.activeRequest ? (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <strong>Active pricing sheet</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0' }}>
            Approved{' '}
            {new Date(data.activeRequest.reviewedAt ?? '').toLocaleString()}
          </p>
        </div>
      ) : null}

      {hasPending ? (
        <div className="card warn-card" style={{ marginBottom: '1rem' }}>
          You have a pending pricing request. Wait for admin review before
          submitting another change.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Period</th>
                <th>Wholesale</th>
                <th>Your retail (USD)</th>
                <th>Markup</th>
                <th>Est. earnings</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row) => (
                <tr key={row.basePriceId}>
                  <td>{row.planName}</td>
                  <td>{row.billingPeriod === 'MONTH' ? 'Monthly' : 'Yearly'}</td>
                  <td>{money(row.wholesaleUnitAmount, row.currency)}</td>
                  <td>
                    <input
                      type="number"
                      min={row.wholesaleUnitAmount / 100}
                      step="0.01"
                      value={retailByBaseId[row.basePriceId] ?? ''}
                      onChange={(ev) =>
                        setRetailByBaseId((prev) => ({
                          ...prev,
                          [row.basePriceId]: ev.target.value,
                        }))
                      }
                      disabled={hasPending || busy}
                      aria-invalid={row.belowWholesale || undefined}
                      className={row.belowWholesale ? 'input-invalid' : undefined}
                    />
                    {row.belowWholesale ? (
                      <p className="field-error">
                        Must be at least{' '}
                        {money(row.wholesaleUnitAmount, row.currency)}
                      </p>
                    ) : null}
                  </td>
                  <td>{money(row.markup, row.currency)}</td>
                  <td>{money(row.estimatedEarnings, row.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy || hasPending || !rows.length || hasInvalidRetail}
          >
            {busy
              ? 'Submitting…'
              : hasApprovedSheet
                ? 'Request price change'
                : 'Submit for approval'}
          </button>
        </div>
      </form>

      {data?.requests?.length ? (
        <section style={{ marginTop: '1.5rem' }}>
          <h3>Request history</h3>
          <ul className="list-plain">
            {data.requests.map((req) => (
              <li key={req.id} className="card" style={{ marginBottom: '0.5rem' }}>
                <strong>{statusLabel(req.status)}</strong>
                {' · '}
                {req.submittedAt
                  ? new Date(req.submittedAt).toLocaleString()
                  : 'Draft'}
                {req.adminNotes ? (
                  <p className="muted" style={{ margin: '0.35rem 0 0' }}>
                    {req.adminNotes}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
