
import { registrarAuditoria } from '../../services/auditService';
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
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  Download,
  Layers,
} from 'lucide-react';

interface GestorDashboardProps {
  tickets: Ticket[];
  onNavigate?: (page: any) => void;
}

const COLORS = [
  '#00A896',
  '#06b6d4',
  '#3b82f6',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
];

export default function GestorDashboard({
  tickets,
}: GestorDashboardProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | 'ano'>('30d');


  const timelineData = useMemo(() => {
    const hoje = new Date();
    const inicio = new Date(hoje);

    if (period === '7d') {
      inicio.setDate(hoje.getDate() - 6);
    } else if (period === '30d') {
      inicio.setDate(hoje.getDate() - 29);
    } else {
      inicio.setMonth(0, 1);
    }

    inicio.setHours(0, 0, 0, 0);

    const dias: {
      chave: string;
      dia: string;
      abertos: number;
      resolvidos: number;
    }[] = [];

    const cursor = new Date(inicio);

    while (cursor <= hoje) {
      const chave = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, '0'),
        String(cursor.getDate()).padStart(2, '0'),
      ].join('-');

      dias.push({
        chave,
        dia: period === 'ano'
          ? cursor.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
          : cursor.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        abertos: 0,
        resolvidos: 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    const porDia = new Map(dias.map((d) => [d.chave, d]));

    for (const ticket of tickets) {
      const criado = new Date(ticket.createdAt);

      if (!Number.isNaN(criado.getTime())) {
        const chave = [
          criado.getFullYear(),
          String(criado.getMonth() + 1).padStart(2, '0'),
          String(criado.getDate()).padStart(2, '0'),
        ].join('-');

        const dia = porDia.get(chave);
        if (dia) dia.abertos++;
      }

      if (ticket.resolvedAt) {
        const resolvido = new Date(ticket.resolvedAt);

        if (!Number.isNaN(resolvido.getTime())) {
          const chave = [
            resolvido.getFullYear(),
            String(resolvido.getMonth() + 1).padStart(2, '0'),
            String(resolvido.getDate()).padStart(2, '0'),
          ].join('-');

          const dia = porDia.get(chave);
          if (dia) dia.resolvidos++;
        }
      }
    }

    return dias;
  }, [tickets, period]);

  const total = tickets.length;

  const resolvidos = tickets.filter(
    (t) => t.status === 'resolvido' || t.status === 'fechado'
  ).length;

  const percentualResolvido =
    total > 0 ? Math.round((resolvidos / total) * 100) : 0;

  const ticketsAvaliados = tickets.filter(
    (t) => typeof t.rating === 'number' && t.rating > 0
  );

  const mediaCSAT =
    ticketsAvaliados.length > 0
      ? (
        ticketsAvaliados.reduce(
          (soma, t) => soma + (t.rating || 0),
          0
        ) / ticketsAvaliados.length
      ).toFixed(1)
      : null;

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};

    tickets.forEach((ticket) => {
      const categoria = ticket.category || 'Sem categoria';
      counts[categoria] = (counts[categoria] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tickets]);

  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};

    tickets.forEach((ticket) => {
      const setor = ticket.requesterDepartment || 'Setor não informado';
      counts[setor] = (counts[setor] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, chamados]) => ({ name, chamados }))
      .sort((a, b) => b.chamados - a.chamados)
      .slice(0, 5);
  }, [tickets]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Titulo',
      'Categoria',
      'Setor',
      'Solicitante',
      'Tecnico',
      'Status',
      'Prioridade',
      'Patrimonio',
      'Pecas',
    ];

    const escapeCSV = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = tickets.map((ticket) =>
      [
        ticket.id,
        ticket.title,
        ticket.category,
        ticket.requesterDepartment,
        ticket.requesterName,
        ticket.assignee || 'Não atribuído',
        ticket.status,
        ticket.priority,
        ticket.assetTag || 'Não informado',
        ticket.replacedParts || '',
      ]
        .map(escapeCSV)
        .join(',')
    );

    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCSV).join(','), ...rows].join('\r\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `relatorio_chamados_sti_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    registrarAuditoria({
      entidade: 'RELATORIO',
      idEntidade: 'BI_TICKETS_CSV',
      tipoOperacao: 'EXPORTACAO_RELATORIO',
      autor: (() => {
        try {
          const raw =
            localStorage.getItem('sti_user') ||
            localStorage.getItem('sti_active_user');

          return raw
            ? JSON.parse(raw).email
            : 'gestor@sti.chamados.com';
        } catch {
          return 'gestor@sti.chamados.com';
        }
      })(),
      estadoAtual: {
        totalRegistros: tickets.length,
        formato: 'CSV',
      },
      metadados: {
        motivo: 'Exportação de relatório de chamados',
        exportadoEm: new Date().toISOString(),
      },
    }).catch((err) =>
      console.error(
        '[Auditoria] Falha ao registrar exportação:',
        err
      )
    );
  };

  const periodoSelecionado =
    period === '7d'
      ? 'Últimos 7 dias'
      : period === '30d'
        ? 'Últimos 30 dias'
        : 'Ano de 2026';

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight text-white">
            Painel de Acompanhamento de Chamados
            <span className="rounded-md border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 font-mono text-xs text-teal-400">
              Indicadores STI
            </span>
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Acompanhe os chamados, os prazos e as solicitações dos setores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-xl border border-white/10 bg-slate-900/80 p-1 text-xs"
            aria-label="Selecionar período"
          >
            <button
              onClick={() => setPeriod('7d')}
              aria-pressed={period === '7d'}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${period === '7d'
                ? 'bg-cyan-500 font-bold text-slate-950'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              7 dias
            </button>

            <button
              onClick={() => setPeriod('30d')}
              aria-pressed={period === '30d'}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${period === '30d'
                ? 'bg-cyan-500 font-bold text-slate-950'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              30 dias
            </button>

            <button
              onClick={() => setPeriod('ano')}
              aria-pressed={period === 'ano'}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${period === 'ano'
                ? 'bg-cyan-500 font-bold text-slate-950'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Ano 2026
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            Baixar relatório
          </button>
        </div>
      </div>

      {/* Indicadores principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Total de Chamados</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>

          <p className="text-2xl font-bold text-white">{total}</p>

          <span className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
            <TrendingUp className="h-3 w-3" />
            Chamados registrados no sistema
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Tempo Médio para Resolver</span>
            <Clock className="h-4 w-4 text-teal-400" />
          </div>

          <p className="text-2xl font-bold text-white">—</p>

          <span className="mt-1 block text-[11px] text-slate-400">
            Não disponível: falta calcular com os horários dos chamados
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Avaliação dos Solicitantes</span>
            <Star className="h-4 w-4 text-amber-400" />
          </div>

          {mediaCSAT !== null ? (
            <>
              <p className="text-2xl font-bold text-white">
                {mediaCSAT}{' '}
                <span className="text-xs font-normal text-slate-400">
                  / 5
                </span>
              </p>

              <span className="mt-1 block text-[11px] text-slate-400">
                {ticketsAvaliados.length}{' '}
                {ticketsAvaliados.length === 1
                  ? 'avaliação recebida'
                  : 'avaliações recebidas'}
              </span>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-white">
                Sem avaliações
              </p>

              <span className="mt-1 block text-[11px] text-slate-400">
                Ainda não há notas registradas
              </span>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Chamados Resolvidos</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>

          <p className="text-2xl font-bold text-emerald-400">
            {percentualResolvido}%
          </p>

          <span className="mt-1 block text-[11px] text-slate-400">
            {resolvidos} de {total} chamados registrados
          </span>
        </div>
      </div>


      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chamados por categoria */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
          <h3 className="mb-1 text-sm font-bold text-white">
            Chamados por Categoria
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            Veja quais tipos de solicitação aparecem no sistema.
          </p>

          {categoryData.length > 0 ? (
            <>
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
                      nameKey="name"
                    >
                      {categoryData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} chamados`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#070e17',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '11px',
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                {categoryData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-[11px] text-slate-300"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="truncate">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-56 items-center justify-center text-center text-sm text-slate-400">
              Nenhum chamado registrado para exibir.
            </div>
          )}
        </div>

        {/* Chamados criados e resolvidos */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5 lg:col-span-2">
          <h3 className="mb-1 text-sm font-bold text-white">
            Chamados Criados e Resolvidos
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            Quantidade de chamados criados e resolvidos por dia.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="dia"
                  stroke="#94a3b8"
                  fontSize={10}
                  minTickGap={period === 'ano' ? 25 : 10}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070e17',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="abertos"
                  name="Criados"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="resolvidos"
                  name="Resolvidos"
                  stroke="#00A896"
                  fill="#00A896"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Setores com mais chamados */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
          <h3 className="mb-1 text-sm font-bold text-white">
            Setores com Mais Chamados
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            Veja quais setores registraram mais solicitações.
          </p>

          {departmentData.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    width={130}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} chamados`, 'Total']}
                    contentStyle={{
                      backgroundColor: '#070e17',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar
                    dataKey="chamados"
                    name="Chamados"
                    fill="#00A896"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-center text-sm text-slate-400">
              Nenhum chamado registrado por setor.
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Período selecionado: {periodoSelecionado}. O gráfico apresenta os
        chamados criados e resolvidos dentro do período selecionado.
      </p>
    </div>
  );
}