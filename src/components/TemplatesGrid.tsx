import { useState, useEffect } from "react";
import { getTemplates, renderTemplate, type Template } from "@/lib/api";
import {
  Calendar, HeartPulse, AlertTriangle, Briefcase, Plane,
  BarChart3, Layers, Star, FileText,
} from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  "calendar": <Calendar className="w-5 h-5" />,
  "heart-pulse": <HeartPulse className="w-5 h-5" />,
  "alert-triangle": <AlertTriangle className="w-5 h-5" />,
  "briefcase": <Briefcase className="w-5 h-5" />,
  "plane": <Plane className="w-5 h-5" />,
  "bar-chart-3": <BarChart3 className="w-5 h-5" />,
  "layers": <Layers className="w-5 h-5" />,
  "star": <Star className="w-5 h-5" />,
};

interface Props {
  onSelect: (prompt: string) => void;
}

export function TemplatesGrid({ onSelect }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  const handleClick = async (template: Template) => {
    if (template.variables && template.variables.length > 0) {
      setActiveTemplate(template);
      setVariables({});
    } else {
      const prompt = await renderTemplate(template.id);
      onSelect(prompt);
    }
  };

  const handleSubmitVariables = async () => {
    if (!activeTemplate) return;
    const prompt = await renderTemplate(activeTemplate.id, variables);
    setActiveTemplate(null);
    setVariables({});
    onSelect(prompt);
  };

  if (templates.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
        Relatórios prontos
      </h3>

      {activeTemplate && (
        <div className="mb-4 p-4 rounded-xl border border-border bg-card">
          <h4 className="text-sm font-semibold mb-3">{activeTemplate.name}</h4>
          {activeTemplate.variables?.map((v) => (
            <div key={v.name} className="mb-3">
              <label className="block text-xs text-muted-foreground mb-1">{v.label}</label>
              <input
                type="text"
                placeholder={v.placeholder}
                value={variables[v.name] || ""}
                onChange={(e) => setVariables({ ...variables, [v.name]: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && handleSubmitVariables()}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={handleSubmitVariables}
              className="px-4 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Gerar relatório
            </button>
            <button
              onClick={() => setActiveTemplate(null)}
              className="px-4 py-1.5 text-xs rounded-lg border border-border hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => handleClick(t)}
            className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              {ICONS[t.icon] || <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
