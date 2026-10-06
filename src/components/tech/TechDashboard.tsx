import React from 'react';

import {
  Inbox,
  Headphones,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LucideIcon,
  Sparkles,
} from 'lucide-react';

import { Ticket, TicketStatus } from '@/types';
import { useTechTheme } from '@/components/tech/TechSidebar';

interface Indicator {
  label: string;
  count: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
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
  techName,
}: TechDashboardProps) {
  const { isDark } = useTechTheme();

  const open = tickets.filter((t) => t.status === 'aberto');
  const inProgress = tickets.filter((t) => t.status === 'em_andamento');
  const waiting = tickets.filter((t) => t.status === 'aguardando');
  const resolved = tickets.filter((t) => t.status === 'resolvido');

  const indicators: Indicator[] = [
    {
      label: 'Chamados abertos',
      count: open.length,
      icon: Inbox,
      iconBg: isDark ? 'bg-teal-500/10' : 'bg-teal-50',
      iconColor: isDark ? 'text-teal-300' : 'text-teal-600',
      status: 'aberto',
    },
    {
      label: 'Em atendimento',
      count: inProgress.length,
      icon: Headphones,
      iconBg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      iconColor: isDark ? 'text-blue-300' : 'text-blue-600',
      status: 'em_andamento',
    },
    {
      label: 'Aguardando usuário',
      count: waiting.length,
      icon: Clock,
      iconBg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      iconColor: isDark ? 'text-amber-300' : 'text-amber-600',
      status: 'aguardando',
    },
    {
      label: 'Resolvidos',
      count: resolved.length,
      icon: CheckCircle2,
      iconBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      iconColor: isDark ? 'text-emerald-300' : 'text-emerald-600',
      status: 'resolvido',
    },
  ];

  const attention = [...open, ...inProgress, ...waiting].slice(0, 6);

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'aberto':
        return (
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              isDark
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Aberto
          </span>
        );

      case 'em_andamento':
        return (
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              isDark
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                : 'border-blue-200 bg-blue-50 text-blue-700',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Em atendimento
          </span>
        );

      case 'aguardando':
        return (
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              isDark
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-amber-200 bg-amber-50 text-amber-700',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Aguardando usuário
          </span>
        );

      case 'resolvido':
        return (
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              isDark
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Resolvido
          </span>
        );

      default:
        return (
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              isDark
                ? 'border-white/10 bg-white/5 text-slate-300'
                : 'border-slate-200 bg-slate-50 text-slate-600',
            ].join(' ')}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div
      className={[
        'relative min-h-screen w-full overflow-x-hidden',
        isDark
          ? 'bg-[#07111d] text-slate-100'
          : 'bg-slate-50 text-slate-900',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1400px] space-y-7 px-4 py-5 sm:px-6 lg:px-8">
        {/* CABEÇALHO */}
        <div
          className={[
            'flex flex-col items-start gap-5 rounded-2xl border p-5 shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <div
              className={[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                isDark
                  ? 'bg-teal-500/10 text-teal-300'
                  : 'bg-teal-50 text-teal-600',
              ].join(' ')}
            >
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h1
                className={[
                  'text-2xl font-bold tracking-tight',
                  isDark ? 'text-white' : 'text-slate-900',
                ].join(' ')}
              >
                Olá, {techName?.trim() || 'Técnico'}!
              </h1>

              <p
                className={[
                  'mt-1 text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600',
                ].join(' ')}
              >
                Veja os chamados que precisam da sua atenção e clique nos
                cards para filtrar.
              </p>
            </div>
          </div>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map((ind) => {
            const Icon = ind.icon;

            return (
              <button
                key={ind.label}
                type="button"
                onClick={() => onFilterSelect?.(ind.status)}
                className={[
                  'group relative flex min-h-[112px] items-center justify-between overflow-hidden rounded-2xl border p-5 text-left shadow-sm',
                  'hover:shadow-lg',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500/50',
                  isDark
                    ? 'border-white/10 bg-[#0b1624] hover:border-teal-500/40 hover:bg-[#102033]'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40',
                ].join(' ')}
              >
                <div
                  className={[
                    'pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl',
                    'opacity-0 group-hover:opacity-100',
                    isDark ? 'bg-teal-500/10' : 'bg-teal-300/30',
                  ].join(' ')}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={[
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                      ind.iconBg,
                      ind.iconColor,
                    ].join(' ')}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <span
                      className={[
                        'block text-3xl font-bold leading-none',
                        isDark
                          ? 'text-white group-hover:text-teal-300'
                          : 'text-slate-900 group-hover:text-teal-600',
                      ].join(' ')}
                    >
                      {ind.count}
                    </span>

                    <p
                      className={[
                        'mt-2 text-sm font-medium',
                        isDark
                          ? 'text-slate-400 group-hover:text-slate-300'
                          : 'text-slate-600 group-hover:text-slate-700',
                      ].join(' ')}
                    >
                      {ind.label}
                    </p>
                  </div>
                </div>

                <ArrowRight
                  className={[
                    'relative z-10 h-5 w-5 shrink-0 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                    isDark ? 'text-teal-300' : 'text-teal-600',
                  ].join(' ')}
                />
              </button>
            );
          })}
        </div>

        {/* CHAMADOS QUE PRECISAM DE ATENÇÃO */}
        <section
          className={[
            'overflow-hidden rounded-2xl border shadow-sm',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          {/* CABEÇALHO DA TABELA */}
          <div
            className={[
              'flex flex-col items-start gap-3 border-b p-5',
              isDark ? 'border-white/10' : 'border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  isDark
                    ? 'bg-teal-500/10 text-teal-300'
                    : 'bg-teal-50 text-teal-600',
                ].join(' ')}
              >
                <AlertCircle className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className={[
                    'text-base font-bold',
                    isDark ? 'text-white' : 'text-slate-900',
                  ].join(' ')}
                >
                  Chamados que precisam de atenção
                </h2>

                <p
                  className={[
                    'mt-0.5 text-xs',
                    isDark ? 'text-slate-500' : 'text-slate-500',
                  ].join(' ')}
                >
                  Acompanhe os atendimentos pendentes da equipe.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToQueue?.()}
              className={[
                'inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold',
                'hover:translate-x-0.5',
                'focus:outline-none focus:ring-2 focus:ring-teal-500/50',
                isDark
                  ? 'text-teal-300 hover:bg-teal-500/10 hover:text-teal-200'
                  : 'text-teal-600 hover:bg-teal-50 hover:text-teal-700',
              ].join(' ')}
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr
                  className={[
                    'border-b text-xs font-bold uppercase tracking-wider',
                    isDark
                      ? 'border-white/10 bg-white/[0.02] text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-500',
                  ].join(' ')}
                >
                  <th className="px-5 py-4">Protocolo</th>
                  <th className="px-5 py-4">Assunto</th>
                  <th className="px-5 py-4">Solicitante</th>
                  <th className="px-5 py-4">Setor</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Ação</th>
                </tr>
              </thead>

              <tbody>
                {attention.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={[
                        'px-5 py-14 text-center',
                        isDark ? 'text-slate-400' : 'text-slate-500',
                      ].join(' ')}
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div
                          className={[
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            isDark
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-emerald-50 text-emerald-600',
                          ].join(' ')}
                        >
                          <CheckCircle2 className="h-6 w-6" />
                        </div>

                        <div>
                          <p
                            className={[
                              'font-semibold',
                              isDark ? 'text-slate-200' : 'text-slate-700',
                            ].join(' ')}
                          >
                            Tudo em dia!
                          </p>

                          <p
                            className={[
                              'mt-1 text-sm',
                              isDark ? 'text-slate-500' : 'text-slate-500',
                            ].join(' ')}
                          >
                            Nenhum chamado pendente no momento.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attention.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => onOpenTicket(t.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onOpenTicket(t.id);
                        }
                      }}
                      className={[
                        'group cursor-pointer border-b last:border-b-0',
                        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50',
                        isDark
                          ? 'border-white/[0.06] hover:bg-teal-500/[0.04]'
                          : 'border-slate-100 hover:bg-teal-50/60',
                      ].join(' ')}
                    >
                      <td className="px-5 py-4">
                        <span
                          className={[
                            'font-mono text-sm font-bold',
                            isDark
                              ? 'text-slate-200 group-hover:text-teal-300'
                              : 'text-slate-800 group-hover:text-teal-600',
                          ].join(' ')}
                        >
                          #{t.id}
                        </span>
                      </td>

                      <td className="max-w-[280px] px-5 py-4">
                        <span
                          className={[
                            'block truncate text-sm font-semibold',
                            isDark
                              ? 'text-slate-200 group-hover:text-white'
                              : 'text-slate-800 group-hover:text-slate-900',
                          ].join(' ')}
                        >
                          {t.title}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm',
                            isDark ? 'text-slate-300' : 'text-slate-700',
                          ].join(' ')}
                        >
                          {t.requesterName}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-600',
                          ].join(' ')}
                        >
                          {t.requesterDepartment}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {getStatusBadge(t.status)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span
                          className={[
                            'inline-flex items-center gap-1.5 text-sm font-bold group-hover:translate-x-0.5',
                            isDark ? 'text-teal-300' : 'text-teal-600',
                          ].join(' ')}
                        >
                          Atender
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}