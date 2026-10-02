
import { useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { TechPage } from '@/components/tech/TechSidebar';
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

const statusFilters: { id: TicketStatus | 'todos'; label: string }[] = [
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
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>(initialStatus);
  const [techFilter, setTechFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setStatusFilter(initialStatus);
  }, [initialStatus]);

  const getTransferInfo = (ticket: Ticket) => {
    const transferUpdate = [...ticket.updates]
      .reverse()
      .find((u) => u.message.toLowerCase().includes('transferido'));

    return transferUpdate ? transferUpdate.message : null;
  };

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'todos' && t.status !== statusFilter) return false;

    if (techFilter === 'sem_tecnico' && t.assignee) return false;
    if (techFilter === 'meus' && t.assignee !== techName) return false;

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
        (t.assignee && t.assignee.toLowerCase().includes(q)) ||
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
    (t) => !t.assignee && t.status !== 'fechado' && t.status !== 'resolvido'
  ).length;

  const myCount = tickets.filter(
    (t) => t.assignee === techName && t.status !== 'fechado' && t.status !== 'resolvido'
  ).length;

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Fila Geral de Chamados
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestão, custódia e distribuição de demandas de Manutenção / TI.
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por protocolo, assunto, solicitante ou técnico responsável…"
          className="w-full rounded-xl border border-white/10 bg-[#0b1624] py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      {/* Filtros por responsável */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#0b1624] p-2 shadow-sm">
        <span className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          Responsável:
        </span>

        <button
          onClick={() => setTechFilter('todos')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            techFilter === 'todos'
              ? 'bg-[#00A896] text-white shadow-sm'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          Todos ({tickets.length})
        </button>

        <button
          onClick={() => setTechFilter('sem_tecnico')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            techFilter === 'sem_tecnico'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Livres na Fila ({unassignedCount})
        </button>

        <button
          onClick={() => setTechFilter('meus')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            techFilter === 'meus'
              ? 'bg-[#00A896] text-white shadow-sm'
              : 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          Atribuídos a Mim ({myCount})
        </button>

        <div className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />

        {/* Filtros individuais dos técnicos */}
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
              key={tech.email}
              onClick={() => setTechFilter(tech.name)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#00A896] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {tech.name.split(' ')[0]} ({techTicketCount})
            </button>
          );
        })}
      </div>

      {/* Filtros por status */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((f) => {
          const active = statusFilter === f.id;
          const count = f.id === 'todos' ? tickets.length : counts[f.id] ?? 0;

          return (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-[#00A896] bg-[#00A896] text-white shadow-sm'
                  : 'border-white/10 bg-[#0b1624] text-slate-300 hover:border-cyan-500/40 hover:bg-white/5'
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabela de chamados */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1624] py-16 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            <Inbox className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-100">
            Nenhum chamado encontrado
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Tente ajustar os filtros de responsável ou a busca textual.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1624] shadow-sm">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#102033] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3.5">Protocolo</th>
                  <th className="px-4 py-3.5">Assunto &amp; Contexto</th>
                  <th className="px-4 py-3.5">Solicitante</th>
                  <th className="px-4 py-3.5">Setor</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Responsável</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filtered.map((t) => {
                  const transferMsg = getTransferInfo(t);
                  const isMine = t.assignee === techName;

                  return (
                    <tr
                      key={t.id}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-300">
                        {t.protocol}
                      </td>

                      <td className="max-w-[260px] px-4 py-3.5">
                        <div className="truncate font-medium text-slate-100">
                          {t.title}
                        </div>

                        {transferMsg && (
                          <div className="mt-1 inline-flex items-center gap-1 rounded border border-purple-400/20 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-300">
                            <ArrowRightLeft className="h-3 w-3" />
                            Transferido
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        {t.requesterName}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-400">
                        {t.requesterDepartment}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={t.status} />
                      </td>

                      <td className="px-4 py-3.5 text-xs">
                        {t.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isMine ? 'bg-cyan-400' : 'bg-slate-500'
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                isMine
                                  ? 'font-semibold text-cyan-300'
                                  : 'text-slate-300'
                              }`}
                            >
                              {t.assignee}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
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
                                className="inline-flex items-center gap-1 rounded-lg bg-[#00A896] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#008f80]"
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
  );
}