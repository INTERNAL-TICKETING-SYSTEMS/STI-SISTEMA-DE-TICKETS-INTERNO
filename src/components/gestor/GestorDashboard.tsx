import { useState, useMemo } from 'react';
import { Ticket } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Star, 
  AlertTriangle, 
  Download, 
  Filter, 
  Layers 
} from 'lucide-react';

interface GestorDashboardProps {
  tickets: Ticket[];
  onNavigate?: (page: any) => void;
}

const COLORS = ['#00A896', '#06b6d4', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function GestorDashboard({ tickets, onNavigate }: GestorDashboardProps) {
  const handleExportCSV = () => {
    const headers = ['ID', 'Titulo', 'Categoria', 'Setor', 'Solicitante', 'Tecnico', 'Status', 'Prioridade', 'Patrimonio', 'Pecas'];
    const rows = tickets.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.requesterDepartment,
      t.requesterName,
      t.assignee || 'Pendente',
      t.status,
      t.priority,
      t.assetTag || 'N/A',
      `"${(t.replacedParts || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_chamados_sti_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [period, setPeriod] = useState<'7d' | '30d' | 'ano'>('30d');

  // Cálculos de KPIs
  const total = tickets.length;
  const resolvidos = tickets.filter((t) => t.status === 'resolvido' || t.status === 'fechado').length;
  const taxaResolucao = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

  // Média de Avaliação (CSAT)
  const ticketsAvaliados = tickets.filter((t) => t.rating && t.rating > 0);
  const mediaCSAT = ticketsAvaliados.length > 0
    ? (ticketsAvaliados.reduce((acc, t) => acc + (t.rating || 0), 0) / ticketsAvaliados.length).toFixed(1)
    : '5.0';

  // Chamados por Categoria para Donut Chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((t) => {
      const cat = t.category || 'Geral';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  // Chamados por Setor para Bar Chart
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((t) => {
      const dep = t.requesterDepartment || 'Outros';
      counts[dep] = (counts[dep] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, chamados]) => ({ name, chamados }))
      .sort((a, b) => b.chamados - a.chamados)
      .slice(0, 5);
  }, [tickets]);

  // Evolução temporal simulada
  const timelineData = [
    { dia: 'Seg', abertos: 6, resolvidos: 5 },
    { dia: 'Ter', abertos: 9, resolvidos: 8 },
    { dia: 'Qua', abertos: 14, resolvidos: 11 },
    { dia: 'Qui', abertos: 8, resolvidos: 9 },
    { dia: 'Sex', abertos: 12, resolvidos: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Topo do Dashboard */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Painel de Inteligência Operacional
            <span className="rounded-md bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-xs text-teal-400 font-mono">
              BI STI
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Métricas de desempenho, conformidade de SLA e auditoria técnica de chamados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-900/80 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setPeriod('7d')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                period === '7d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                period === '30d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriod('ano')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                period === 'ano' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ano 2026
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            Exportar BI
          </button>
        </div>
      </div>

      {/* Linha de KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total de Demandas</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{total}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> 100% monitorado
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Tempo Médio (MTTR)</span>
            <Clock className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white">2h 15m</p>
          <span className="text-[11px] text-teal-400 mt-1 block">Meta de SLA: até 4h</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Satisfação (CSAT)</span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mediaCSAT} <span className="text-xs font-normal text-slate-400">/ 5.0</span></p>
          <span className="text-[11px] text-amber-400 mt-1 block">{ticketsAvaliados.length} avaliações registradas</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Conformidade de SLA</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{taxaResolucao}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Resolução no prazo</span>
        </div>
      </div>

      {/* Grade de Gráficos Power BI / Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Donut: Categorias */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
          <h3 className="text-sm font-bold text-white mb-1">Distribuição por Categoria</h3>
          <p className="text-xs text-slate-400 mb-4">Volume percentual de incidentes</p>
          
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
            {categoryData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Linha/Área: Entrada vs Resolução */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0b1624] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Fluxo de Demandas no Período</h3>
              <p className="text-xs text-slate-400">Chamados abertos vs chamados atendidos</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-cyan-400" /> Abertos
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Resolvidos
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorAbertos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolvidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="dia" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="abertos" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAbertos)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolvidos" stroke="#10b981" fillOpacity={1} fill="url(#colorResolvidos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras: Top 5 Setores Demandantes */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
        <h3 className="text-sm font-bold text-white mb-1">Top Setores com Mais Solicitações</h3>
        <p className="text-xs text-slate-400 mb-4">Mapeamento para direcionamento de treinamento ou substituição de maquinário</p>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#070e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
              />
              <Bar dataKey="chamados" fill="#00A896" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}