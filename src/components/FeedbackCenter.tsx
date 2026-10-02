
import React, { useEffect, useState } from 'react';
import {
  Bug,
  Sparkles,
  FileText,
  Filter,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  X,
  User,
  Building,
  CalendarDays,
  ClipboardList,
} from 'lucide-react';

export interface FeedbackItem {
  id: string;
  type: 'falha' | 'ideia' | 'demanda_gestor';
  title: string;
  description: string;
  authorName: string;
  authorDepartment?: string;
  authorRole?: string;
  createdAt: string;
  status: 'novo' | 'em_analise' | 'implementado' | 'descartado';
  priority?: 'baixa' | 'media' | 'alta';
}

interface FeedbackCenterProps {
  currentRole: 'tecnico' | 'gestor';
  activeUserName?: string;
  activeUserDepartment?: string;
}

const DEFAULT_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'FB-001',
    type: 'falha',
    title: 'Lentidão no carregamento de anexos pesados',
    description:
      'Ao anexar PDFs acima de 5MB na abertura de chamado, a página congela por alguns segundos antes de confirmar o upload.',
    authorName: 'Ana Paula Rocha',
    authorDepartment: 'Recursos Humanos',
    authorRole: 'Servidor',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'em_analise',
    priority: 'alta',
  },
  {
    id: 'FB-002',
    type: 'ideia',
    title: 'Adicionar filtro por data de abertura no painel',
    description:
      'Seria muito útil podermos filtrar os chamados por período de datas específico para conciliação mensal.',
    authorName: 'Carlos Eduardo',
    authorDepartment: 'Financeiro',
    authorRole: 'Servidor',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'novo',
    priority: 'media',
  },
  {
    id: 'FB-003',
    type: 'demanda_gestor',
    title: 'Relatório Executivo de Tempo Médio de Resolução (MTTR) por Diretoria',
    description:
      'Necessário compilar os dados consolidados do terceiro trimestre para apresentação ao comitê de governança.',
    authorName: 'Diretoria de Governança',
    authorDepartment: 'Gabinete / Gestão',
    authorRole: 'Gestor',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'novo',
    priority: 'alta',
  },
];

const TYPE_STYLES = {
  falha: {
    label: 'Falha',
    icon: Bug,
    color: 'amber',
    badge: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
    iconBox: 'bg-amber-400/10 text-amber-300',
    active: 'border-amber-400/40 bg-amber-400/10 ring-1 ring-amber-400/20',
  },
  ideia: {
    label: 'Sugestão',
    icon: Sparkles,
    color: 'cyan',
    badge: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
    iconBox: 'bg-cyan-400/10 text-cyan-300',
    active: 'border-cyan-400/40 bg-cyan-400/10 ring-1 ring-cyan-400/20',
  },
  demanda_gestor: {
    label: 'Demanda gerencial',
    icon: FileText,
    color: 'emerald',
    badge: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    iconBox: 'bg-emerald-400/10 text-emerald-300',
    active: 'border-emerald-400/40 bg-emerald-400/10 ring-1 ring-emerald-400/20',
  },
} as const;

const STATUS_STYLES = {
  novo: {
    label: 'Novo',
    icon: AlertCircle,
    classes: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
    dot: 'bg-sky-400',
  },
  em_analise: {
    label: 'Em análise',
    icon: Clock,
    classes: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
    dot: 'bg-amber-400',
  },
  implementado: {
    label: 'Concluído',
    icon: CheckCircle2,
    classes: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  descartado: {
    label: 'Descartado',
    icon: X,
    classes: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
    dot: 'bg-rose-400',
  },
} as const;

const PRIORITY_STYLES = {
  baixa: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
  media: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  alta: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
} as const;

type FilterType = 'todos' | FeedbackItem['type'];

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return 'Data indisponível';
  }

  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function loadFeedbacks(): FeedbackItem[] {
  try {
    const saved = localStorage.getItem('sti_feedbacks');

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed as FeedbackItem[];
      }
    }
  } catch {
    // Mantém os registros padrão se o armazenamento estiver inválido.
  }

  return DEFAULT_FEEDBACKS;
}

export default function FeedbackCenter({
  currentRole,
  activeUserName = 'Usuário',
  activeUserDepartment = 'STI',
}: FeedbackCenterProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(loadFeedbacks);
  const [filterType, setFilterType] = useState<FilterType>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demandTitle, setDemandTitle] = useState('');
  const [demandDesc, setDemandDesc] = useState('');
  const [demandPriority, setDemandPriority] =
    useState<FeedbackItem['priority']>('alta');

  useEffect(() => {
    try {
      localStorage.setItem('sti_feedbacks', JSON.stringify(feedbacks));
    } catch {
      // A interface continua funcionando mesmo se o navegador bloquear o armazenamento.
    }
  }, [feedbacks]);

  const saveFeedbacks = (updated: FeedbackItem[]) => {
    setFeedbacks(updated);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: FeedbackItem['status'],
  ) => {
    saveFeedbacks(
      feedbacks.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  const handleCreateDemand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!demandTitle.trim() || !demandDesc.trim()) {
      return;
    }

    const newItem: FeedbackItem = {
      id: `DEM-${Date.now().toString().slice(-6)}`,
      type: 'demanda_gestor',
      title: demandTitle.trim(),
      description: demandDesc.trim(),
      authorName: activeUserName,
      authorDepartment: activeUserDepartment,
      authorRole: 'Gestor',
      createdAt: new Date().toISOString(),
      status: 'novo',
      priority: demandPriority ?? 'alta',
    };

    saveFeedbacks([newItem, ...feedbacks]);
    setFilterType('todos');
    setDemandTitle('');
    setDemandDesc('');
    setDemandPriority('alta');
    setIsModalOpen(false);
  };

  const filteredFeedbacks = feedbacks.filter(
    (item) => filterType === 'todos' || item.type === filterType,
  );

  const bugsCount = feedbacks.filter((item) => item.type === 'falha').length;
  const ideasCount = feedbacks.filter((item) => item.type === 'ideia').length;
  const demandsCount = feedbacks.filter(
    (item) => item.type === 'demanda_gestor',
  ).length;

  const counters = [
    {
      key: 'falha' as const,
      label: 'Problemas e falhas',
      description: 'Ocorrências reportadas',
      count: bugsCount,
      icon: Bug,
    },
    {
      key: 'ideia' as const,
      label: 'Sugestões de ideias',
      description: 'Propostas de melhoria',
      count: ideasCount,
      icon: Sparkles,
    },
    {
      key: 'demanda_gestor' as const,
      label: 'Demandas de gestão',
      description: 'Solicitações institucionais',
      count: demandsCount,
      icon: FileText,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 text-slate-100">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <ClipboardList className="h-5 w-5" />
            </div>


            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Central de Feedbacks &amp; Demandas
            </h1>

            <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
              {currentRole === 'gestor' ? 'Visão da Gestão' : 'Console Técnico'}
            </span>
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            Acompanhe problemas, sugestões de aprimoramento e solicitações de
            relatórios em um único lugar.
          </p>
        </div>

        {currentRole === 'gestor' && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nova demanda</span>
          </button>
        )}
      </header>

      {/* Contadores */}
      <section
        aria-label="Resumo de feedbacks"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {counters.map((counter) => {
          const typeStyle = TYPE_STYLES[counter.key];
          const Icon = counter.icon;
          const isActive = filterType === counter.key;

          return (
            <button
              key={counter.key}
              type="button"
              aria-pressed={isActive}
              onClick={() =>
                setFilterType(isActive ? 'todos' : counter.key)
              }

              className={`group flex min-h-28 items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${isActive
                ? typeStyle.active
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeStyle.iconBox}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">

                  <span className="block text-2xl font-bold tabular-nums text-gray-900">
                    {feedbacks.length}
                  </span>

                  <span className="block text-sm font-semibold text-gray-900">
                    {typeStyle.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {counter.description}
                  </span>
                </div>
              </div>

              <span className="text-xs text-slate-500 transition-colors group-hover:text-slate-300">
                {isActive ? 'Filtrado' : 'Ver'}
              </span>
            </button>
          );
        })}
      </section>

      {/* Filtros */}

      <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-800">
            <Filter className="h-4 w-4 text-gray-600" />
            Filtrar registros
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterType('todos')}
              aria-pressed={filterType === 'todos'}
              className={`min-h-9 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${filterType === 'todos'
                ? 'border-cyan-200 bg-cyan-50 text-cyan-900'
                : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              Todos ({feedbacks.length})
            </button>

            {(Object.keys(TYPE_STYLES) as FeedbackItem['type'][]).map(
              (type) => {
                const selected = filterType === type;
                const style = TYPE_STYLES[type];

                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilterType(type)}
                    className={`min-h-9 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${selected
                      ? style.badge
                      : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    {style.label}
                  </button>
                );
              },
            )}
          </div>

          <span className="text-xs text-slate-500 sm:ml-auto">
            {filteredFeedbacks.length}{' '}
            {filteredFeedbacks.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </section>

      {/* Lista */}
      <section aria-label="Lista de feedbacks" className="space-y-3">
        {filteredFeedbacks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-slate-200">
              Nenhum registro encontrado
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Não há registros nesta categoria no momento.
            </p>
            {filterType !== 'todos' && (
              <button
                type="button"
                onClick={() => setFilterType('todos')}
                className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Limpar filtro
              </button>
            )}
          </div>
        ) : (
          filteredFeedbacks.map((item) => {
            const typeStyle = TYPE_STYLES[item.type];
            const TypeIcon = typeStyle.icon;
            const statusStyle = STATUS_STYLES[item.status] ?? STATUS_STYLES.novo;
            const StatusIcon = statusStyle.icon;

            return (

              <article
                key={item.id}
                className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${typeStyle.badge}`}
                    >
                      <TypeIcon className="h-3.5 w-3.5" />
                      {typeStyle.label}
                    </span>

                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-slate-400">
                      {item.id}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyle.classes}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusStyle.label}
                    </span>

                    <label className="sr-only" htmlFor={`status-${item.id}`}>
                      Status do registro {item.id}
                    </label>
                    <select
                      id={`status-${item.id}`}
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          item.id,
                          e.target.value as FeedbackItem['status'],
                        )
                      }
                      className="min-h-9 max-w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-900 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      {Object.entries(STATUS_STYLES).map(([value, status]) => (

                        <option
                          key={value}
                          value={value}
                          className="bg-white text-gray-900"
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>

                  <h2 className="break-words text-base font-semibold leading-snug text-gray-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-200 pt-3">

                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="block text-[10px] text-gray-600">
                        Solicitante
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.authorName}
                      </span>
                    </span>
                  </div>

                  {item.authorDepartment && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-400">
                        <Building className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="block text-[10px] text-slate-500">
                          Setor
                        </span>

                        <span className="font-medium text-gray-900">
                          {item.authorDepartment}
                        </span>
                      </span>
                    </div>
                  )}

                  {item.authorRole && (
                    <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-[11px] text-gray-800">
                      Perfil: {item.authorRole}
                    </span>
                  )}

                  {item.priority && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLES[item.priority]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      Prioridade {item.priority}
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Modal do gestor */}
      {isModalOpen && currentRole === 'gestor' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="demand-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-slate-900 p-5 text-white shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    id="demand-modal-title"
                    className="text-base font-bold text-white"
                  >
                    Solicitar dado ou relatório
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Registre uma demanda para análise da equipe STI.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDemand} className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="demand-title"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Título da solicitação
                </label>
                <input
                  id="demand-title"
                  type="text"
                  required
                  maxLength={160}
                  autoFocus
                  value={demandTitle}
                  onChange={(e) => setDemandTitle(e.target.value)}
                  placeholder="Ex.: Relatório de SLA dos chamados"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-slate-200">
                  Prioridade institucional
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {(['baixa', 'media', 'alta'] as const).map((priority) => {
                    const selected = demandPriority === priority;

                    return (
                      <button
                        key={priority}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setDemandPriority(priority)}
                        className={`min-h-10 rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${selected
                          ? PRIORITY_STYLES[priority]
                          : 'border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                          }`}
                      >
                        {priority}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="demand-description"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Especificação dos dados necessários
                </label>
                <textarea
                  id="demand-description"
                  rows={5}
                  required
                  maxLength={4000}
                  value={demandDesc}
                  onChange={(e) => setDemandDesc(e.target.value)}
                  placeholder="Informe o período, os setores envolvidos, as métricas desejadas e o objetivo do relatório."
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Solicitação registrada pelo perfil gestor.
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="min-h-10 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <Send className="h-4 w-4" />
                    Registrar demanda
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}