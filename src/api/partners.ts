import { apiUrl } from '../config';

const TOKEN_KEY = 'fiyr_partner_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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

export async function getMePartner() {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  const res = await fetch(apiUrl('/partners/me'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return readJson(res) as Promise<Record<string, unknown>>;
}

export async function getDashboard<T = Record<string, unknown>>() {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  const res = await fetch(apiUrl('/partners/me/dashboard'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await readJson(res)) as T;
}

export async function updatePayoutDetails(body: Record<string, string>) {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  const res = await fetch(apiUrl('/partners/me/payout-details'), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return readJson(res) as Promise<Record<string, unknown>>;
}
