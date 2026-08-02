import { apiUrl } from '../config';

const REF_KEY = 'fiyr_partner_ref';

/** Record a partner recruit link click (best-effort). */
async function recordPartnerReferralClick(code: string) {
  try {
    const path = window.location.pathname;
    await fetch(
      `${apiUrl(`/partners/r/${encodeURIComponent(code)}`)}?path=${encodeURIComponent(path)}`,
      { method: 'GET' },
    );
  } catch {
    // Non-blocking analytics
  }
}

/**
 * Capture partner `?ref=` from any route and persist first-touch for apply flow.
 * Call once at app boot and when the query string changes.
 */
export function capturePartnerReferralCode(): string | null {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('ref')?.trim();

  if (fromUrl) {
    const existing = sessionStorage.getItem(REF_KEY);
    if (existing !== fromUrl) {
      sessionStorage.setItem(REF_KEY, fromUrl);
      void recordPartnerReferralClick(fromUrl);
    }
    return fromUrl;
  }

  return sessionStorage.getItem(REF_KEY);
}

export function getStoredPartnerReferralCode(): string | null {
  return sessionStorage.getItem(REF_KEY);
}

/** Apply path with stored recruit ref when present. */
export function applyPathWithReferral(): string {
  const ref = getStoredPartnerReferralCode();
  return ref ? `/apply?ref=${encodeURIComponent(ref)}` : '/apply';
}
