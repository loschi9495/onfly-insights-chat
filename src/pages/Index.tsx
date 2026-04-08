import { useState, useEffect, useRef, useCallback } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { SuggestionsGrid } from "@/components/SuggestionsGrid";
import { askQuestion, resetSession } from "@/lib/api";
import { Menu } from "lucide-react";
import {
  type Conversation,
  loadConversations,
  saveConversations,
  createConversation,
} from "@/lib/conversations";

export default function Index() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const loaded = loadConversations();
    return loaded.length > 0 ? loaded : [createConversation()];
  });
  const [activeId, setActiveId] = useState(() => conversations[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  }, []);

  const updateConversation = (id: string, updater: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const handleSend = async (question: string) => {
    if (!active || loading) return;

    updateConversation(activeId, (c) => ({
      ...c,
      title: c.messages.length === 0 ? question.slice(0, 50) : c.title,
      messages: [...c.messages, { role: "user", content: question }],
    }));

    setLoading(true);
    scrollToBottom();

    try {
      const data = await askQuestion(question, activeId);
      updateConversation(activeId, (c) => ({
        ...c,
        messages: [...c.messages, { role: "agent", content: data.answer, follow_ups: data.follow_ups || [] }],
      }));
    } catch {
      updateConversation(activeId, (c) => ({
        ...c,
        messages: [
          ...c.messages,
          {
            role: "agent",
            content: "Desculpe, ocorreu um erro ao consultar os dados. Tente reformular sua pergunta.",
          },
        ],
      }));
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleNew = async () => {
    if (active) {
      resetSession(active.id).catch(() => {});
    }
    const newConvo = createConversation();
    setConversations((prev) => [newConvo, ...prev]);
    setActiveId(newConvo.id);
  };

  const handleDelete = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const newConvo = createConversation();
        filtered.push(newConvo);
      }
      if (id === activeId) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "flex" : "hidden"} md:flex absolute md:relative z-40 h-full`}>
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setSidebarOpen(false); }}
          onNew={handleNew}
          onDelete={handleDelete}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/60" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {active && active.messages.length === 0 && !loading ? (
          <>
            <SuggestionsGrid onSelect={handleSend} />
            <ChatInput onSend={handleSend} disabled={loading} />
          </>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-3xl mx-auto">
                {active?.messages.map((m, i) => (
                  <ChatMessage key={i} message={m} onFollowUp={handleSend} isLast={i === (active?.messages.length ?? 0) - 1} />
                ))}
                {loading && <TypingIndicator />}
              </div>
            </div>
            <ChatInput onSend={handleSend} disabled={loading} />
          </>
        )}
      </div>
    </div>
  );
}
