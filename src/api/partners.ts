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

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    return res.statusText || `HTTP ${res.status}`;
  } catch {
    return res.statusText || `HTTP ${res.status}`;
  }
}

export async function applyPartner(body: {
  email: string;
  password: string;
  fullName?: string;
  companyName?: string;
  website?: string;
  preferredCode?: string;
  applicationNote?: string;
}) {
  const res = await fetch(apiUrl('/partners/apply'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  if (data.access_token) setToken(data.access_token);
  return data;
}

export async function getMePartner() {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  const res = await fetch(apiUrl('/partners/me'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getDashboard() {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  const res = await fetch(apiUrl('/partners/me/dashboard'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
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
  return res.json();
}
