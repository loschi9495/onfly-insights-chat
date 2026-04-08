import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/conversations";

const API_URL = import.meta.env.VITE_API_URL || "";

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3 text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 group">
      <div className="max-w-[85%] bg-agent-bubble text-agent-bubble-foreground rounded-2xl rounded-bl-md px-4 py-3 text-sm relative">
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => {
                if (href?.startsWith("/download/")) {
                  return (
                    <a
                      href={`${API_URL}${href}`}
                      download
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#0056b3] text-white rounded-lg hover:bg-[#004494] transition-colors no-underline font-medium text-sm"
                    >
                      <Download className="w-4 h-4" />
                      {children}
                    </a>
                  );
                }
                return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-secondary"
          title="Copiar resposta"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>
    </div>
  );
}
