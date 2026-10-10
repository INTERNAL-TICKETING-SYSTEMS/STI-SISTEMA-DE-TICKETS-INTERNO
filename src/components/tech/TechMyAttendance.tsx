
import React from 'react';
import {
  Clock,
  ArrowRight,
  Search,
  Inbox,
  CheckCircle2,
  Headphones,
} from 'lucide-react';

import { Ticket, TicketStatus } from '@/types';
import { useTechTheme } from './techTheme';

interface TechMyAttendanceProps {
  tickets: Ticket[];
  onNavigate: (p: any) => void;
  onOpenTicket: (id: string) => void;
  techName: string;
}

export default function TechMyAttendance({
  tickets,
  onOpenTicket,
  techName,
}: TechMyAttendanceProps) {
  const { isDark } = useTechTheme();

  const [search, setSearch] = React.useState('');

  // Chamados atribuídos ao técnico
  const myTickets = tickets.filter(
    (ticket) =>
      ticket.assignee === techName &&
      ticket.status !== 'fechado'
  );

  // Busca
  const filteredTickets = myTickets.filter((ticket) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.requesterName.toLowerCase().includes(query) ||
      ticket.requesterDepartment.toLowerCase().includes(query)
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
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700';

      case 'em_andamento':
        return isDark
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
          : 'border-blue-200 bg-blue-50 text-blue-700';

      case 'aguardando':
        return isDark
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          : 'border-amber-200 bg-amber-50 text-amber-700';

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
        return 'bg-emerald-400';
      case 'em_andamento':
        return 'bg-blue-400';
      case 'aguardando':
        return 'bg-amber-400';
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

    if (!rawDate) return '23/09/2026';

    try {
      const date = new Date(rawDate);

      if (Number.isNaN(date.getTime())) {
        return '23/09/2026';
      }

      return date.toLocaleDateString('pt-BR');
    } catch {
      return '23/09/2026';
    }
  };

  const inProgressCount = myTickets.filter(
    (ticket) => ticket.status === 'em_andamento'
  ).length;

  const resolvedCount = myTickets.filter(
    (ticket) => ticket.status === 'resolvido'
  ).length;

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
        {/* Cabeçalho sem botão de tema */}
        <section
          className={[
            'flex flex-col gap-5 rounded-2xl border p-5 shadow-sm',
            'sm:flex-row sm:items-center sm:justify-between',
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
                  ? 'bg-blue-500/10 text-blue-300'
                  : 'bg-blue-50 text-blue-600',
              ].join(' ')}
            >
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <h1
                className={[
                  'text-2xl font-bold tracking-tight',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                Meus atendimentos
              </h1>

              <p
                className={[
                  'mt-1 text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Acompanhe os chamados atribuídos a você.
              </p>
            </div>
          </div>
        </section>

        {/* Resumo */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total */}
          <div
            className={[
              'flex min-h-[110px] items-center gap-4 rounded-2xl border p-5 shadow-sm',
              isDark
                ? 'border-white/10 bg-[#0b1624]'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                isDark
                  ? 'bg-teal-500/10 text-teal-300'
                  : 'bg-teal-50 text-teal-600',
              ].join(' ')}
            >
              <Inbox className="h-6 w-6" />
            </div>

            <div>
              <span
                className={[
                  'block text-3xl font-bold leading-none',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                {myTickets.length}
              </span>

              <p
                className={[
                  'mt-2 text-sm font-medium',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Chamado{myTickets.length === 1 ? '' : 's'} atribuído
                {myTickets.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Em atendimento */}
          <div
            className={[
              'flex min-h-[110px] items-center gap-4 rounded-2xl border p-5 shadow-sm',
              isDark
                ? 'border-white/10 bg-[#0b1624]'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                isDark
                  ? 'bg-blue-500/10 text-blue-300'
                  : 'bg-blue-50 text-blue-600',
              ].join(' ')}
            >
              <Headphones className="h-6 w-6" />
            </div>

            <div>
              <span
                className={[
                  'block text-3xl font-bold leading-none',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                {inProgressCount}
              </span>

              <p
                className={[
                  'mt-2 text-sm font-medium',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Em atendimento
              </p>
            </div>
          </div>

          {/* Resolvidos */}
          <div
            className={[
              'flex min-h-[110px] items-center gap-4 rounded-2xl border p-5 shadow-sm',
              isDark
                ? 'border-white/10 bg-[#0b1624]'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                isDark
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'bg-emerald-50 text-emerald-600',
              ].join(' ')}
            >
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <span
                className={[
                  'block text-3xl font-bold leading-none',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                {resolvedCount}
              </span>

              <p
                className={[
                  'mt-2 text-sm font-medium',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Resolvido{resolvedCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <section
          className={[
            'overflow-hidden rounded-2xl border shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          {/* Cabeçalho da tabela */}
          <div
            className={[
              'flex flex-col gap-4 border-b p-5',
              'sm:flex-row sm:items-center sm:justify-between',
              isDark ? 'border-white/10' : 'border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  isDark
                    ? 'bg-blue-500/10 text-blue-300'
                    : 'bg-blue-50 text-blue-600',
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
                  Chamados em atendimento
                </h2>

                <p
                  className={[
                    'mt-0.5 text-xs',
                    isDark ? 'text-slate-500' : 'text-slate-500',
                  ].join(' ')}
                >
                  {myTickets.length}{' '}
                  {myTickets.length === 1 ? 'chamado' : 'chamados'}
                </p>
              </div>
            </div>

            {/* Busca sem transição */}
            <div className="relative w-full sm:w-[320px]">
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
                placeholder="Buscar chamado..."
                className={[
                  'h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none',
                  'focus:ring-2 focus:ring-teal-500/30',
                  isDark
                    ? 'border-white/10 bg-white/[0.03] text-slate-200 placeholder:text-slate-600 focus:border-teal-500/40'
                    : 'border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-teal-400',
                ].join(' ')}
              />
            </div>
          </div>

          {/* Conteúdo da tabela */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr
                  className={[
                    'border-b text-xs font-bold uppercase tracking-wider',
                    isDark
                      ? 'border-white/10 bg-white/[0.02] text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-500',
                  ].join(' ')}
                >
                  <th className="px-5 py-4">Protocolo</th>
                  <th className="px-5 py-4">Assunto</th>
                  <th className="px-5 py-4">Solicitante</th>
                  <th className="px-5 py-4">Setor</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Abertura</th>
                  <th className="px-5 py-4 text-right">Ação</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div
                          className={[
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            isDark
                              ? 'bg-slate-500/10 text-slate-500'
                              : 'bg-slate-100 text-slate-400',
                          ].join(' ')}
                        >
                          <Inbox className="h-6 w-6" />
                        </div>

                        <div className="text-center">
                          <p
                            className={[
                              'font-semibold',
                              isDark ? 'text-slate-300' : 'text-slate-700',
                            ].join(' ')}
                          >
                            {search
                              ? 'Nenhum chamado encontrado'
                              : 'Nenhum chamado atribuído'}
                          </p>

                          <p
                            className={[
                              'mt-1 text-sm',
                              isDark ? 'text-slate-500' : 'text-slate-500',
                            ].join(' ')}
                          >
                            {search
                              ? 'Tente pesquisar por outro termo.'
                              : 'Os chamados atribuídos a você aparecerão aqui.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={[
                        'group border-b last:border-b-0',
                        isDark
                          ? 'border-white/[0.06] hover:bg-teal-500/[0.04]'
                          : 'border-slate-100 hover:bg-teal-50/50',
                      ].join(' ')}
                    >
                      <td className="px-5 py-4">
                        <span
                          className={[
                            'font-mono text-sm font-bold',
                            isDark
                              ? 'text-slate-200 group-hover:text-teal-300'
                              : 'text-slate-800 group-hover:text-teal-600',
                          ].join(' ')}
                        >
                          {ticket.id}
                        </span>
                      </td>

                      <td className="max-w-[300px] px-5 py-4">
                        <span
                          className={[
                            'block truncate text-sm font-semibold',
                            isDark
                              ? 'text-slate-200 group-hover:text-white'
                              : 'text-slate-800 group-hover:text-slate-900',
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
                            'text-sm',
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
                            'text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/40',
                            isDark
                              ? 'text-teal-300 hover:bg-teal-500/10'
                              : 'text-teal-600 hover:bg-teal-50',
                          ].join(' ')}
                        >
                          Atender
                          <ArrowRight className="h-4 w-4" />
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