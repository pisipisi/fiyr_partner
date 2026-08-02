import { useState, type FormEvent } from 'react';
import { submitW9Form, uploadW9 } from '../api/partners';
import { IconFileText } from './Icons';

type W9Summary = {
  legalName?: string;
  businessName?: string;
  taxClassification?: string;
  llcTaxClassification?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  tinType?: string;
  tinLast4?: string;
  signatureName?: string;
  signedAt?: string;
};

type Props = {
  w9Submitted?: boolean;
  w9SubmittedAt?: string | null;
  w9Summary?: W9Summary | null;
  onSubmitted: () => Promise<void>;
};

const TAX_CLASS_OPTIONS = [
  { value: 'individual', label: 'Individual / sole proprietor or single-member LLC' },
  { value: 'c_corp', label: 'C Corporation' },
  { value: 's_corp', label: 'S Corporation' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'trust_estate', label: 'Trust / estate' },
  { value: 'llc', label: 'LLC (specify tax classification below)' },
  { value: 'other', label: 'Other' },
] as const;

function taxClassLabel(value?: string) {
  return TAX_CLASS_OPTIONS.find((o) => o.value === value)?.label || value || '—';
}

export default function W9Section({
  w9Submitted,
  w9SubmittedAt,
  w9Summary,
  onSubmitted,
}: Props) {
  const [mode, setMode] = useState<'form' | 'upload'>('form');
  const [taxClassification, setTaxClassification] = useState(
    w9Summary?.taxClassification || 'individual',
  );
  const [tinType, setTinType] = useState<'ssn' | 'ein'>(
    (w9Summary?.tinType as 'ssn' | 'ein') || 'ssn',
  );
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      await submitW9Form({
        legalName: String(fd.get('legalName') || ''),
        businessName: String(fd.get('businessName') || '') || undefined,
        taxClassification: String(fd.get('taxClassification') || 'individual'),
        llcTaxClassification:
          taxClassification === 'llc'
            ? String(fd.get('llcTaxClassification') || '')
            : undefined,
        addressLine1: String(fd.get('addressLine1') || ''),
        addressLine2: String(fd.get('addressLine2') || '') || undefined,
        city: String(fd.get('city') || ''),
        state: String(fd.get('state') || '').toUpperCase(),
        zip: String(fd.get('zip') || ''),
        tinType,
        tin: String(fd.get('tin') || ''),
        signatureName: String(fd.get('signatureName') || ''),
        certify: fd.get('certify') === 'on',
      });
      setMsg('W-9 submitted successfully.');
      await onSubmitted();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setBusy(false);
    }
  }

  async function onUploadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg('');
    const input = e.currentTarget.elements.namedItem('w9File') as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      setMsg('Choose a PDF file to upload.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setMsg('W-9 must be a PDF file.');
      return;
    }
    setBusy(true);
    try {
      await uploadW9(file);
      setMsg('W-9 uploaded successfully.');
      input.value = '';
      await onSubmitted();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card settings-section">
      <div className="card-head">
        <div>
          <h3>Tax form (W-9)</h3>
          <p className="card-desc">
            Required before your first payout
          </p>
        </div>
        <IconFileText className="card-head-icon" />
      </div>
      <p className="muted" style={{ marginBottom: '0.85rem' }}>
        Fill out the form and we generate your W-9 PDF, or upload a signed copy.
      </p>

      {w9Submitted ? (
        <p className="success" style={{ marginTop: '0.75rem' }}>
          W-9 on file
          {w9SubmittedAt
            ? ` · submitted ${new Date(w9SubmittedAt).toLocaleDateString()}`
            : ''}
          {w9Summary?.legalName ? ` · ${w9Summary.legalName}` : ''}
          {w9Summary?.tinLast4
            ? ` · ${w9Summary.tinType === 'ein' ? 'EIN' : 'SSN'} ···${w9Summary.tinLast4}`
            : ''}
          . You can submit again to replace it.
        </p>
      ) : null}

      <div className="tab-group">
        <button
          type="button"
          className={`btn btn-sm ${mode === 'form' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setMode('form')}
        >
          Fill out online
        </button>
        <button
          type="button"
          className={`btn btn-sm ${mode === 'upload' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setMode('upload')}
        >
          Upload PDF
        </button>
      </div>

      {mode === 'form' ? (
        <form className="form" onSubmit={onFormSubmit} style={{ marginTop: '0.85rem' }}>
          <label>
            Legal name (as on tax return)
            <input
              name="legalName"
              type="text"
              required
              defaultValue={w9Summary?.legalName || ''}
            />
          </label>
          <label>
            Business name (if different)
            <input
              name="businessName"
              type="text"
              defaultValue={w9Summary?.businessName || ''}
            />
          </label>
          <label>
            Federal tax classification
            <select
              name="taxClassification"
              value={taxClassification}
              onChange={(e) => setTaxClassification(e.target.value)}
              required
            >
              {TAX_CLASS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {taxClassification === 'llc' ? (
            <label>
              LLC tax classification
              <select
                name="llcTaxClassification"
                defaultValue={w9Summary?.llcTaxClassification || 'P'}
                required
              >
                <option value="C">C Corporation</option>
                <option value="S">S Corporation</option>
                <option value="P">Partnership</option>
              </select>
            </label>
          ) : null}
          <label>
            Street address
            <input
              name="addressLine1"
              type="text"
              required
              defaultValue={w9Summary?.addressLine1 || ''}
            />
          </label>
          <label>
            Apt / suite (optional)
            <input
              name="addressLine2"
              type="text"
              defaultValue={w9Summary?.addressLine2 || ''}
            />
          </label>
          <div className="form-grid-3">
            <label>
              City
              <input name="city" type="text" required defaultValue={w9Summary?.city || ''} />
            </label>
            <label>
              State
              <input
                name="state"
                type="text"
                required
                maxLength={2}
                pattern="[A-Za-z]{2}"
                placeholder="TX"
                defaultValue={w9Summary?.state || ''}
              />
            </label>
            <label>
              ZIP
              <input
                name="zip"
                type="text"
                required
                pattern="\d{5}(-\d{4})?"
                placeholder="78701"
                defaultValue={w9Summary?.zip || ''}
              />
            </label>
          </div>
          <label>
            Tax ID type
            <select
              name="tinType"
              value={tinType}
              onChange={(e) => setTinType(e.target.value as 'ssn' | 'ein')}
            >
              <option value="ssn">Social Security Number (SSN)</option>
              <option value="ein">Employer Identification Number (EIN)</option>
            </select>
          </label>
          <label>
            {tinType === 'ssn' ? 'SSN' : 'EIN'}
            <input
              name="tin"
              type="text"
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder={tinType === 'ssn' ? '123-45-6789' : '12-3456789'}
            />
          </label>
          <label>
            Electronic signature (type your full legal name)
            <input
              name="signatureName"
              type="text"
              required
              defaultValue={w9Summary?.signatureName || w9Summary?.legalName || ''}
            />
          </label>
          <label style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.5rem' }}>
            <input name="certify" type="checkbox" required style={{ width: 'auto' }} />
            <span>
              Under penalties of perjury, I certify that this information is
              correct and I am a U.S. person for tax purposes (
              {taxClassLabel(taxClassification)}).
            </span>
          </label>
          {msg ? (
            <p className={msg.includes('success') ? 'success' : 'error'}>{msg}</p>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Submitting…' : 'Submit W-9'}
          </button>
        </form>
      ) : (
        <form className="form" onSubmit={onUploadSubmit} style={{ marginTop: '0.85rem' }}>
          <label>
            Signed W-9 (PDF)
            <input name="w9File" type="file" accept="application/pdf,.pdf" />
          </label>
          <p className="muted">
            Need the blank form?{' '}
            <a
              href="https://www.irs.gov/forms-pubs/about-form-w-9"
              target="_blank"
              rel="noreferrer"
            >
              Download from IRS
            </a>
          </p>
          {msg ? (
            <p className={msg.includes('success') ? 'success' : 'error'}>{msg}</p>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Uploading…' : 'Upload W-9'}
          </button>
        </form>
      )}
    </section>
  );
}
