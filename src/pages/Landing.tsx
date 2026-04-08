import { useNavigate } from "react-router-dom";
import { getStoredUser } from "@/lib/auth";
import {
  MessageSquare, BarChart3, FileSpreadsheet, Zap,
  Shield, Brain, ArrowRight, Sparkles, Database,
  PieChart, TrendingUp, Users,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleCTA = () => {
    navigate(user ? "/" : "/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Onfly Insights</span>
          </div>
          <button
            onClick={handleCTA}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {user ? "Abrir app" : "Acessar"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-6">
            <Brain className="w-3 h-3" />
            Powered by Claude AI + BigQuery
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Pergunte em portugues,
            <br />
            <span className="text-primary">receba insights em segundos</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Agente de inteligencia que transforma perguntas em linguagem natural em
            relatorios completos com graficos, tabelas e planilhas — direto do
            seu data warehouse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCTA}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-lg"
            >
              Comecar agora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Demo visual */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
            <div className="border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-xs text-muted-foreground ml-2">Onfly Insights</span>
            </div>
            <div className="p-6 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-primary/20 text-foreground rounded-2xl rounded-br-md px-4 py-2 text-sm max-w-[70%]">
                  Qual o GMV por modalidade no Q1 2026?
                </div>
              </div>
              {/* Agent response */}
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[85%] space-y-3">
                  <p className="font-semibold">GMV Total: R$ 771,8M no Q1 2026</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Voos", value: "R$ 435M", pct: "56%", color: "bg-blue-500" },
                      { label: "Hoteis", value: "R$ 289M", pct: "37%", color: "bg-green-500" },
                      { label: "Carros", value: "R$ 28M", pct: "4%", color: "bg-yellow-500" },
                      { label: "Onibus", value: "R$ 19M", pct: "3%", color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className={`h-1.5 rounded-full ${item.color} mb-2`} style={{ width: item.pct }} />
                        <p className="text-xs font-medium">{item.value}</p>
                        <p className="text-[10px] text-muted-foreground">{item.label} ({item.pct})</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">pie chart</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">tabela detalhada</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">exportar xlsx</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo que voce precisa para tomar decisoes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              De perguntas simples a relatorios executivos completos, sem escrever uma linha de SQL.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Linguagem natural",
                desc: "Pergunte como falaria com um analista. O agente interpreta, gera SQL e consulta o BigQuery automaticamente.",
              },
              {
                icon: <PieChart className="w-6 h-6" />,
                title: "Graficos automaticos",
                desc: "Pie charts, barras, linhas e areas gerados automaticamente. O agente escolhe a melhor visualizacao para cada dado.",
              },
              {
                icon: <FileSpreadsheet className="w-6 h-6" />,
                title: "Exportar em Excel",
                desc: "Peca 'gere uma planilha' e receba um XLSX formatado com ate 5.000 linhas para download imediato.",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Respostas em streaming",
                desc: "Acompanhe cada etapa em tempo real: analise da pergunta, consulta ao BigQuery e geracao da resposta.",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Templates prontos",
                desc: "8 relatorios pre-configurados: resumo semanal, health check de cliente, pipeline de risco, NPS e mais.",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Contexto inteligente",
                desc: "Desambiguacao automatica, sugestoes de follow-up contextuais e expansao de abreviacoes do mercado.",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Como funciona</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", icon: <MessageSquare className="w-5 h-5" />, title: "Pergunte", desc: "Digite sua pergunta em portugues" },
              { step: "2", icon: <Brain className="w-5 h-5" />, title: "IA interpreta", desc: "Claude analisa e gera a query SQL" },
              { step: "3", icon: <Database className="w-5 h-5" />, title: "BigQuery", desc: "Consulta executada no data warehouse" },
              { step: "4", icon: <BarChart3 className="w-5 h-5" />, title: "Resultado", desc: "Graficos, tabelas e insights" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  {item.icon}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data & Security */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Seguro por design</h2>
              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-4 h-4" />, text: "Autenticacao Google SSO com restricao por dominio" },
                  { icon: <Database className="w-4 h-4" />, text: "Apenas queries SELECT — escrita bloqueada no BigQuery" },
                  { icon: <Users className="w-4 h-4" />, text: "Limite de 10GB de billing por query" },
                  { icon: <Zap className="w-4 h-4" />, text: "Arquivos exportados expiram em 24 horas" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 text-sm">Dados disponiveis</h3>
              <div className="space-y-2">
                {[
                  "Reservas e compras (4.7M registros)",
                  "Contabilidade de viagens (4.0M registros)",
                  "Viajantes por viagem (4.7M registros)",
                  "Empresas clientes (10.7K registros)",
                  "GMV/TPV/lucro mensal por cliente",
                  "NPS do produto",
                  "Tickets de suporte (17.8M registros)",
                  "Metricas de engajamento por empresa",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para insights em segundos?</h2>
          <p className="text-muted-foreground mb-8">
            Pare de esperar dias por relatorios. Pergunte agora e receba a resposta na hora.
          </p>
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-lg"
          >
            Comecar agora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Onfly Insights Agent
          </div>
          <p>Powered by Claude AI + Google BigQuery</p>
        </div>
      </footer>
    </div>
  );
}
