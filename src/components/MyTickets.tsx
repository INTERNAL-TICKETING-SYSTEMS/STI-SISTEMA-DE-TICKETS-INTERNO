import { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelative } from '@/data';
import Button from '@/components/ui/Button';
import { Page } from '@/components/Sidebar';
import { MessagesSquare, ArrowRight, Search, Inbox } from 'lucide-react';

interface MyTicketsProps {
  tickets: Ticket[];
  onNavigate: (p: Page) => void;
  onOpenTicket: (id: string) => void;
}

const filters: { id: TicketStatus | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'aberto', label: 'Abertos' },
  { id: 'em_andamento', label: 'Em andamento' },
  { id: 'aguardando', label: 'Aguardando você' },
  { id: 'resolvido', label: 'Resolvidos' },
  { id: 'fechado', label: 'Fechados' },
];

export default function MyTickets({ tickets, onNavigate, onOpenTicket }: MyTicketsProps) {
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
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sti-navy-800">Meus chamados</h1>
          <p className="mt-2 text-sm text-slate-500">
            Acompanhe e atualize seus pedidos de ajuda.
          </p>
        </div>
        <Button onClick={() => onNavigate('abrir-chamado')}>
          Abrir chamado
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título ou protocolo…"
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

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-600">Nenhum chamado encontrado</p>
          <p className="mt-1 text-sm text-slate-400">
            {search ? 'Tente outra busca.' : 'Você não tem chamados nesta categoria.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sti">
          {filtered.map((t, i) => (
            <button
              key={t.id}
              onClick={() => onOpenTicket(t.id)}
              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${
                i > 0 ? 'border-t border-slate-100' : ''
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <MessagesSquare className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sti-navy-800">{t.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.protocol} · {t.category} · atualizado {formatRelative(t.updatedAt)}
                </p>
              </div>
              <StatusBadge status={t.status} />
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
