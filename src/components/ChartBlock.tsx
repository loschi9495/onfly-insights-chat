import {
  BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

const DEFAULT_COLORS = ["#0056b3", "#00a86b", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];

interface ChartData {
  type: "bar" | "pie" | "line" | "area";
  title?: string;
  data: Record<string, unknown>[];
  xKey?: string;
  yKeys?: string[];
  colors?: string[];
}

function formatValue(value: unknown): string {
  if (typeof value !== "number") return String(value);
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1)}k`;
  return `R$ ${value.toFixed(0)}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      {label && <p className="font-medium mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {formatValue(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function ChartBlock({ config }: { config: ChartData }) {
  const { type, title, data, xKey = "name", yKeys = ["value"], colors = DEFAULT_COLORS } = config;

  if (!data?.length) return null;

  return (
    <div className="my-4 p-4 rounded-xl border border-border bg-card">
      {title && <h4 className="text-sm font-semibold mb-3 text-center">{title}</h4>}
      <ResponsiveContainer width="100%" height={300}>
        {type === "pie" ? (
          <PieChart>
            <Pie
              data={data}
              dataKey={yKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={true}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatValue(v)} />
            <Tooltip content={<CustomTooltip />} />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 4 }} />
            ))}
          </LineChart>
        ) : type === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatValue(v)} />
            <Tooltip content={<CustomTooltip />} />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.15} strokeWidth={2} />
            ))}
          </AreaChart>
        ) : (
          <BarChart data={data} layout={data.length > 6 ? "vertical" : "horizontal"}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            {data.length > 6 ? (
              <>
                <YAxis dataKey={xKey} type="category" tick={{ fontSize: 11 }} width={120} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatValue(v)} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatValue(v)} />
              </>
            )}
            <Tooltip content={<CustomTooltip />} />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export function tryParseChart(code: string): ChartData | null {
  try {
    const parsed = JSON.parse(code);
    if (parsed.type && parsed.data && Array.isArray(parsed.data)) {
      return parsed as ChartData;
    }
  } catch { /* not a chart */ }
  return null;
}
