const BASE_URL = 'http://localhost:8080/api';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      console.warn(`Backend endpoint ${endpoint} returned status ${response.status}. Using local state.`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Backend connection failed for ${endpoint}. Falling back to local state.`);
    return null;
  }
};

