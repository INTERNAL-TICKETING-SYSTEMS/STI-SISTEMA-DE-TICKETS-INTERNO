import { Ticket } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateShort } from '@/data';
import { TechPage } from '@/components/tech/TechSidebar';
import { Inbox, AlertCircle, Clock, CheckCircle2, ArrowRight, Headphones } from 'lucide-react';
import Button from '@/components/ui/Button';

interface TechDashboardProps {
  tickets: Ticket[];
  onNavigate: (p: TechPage) => void;
  onOpenTicket: (id: string) => void;
  onAssume: (id: string) => void;
  techName: string;
}

interface Indicator {
  label: string;
  count: number;
  icon: typeof Inbox;
  classes: string;
  iconBg: string;
}

export default function TechDashboard({ tickets, onNavigate, onOpenTicket, onAssume, techName }: TechDashboardProps) {
  const open = tickets.filter((t) => t.status === 'aberto');
  const inProgress = tickets.filter((t) => t.status === 'em_andamento');
  const waiting = tickets.filter((t) => t.status === 'aguardando');
  const resolved = tickets.filter((t) => t.status === 'resolvido');

  const indicators: Indicator[] = [
    { label: 'Chamados abertos', count: open.length, icon: Inbox, classes: 'text-sti-teal-700', iconBg: 'bg-sti-teal-50 text-sti-teal-600' },
    { label: 'Em atendimento', count: inProgress.length, icon: Headphones, classes: 'text-blue-700', iconBg: 'bg-blue-50 text-blue-600' },
    { label: 'Aguardando usuário', count: waiting.length, icon: Clock, classes: 'text-amber-700', iconBg: 'bg-amber-50 text-amber-600' },
    { label: 'Resolvidos', count: resolved.length, icon: CheckCircle2, classes: 'text-green-700', iconBg: 'bg-green-50 text-green-600' },
  ];

  const attention = [...open, ...inProgress, ...waiting].slice(0, 6);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sti-navy-800">Olá, {techName.split(' ')[0]}!</h1>
        <p className="mt-1 text-sm text-slate-500">Veja os chamados que precisam de atenção.</p>
      </div>

      {/* Indicators */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          return (
            <div key={ind.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sti">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ind.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${ind.classes}`}>{ind.count}</p>
                  <p className="text-xs text-slate-400">{ind.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attention table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-sti-navy-800">
            <AlertCircle className="h-4 w-4 text-sti-teal-600" />
            Chamados que precisam de atenção
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('tech-chamados')}>
            Ver todos
          </Button>
        </div>

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
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {attention.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-medium text-sti-navy-800">{t.protocol}</td>
                  <td className="max-w-[200px] truncate px-4 py-3.5 text-slate-700">{t.title}</td>
                  <td className="px-4 py-3.5 text-slate-600">{t.requesterName}</td>
                  <td className="px-4 py-3.5 text-slate-600">{t.requesterDepartment}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 text-slate-500">{formatDateShort(t.createdAt)}</td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {t.assignee ?? <span className="text-slate-400 italic">Não atribuído</span>}
                  </td>
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
      </div>
    </div>
  );
}
