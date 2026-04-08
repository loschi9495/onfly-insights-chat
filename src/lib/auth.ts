export interface User {
  email: string;
  name: string;
  picture: string;
  credential: string;
}

const STORAGE_KEY = "onfly_insights_user";

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const user = getStoredUser();
  if (!user?.credential) return {};
  return { Authorization: `Bearer ${user.credential}` };
}
