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

export async function askQuestion(question: string, sessionId: string): Promise<{ answer: string; session_id: string; follow_ups: string[] }> {
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

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  variables?: { name: string; label: string; type: string; placeholder: string }[];
}

export async function getTemplates(): Promise<Template[]> {
  try {
    const res = await authFetch(`${API_URL}/templates`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.templates;
  } catch {
    return [];
  }
}

export async function renderTemplate(templateId: string, variables?: Record<string, string>): Promise<string> {
  const res = await authFetch(`${API_URL}/templates/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id: templateId, variables }),
  });
  if (!res.ok) throw new Error("Erro ao renderizar template");
  const data = await res.json();
  return data.prompt;
}

export function askQuestionStream(
  question: string,
  sessionId: string,
  onStatus: (msg: string) => void,
  onText: (chunk: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
): AbortController {
  const controller = new AbortController();
  const headers = getAuthHeaders();

  fetch(`${API_URL}/ask/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ question, session_id: sessionId }),
    signal: controller.signal,
  }).then(async (res) => {
    if (res.status === 401) {
      clearUser();
      window.location.href = "/login";
      return;
    }
    if (!res.ok || !res.body) {
      onError("Erro ao consultar dados");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const event = JSON.parse(line.slice(6));
          if (event.type === "status") onStatus(event.content);
          else if (event.type === "text") onText(event.content);
          else if (event.type === "done") onDone();
          else if (event.type === "error") onError(event.content);
        } catch { /* skip malformed */ }
      }
    }
  }).catch((err) => {
    if (err.name !== "AbortError") onError("Erro de conexão");
  });

  return controller;
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
