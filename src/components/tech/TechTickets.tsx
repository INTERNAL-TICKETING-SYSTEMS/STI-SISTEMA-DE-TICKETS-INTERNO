import { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateShort } from '@/data';
import Button from '@/components/ui/Button';
import { TechPage } from '@/components/tech/TechSidebar';
import { Search, Inbox, ArrowRight, Headphones } from 'lucide-react';

interface TechTicketsProps {
  tickets: Ticket[];
  onNavigate: (p: TechPage) => void;
  onOpenTicket: (id: string) => void;
  onAssume: (id: string) => void;
}

const filters: { id: TicketStatus | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'aberto', label: 'Abertos' },
  { id: 'em_andamento', label: 'Em atendimento' },
  { id: 'aguardando', label: 'Aguardando usuário' },
  { id: 'resolvido', label: 'Resolvidos' },
  { id: 'fechado', label: 'Fechados' },
];

export default function TechTickets({ tickets, onOpenTicket, onAssume }: TechTicketsProps) {
  const [filter, setFilter] = useState<TicketStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');

  const filtered = tickets.filter((t) => {
    if (filter !== 'todos' && t.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.protocol.toLowerCase().includes(q);
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sti-navy-800">Chamados</h1>
        <p className="mt-1 text-sm text-slate-500">Consulte e gerencie os chamados de suporte.</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por protocolo ou assunto…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-sti-teal-400 focus:outline-none focus:ring-2 focus:ring-sti-teal-100"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.id;
          const count = f.id === 'todos' ? tickets.length : counts[f.id] ?? 0;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-sti-navy-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sti-navy-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-600">Nenhum chamado encontrado</p>
          <p className="mt-1 text-sm text-slate-400">
            {search ? 'Tente outra busca.' : 'Não há chamados nesta categoria.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sti">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium text-slate-400">
                <th className="px-4 py-3">Protocolo</th>
                <th className="px-4 py-3">Assunto</th>
                <th className="px-4 py-3">Solicitante</th>
                <th className="px-4 py-3">Setor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-medium text-sti-navy-800">{t.protocol}</td>
                  <td className="max-w-[220px] truncate px-4 py-3.5 text-slate-700">{t.title}</td>
                  <td className="px-4 py-3.5 text-slate-600">{t.requesterName}</td>
                  <td className="px-4 py-3.5 text-slate-600">{t.requesterDepartment}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {t.assignee ?? <span className="text-slate-400 italic">Não atribuído</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{formatDateShort(t.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    {t.status === 'aberto' && !t.assignee ? (
                      <Button size="sm" onClick={() => onAssume(t.id)}>
                        <Headphones className="h-3.5 w-3.5" />
                        Atender
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => onOpenTicket(t.id)}>
                        Ver chamado
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
