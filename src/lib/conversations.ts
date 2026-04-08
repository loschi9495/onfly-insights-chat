import { v4 as uuidv4 } from "uuid";

export interface Message {
  role: "user" | "agent";
  content: string;
  follow_ups?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const STORAGE_KEY = "onfly-conversations";

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConversations(convos: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function createConversation(): Conversation {
  return {
    id: uuidv4(),
    title: "Nova conversa",
    messages: [],
    createdAt: Date.now(),
  };
}
