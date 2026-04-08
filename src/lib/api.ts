import { getAuthHeaders, clearUser } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "";

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    clearUser();
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }
  return res;
}

export async function askQuestion(question: string, sessionId: string): Promise<{ answer: string; session_id: string }> {
  const res = await authFetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, session_id: sessionId }),
  });
  if (!res.ok) {
    throw new Error("Erro ao consultar dados");
  }
  return res.json();
}

export async function resetSession(sessionId: string): Promise<void> {
  await authFetch(`${API_URL}/reset?session_id=${sessionId}`, { method: "POST" });
}

export async function getSuggestions(): Promise<string[]> {
  try {
    const res = await authFetch(`${API_URL}/suggestions`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.suggestions;
  } catch {
    return [
      "Qual o GMV total por modalidade no Q1 2026?",
      "Top 10 empresas por GMV em 2026",
      "Compare o GMV de janeiro vs fevereiro 2026",
      "Qual o take rate por consolidador?",
      "Quais empresas fizeram churn em 2026?",
      "NPS médio por tamanho de empresa",
    ];
  }
}

export async function loginWithGoogle(credential: string): Promise<{ email: string; name: string; picture: string }> {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Erro ao autenticar" }));
    throw new Error(error.detail || "Erro ao autenticar");
  }
  return res.json();
}
