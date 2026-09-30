import { TicketStatus } from '@/types';

const statusConfig: Record<TicketStatus, { label: string; classes: string; dot: string }> = {
  aberto: {
    label: 'Aberto',
    classes: 'bg-sti-teal-50 text-sti-teal-700 border-sti-teal-200',
    dot: 'bg-sti-teal-500',
  },
  em_andamento: {
    label: 'Em atendimento',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  aguardando: {
    label: 'Aguardando usuário',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  resolvido: {
    label: 'Resolvido',
    classes: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  fechado: {
    label: 'Fechado',
    classes: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function statusLabel(s: TicketStatus): string {
  return statusConfig[s].label;
}

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
