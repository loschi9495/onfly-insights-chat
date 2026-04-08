import { useEffect, useState } from "react";
import { getSuggestions } from "@/lib/api";
import { Sparkles } from "lucide-react";

interface Props {
  onSelect: (question: string) => void;
}

export function SuggestionsGrid({ onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    getSuggestions().then(setSuggestions);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <Sparkles className="w-10 h-10 text-primary mb-4" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">O que você gostaria de saber?</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Pergunte sobre GMV, reservas, viajantes, empresas e mais.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="text-left bg-card hover:bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
