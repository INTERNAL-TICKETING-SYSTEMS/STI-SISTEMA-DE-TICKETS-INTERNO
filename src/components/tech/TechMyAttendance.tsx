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

export default function TechMyAttendance({ tickets, onNavigate, onOpenTicket, techName }: TechMyAttendanceProps) {
  const myTickets = tickets.filter((t) => t.assignee === techName);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sti-navy-800">Meus atendimentos</h1>
        <p className="mt-1 text-sm text-slate-500">Chamados atribuídos a você.</p>
      </div>

      {myTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-600">Nenhum atendimento atribuído</p>
          <p className="mt-1 text-sm text-slate-400">Assuma um chamado para começar a atender.</p>
          <Button className="mt-5" onClick={() => onNavigate('tech-chamados')}>
            <Headphones className="h-4 w-4" />
            Ver chamados disponíveis
          </Button>
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
                <th className="px-4 py-3">Abertura</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {myTickets.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-medium text-sti-navy-800">{t.protocol}</td>
                  <td className="max-w-[240px] truncate px-4 py-3.5 text-slate-700">{t.title}</td>
                  <td className="px-4 py-3.5 text-slate-600">{t.requesterName}</td>
                  <td className="px-4 py-3.5 text-slate-600">{t.requesterDepartment}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 text-slate-500">{formatDateShort(t.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Button size="sm" variant="secondary" onClick={() => onOpenTicket(t.id)}>
                      Atender
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
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
