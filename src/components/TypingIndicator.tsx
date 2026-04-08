interface Props {
  message?: string;
}

export function TypingIndicator({ message }: Props) {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-agent-bubble rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-2">
          {message || "Consultando dados"}
        </span>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
