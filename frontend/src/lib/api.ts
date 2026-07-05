const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('lobna_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint?.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'حدث خطأ ما');
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
  /** Upload a file — returns { success, url } */
  upload: async (file: File): Promise<{ success: boolean; url: string }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lobna_token') : null
    const form = new FormData()
    form.append('file', file)
    const url = `${API_URL}/upload`
    const res = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Upload failed')
    return data
  },
};

export default api;
