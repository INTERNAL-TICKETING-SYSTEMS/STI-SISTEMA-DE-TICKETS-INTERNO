import { useState, useEffect } from 'react';
import { Ticket, TicketStatus, User } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateShort } from '@/data';
import Button from '@/components/ui/Button';
import { TechPage } from '@/components/tech/TechSidebar';
import { Search, Inbox, ArrowRight, Headphones, UserCheck, ArrowRightLeft, Users, Filter } from 'lucide-react';
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

export default function TechTickets({ tickets, onOpenTicket, onAssume, techName = 'Daniel Santos', initialStatus = 'todos' }: TechTicketsProps) {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>(initialStatus || 'todos');
  useEffect(() => {
    if (initialStatus) {
      setStatusFilter(initialStatus);
    }
  }, [initialStatus]);
  const [techFilter, setTechFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');

  // Identifica se houve transferência analisando as mensagens de update
  const getTransferInfo = (ticket: Ticket) => {
    const transferUpdate = [...ticket.updates].reverse().find((u) => u.message.toLowerCase().includes('transferido'));
    return transferUpdate ? transferUpdate.message : null;
  };

  const filtered = tickets.filter((t) => {
    // Filtro de status
    if (statusFilter !== 'todos' && t.status !== statusFilter) return false;

    // Filtro por responsável
    if (techFilter === 'sem_tecnico' && t.assignee) return false;
    if (techFilter === 'meus' && t.assignee !== techName) return false;
    if (techFilter !== 'todos' && techFilter !== 'sem_tecnico' && techFilter !== 'meus' && t.assignee !== techFilter) {
      return false;
    }

    // Busca textual
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

  const unassignedCount = tickets.filter((t) => !t.assignee && t.status !== 'fechado' && t.status !== 'resolvido').length;
  const myCount = tickets.filter((t) => t.assignee === techName && t.status !== 'fechado' && t.status !== 'resolvido').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-sti-navy-800">Fila Geral de Chamados</h1>
          <p className="mt-1 text-sm text-slate-500">Gestão, custódia e distribuição de demandas de Manutenção / TI.</p>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por protocolo, assunto, solicitante ou técnico responsável…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-sti-teal-400 focus:outline-none focus:ring-2 focus:ring-sti-teal-100 shadow-sm"
        />
      </div>

      {/* Linha 1 de Filtros: Por Responsável (Custódia da Equipe) */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <span className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" /> Responsável:
        </span>

        <button
          onClick={() => setTechFilter('todos')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            techFilter === 'todos' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Todos ({tickets.length})
        </button>

        <button
          onClick={() => setTechFilter('sem_tecnico')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            techFilter === 'sem_tecnico'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Livres na Fila ({unassignedCount})
        </button>

        <button
          onClick={() => setTechFilter('meus')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            techFilter === 'meus' ? 'bg-[#00A896] text-white shadow-sm' : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          Atribuídos a Mim ({myCount})
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Botões individuais dos 4 técnicos */}
        {mockTechnicians.map((tech) => {
          const isSelected = techFilter === tech.name;
          const techTicketCount = tickets.filter(
            (t) => t.assignee === tech.name && t.status !== 'fechado' && t.status !== 'resolvido'
          ).length;

          return (
            <button
              key={tech.email}
              onClick={() => setTechFilter(tech.name)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                isSelected ? 'bg-sti-navy-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tech.name.split(' ')[0]} ({techTicketCount})
            </button>
          );
        })}
      </div>

      {/* Linha 2 de Filtros: Por Status */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((f) => {
          const active = statusFilter === f.id;
          const count = f.id === 'todos' ? tickets.length : counts[f.id] ?? 0;
          return (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabela de Chamados com Badges e Ação Rápida */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Nenhum chamado encontrado</p>
          <p className="mt-1 text-xs text-slate-400">Tente ajustar os filtros de responsável ou a busca textual.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3.5">Protocolo</th>
                  <th className="px-4 py-3.5">Assunto & Contexto</th>
                  <th className="px-4 py-3.5">Solicitante</th>
                  <th className="px-4 py-3.5">Setor</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Responsável</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => {
                  const transferMsg = getTransferInfo(t);
                  const isMine = t.assignee === techName;

                  return (
                    <tr key={t.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                        {t.protocol}
                      </td>

                      <td className="max-w-[260px] px-4 py-3.5">
                        <div className="font-medium text-slate-800 truncate">{t.title}</div>
                        {/* Alerta Visual de Transferência */}
                        {transferMsg && (
                          <div className="mt-1 inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 border border-purple-200/60">
                            <ArrowRightLeft className="h-3 w-3" />
                            Transferido
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-600">{t.requesterName}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{t.requesterDepartment}</td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={t.status} />
                      </td>

                      <td className="px-4 py-3.5 text-xs">
                        {t.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${isMine ? 'bg-cyan-500' : 'bg-slate-400'}`} />
                            <span className={`font-medium ${isMine ? 'text-cyan-700 font-semibold' : 'text-slate-700'}`}>
                              {t.assignee}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                            Aguardando
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botão de Assumir Direto se estiver livre ou com outro técnico */}
                          {!isMine && t.status !== 'fechado' && t.status !== 'resolvido' && (
                            <button
                              type="button"
                              onClick={() => onAssume(t.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                              title="Assumir este chamado para mim"
                            >
                              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                              Assumir
                            </button>
                          )}

                          <Button size="sm" variant="secondary" onClick={() => onOpenTicket(t.id)}>
                            Abrir
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
