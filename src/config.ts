const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function getApiBase(): string {
  return API_BASE.replace(/\/$/, '');
}

export function apiUrl(path: string): string {
  return `${getApiBase()}/api${path.startsWith('/') ? path : `/${path}`}`;
}
