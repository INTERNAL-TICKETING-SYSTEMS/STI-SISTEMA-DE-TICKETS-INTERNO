
import { Ticket } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateShort } from '@/data';
import Button from '@/components/ui/Button';
import { TechPage } from '@/components/tech/TechSidebar';
import { ArrowRight, Headphones, Inbox } from 'lucide-react';

interface TechMyAttendanceProps {
  tickets: Ticket[];
  onNavigate: (p: TechPage) => void;
  onOpenTicket: (id: string) => void;
  techName: string;
}

export default function TechMyAttendance({
  tickets,
  onNavigate,
  onOpenTicket,
  techName,
}: TechMyAttendanceProps) {
  const myTickets = tickets.filter((t) => t.assignee === techName);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">
          Meus atendimentos
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Acompanhe os chamados atribuídos a você.
        </p>
      </header>

      {myTickets.length === 0 ? (
        <section className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1624] px-6 py-12 text-center shadow-sm">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10">
            <Inbox className="h-8 w-8 text-teal-400" />
          </div>

          <h2 className="text-base font-semibold text-slate-100">
            Nenhum atendimento atribuído
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Você ainda não tem chamados sob sua responsabilidade.
            Acesse a fila geral para encontrar um chamado disponível.
          </p>

          <Button
            className="mt-6"
            onClick={() => onNavigate('tech-chamados')}
          >
            <Headphones className="h-4 w-4" />
            Ver chamados disponíveis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1624] shadow-sm">
          <div className="flex flex-col gap-1 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-slate-100">
              Chamados em atendimento
            </h2>
            <span className="text-sm text-slate-400">
              {myTickets.length}{' '}
              {myTickets.length === 1 ? 'chamado' : 'chamados'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-4">Protocolo</th>
                  <th className="px-4 py-4">Assunto</th>
                  <th className="px-4 py-4">Solicitante</th>
                  <th className="px-4 py-4">Setor</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Abertura</th>
                  <th className="px-4 py-4 text-right">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {myTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="transition-colors hover:bg-white/[0.04]"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-teal-300">
                      {t.protocol}
                    </td>

                    <td className="max-w-[240px] truncate px-4 py-4 font-medium text-slate-200">
                      {t.title}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-300">
                      {t.requesterName}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {t.requesterDepartment}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge status={t.status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-400">
                      {formatDateShort(t.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onOpenTicket(t.id)}
                      >
                        Atender
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}