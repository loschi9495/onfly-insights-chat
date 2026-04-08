export interface User {
  email: string;
  name: string;
  picture: string;
}

interface StoredAuth {
  user: User;
  access_token: string;
  refresh_token: string;
}

const STORAGE_KEY = "onfly_insights_auth";
const API_URL = import.meta.env.VITE_API_URL || "";

export function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function getStoredUser(): User | null {
  return getStoredAuth()?.user || null;
}

export function storeAuth(data: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const auth = getStoredAuth();
  if (!auth?.access_token) return {};
  return { Authorization: `Bearer ${auth.access_token}` };
}

export async function refreshToken(): Promise<boolean> {
  const auth = getStoredAuth();
  if (!auth?.refresh_token) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: auth.refresh_token }),
    });

    if (!res.ok) {
      clearUser();
      return false;
    }

    const data = await res.json();
    storeAuth({ ...auth, access_token: data.access_token });
    return true;
  } catch {
    clearUser();
    return false;
  }
}
