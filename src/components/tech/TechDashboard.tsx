import React from 'react';
import {
  Inbox,
  Headphones,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { Ticket, TicketStatus } from '@/types';

interface Indicator {
  label: string;
  count: number;
  icon: LucideIcon;
  classes: string;
  iconBg: string;
  status: TicketStatus;
}

interface TechDashboardProps {
  tickets: Ticket[];
  onOpenTicket: (id: string) => void;
  onFilterSelect?: (status: TicketStatus) => void;
  onNavigateToQueue?: () => void;
  onNavigate?: (p: any) => void;
  onAssume?: (id: string) => void;
  techName?: string;
}

export default function TechDashboard({
  tickets,
  onOpenTicket,
  onFilterSelect,
  onNavigateToQueue,
  onNavigate,
  onAssume,
  techName
}: TechDashboardProps) {
  const open = tickets.filter((t) => t.status === 'aberto');
  const inProgress = tickets.filter((t) => t.status === 'em_andamento');
  const waiting = tickets.filter((t) => t.status === 'aguardando');
  const resolved = tickets.filter((t) => t.status === 'resolvido');


  const indicators: Indicator[] = [
    {
      label: 'Chamados abertos',
      count: open.length,
      icon: Inbox,
      classes: 'text-teal-400',
      iconBg: 'bg-teal-500/10 text-teal-400',
      status: 'aberto'
    },
    {
      label: 'Em atendimento',
      count: inProgress.length,
      icon: Headphones,
      classes: 'text-blue-400',
      iconBg: 'bg-blue-500/10 text-blue-400',
      status: 'em_andamento'
    },
    {
      label: 'Aguardando usuário',
      count: waiting.length,
      icon: Clock,
      classes: 'text-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-400',
      status: 'aguardando'
    },
    {
      label: 'Resolvidos',
      count: resolved.length,
      icon: CheckCircle2,
      classes: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      status: 'resolvido'
    },
  ];

  const attention = [...open, ...inProgress, ...waiting].slice(0, 6);


  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'aberto':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Aberto
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Em atendimento
          </span>
        );
      case 'aguardando':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Aguardando usuário
          </span>
        );
      case 'resolvido':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Resolvido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Olá, {techName?.trim() || 'Técnico'}!
        </h1>
        <p className="text-sm text-slate-400">
          Veja os chamados que precisam da sua atenção e clique nos cards para filtrar.
        </p>
      </div>

      {/* Grid de Métricas Clicáveis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          return (
            <div
              key={ind.label}
              onClick={() => onFilterSelect?.(ind.status)}
              role="button"
              tabIndex={0}
              className="group flex items-center justify-between rounded-2xl bg-[#0b1624] p-5 border border-white/10 shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:bg-[#102033] hover:border-cyan-500/40"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${ind.iconBg} transition-transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {ind.count}
                  </span>
                  <p className="text-xs font-medium text-slate-400">{ind.label}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-cyan-600 transition-all -translate-x-1 group-hover:translate-x-0" />
            </div>
          );
        })}
      </div>

      {/* Seção Chamados que Precisam de Atenção */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-teal-400" />
            <h2 className="text-base font-bold text-slate-100">Chamados que precisam de atenção</h2>
          </div>
          <button
            onClick={() => onNavigateToQueue?.()}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1"
          >
            Ver todos &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Protocolo</th>
                <th className="py-3 px-3">Assunto</th>
                <th className="py-3 px-3">Solicitante</th>
                <th className="py-3 px-3">Setor</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {attention.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nenhum chamado pendente no momento.
                  </td>
                </tr>
              ) : (
                attention.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onOpenTicket(t.id)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-100 group-hover:text-cyan-300">{t.id}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-200 max-w-[240px] truncate">{t.title}</td>
                    <td className="py-3.5 px-3 text-slate-300">{t.requesterName}</td>
                    <td className="py-3.5 px-3 text-slate-400">{t.requesterDepartment}</td>
                    <td className="py-3.5 px-3">{getStatusBadge(t.status)}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-semibold text-teal-400 group-hover:underline">Atender &rarr;</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
