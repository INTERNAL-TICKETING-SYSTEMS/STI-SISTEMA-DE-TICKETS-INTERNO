import React from 'react';
import {
  Clock,
  ArrowRight,
  Search,
  Inbox,
  CheckCircle2,
  Headphones,
  Filter,
  X,
  ClipboardList,
} from 'lucide-react';

import { Ticket, TicketStatus } from '@/types';
import { useTechTheme } from './techTheme';

interface TechMyAttendanceProps {
  tickets: Ticket[];
  onNavigate: (p: any) => void;
  onOpenTicket: (id: string) => void;
  techName: string;
}

const statusFilters: {
  id: TicketStatus | 'todos';
  label: string;
}[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'aberto', label: 'Abertos' },
  { id: 'em_andamento', label: 'Em atendimento' },
  { id: 'aguardando', label: 'Aguardando usuário' },
  { id: 'resolvido', label: 'Resolvidos' },
];

export default function TechMyAttendance({
  tickets,
  onOpenTicket,
  techName,
}: TechMyAttendanceProps) {
  const { isDark } = useTechTheme();

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] =
    React.useState<TicketStatus | 'todos'>('todos');

  // Chamados atribuídos ao técnico.
  // Chamados fechados permanecem fora desta tela, como na versão anterior.
  const myTickets = tickets.filter(
    (ticket) =>
      ticket.assignee === techName &&
      ticket.status !== 'fechado'
  );

  // Indicadores
  const inProgressCount = myTickets.filter(
    (ticket) => ticket.status === 'em_andamento'
  ).length;

  const resolvedCount = myTickets.filter(
    (ticket) => ticket.status === 'resolvido'
  ).length;

  const openCount = myTickets.filter(
    (ticket) => ticket.status === 'aberto'
  ).length;

  const waitingCount = myTickets.filter(
    (ticket) => ticket.status === 'aguardando'
  ).length;

  // Pesquisa e filtros combinados
  const filteredTickets = myTickets.filter((ticket) => {
    if (
      statusFilter !== 'todos' &&
      ticket.status !== statusFilter
    ) {
      return false;
    }

    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      ticket.id,
      ticket.protocol,
      ticket.title,
      ticket.requesterName,
      ticket.requesterDepartment,
      ticket.assignee,
    ].some((value) =>
      String(value || '').toLowerCase().includes(query)
    );
  });

  // Status
  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'em_andamento':
        return 'Em atendimento';
      case 'aguardando':
        return 'Aguardando usuário';
      case 'resolvido':
        return 'Resolvido';
      case 'fechado':
        return 'Fechado';
      default:
        return status;
    }
  };

  const getStatusClasses = (status: TicketStatus) => {
    switch (status) {
      case 'aberto':
        return isDark
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          : 'border-amber-200 bg-amber-50 text-amber-700';

      case 'em_andamento':
        return isDark
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
          : 'border-blue-200 bg-blue-50 text-blue-700';

      case 'aguardando':
        return isDark
          ? 'border-violet-500/30 bg-violet-500/10 text-violet-300'
          : 'border-violet-200 bg-violet-50 text-violet-700';

      case 'resolvido':
        return isDark
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700';

      case 'fechado':
        return isDark
          ? 'border-slate-500/30 bg-slate-500/10 text-slate-300'
          : 'border-slate-200 bg-slate-50 text-slate-600';

      default:
        return isDark
          ? 'border-white/10 bg-white/5 text-slate-300'
          : 'border-slate-200 bg-slate-50 text-slate-600';
    }
  };

  const getStatusDot = (status: TicketStatus) => {
    switch (status) {
      case 'aberto':
        return 'bg-amber-400';
      case 'em_andamento':
        return 'bg-blue-400';
      case 'aguardando':
        return 'bg-violet-400';
      case 'resolvido':
        return 'bg-emerald-400';
      case 'fechado':
        return isDark ? 'bg-slate-500' : 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  // Data de abertura
  const formatDate = (ticket: Ticket) => {
    const rawDate =
      (ticket as any).createdAt ??
      (ticket as any).openedAt ??
      (ticket as any).created_at ??
      (ticket as any).date;

    if (!rawDate) return '—';

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString('pt-BR');
  };

  // Protocolo com alternativa para registros antigos
  const getProtocol = (ticket: Ticket) =>
    ticket.protocol || ticket.id;

  return (
    <div
      className={[
        'relative min-h-screen w-full overflow-x-hidden',
        isDark
          ? 'bg-[#07111d] text-slate-100'
          : 'bg-slate-50 text-slate-900',
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

        {/* CABEÇALHO */}

        <section
          className={[
            'flex flex-col gap-5 rounded-2xl border p-5 shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <div
              className={[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                isDark
                  ? 'bg-teal-500/10 text-teal-300'
                  : 'bg-teal-50 text-teal-600',
              ].join(' ')}
            >
              <Headphones className="h-5 w-5" />
            </div>

            <div>
              <h1
                className={[
                  'text-2xl font-bold tracking-tight',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                Meus Atendimentos
              </h1>

              <p
                className={[
                  'mt-1 text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Acompanhe e gerencie os chamados atribuídos a você.
              </p>
            </div>
          </div>
        </section>

        {/* INDICADORES */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

          {/* TOTAL */}

          <button
            type="button"
            onClick={() => setStatusFilter('todos')}
            className={[
              'group rounded-2xl border p-5 text-left shadow-sm',
              'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
              statusFilter === 'todos'
                ? isDark
                  ? 'border-teal-500/40 bg-teal-500/[0.08]'
                  : 'border-teal-300 bg-teal-50/70'
                : isDark
                  ? 'border-white/10 bg-[#0b1624] hover:border-teal-500/30'
                  : 'border-slate-200 bg-white hover:border-teal-200',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <span
                className={[
                  'text-xs font-medium',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                ].join(' ')}
              >
                Total de chamados
              </span>

              <ClipboardList className="h-5 w-5 text-teal-500 transition-transform duration-300 group-hover:scale-110" />
            </div>

            <p
              className={[
                'mt-3 text-3xl font-bold tabular-nums',
                isDark ? 'text-white' : 'text-slate-900',
              ].join(' ')}
            >
              {myTickets.length}
            </p>

            <span className="mt-1 block text-[11px] text-teal-600">
              Visualizar todos
            </span>
          </button>

          {/* EM ATENDIMENTO */}

          <button
            type="button"
            onClick={() => setStatusFilter('em_andamento')}
            className={[
              'group rounded-2xl border p-5 text-left shadow-sm',
              'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
              statusFilter === 'em_andamento'
                ? isDark
                  ? 'border-blue-400/50 bg-blue-500/[0.08]'
                  : 'border-blue-300 bg-blue-50/70'
                : isDark
                  ? 'border-white/10 bg-[#0b1624] hover:border-blue-500/30'
                  : 'border-slate-200 bg-white hover:border-blue-200',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <span
                className={[
                  'text-xs font-medium',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                ].join(' ')}
              >
                Em atendimento
              </span>

              <Headphones className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
            </div>

            <p
              className={[
                'mt-3 text-3xl font-bold tabular-nums',
                isDark ? 'text-white' : 'text-slate-900',
              ].join(' ')}
            >
              {inProgressCount}
            </p>

            <span className="mt-1 block text-[11px] text-blue-600">
              Chamados em execução
            </span>
          </button>

          {/* RESOLVIDOS */}

          <button
            type="button"
            onClick={() => setStatusFilter('resolvido')}
            className={[
              'group rounded-2xl border p-5 text-left shadow-sm',
              'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
              statusFilter === 'resolvido'
                ? isDark
                  ? 'border-emerald-400/50 bg-emerald-500/[0.08]'
                  : 'border-emerald-300 bg-emerald-50/70'
                : isDark
                  ? 'border-white/10 bg-[#0b1624] hover:border-emerald-500/30'
                  : 'border-slate-200 bg-white hover:border-emerald-200',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <span
                className={[
                  'text-xs font-medium',
                  isDark ? 'text-slate-400' : 'text-slate-500',
                ].join(' ')}
              >
                Resolvidos
              </span>

              <CheckCircle2 className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
            </div>

            <p
              className={[
                'mt-3 text-3xl font-bold tabular-nums',
                isDark ? 'text-white' : 'text-slate-900',
              ].join(' ')}
            >
              {resolvedCount}
            </p>

            <span className="mt-1 block text-[11px] text-emerald-600">
              Atendimentos concluídos
            </span>
          </button>
        </div>

        {/* PESQUISA E FILTROS */}

        <section
          className={[
            'rounded-2xl border p-4 shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                className={[
                  'text-sm font-semibold',
                  isDark ? 'text-white' : 'text-slate-800',
                ].join(' ')}
              >
                Localizar atendimentos
              </h2>

              <p
                className={[
                  'mt-0.5 text-xs',
                  isDark ? 'text-slate-500' : 'text-slate-500',
                ].join(' ')}
              >
                Pesquise por protocolo, assunto, solicitante ou setor.
              </p>
            </div>

            <span
              className={[
                'text-xs font-medium',
                isDark ? 'text-slate-400' : 'text-slate-500',
              ].join(' ')}
            >
              {filteredTickets.length} resultado(s)
            </span>
          </div>

          <div className="relative">
            <Search
              className={[
                'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2',
                isDark ? 'text-slate-500' : 'text-slate-400',
              ].join(' ')}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o protocolo, assunto ou nome..."
              aria-label="Pesquisar meus atendimentos"
              className={[
                'h-12 w-full rounded-xl border py-3 pl-11 pr-11 text-sm outline-none',
                'transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
                isDark
                  ? 'border-white/10 bg-white/[0.03] text-white placeholder:text-slate-500'
                  : 'border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400',
              ].join(' ')}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar pesquisa"
                className={[
                  'absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5',
                  'transition-colors duration-200',
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700',
                ].join(' ')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* FILTROS DE STATUS */}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={[
                'mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider',
                isDark ? 'text-slate-400' : 'text-slate-500',
              ].join(' ')}
            >
              <Filter className="h-3.5 w-3.5" />
              Status:
            </span>

            {statusFilters.map((filter) => {
              const active = statusFilter === filter.id;

              const count =
                filter.id === 'todos'
                  ? myTickets.length
                  : myTickets.filter(
                      (ticket) => ticket.status === filter.id
                    ).length;

              return (
                <button
                  type="button"
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium',
                    'transition-all duration-200 ease-out active:scale-[0.97]',
                    active
                      ? 'border-[#00A896] bg-[#00A896] text-white shadow-sm'
                      : isDark
                        ? 'border-white/10 bg-[#0b1624] text-slate-300 hover:border-teal-500/40 hover:bg-white/5'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50',
                  ].join(' ')}
                >
                  {filter.label}

                  <span
                    className={[
                      'rounded-full px-1.5 py-0.5 text-[10px]',
                      active
                        ? 'bg-white/20 text-white'
                        : isDark
                          ? 'bg-white/10 text-slate-400'
                          : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TABELA */}

        <section
          className={[
            'overflow-hidden rounded-2xl border shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          {/* CABEÇALHO DA TABELA */}

          <div
            className={[
              'flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between',
              isDark ? 'border-white/10' : 'border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  isDark
                    ? 'bg-teal-500/10 text-teal-300'
                    : 'bg-teal-50 text-teal-600',
                ].join(' ')}
              >
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className={[
                    'text-base font-bold',
                    isDark ? 'text-white' : 'text-slate-900',
                  ].join(' ')}
                >
                  Chamados sob minha responsabilidade
                </h2>

                <p
                  className={[
                    'mt-0.5 text-xs',
                    isDark ? 'text-slate-500' : 'text-slate-500',
                  ].join(' ')}
                >
                  Exibindo {filteredTickets.length} de {myTickets.length} chamado(s)
                </p>
              </div>
            </div>

            {statusFilter !== 'todos' && (
              <button
                type="button"
                onClick={() => setStatusFilter('todos')}
                className={[
                  'self-start rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  isDark
                    ? 'text-teal-300 hover:bg-teal-500/10'
                    : 'text-teal-700 hover:bg-teal-50',
                ].join(' ')}
              >
                Limpar filtro
              </button>
            )}
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead>
                <tr
                  className={
                    isDark
                      ? 'border-b border-white/10 bg-white/[0.03] text-slate-400'
                      : 'border-b border-slate-200 bg-slate-50 text-slate-600'
                  }
                >
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Protocolo
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Assunto
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Setor
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Abertura
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>

              <tbody
                className={
                  isDark
                    ? 'divide-y divide-white/[0.06]'
                    : 'divide-y divide-slate-100'
                }
              >
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div
                          className={[
                            'flex h-14 w-14 items-center justify-center rounded-full',
                            isDark ? 'bg-white/5' : 'bg-slate-100',
                          ].join(' ')}
                        >
                          <Inbox
                            className={[
                              'h-7 w-7',
                              isDark ? 'text-slate-500' : 'text-slate-400',
                            ].join(' ')}
                          />
                        </div>

                        <div className="text-center">
                          <p
                            className={[
                              'font-semibold',
                              isDark ? 'text-slate-200' : 'text-slate-800',
                            ].join(' ')}
                          >
                            {search || statusFilter !== 'todos'
                              ? 'Nenhum chamado encontrado'
                              : 'Nenhum chamado atribuído'}
                          </p>

                          <p
                            className={[
                              'mt-1 text-sm',
                              isDark ? 'text-slate-500' : 'text-slate-500',
                            ].join(' ')}
                          >
                            {search || statusFilter !== 'todos'
                              ? 'Tente alterar a pesquisa ou selecionar outro status.'
                              : 'Os chamados atribuídos a você aparecerão aqui.'}
                          </p>

                          {(search || statusFilter !== 'todos') && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearch('');
                                setStatusFilter('todos');
                              }}
                              className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold text-teal-600 transition-colors hover:bg-teal-50"
                            >
                              Limpar pesquisa e filtros
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={[
                        'group transition-all duration-200 ease-out',
                        isDark
                          ? 'hover:bg-teal-500/[0.06]'
                          : 'hover:bg-teal-50/70',
                      ].join(' ')}
                    >
                      <td className="px-5 py-4">
                        <span
                          className={[
                            'font-mono text-xs font-semibold transition-colors',
                            isDark
                              ? 'text-slate-300 group-hover:text-teal-300'
                              : 'text-slate-700 group-hover:text-teal-700',
                          ].join(' ')}
                        >
                          {getProtocol(ticket)}
                        </span>
                      </td>

                      <td className="max-w-[300px] px-5 py-4">
                        <span
                          className={[
                            'block truncate text-sm font-semibold',
                            isDark ? 'text-slate-100' : 'text-slate-800',
                          ].join(' ')}
                          title={ticket.title}
                        >
                          {ticket.title}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm',
                            isDark ? 'text-slate-300' : 'text-slate-700',
                          ].join(' ')}
                        >
                          {ticket.requesterName}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-600',
                          ].join(' ')}
                        >
                          {ticket.requesterDepartment}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
                            getStatusClasses(ticket.status),
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'h-2 w-2 rounded-full',
                              getStatusDot(ticket.status),
                            ].join(' ')}
                          />

                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm tabular-nums',
                            isDark ? 'text-slate-400' : 'text-slate-600',
                          ].join(' ')}
                        >
                          {formatDate(ticket)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenTicket(ticket.id)}
                          className={[
                            'inline-flex items-center gap-2 rounded-lg px-3 py-2',
                            'text-xs font-semibold shadow-sm transition-all duration-200 ease-out',
                            'active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-teal-500/40',
                            isDark
                              ? 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
                              : 'bg-teal-50 text-teal-700 hover:bg-teal-100',
                          ].join(' ')}
                          title="Abrir atendimento"
                        >
                          Atender
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}