const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${BASE}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const newToken = json.data?.accessToken ?? json.accessToken;
    if (!newToken) return null;
    localStorage.setItem('accessToken', newToken);
    document.cookie = `accessToken=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
    return newToken;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const makeRequest = (t: string | null) =>
    fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...init?.headers,
      },
    });

  let res = await makeRequest(token);

  // Auto-refresh on 401
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await makeRequest(newToken);
    } else {
      // Refresh failed — redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'accessToken=; path=/; max-age=0';
        window.location.href = '/login';
      }
    }
  }

  const json = await res.json();
  if (!res.ok) {
    if (Array.isArray(json)) throw new Error(json.map((e: any) => e.message).join(', '));
    throw new Error(json.message || json.error || 'Request failed');
  }
  return json;
}
