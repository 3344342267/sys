const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  const authData = localStorage.getItem('novelist-auth');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.state?.token;
    } catch {
      return null;
    }
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  auth: {
    register: (email: string, password: string, nickname: string) =>
      request<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, nickname }),
      }),
    login: (email: string, password: string) =>
      request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request<any>('/auth/logout', { method: 'POST' }),
    me: () => request<any>('/auth/me'),
  },
  projects: {
    list: () => request<any>('/projects'),
    create: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => request<any>(`/projects/${id}`),
    update: (id: string, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/projects/${id}`, { method: 'DELETE' }),
    stats: (id: string) => request<any>(`/projects/${id}/stats`),
  },
  chapters: {
    list: (projectId: string) => request<any>(`/projects/${projectId}/chapters`),
    create: (projectId: string, data: any) =>
      request<any>(`/projects/${projectId}/chapters`, { method: 'POST', body: JSON.stringify(data) }),
    get: (projectId: string, id: string) => request<any>(`/projects/${projectId}/chapters/${id}`),
    update: (projectId: string, id: string, data: any) =>
      request<any>(`/projects/${projectId}/chapters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (projectId: string, id: string) =>
      request<any>(`/projects/${projectId}/chapters/${id}`, { method: 'DELETE' }),
    reorder: (projectId: string, orders: any[]) =>
      request<any>(`/projects/${projectId}/chapters/reorder`, { method: 'PUT', body: JSON.stringify({ orders }) }),
  },
  elements: {
    list: (projectId: string) => request<any>(`/projects/${projectId}/elements`),
    create: (projectId: string, data: any) =>
      request<any>(`/projects/${projectId}/elements`, { method: 'POST', body: JSON.stringify(data) }),
    get: (projectId: string, id: string) => request<any>(`/projects/${projectId}/elements/${id}`),
    update: (projectId: string, id: string, data: any) =>
      request<any>(`/projects/${projectId}/elements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (projectId: string, id: string) =>
      request<any>(`/projects/${projectId}/elements/${id}`, { method: 'DELETE' }),
  },
};
