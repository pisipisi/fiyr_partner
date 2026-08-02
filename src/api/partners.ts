import { apiUrl } from '../config';

const TOKEN_KEY = 'fiyr_partner_token';

export const AUTH_CHANGED_EVENT = 'fiyr-partner-auth-changed';

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 <= Date.now() + 5000;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Returns a non-expired token, clearing storage if the saved token is stale. */
export function getValidToken(): string | null {
  const token = getToken();
  if (!token) return null;
  if (isTokenExpired(token)) {
    clearToken();
    notifyAuthChanged();
    return null;
  }
  return token;
}

export function hasValidSession(): boolean {
  return !!getValidToken();
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChanged();
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChanged();
}

export function logout(redirectTo = '/') {
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChanged();
  if (redirectTo) {
    window.location.href = redirectTo;
  }
}

async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getValidToken();
  if (!token) throw new Error('Not logged in');

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(apiUrl(path), { ...init, headers });

  if (res.status === 401 || res.status === 403) {
    clearToken();
    const currentPath = window.location.pathname;
    const isPublic =
      currentPath === '/' ||
      currentPath.startsWith('/login') ||
      currentPath.startsWith('/apply') ||
      currentPath.startsWith('/forgot-password') ||
      currentPath.startsWith('/reset-password') ||
      currentPath.startsWith('/terms');
    if (!isPublic) {
      window.location.href = '/login?session=expired';
    }
    throw new Error('Session expired. Please sign in again.');
  }

  return res;
}

async function authJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await authFetch(path, init);
  if (!res.ok) throw new Error(await parseError(res));
  return (await readJson(res)) as T;
}

async function readJson(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!contentType.includes('application/json')) {
    throw new Error(
      `API returned non-JSON (${res.status}). Check VITE_API_BASE_URL and that uzmos-api with the partners module is deployed.`,
    );
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Invalid JSON from API (${res.status}). Check VITE_API_BASE_URL.`,
    );
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await readJson(res)) as { message?: string | string[] };
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    return res.statusText || `HTTP ${res.status}`;
  } catch (err) {
    return err instanceof Error
      ? err.message
      : res.statusText || `HTTP ${res.status}`;
  }
}

export async function applyPartner(body: {
  email: string;
  password: string;
  fullName?: string;
  companyName?: string;
  website?: string;
  preferredCode?: string;
  referralCode?: string;
  applicationNote?: string;
}) {
  const res = await fetch(apiUrl('/partners/apply'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return readJson(res);
}

export async function login(email: string, password: string) {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await readJson(res)) as { access_token?: string };
  if (data.access_token) setToken(data.access_token);
  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(apiUrl('/auth/forgot-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, client: 'partner' }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return readJson(res) as Promise<{ message?: string }>;
}

export async function resetPassword(body: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch(apiUrl('/auth/reset-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return readJson(res) as Promise<{ message?: string }>;
}

export type PartnerProfile = {
  id?: string;
  email: string;
  fullName?: string | null;
  companyName?: string | null;
  website?: string | null;
  code: string;
  status: string;
  businessCommissionPercent?: number;
  recurringMonths?: number;
  w9Submitted?: boolean;
  w9SubmittedAt?: string | null;
  w9Summary?: {
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
  } | null;
  payoutDetails?: {
    method?: string;
    paypalEmail?: string;
    bankAccountName?: string;
    bankName?: string;
    bankRoutingLast4?: string;
    bankAccountLast4?: string;
    notes?: string;
  } | null;
};

export async function getMePartner() {
  return authJson<PartnerProfile>('/partners/me');
}

export async function updatePartnerProfile(body: {
  fullName?: string;
  companyName?: string;
  website?: string;
}) {
  return authJson<PartnerProfile>('/partners/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function updatePartnerPassword(body: {
  currentPassword: string;
  newPassword: string;
}) {
  return authJson<{ message?: string }>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    }),
  });
}

export async function getDashboard<T = Record<string, unknown>>() {
  return authJson<T>('/partners/me/dashboard');
}

export async function updatePayoutDetails(body: Record<string, string>) {
  return authJson<Record<string, unknown>>('/partners/me/payout-details', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function submitW9Form(body: {
  legalName: string;
  businessName?: string;
  taxClassification: string;
  llcTaxClassification?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  tinType: 'ssn' | 'ein';
  tin: string;
  signatureName: string;
  certify: boolean;
}) {
  return authJson<Record<string, unknown>>('/partners/me/w9/form', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function uploadW9(file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await authFetch('/partners/me/w9', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return readJson(res) as Promise<Record<string, unknown>>;
}

export type ProposedPartnerPrice = {
  basePriceId: string;
  unitAmount: number;
  billingPeriod: 'MONTH' | 'YEAR';
};

export type PartnerPricingRequest = {
  id: string;
  status: string;
  proposedPrices: ProposedPartnerPrice[];
  submittedAt?: string | null;
  reviewedAt?: string | null;
  adminNotes?: string | null;
};

export type PricingBasePlansResponse = {
  plans: Array<{
    id: string;
    name: string;
    description: string;
    prices: Array<{
      basePriceId: string;
      billingPeriod: string;
      wholesaleUnitAmount: number;
      retailUnitAmount: number | null;
      currency: string;
    }>;
  }>;
  requests: PartnerPricingRequest[];
  activeRequest: PartnerPricingRequest | null;
};

export async function getPricingBasePlans() {
  return authJson<PricingBasePlansResponse>('/partners/me/pricing/base-plans');
}

export async function submitPricingRequest(body: {
  proposedPrices: ProposedPartnerPrice[];
}) {
  return authJson<PartnerPricingRequest>('/partners/me/pricing/requests', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updatePricingRequest(
  requestId: string,
  body: { proposedPrices: ProposedPartnerPrice[] },
) {
  return authJson<PartnerPricingRequest>(
    `/partners/me/pricing/requests/${requestId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
}
