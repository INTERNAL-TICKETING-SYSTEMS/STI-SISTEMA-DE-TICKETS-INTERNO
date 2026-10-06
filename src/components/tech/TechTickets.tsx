import { useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { TechPage, useTechTheme } from '@/components/tech/TechSidebar';
import {
  Search,
  Inbox,
  ArrowRight,
  UserCheck,
  ArrowRightLeft,
  Filter,
} from 'lucide-react';
import { mockTechnicians } from '@/data';

interface TechTicketsProps {
  tickets: Ticket[];
  onNavigate: (p: TechPage) => void;
  onOpenTicket: (id: string) => void;
  onAssume: (id: string) => void;
  techName?: string;
  initialStatus?: TicketStatus | 'todos';
}

const statusFilters: {
  id: TicketStatus | 'todos';
  label: string;
}[] = [
  { id: 'todos', label: 'Todos os status' },
  { id: 'aberto', label: 'Abertos' },
  { id: 'em_andamento', label: 'Em atendimento' },
  { id: 'aguardando', label: 'Aguardando usuário' },
  { id: 'resolvido', label: 'Resolvidos' },
  { id: 'fechado', label: 'Fechados' },
];

export default function TechTickets({
  tickets,
  onOpenTicket,
  onAssume,
  techName = 'Daniel Santos',
  initialStatus = 'todos',
}: TechTicketsProps) {
  const [statusFilter, setStatusFilter] =
    useState<TicketStatus | 'todos'>(initialStatus);

  const [techFilter, setTechFilter] =
    useState<string>('todos');

  const [search, setSearch] = useState('');

  const { isDark } = useTechTheme();

  useEffect(() => {
    setStatusFilter(initialStatus);
  }, [initialStatus]);

  const getTransferInfo = (ticket: Ticket) => {
    const transferUpdate = [...ticket.updates]
      .reverse()
      .find((u) =>
        u.message.toLowerCase().includes('transferido')
      );

    return transferUpdate ? transferUpdate.message : null;
  };

  const filtered = tickets.filter((t) => {
    if (
      statusFilter !== 'todos' &&
      t.status !== statusFilter
    ) {
      return false;
    }

    if (
      techFilter === 'sem_tecnico' &&
      t.assignee
    ) {
      return false;
    }

    if (
      techFilter === 'meus' &&
      t.assignee !== techName
    ) {
      return false;
    }

    if (
      techFilter !== 'todos' &&
      techFilter !== 'sem_tecnico' &&
      techFilter !== 'meus' &&
      t.assignee !== techFilter
    ) {
      return false;
    }

    if (search) {
      const q = search.toLowerCase();

      return (
        t.title.toLowerCase().includes(q) ||
        t.protocol.toLowerCase().includes(q) ||
        (t.assignee &&
          t.assignee.toLowerCase().includes(q)) ||
        t.requesterName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const counts = tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const unassignedCount = tickets.filter(
    (t) =>
      !t.assignee &&
      t.status !== 'fechado' &&
      t.status !== 'resolvido'
  ).length;

  const myCount = tickets.filter(
    (t) =>
      t.assignee === techName &&
      t.status !== 'fechado' &&
      t.status !== 'resolvido'
  ).length;

  return (
    <div
      className={[
        'min-h-screen w-full',
        isDark
          ? 'bg-[#07111d] text-slate-100'
          : 'bg-slate-50 text-slate-900',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1400px] space-y-6">

        {/* CABEÇALHO */}

        <div
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
                'flex h-11 w-11 items-center justify-center rounded-xl',
                isDark
                  ? 'bg-teal-500/10 text-teal-300'
                  : 'bg-teal-50 text-teal-600',
              ].join(' ')}
            >
              <Inbox className="h-5 w-5" />
            </div>

            <div>
              <h1
                className={[
                  'text-2xl font-bold tracking-tight',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                Fila Geral de Chamados
              </h1>

              <p
                className={[
                  'mt-1 text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Gestão, custódia e distribuição de demandas de
                Manutenção / TI.
              </p>
            </div>
          </div>
        </div>

        {/* BUSCA */}

        <div className="relative">
          <Search
            className={[
              'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2',
              isDark ? 'text-slate-500' : 'text-slate-400',
            ].join(' ')}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por protocolo, assunto, solicitante ou técnico responsável…"
            className={[
              'w-full rounded-xl border py-3 pl-11 pr-4 text-sm shadow-sm outline-none',
              'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
              isDark
                ? 'border-white/10 bg-[#0b1624] text-slate-100 placeholder:text-slate-500'
                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400',
            ].join(' ')}
          />
        </div>

        {/* FILTROS POR RESPONSÁVEL */}

        <div
          className={[
            'flex flex-wrap items-center gap-1.5 rounded-xl border p-2 shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <span
            className={[
              'flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider',
              isDark ? 'text-slate-400' : 'text-slate-500',
            ].join(' ')}
          >
            <Filter className="h-3.5 w-3.5" />
            Responsável:
          </span>

          <button
            type="button"
            onClick={() => setTechFilter('todos')}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-medium',
              techFilter === 'todos'
                ? 'bg-[#00A896] text-white shadow-sm'
                : isDark
                  ? 'text-slate-300 hover:bg-white/5'
                  : 'text-slate-600 hover:bg-slate-100',
            ].join(' ')}
          >
            Todos ({tickets.length})
          </button>

          <button
            type="button"
            onClick={() => setTechFilter('sem_tecnico')}
            className={[
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
              techFilter === 'sem_tecnico'
                ? 'bg-amber-600 text-white shadow-sm'
                : isDark
                  ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Livres na Fila ({unassignedCount})
          </button>

          <button
            type="button"
            onClick={() => setTechFilter('meus')}
            className={[
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
              techFilter === 'meus'
                ? 'bg-[#00A896] text-white shadow-sm'
                : isDark
                  ? 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            Atribuídos a Mim ({myCount})
          </button>

          <div
            className={[
              'mx-1 hidden h-4 w-px sm:block',
              isDark ? 'bg-white/10' : 'bg-slate-200',
            ].join(' ')}
          />

          {mockTechnicians.map((tech) => {
            const isSelected = techFilter === tech.name;

            const techTicketCount = tickets.filter(
              (t) =>
                t.assignee === tech.name &&
                t.status !== 'fechado' &&
                t.status !== 'resolvido'
            ).length;

            return (
              <button
                type="button"
                key={tech.email}
                onClick={() => setTechFilter(tech.name)}
                className={[
                  'rounded-lg px-2.5 py-1.5 text-xs font-medium',
                  isSelected
                    ? 'bg-[#00A896] text-white shadow-sm'
                    : isDark
                      ? 'text-slate-300 hover:bg-white/5'
                      : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')}
              >
                {tech.name.split(' ')[0]} ({techTicketCount})
              </button>
            );
          })}
        </div>

        {/* FILTROS POR STATUS */}

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => {
            const active = statusFilter === f.id;

            const count =
              f.id === 'todos'
                ? tickets.length
                : counts[f.id] ?? 0;

            return (
              <button
                type="button"
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium',
                  active
                    ? 'border-[#00A896] bg-[#00A896] text-white shadow-sm'
                    : isDark
                      ? 'border-white/10 bg-[#0b1624] text-slate-300 hover:border-teal-500/40 hover:bg-white/5'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50',
                ].join(' ')}
              >
                {f.label}

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

        {/* TABELA / ESTADO VAZIO */}

        {filtered.length === 0 ? (
          <div
            className={[
              'flex flex-col items-center justify-center rounded-2xl border py-16 text-center shadow-sm',
              isDark
                ? 'border-white/10 bg-[#0b1624]'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div
              className={[
                'mb-4 flex h-14 w-14 items-center justify-center rounded-full',
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

            <p
              className={[
                'text-sm font-semibold',
                isDark ? 'text-slate-100' : 'text-slate-800',
              ].join(' ')}
            >
              Nenhum chamado encontrado
            </p>

            <p
              className={[
                'mt-1 text-xs',
                isDark ? 'text-slate-400' : 'text-slate-500',
              ].join(' ')}
            >
              Tente ajustar os filtros de responsável ou a busca
              textual.
            </p>
          </div>
        ) : (
          <div
            className={[
              'overflow-hidden rounded-2xl border shadow-sm',
              isDark
                ? 'border-white/10 bg-[#0b1624]'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr
                    className={[
                      'border-b text-xs font-semibold uppercase tracking-wider',
                      isDark
                        ? 'border-white/10 bg-[#102033] text-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-500',
                    ].join(' ')}
                  >
                    <th className="px-4 py-3.5">Protocolo</th>
                    <th className="px-4 py-3.5">Assunto &amp; Contexto</th>
                    <th className="px-4 py-3.5">Solicitante</th>
                    <th className="px-4 py-3.5">Setor</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Responsável</th>
                    <th className="px-4 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>

                <tbody
                  className={
                    isDark
                      ? 'divide-y divide-white/10'
                      : 'divide-y divide-slate-100'
                  }
                >
                  {filtered.map((t) => {
                    const transferMsg = getTransferInfo(t);
                    const isMine = t.assignee === techName;

                    return (
                      <tr
                        key={t.id}
                        className={
                          isDark
                            ? 'group hover:bg-teal-500/[0.04]'
                            : 'group hover:bg-teal-50/60'
                        }
                      >
                        <td
                          className={[
                            'px-4 py-3.5 font-mono text-xs font-semibold',
                            isDark ? 'text-slate-300' : 'text-slate-700',
                          ].join(' ')}
                        >
                          {t.protocol}
                        </td>

                        <td className="max-w-[260px] px-4 py-3.5">
                          <div
                            className={[
                              'truncate font-medium',
                              isDark ? 'text-slate-100' : 'text-slate-800',
                            ].join(' ')}
                          >
                            {t.title}
                          </div>

                          {transferMsg && (
                            <div
                              className={[
                                'mt-1 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium',
                                isDark
                                  ? 'border-purple-400/20 bg-purple-500/10 text-purple-300'
                                  : 'border-purple-200 bg-purple-50 text-purple-700',
                              ].join(' ')}
                            >
                              <ArrowRightLeft className="h-3 w-3" />
                              Transferido
                            </div>
                          )}
                        </td>

                        <td
                          className={[
                            'px-4 py-3.5 text-xs',
                            isDark ? 'text-slate-300' : 'text-slate-700',
                          ].join(' ')}
                        >
                          {t.requesterName}
                        </td>

                        <td
                          className={[
                            'px-4 py-3.5 text-xs',
                            isDark ? 'text-slate-400' : 'text-slate-600',
                          ].join(' ')}
                        >
                          {t.requesterDepartment}
                        </td>

                        <td className="px-4 py-3.5">
                          <StatusBadge status={t.status} />
                        </td>

                        <td className="px-4 py-3.5 text-xs">
                          {t.assignee ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={[
                                  'h-2 w-2 rounded-full',
                                  isMine
                                    ? 'bg-cyan-400'
                                    : isDark
                                      ? 'bg-slate-500'
                                      : 'bg-slate-400',
                                ].join(' ')}
                              />

                              <span
                                className={[
                                  'font-medium',
                                  isMine
                                    ? isDark
                                      ? 'font-semibold text-cyan-300'
                                      : 'font-semibold text-cyan-700'
                                    : isDark
                                      ? 'text-slate-300'
                                      : 'text-slate-600',
                                ].join(' ')}
                              >
                                {t.assignee}
                              </span>
                            </div>
                          ) : (
                            <span
                              className={[
                                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                                isDark
                                  ? 'border-amber-400/20 bg-amber-500/10 text-amber-300'
                                  : 'border-amber-200 bg-amber-50 text-amber-700',
                              ].join(' ')}
                            >
                              Aguardando
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isMine &&
                              t.status !== 'fechado' &&
                              t.status !== 'resolvido' && (
                                <button
                                  type="button"
                                  onClick={() => onAssume(t.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-[#00A896] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#008f80]"
                                  title="Assumir este chamado para mim"
                                >
                                  <UserCheck className="h-3.5 w-3.5" />
                                  Assumir
                                </button>
                              )}

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onOpenTicket(t.id)}
                            >
                              Abrir
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}