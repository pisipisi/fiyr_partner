const REF_KEY = 'fiyr_partner_ref';

/** Captures partner `?ref=` from URL and persists first-touch for apply flow. */
export function capturePartnerReferralCode(): string | null {
  const existing = sessionStorage.getItem(REF_KEY);
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('ref')?.trim();
  if (fromUrl) {
    sessionStorage.setItem(REF_KEY, fromUrl);
    return fromUrl;
  }
  return null;
}

export function getStoredPartnerReferralCode(): string | null {
  return sessionStorage.getItem(REF_KEY);
}
