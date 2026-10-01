import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelative } from '@/data';
import { PlusCircle, ClipboardList, ArrowRight, MessagesSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Page } from '@/components/Sidebar';

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

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-400">
          Olá, {userName || 'Usuário'}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-sti-navy-800">Como podemos ajudar?</h1>
      </div>

      {/* Two main actions */}
      <div className="mb-12 grid gap-5 sm:grid-cols-2">
        <button
          onClick={() => onNavigate('abrir-chamado')}
          className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sti transition-all hover:border-sti-teal-300 hover:shadow-sti-md"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sti-teal-50 text-sti-teal-600 transition-colors group-hover:bg-sti-teal-500 group-hover:text-white">
            <PlusCircle className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-sti-navy-800">Abrir um chamado</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Conte o que está acontecendo e a TI vai ajudar você.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-sti-teal-500" />
        </button>

        <button
          onClick={() => onNavigate('meus-chamados')}
          className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sti transition-all hover:border-sti-navy-300 hover:shadow-sti-md"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sti-navy-50 text-sti-navy-600 transition-colors group-hover:bg-sti-navy-800 group-hover:text-white">
            <ClipboardList className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-sti-navy-800">Meus chamados</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Veja como estão seus pedidos de ajuda.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-sti-navy-500" />
        </button>
      </div>

      {/* Recent tickets — simple list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-sti-navy-800">Chamados recentes</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('meus-chamados')}>
            Ver todos
          </Button>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-12 text-center">
            <p className="text-sm text-slate-400">Você ainda não abriu nenhum chamado.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sti">
            {recent.map((t, i) => (
              <button
                key={t.id}
                onClick={() => onOpenTicket(t.id)}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${i > 0 ? 'border-t border-slate-100' : ''
                  }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <MessagesSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-sti-navy-800">{t.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {t.protocol} · atualizado {formatRelative(t.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={t.status} />
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
