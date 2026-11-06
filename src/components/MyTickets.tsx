
import { useMemo, useState } from 'react';
import { Ticket, TicketStatus, User } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelative } from '@/data';
import { belongsToUser } from '@/utils/ticketOwnership';
import Button from '@/components/ui/Button';
import { Page } from '@/components/Sidebar';
import {
  MessagesSquare,
  ArrowRight,
  Search,
  Inbox,
  X,
  ClipboardList,
  Clock,
  CheckCircle2,
  CircleAlert,
  PlusCircle,
} from 'lucide-react';
import { useTechTheme } from '@/components/tech/techTheme';

interface MyTicketsProps {
  tickets: Ticket[];
  activeUser: User;
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
  activeUser,
  onNavigate,
  onOpenTicket,
}: MyTicketsProps) {
  const [filter, setFilter] = useState<TicketStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const { isDark } = useTechTheme();
  const myTickets = useMemo(
    () => tickets.filter((ticket) => belongsToUser(ticket, activeUser)),
    [tickets, activeUser],

  );

  const colors = {
    heading: isDark ? 'text-slate-100' : 'text-sti-navy-800',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    card: isDark
      ? 'border-slate-700 bg-slate-900'
      : 'border-slate-200 bg-white',
    input: isDark
      ? 'border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500'
      : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400',
    divider: isDark ? 'border-slate-800' : 'border-slate-100',
    hover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50',
    inactiveFilter: isDark
      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
      : 'border-slate-200 bg-white text-slate-600 hover:border-sti-teal-300 hover:bg-slate-50',
    count: isDark
      ? 'bg-slate-800 text-slate-300'
      : 'bg-slate-100 text-slate-500',
    iconText: isDark ? 'text-slate-300' : 'text-slate-400',
  };

  const counts = useMemo(() => {
    return {
      total: myTickets.length,
      aberto: myTickets.filter((ticket) => ticket.status === 'aberto').length,
      andamento: myTickets.filter((ticket) => ticket.status === 'em_andamento').length,
      aguardando: myTickets.filter((ticket) => ticket.status === 'aguardando').length,
      resolvido: myTickets.filter((ticket) => ticket.status === 'resolvido').length,
      fechado: myTickets.filter((ticket) => ticket.status === 'fechado').length,
    };
  }, [myTickets]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return myTickets.filter((ticket) => {
      if (filter !== 'todos' && ticket.status !== filter) {
        return false;
      }

      if (!query) return true;

      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.protocol.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query)
      );
    });
  }, [myTickets, filter, search]);

  const cards = [
    {
      id: 'todos' as const,
      label: 'Total de chamados',
      value: counts.total,
      description: 'Todos os seus registros',
      icon: ClipboardList,
      iconStyle: isDark
        ? 'bg-slate-800 text-slate-300'
        : 'bg-slate-100 text-slate-600',
      activeStyle: 'border-sti-teal-400 ring-2 ring-sti-teal-400/20',
    },
    {
      id: 'aberto' as const,
      label: 'Abertos',
      value: counts.aberto,
      description: 'Aguardando atendimento',
      icon: CircleAlert,
      iconStyle: 'bg-amber-500/10 text-amber-500',
      activeStyle: 'border-amber-400 ring-2 ring-amber-400/20',
    },
    {
      id: 'em_andamento' as const,
      label: 'Em andamento',
      value: counts.andamento,
      description: 'Em atendimento pela TI',
      icon: Clock,
      iconStyle: 'bg-blue-500/10 text-blue-500',
      activeStyle: 'border-blue-400 ring-2 ring-blue-400/20',
    },
    {
      id: 'resolvido' as const,
      label: 'Resolvidos',
      value: counts.resolvido,
      description: 'Solicitações solucionadas',
      icon: CheckCircle2,
      iconStyle: 'bg-emerald-500/10 text-emerald-500',
      activeStyle: 'border-emerald-400 ring-2 ring-emerald-400/20',
    },
  ];

  const clearFilters = () => {
    setFilter('todos');
    setSearch('');
  };

  return (
    <div className="space-y-7">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sti-teal-500" />
            <p className={`text-xs font-semibold uppercase tracking-wider ${colors.muted}`}>
              Central de atendimento
            </p>
          </div>

          <h1 className={`text-2xl font-bold tracking-tight ${colors.heading}`}>
            Meus chamados
          </h1>

          <p className={`mt-2 text-sm ${colors.muted}`}>
            Acompanhe o andamento e consulte suas solicitações de suporte.
          </p>
        </div>

        <Button onClick={() => onNavigate('abrir-chamado')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Abrir chamado
        </Button>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const active = filter === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setFilter(card.id)}
              aria-pressed={active}
              className={`group rounded-2xl border p-5 text-left shadow-sti transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sti-md ${active ? card.activeStyle : colors.card
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium ${colors.muted}`}>
                    {card.label}
                  </p>

                  <p className={`mt-3 text-3xl font-bold tabular-nums ${colors.heading}`}>
                    {card.value}
                  </p>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className={`mt-3 text-xs ${colors.muted}`}>
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs font-semibold ${active ? 'text-sti-teal-500' : colors.muted}`}>
                  {active ? 'Filtro selecionado' : 'Ver chamados'}
                </span>

                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${colors.muted}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Pesquisa e filtros */}
      <div className={`rounded-2xl border p-4 shadow-sti sm:p-5 ${colors.card}`}>
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className={`text-sm font-semibold ${colors.heading}`}>
              Consultar solicitações
            </h2>
            <p className={`mt-1 text-xs ${colors.muted}`}>
              Pesquise por protocolo, título ou categoria.
            </p>
          </div>

          <span className={`text-xs ${colors.muted}`}>
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <div className="relative">
          <Search className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${colors.muted}`} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Digite o protocolo, título ou categoria..."
            aria-label="Buscar chamados por protocolo, título ou categoria"
            className={`w-full rounded-xl border py-3 pl-11 pr-11 text-sm transition-all focus:border-sti-teal-400 focus:outline-none focus:ring-2 focus:ring-sti-teal-400/20 ${colors.input}`}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Limpar pesquisa"
              className={`absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg transition-colors ${isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = filter === item.id;
            const count =
              item.id === 'todos'
                ? counts.total
                : counts[item.id === 'em_andamento' ? 'andamento' : item.id];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${active
                  ? 'border-sti-navy-800 bg-sti-navy-800 text-white shadow-sm'
                  : colors.inactiveFilter
                  }`}
              >
                {item.label}

                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20 text-white' : colors.count
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de chamados */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className={`text-base font-semibold ${colors.heading}`}>
              Suas solicitações
            </h2>
            <p className={`mt-1 text-xs ${colors.muted}`}>
              Consulte os detalhes e acompanhe cada atendimento.
            </p>
          </div>

          {filter !== 'todos' || search ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-sti-teal-500 transition-colors hover:text-sti-teal-600"
            >
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className={`flex flex-col items-center justify-center rounded-2xl border px-5 py-16 text-center shadow-sti ${colors.card}`}>
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Inbox className={`h-8 w-8 ${colors.iconText}`} />
            </div>

            <h3 className={`text-base font-semibold ${colors.heading}`}>
              Nenhum chamado encontrado
            </h3>

            <p className={`mt-2 max-w-sm text-sm ${colors.muted}`}>
              {search
                ? 'Não encontramos solicitações com os termos pesquisados. Tente outra busca.'
                : filter !== 'todos'
                  ? 'Você não possui chamados nesta categoria no momento.'
                  : 'Você ainda não possui chamados registrados. Que tal abrir sua primeira solicitação?'}
            </p>

            {search || filter !== 'todos' ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 text-sm font-semibold text-sti-teal-500 hover:text-sti-teal-600"
              >
                Limpar pesquisa e filtros
              </button>
            ) : (
              <div className="mt-5">
                <Button onClick={() => onNavigate('abrir-chamado')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Abrir primeiro chamado
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className={`overflow-hidden rounded-2xl border shadow-sti ${colors.card}`}>
            {filtered.map((ticket, index) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onOpenTicket(ticket.id)}
                className={`group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors sm:gap-4 sm:px-5 ${colors.hover} ${index > 0 ? `border-t ${colors.divider}` : ''
                  }`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${isDark
                  ? 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-sti-teal-50 group-hover:text-sti-teal-600'
                  }`}>
                  <MessagesSquare className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${colors.heading}`}>
                    {ticket.title}
                  </p>

                  <p className={`mt-1 truncate text-xs ${colors.muted}`}>
                    <span className="font-medium">{ticket.protocol}</span>
                    <span className="mx-1.5">·</span>
                    {ticket.category}
                  </p>

                  <p className={`mt-1 text-[11px] ${colors.muted}`}>
                    Atualizado {formatRelative(ticket.updatedAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={ticket.status} />

                  <ArrowRight className={`hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:block ${colors.muted}`} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}