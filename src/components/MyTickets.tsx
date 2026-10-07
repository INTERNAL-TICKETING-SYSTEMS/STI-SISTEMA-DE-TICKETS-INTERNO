import { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelative } from '@/data';
import Button from '@/components/ui/Button';
import { Page } from '@/components/Sidebar';
import { MessagesSquare, ArrowRight, Search, Inbox } from 'lucide-react';
import { useTechTheme } from '@/components/tech/techTheme';

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

export default function MyTickets({
  tickets,
  onNavigate,
  onOpenTicket,
}: MyTicketsProps) {
  const [filter, setFilter] = useState<TicketStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const { isDark } = useTechTheme();

  const colors = {
    heading: isDark ? 'text-slate-100' : 'text-sti-navy-800',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    card: isDark
      ? 'border-slate-700 bg-slate-900'
      : 'border-slate-200 bg-white',
    input: isDark
      ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500'
      : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400',
    divider: isDark ? 'border-slate-800' : 'border-slate-100',
    hover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
    iconBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
    iconText: isDark ? 'text-slate-300' : 'text-slate-400',
    arrow: isDark ? 'text-slate-500' : 'text-slate-300',
    inactiveFilter: isDark
      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
      : 'border-slate-200 bg-white text-slate-600 hover:border-sti-navy-200 hover:bg-slate-50',
    count: isDark
      ? 'bg-slate-800 text-slate-300'
      : 'bg-slate-100 text-slate-500',
  };

  const filtered = tickets.filter((ticket) => {
    if (filter !== 'todos' && ticket.status !== filter) return false;

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.protocol.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const counts = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${colors.heading}`}>
            Meus chamados
          </h1>

          <p className={`mt-2 text-sm ${colors.muted}`}>
            Acompanhe e atualize seus pedidos de ajuda.
          </p>
        </div>

        <Button onClick={() => onNavigate('abrir-chamado')}>
          Abrir chamado
        </Button>
      </div>

      {/* Pesquisa */}
      <div className="relative mb-5">
        <Search
          className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${colors.muted}`}
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título ou protocolo..."
          aria-label="Buscar chamados por título ou protocolo"
          className={`w-full rounded-lg border py-2.5 pl-11 pr-4 text-sm transition-colors focus:border-sti-teal-400 focus:outline-none focus:ring-2 focus:ring-sti-teal-400/20 ${colors.input}`}
        />
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => {
          const active = filter === item.id;
          const count =
            item.id === 'todos'
              ? tickets.length
              : counts[item.id] ?? 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-sti-navy-800 bg-sti-navy-800 text-white'
                  : colors.inactiveFilter
              }`}
            >
              {item.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  active ? 'bg-white/20 text-white' : colors.count
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-xl border py-16 text-center ${colors.card}`}
        >
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colors.iconBg}`}
          >
            <Inbox className={`h-7 w-7 ${colors.iconText}`} />
          </div>

          <p className={`text-sm font-medium ${colors.heading}`}>
            Nenhum chamado encontrado
          </p>

          <p className={`mt-1 text-sm ${colors.muted}`}>
            {search
              ? 'Tente outra busca.'
              : 'Você não tem chamados nesta categoria.'}
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-xl border shadow-sti ${colors.card}`}
        >
          {filtered.map((ticket, index) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onOpenTicket(ticket.id)}
              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${colors.hover} ${
                index > 0 ? `border-t ${colors.divider}` : ''
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg} ${colors.iconText}`}
              >
                <MessagesSquare className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${colors.heading}`}>
                  {ticket.title}
                </p>

                <p className={`mt-0.5 text-xs ${colors.muted}`}>
                  {ticket.protocol} · {ticket.category} · atualizado{' '}
                  {formatRelative(ticket.updatedAt)}
                </p>
              </div>

              <StatusBadge status={ticket.status} />

              <ArrowRight
                className={`h-4 w-4 shrink-0 ${colors.arrow}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}