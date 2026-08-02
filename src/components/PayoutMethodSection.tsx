import { useEffect, useState, type FormEvent } from 'react';
import { updatePayoutDetails } from '../api/partners';
import { IconClock } from './Icons';

type PayoutDetails = {
  method?: string;
  paypalEmail?: string;
  bankAccountName?: string;
  bankName?: string;
  bankRoutingLast4?: string;
  bankAccountLast4?: string;
  notes?: string;
} | null;

type Props = {
  payoutDetails?: PayoutDetails;
  onSaved: () => Promise<void>;
};

export default function PayoutMethodSection({ payoutDetails, onSaved }: Props) {
  const [payoutMethod, setPayoutMethod] = useState(
    payoutDetails?.method || 'paypal',
  );
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPayoutMethod(payoutDetails?.method || 'paypal');
  }, [payoutDetails?.method]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const method = String(fd.get('method') || 'paypal');
    const payload: Record<string, string> = {
      method,
      notes: String(fd.get('notes') || ''),
    };
    if (method === 'paypal') {
      payload.paypalEmail = String(fd.get('paypalEmail') || '');
    } else if (method === 'bank') {
      payload.bankAccountName = String(fd.get('bankAccountName') || '');
      payload.bankName = String(fd.get('bankName') || '');
      payload.bankRoutingNumber = String(fd.get('bankRoutingNumber') || '');
      payload.bankAccountNumber = String(fd.get('bankAccountNumber') || '');
    }
    try {
      await updatePayoutDetails(payload);
      setMsg('Payout details saved.');
      await onSaved();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  const payout = payoutDetails;

  return (
    <section className="card settings-section">
      <div className="card-head">
        <div>
          <h3>Payout method</h3>
          <p className="card-desc">Where we send your commissions</p>
        </div>
        <IconClock className="card-head-icon" />
      </div>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Method
          <select
            name="method"
            value={payoutMethod}
            onChange={(e) => setPayoutMethod(e.target.value)}
          >
            <option value="paypal">PayPal</option>
            <option value="bank">Bank transfer (ACH)</option>
            <option value="other">Other</option>
          </select>
        </label>

        {payoutMethod === 'paypal' ? (
          <label>
            PayPal email
            <input
              name="paypalEmail"
              type="email"
              required
              defaultValue={payout?.paypalEmail || ''}
            />
          </label>
        ) : null}

        {payoutMethod === 'bank' ? (
          <>
            <label>
              Account holder name
              <input
                name="bankAccountName"
                type="text"
                required
                defaultValue={payout?.bankAccountName || ''}
              />
            </label>
            <label>
              Bank name (optional)
              <input
                name="bankName"
                type="text"
                defaultValue={payout?.bankName || ''}
              />
            </label>
            <label>
              Routing number
              <input
                name="bankRoutingNumber"
                type="text"
                inputMode="numeric"
                pattern="\d{9}"
                maxLength={9}
                required
                placeholder="9 digits"
              />
            </label>
            <label>
              Account number
              <input
                name="bankAccountNumber"
                type="text"
                inputMode="numeric"
                required
                minLength={4}
                maxLength={17}
                placeholder={
                  payout?.bankAccountLast4
                    ? `Saved ···${payout.bankAccountLast4} (enter full number to update)`
                    : undefined
                }
              />
            </label>
            {payout?.bankAccountLast4 ? (
              <p className="muted" style={{ fontSize: '0.82rem' }}>
                Current account ending in {payout.bankAccountLast4}
                {payout.bankRoutingLast4
                  ? ` · routing ···${payout.bankRoutingLast4}`
                  : ''}
              </p>
            ) : null}
          </>
        ) : null}

        <label>
          Notes
          <textarea name="notes" defaultValue={payout?.notes || ''} />
        </label>
        {msg ? (
          <p className={msg.includes('saved') ? 'success' : 'error'}>{msg}</p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save payout details'}
        </button>
      </form>
    </section>
  );
}
