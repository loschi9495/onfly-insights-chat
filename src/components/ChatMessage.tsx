import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/conversations";
import { ChartBlock, tryParseChart } from "./ChartBlock";
import { API_URL } from "@/lib/config";

interface Props {
  message: Message;
  onFollowUp?: (question: string) => void;
  isLast?: boolean;
}

export function ChatMessage({ message, onFollowUp, isLast }: Props) {
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

  const showFollowUps = isLast && message.follow_ups && message.follow_ups.length > 0;

  return (
    <div className="flex flex-col items-start mb-4 group">
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
              code: ({ className, children }) => {
                const isChart = className === "language-chart";
                if (isChart) {
                  const chartConfig = tryParseChart(String(children).trim());
                  if (chartConfig) {
                    return <ChartBlock config={chartConfig} />;
                  }
                }
                // Inline code
                if (!className) {
                  return <code className="px-1.5 py-0.5 rounded bg-secondary text-xs">{children}</code>;
                }
                // Code block (non-chart)
                return (
                  <code className={`block p-3 rounded-lg bg-secondary text-xs overflow-x-auto ${className || ""}`}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <>{children}</>,
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

      {showFollowUps && (
        <div className="flex flex-wrap gap-2 mt-2 ml-1 max-w-[85%]">
          {message.follow_ups!.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onFollowUp?.(suggestion)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-3 h-3" />
              <span className="truncate max-w-[250px]">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
