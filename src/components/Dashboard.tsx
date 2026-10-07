import { Ticket } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelative } from '@/data';
import { PlusCircle, ClipboardList, ArrowRight, MessagesSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Page } from '@/components/Sidebar';
import { useTechTheme } from '@/components/tech/techTheme';

interface DashboardProps {
  tickets: Ticket[];
  onNavigate: (p: Page) => void;
  onOpenTicket: (id: string) => void;
  userName: string;
}

export default function Dashboard({
  tickets,
  onNavigate,
  onOpenTicket,
  userName,
}: DashboardProps) {
  const recent = tickets.slice(0, 4);
  const { isDark } = useTechTheme();

  const colors = {
    heading: isDark ? 'text-slate-100' : 'text-sti-navy-800',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    card: isDark
      ? 'border-slate-700 bg-slate-900'
      : 'border-slate-200 bg-white',
    divider: isDark ? 'border-slate-800' : 'border-slate-100',
    hover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
    iconBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
    iconText: isDark ? 'text-slate-300' : 'text-slate-400',
    arrow: isDark ? 'text-slate-500' : 'text-slate-300',
  };

  return (
    <div>
      {/* Saudação */}
      <div className="mb-8">
        <p className={`text-sm font-medium ${colors.muted}`}>
          Olá, {userName || 'Usuário'}
        </p>

        <h1 className={`mt-1 text-2xl font-bold ${colors.heading}`}>
          Como podemos ajudar?
        </h1>
      </div>

      {/* Ações principais */}
      <div className="mb-12 grid gap-5 sm:grid-cols-2">
        <button
          onClick={() => onNavigate('abrir-chamado')}
          className={`group flex items-center gap-5 rounded-2xl border p-6 text-left shadow-sti transition-all hover:border-sti-teal-400 hover:shadow-sti-md ${colors.card}`}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sti-teal-50 text-sti-teal-600 transition-colors group-hover:bg-sti-teal-500 group-hover:text-white">
            <PlusCircle className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <h2 className={`text-lg font-semibold ${colors.heading}`}>
              Abrir um chamado
            </h2>

            <p className={`mt-0.5 text-sm ${colors.muted}`}>
              Conte o que está acontecendo e a TI vai ajudar você.
            </p>
          </div>

          <ArrowRight
            className={`h-5 w-5 transition-all group-hover:translate-x-1 group-hover:text-sti-teal-400 ${colors.arrow}`}
          />
        </button>

        <button
          onClick={() => onNavigate('meus-chamados')}
          className={`group flex items-center gap-5 rounded-2xl border p-6 text-left shadow-sti transition-all hover:border-sti-navy-400 hover:shadow-sti-md ${colors.card}`}
        >
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-sti-navy-800 group-hover:text-white ${
              isDark
                ? 'bg-slate-800 text-slate-200'
                : 'bg-sti-navy-50 text-sti-navy-600'
            }`}
          >
            <ClipboardList className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <h2 className={`text-lg font-semibold ${colors.heading}`}>
              Meus chamados
            </h2>

            <p className={`mt-0.5 text-sm ${colors.muted}`}>
              Veja como estão seus pedidos de ajuda.
            </p>
          </div>

          <ArrowRight
            className={`h-5 w-5 transition-all group-hover:translate-x-1 group-hover:text-sti-navy-400 ${colors.arrow}`}
          />
        </button>
      </div>

      {/* Chamados recentes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-base font-semibold ${colors.heading}`}>
            Chamados recentes
          </h3>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('meus-chamados')}
          >
            Ver todos
          </Button>
        </div>

        {recent.length === 0 ? (
          <div
            className={`rounded-xl border py-12 text-center ${colors.card}`}
          >
            <p className={`text-sm ${colors.muted}`}>
              Você ainda não abriu nenhum chamado.
            </p>
          </div>
        ) : (
          <div
            className={`overflow-hidden rounded-xl border shadow-sti ${colors.card}`}
          >
            {recent.map((ticket, index) => (
              <button
                key={ticket.id}
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
                  <p
                    className={`truncate text-sm font-medium ${colors.heading}`}
                  >
                    {ticket.title}
                  </p>

                  <p className={`mt-0.5 text-xs ${colors.muted}`}>
                    {ticket.protocol} · atualizado{' '}
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
    </div>
  );
}