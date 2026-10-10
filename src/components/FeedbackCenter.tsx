import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  ClipboardList,
  Filter,
  Lightbulb,
  Search,
  ShieldAlert,
  User,
} from 'lucide-react';

import { useTechTheme } from '@/components/tech/techTheme';

type FeedbackType = 'falha' | 'sugestao' | 'demanda_gerencial';
type FeedbackStatus = 'Novo' | 'Em análise' | 'Concluído' | 'Descartado';
type FeedbackPriority = 'alta' | 'media' | 'baixa';

interface FeedbackRecord {
  id: string;
  type: FeedbackType;
  date: string;
  title: string;
  description: string;
  requester: string;
  department: string;
  profile: 'Servidor' | 'Gestor';
  priority: FeedbackPriority;
  status: FeedbackStatus;
}

const initialRecords: FeedbackRecord[] = [
  {
    id: 'FB-001',
    type: 'falha',
    date: '30/09/2026, 13:53',
    title: 'Lentidão no carregamento de anexos pesados',
    description:
      'Ao anexar PDFs acima de 5MB na abertura de chamado, a página congela por alguns segundos antes de confirmar o upload.',
    requester: 'Ana Paula Rocha',
    department: 'Recursos Humanos',
    profile: 'Servidor',
    priority: 'alta',
    status: 'Em análise',
  },
  {
    id: 'FB-002',
    type: 'sugestao',
    date: '29/09/2026, 13:53',
    title: 'Adicionar filtro por data de abertura no painel',
    description:
      'Seria muito útil podermos filtrar os chamados por período de datas específico para conciliação mensal.',
    requester: 'Carlos Eduardo',
    department: 'Financeiro',
    profile: 'Servidor',
    priority: 'media',
    status: 'Novo',
  },
  {
    id: 'FB-003',
    type: 'demanda_gerencial',
    date: '01/10/2026, 01:53',
    title:
      'Relatório Executivo de Tempo Médio de Resolução (MTTR) por Diretoria',
    description:
      'Necessário compilar os dados consolidados do terceiro trimestre para apresentação ao comitê de governança.',
    requester: 'Diretoria de Governança',
    department: 'Gabinete / Gestão',
    profile: 'Gestor',
    priority: 'alta',
    status: 'Novo',
  },
];

const typeConfig: Record<
  FeedbackType,
  { label: string; icon: React.ElementType }
> = {
  falha: { label: 'Falha', icon: AlertCircle },
  sugestao: { label: 'Sugestão', icon: Lightbulb },
  demanda_gerencial: { label: 'Demanda gerencial', icon: BarChart3 },
};

const statusConfig: Record<FeedbackStatus, { label: string }> = {
  Novo: { label: 'Novo' },
  'Em análise': { label: 'Em análise' },
  Concluído: { label: 'Concluído' },
  Descartado: { label: 'Descartado' },
};

interface FeedbackCenterProps {
  currentRole?: string;
  activeUserName?: string;
  activeUserDepartment?: string;
}

export default function FeedbackCenter({
  currentRole,
  activeUserName,
  activeUserDepartment,
}: FeedbackCenterProps) {
  const { isDark } = useTechTheme();

  const [records, setRecords] = useState<FeedbackRecord[]>(initialRecords);
  const [selectedType, setSelectedType] = useState<'todos' | FeedbackType>(
    'todos',
  );
  const [search, setSearch] = useState('');

  const failureCount = records.filter(
    (record) => record.type === 'falha',
  ).length;

  const suggestionCount = records.filter(
    (record) => record.type === 'sugestao',
  ).length;

  const managementCount = records.filter(
    (record) => record.type === 'demanda_gerencial',
  ).length;

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesType =
        selectedType === 'todos' || record.type === selectedType;

      const matchesSearch =
        !normalizedSearch ||
        record.id.toLowerCase().includes(normalizedSearch) ||
        record.title.toLowerCase().includes(normalizedSearch) ||
        record.description.toLowerCase().includes(normalizedSearch) ||
        record.requester.toLowerCase().includes(normalizedSearch) ||
        record.department.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesSearch;
    });
  }, [records, selectedType, search]);

  const updateStatus = (id: string, status: FeedbackStatus) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id ? { ...record, status } : record,
      ),
    );
  };

  const getTypeClasses = (type: FeedbackType) => {
    if (type === 'falha') {
      return isDark
        ? 'border-red-500/20 bg-red-500/10 text-red-300'
        : 'border-red-200 bg-red-50 text-red-700';
    }

    if (type === 'sugestao') {
      return isDark
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
        : 'border-amber-200 bg-amber-50 text-amber-700';
    }

    return isDark
      ? 'border-violet-500/20 bg-violet-500/10 text-violet-300'
      : 'border-violet-200 bg-violet-50 text-violet-700';
  };

  const getStatusClasses = (status: FeedbackStatus) => {
    switch (status) {
      case 'Novo':
        return isDark
          ? 'border-blue-500/20 bg-blue-500/10 text-blue-300'
          : 'border-blue-200 bg-blue-50 text-blue-700';

      case 'Em análise':
        return isDark
          ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
          : 'border-amber-200 bg-amber-50 text-amber-700';

      case 'Concluído':
        return isDark
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700';

      case 'Descartado':
        return isDark
          ? 'border-slate-500/20 bg-slate-500/10 text-slate-300'
          : 'border-slate-200 bg-slate-50 text-slate-600';

      default:
        return '';
    }
  };

  const getPriorityClasses = (priority: FeedbackPriority) => {
    switch (priority) {
      case 'alta':
        return isDark ? 'text-red-300' : 'text-red-600';

      case 'media':
        return isDark ? 'text-amber-300' : 'text-amber-600';

      case 'baixa':
        return isDark ? 'text-emerald-300' : 'text-emerald-600';

      default:
        return '';
    }
  };

  const priorityLabel = (priority: FeedbackPriority) => {
    if (priority === 'alta') return 'alta';
    if (priority === 'media') return 'média';
    return 'baixa';
  };

  return (
    <div
      className={[
        'relative min-h-screen w-full overflow-x-hidden',
        isDark ? 'bg-[#07111d] text-slate-100' : 'bg-slate-50 text-slate-900',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none fixed inset-0 -z-10',
          isDark ? 'bg-[#07111d]' : 'bg-slate-50',
        ].join(' ')}
      />

      <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <section
          className={[
            'rounded-2xl border p-5 shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={[
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                  isDark
                    ? 'bg-teal-500/10 text-teal-300'
                    : 'bg-teal-50 text-teal-600',
                ].join(' ')}
              >
                <MessageSquareIcon />
              </div>

              <div>
                <h1
                  className={[
                    'text-2xl font-bold tracking-tight',
                    isDark ? 'text-white' : 'text-slate-900',
                  ].join(' ')}
                >
                  Central de Feedbacks &amp; Demandas
                </h1>

                <p
                  className={[
                    'mt-1 text-sm',
                    isDark ? 'text-slate-400' : 'text-slate-600',
                  ].join(' ')}
                >
                  Console Técnico
                </p>

                <p
                  className={[
                    'mt-1 text-sm',
                    isDark ? 'text-slate-500' : 'text-slate-500',
                  ].join(' ')}
                >
                  Acompanhe problemas, sugestões de aprimoramento e solicitações
                  de relatórios em um único lugar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={[
                  'hidden rounded-xl border px-4 py-3 text-right lg:block',
                  isDark
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-slate-200 bg-slate-50',
                ].join(' ')}
              >
                <p
                  className={[
                    'text-[10px] font-bold uppercase tracking-wider',
                    isDark ? 'text-slate-500' : 'text-slate-400',
                  ].join(' ')}
                >
                  Registros ativos
                </p>

                <p
                  className={[
                    'mt-1 text-2xl font-bold',
                    isDark ? 'text-white' : 'text-slate-900',
                  ].join(' ')}
                >
                  {records.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            icon={AlertCircle}
            title="Falha"
            description="Ocorrências reportadas"
            count={failureCount}
            isDark={isDark}
            iconClass={
              isDark
                ? 'bg-red-500/10 text-red-300'
                : 'bg-red-50 text-red-600'
            }
            onClick={() => setSelectedType('falha')}
          />

          <SummaryCard
            icon={Lightbulb}
            title="Sugestão"
            description="Propostas de melhoria"
            count={suggestionCount}
            isDark={isDark}
            iconClass={
              isDark
                ? 'bg-amber-500/10 text-amber-300'
                : 'bg-amber-50 text-amber-600'
            }
            onClick={() => setSelectedType('sugestao')}
          />

          <SummaryCard
            icon={BarChart3}
            title="Demanda gerencial"
            description="Solicitações institucionais"
            count={managementCount}
            isDark={isDark}
            iconClass={
              isDark
                ? 'bg-violet-500/10 text-violet-300'
                : 'bg-violet-50 text-violet-600'
            }
            onClick={() => setSelectedType('demanda_gerencial')}
          />
        </div>

        {/* Filtros */}
        <section
          className={[
            'rounded-2xl border p-4',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Filter
                className={[
                  'h-4 w-4',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                ].join(' ')}
              />

              <span
                className={[
                  'text-sm font-semibold',
                  isDark ? 'text-slate-200' : 'text-slate-700',
                ].join(' ')}
              >
                Filtrar registros
              </span>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'todos' as const, label: `Todos (${records.length})` },
                  { key: 'falha' as const, label: 'Falha' },
                  { key: 'sugestao' as const, label: 'Sugestão' },
                  {
                    key: 'demanda_gerencial' as const,
                    label: 'Demanda gerencial',
                  },
                ].map((filter) => {
                  const active = selectedType === filter.key;

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setSelectedType(filter.key)}
                      className={[
                        'rounded-lg border px-3 py-2 text-xs font-semibold',
                        active
                          ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
                          : isDark
                            ? 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                      ].join(' ')}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  className={[
                    'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
                    isDark ? 'text-slate-500' : 'text-slate-400',
                  ].join(' ')}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar registro..."
                  className={[
                    'h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none',
                    'focus:ring-2 focus:ring-teal-500/30',
                    isDark
                      ? 'border-white/10 bg-white/[0.03] text-white placeholder:text-slate-500 focus:border-teal-500/50'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500',
                  ].join(' ')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Listagem */}
        <section
          className={[
            'overflow-hidden rounded-2xl border shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <div
            className={[
              'flex items-center justify-between border-b px-5 py-4',
              isDark ? 'border-white/10' : 'border-slate-200',
            ].join(' ')}
          >
            <div>
              <h2
                className={[
                  'text-base font-bold',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                Registros
              </h2>

              <p
                className={[
                  'mt-0.5 text-xs',
                  isDark ? 'text-slate-500' : 'text-slate-500',
                ].join(' ')}
              >
                {filteredRecords.length}{' '}
                {filteredRecords.length === 1
                  ? 'registro encontrado'
                  : 'registros encontrados'}
              </p>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div
                className={[
                  'flex h-14 w-14 items-center justify-center rounded-full',
                  isDark
                    ? 'bg-slate-500/10 text-slate-400'
                    : 'bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                <Search className="h-6 w-6" />
              </div>

              <p
                className={[
                  'mt-4 font-semibold',
                  isDark ? 'text-slate-200' : 'text-slate-700',
                ].join(' ')}
              >
                Nenhum registro encontrado
              </p>

              <p
                className={[
                  'mt-1 text-sm',
                  isDark ? 'text-slate-500' : 'text-slate-500',
                ].join(' ')}
              >
                Tente alterar o filtro ou a busca.
              </p>
            </div>
          ) : (
            <div
              className={[
                'divide-y',
                isDark ? 'divide-white/10' : 'divide-slate-200',
              ].join(' ')}
            >
              {filteredRecords.map((record) => {
                const TypeIcon = typeConfig[record.type].icon;

                return (
                  <article
                    key={record.id}
                    className={[
                      'p-5',
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={[
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                              getTypeClasses(record.type),
                            ].join(' ')}
                          >
                            <TypeIcon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={[
                                  'rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
                                  getTypeClasses(record.type),
                                ].join(' ')}
                              >
                                {typeConfig[record.type].label}
                              </span>

                              <span
                                className={[
                                  'font-mono text-xs font-bold',
                                  isDark ? 'text-slate-400' : 'text-slate-500',
                                ].join(' ')}
                              >
                                {record.id}
                              </span>

                              <span
                                className={[
                                  'text-xs',
                                  isDark ? 'text-slate-600' : 'text-slate-400',
                                ].join(' ')}
                              >
                                {record.date}
                              </span>
                            </div>

                            <h3
                              className={[
                                'mt-3 text-base font-bold',
                                isDark ? 'text-white' : 'text-slate-900',
                              ].join(' ')}
                            >
                              {record.title}
                            </h3>

                            <p
                              className={[
                                'mt-2 max-w-4xl text-sm leading-6',
                                isDark ? 'text-slate-400' : 'text-slate-600',
                              ].join(' ')}
                            >
                              {record.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <select
                            value={record.status}
                            onChange={(event) =>
                              updateStatus(
                                record.id,
                                event.target.value as FeedbackStatus,
                              )
                            }
                            className={[
                              'rounded-lg border px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500/30',
                              getStatusClasses(record.status),
                              isDark ? 'bg-[#0b1624]' : 'bg-white',
                            ].join(' ')}
                            aria-label={`Status do registro ${record.id}`}
                          >
                            {Object.keys(statusConfig).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div
                        className={[
                          'flex flex-col gap-4 border-t pt-4 lg:flex-row lg:items-center lg:justify-between',
                          isDark ? 'border-white/10' : 'border-slate-200',
                        ].join(' ')}
                      >
                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                          <MetadataItem
                            icon={User}
                            label="Solicitante"
                            value={record.requester}
                            isDark={isDark}
                          />

                          <MetadataItem
                            icon={ClipboardList}
                            label="Setor"
                            value={record.department}
                            isDark={isDark}
                          />

                          <MetadataItem
                            icon={ShieldAlert}
                            label="Perfil"
                            value={record.profile}
                            isDark={isDark}
                          />

                          <div>
                            <p
                              className={[
                                'text-[10px] font-bold uppercase tracking-wide',
                                isDark ? 'text-slate-600' : 'text-slate-400',
                              ].join(' ')}
                            >
                              Prioridade
                            </p>

                            <p
                              className={[
                                'text-xs font-bold capitalize',
                                getPriorityClasses(record.priority),
                              ].join(' ')}
                            >
                              {priorityLabel(record.priority)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            window.alert(
                              `Detalhes do registro ${record.id}\n\n${record.title}\n\n${record.description}`,
                            );
                          }}
                          className={[
                            'inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold',
                            isDark
                              ? 'text-teal-300 hover:bg-teal-500/10'
                              : 'text-teal-600 hover:bg-teal-50',
                          ].join(' ')}
                        >
                          Ver detalhes
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MessageSquareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 8h10M7 12h6m-9 7 2.5-3H18a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h.5L4 19Z"
      />
    </svg>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
  isDark: boolean;
  iconClass: string;
  onClick: () => void;
}

function SummaryCard({
  icon: Icon,
  title,
  description,
  count,
  isDark,
  iconClass,
  onClick,
}: SummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex min-h-[130px] items-center justify-between rounded-2xl border p-5 text-left',
        isDark
          ? 'border-white/10 bg-[#0b1624] hover:border-teal-500/30 hover:bg-[#102033]'
          : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50',
        'focus:outline-none focus:ring-2 focus:ring-teal-500/40',
      ].join(' ')}
    >
      <div className="flex items-center gap-4">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            iconClass,
          ].join(' ')}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p
            className={[
              'text-3xl font-bold',
              isDark ? 'text-white' : 'text-slate-900',
            ].join(' ')}
          >
            {count}
          </p>

          <p
            className={[
              'mt-1 text-sm font-bold',
              isDark ? 'text-slate-200' : 'text-slate-700',
            ].join(' ')}
          >
            {title}
          </p>

          <p
            className={[
              'mt-0.5 text-xs',
              isDark ? 'text-slate-500' : 'text-slate-500',
            ].join(' ')}
          >
            {description}
          </p>
        </div>
      </div>

      <span
        className={[
          'flex h-9 w-9 items-center justify-center rounded-lg',
          isDark
            ? 'bg-white/5 text-slate-400'
            : 'bg-slate-50 text-slate-400',
        ].join(' ')}
      >
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}

interface MetadataItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isDark: boolean;
}

function MetadataItem({
  icon: Icon,
  label,
  value,
  isDark,
}: MetadataItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        className={[
          'h-4 w-4',
          isDark ? 'text-slate-500' : 'text-slate-400',
        ].join(' ')}
      />

      <div>
        <p
          className={[
            'text-[10px] font-bold uppercase tracking-wide',
            isDark ? 'text-slate-600' : 'text-slate-400',
          ].join(' ')}
        >
          {label}
        </p>

        <p
          className={[
            'text-xs font-semibold',
            isDark ? 'text-slate-300' : 'text-slate-700',
          ].join(' ')}
        >
          {value}
        </p>
      </div>
    </div>
  );
}