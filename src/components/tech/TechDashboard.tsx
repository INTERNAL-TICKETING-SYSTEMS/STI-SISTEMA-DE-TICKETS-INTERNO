import React from 'react';

import {
  Inbox,
  Headphones,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LucideIcon,
  Moon,
  Sun,
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
  /*
   * ============================================================
   * TEMA GLOBAL
   * ============================================================
   *
   * IMPORTANTE:
   * O Dashboard NÃO possui mais um estado próprio de tema.
   *
   * Ele utiliza exatamente o mesmo tema da Sidebar e do
   * TechPageContainer.
   */

  const {
    isDark,
    toggleTheme,
  } = useTechTheme();

  /*
   * ============================================================
   * FILTROS DOS CHAMADOS
   * ============================================================
   */

  const open = tickets.filter(
    (t) => t.status === 'aberto'
  );

  const inProgress = tickets.filter(
    (t) => t.status === 'em_andamento'
  );

  const waiting = tickets.filter(
    (t) => t.status === 'aguardando'
  );

  const resolved = tickets.filter(
    (t) => t.status === 'resolvido'
  );

  /*
   * ============================================================
   * INDICADORES
   * ============================================================
   */

  const indicators: Indicator[] = [
    {
      label: 'Chamados abertos',
      count: open.length,
      icon: Inbox,
      iconBg: isDark
        ? 'bg-teal-500/10'
        : 'bg-teal-50',
      iconColor: isDark
        ? 'text-teal-300'
        : 'text-teal-600',
      status: 'aberto',
    },

    {
      label: 'Em atendimento',
      count: inProgress.length,
      icon: Headphones,
      iconBg: isDark
        ? 'bg-blue-500/10'
        : 'bg-blue-50',
      iconColor: isDark
        ? 'text-blue-300'
        : 'text-blue-600',
      status: 'em_andamento',
    },

    {
      label: 'Aguardando usuário',
      count: waiting.length,
      icon: Clock,
      iconBg: isDark
        ? 'bg-amber-500/10'
        : 'bg-amber-50',
      iconColor: isDark
        ? 'text-amber-300'
        : 'text-amber-600',
      status: 'aguardando',
    },

    {
      label: 'Resolvidos',
      count: resolved.length,
      icon: CheckCircle2,
      iconBg: isDark
        ? 'bg-emerald-500/10'
        : 'bg-emerald-50',
      iconColor: isDark
        ? 'text-emerald-300'
        : 'text-emerald-600',
      status: 'resolvido',
    },
  ];

  /*
   * ============================================================
   * CHAMADOS QUE PRECISAM DE ATENÇÃO
   * ============================================================
   */

  const attention = [
    ...open,
    ...inProgress,
    ...waiting,
  ].slice(0, 6);

  /*
   * ============================================================
   * BADGES DE STATUS
   * ============================================================
   */

  const getStatusBadge = (
    status: TicketStatus
  ) => {
    switch (status) {
      case 'aberto':
        return (
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full',
              'border px-3 py-1 text-xs font-semibold',
              'transition-colors duration-300',
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
              'inline-flex items-center gap-2 rounded-full',
              'border px-3 py-1 text-xs font-semibold',
              'transition-colors duration-300',
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
              'inline-flex items-center gap-2 rounded-full',
              'border px-3 py-1 text-xs font-semibold',
              'transition-colors duration-300',
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
              'inline-flex items-center gap-2 rounded-full',
              'border px-3 py-1 text-xs font-semibold',
              'transition-colors duration-300',
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
              'inline-flex items-center gap-2 rounded-full',
              'border px-3 py-1 text-xs font-semibold',
              'transition-colors duration-300',
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

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      className={[
        'relative min-h-screen w-full overflow-x-hidden',
        'transition-colors duration-500',
        isDark
          ? 'bg-[#07111d] text-slate-100'
          : 'bg-slate-50 text-slate-900',
      ].join(' ')}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          space-y-7
          px-4
          py-5
          sm:px-6
          lg:px-8
        "
      >

        {/* =====================================================
            CABEÇALHO
        ====================================================== */}

        <div
          className={[
            'flex flex-col gap-5 rounded-2xl border p-5 shadow-sm',
            'transition-colors duration-500',
            'sm:flex-row sm:items-center sm:justify-between',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
          style={{
            animation:
              'stiFadeUp 0.45s ease-out both',
          }}
        >
          <div>
            <div className="flex items-center gap-3">

              <div
                className={[
                  'flex h-11 w-11 items-center justify-center rounded-xl',
                  'transition-colors duration-500',
                  isDark
                    ? 'bg-teal-500/10 text-teal-300'
                    : 'bg-teal-50 text-teal-600',
                ].join(' ')}
              >
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>

              <div>
                <h1
                  className={[
                    'text-2xl font-bold tracking-tight',
                    'transition-colors duration-500',
                    isDark
                      ? 'text-white'
                      : 'text-slate-900',
                  ].join(' ')}
                >
                  Olá, {techName?.trim() || 'Técnico'}!
                </h1>

                <p
                  className={[
                    'mt-1 text-sm',
                    'transition-colors duration-500',
                    isDark
                      ? 'text-slate-400'
                      : 'text-slate-600',
                  ].join(' ')}
                >
                  Veja os chamados que precisam da sua atenção
                  e clique nos cards para filtrar.
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              BOTÃO DE TEMA
          ================================================== */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark
                ? 'Ativar modo claro'
                : 'Ativar modo escuro'
            }
            title={
              isDark
                ? 'Ativar modo claro'
                : 'Ativar modo escuro'
            }
            className={[
              'group flex min-h-[46px] items-center justify-center',
              'gap-3 rounded-xl border px-4 py-2.5',
              'text-sm font-semibold',
              'transition-all duration-300',
              'hover:-translate-y-0.5 hover:shadow-md',
              'focus:outline-none focus:ring-2',
              'focus:ring-teal-500/50',
              isDark
                ? 'border-white/10 bg-white/5 text-slate-200 hover:border-teal-500/40 hover:bg-teal-500/10'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-8 w-8 items-center justify-center rounded-lg',
                'transition-all duration-500',
                isDark
                  ? 'bg-slate-800 text-amber-300 group-hover:bg-amber-400/10'
                  : 'bg-white text-indigo-600 shadow-sm group-hover:bg-indigo-50',
              ].join(' ')}
            >
              {isDark ? (
                <Sun
                  className="
                    h-4 w-4
                    transition-transform
                    duration-500
                    group-hover:rotate-45
                  "
                />
              ) : (
                <Moon
                  className="
                    h-4 w-4
                    transition-transform
                    duration-500
                    group-hover:-rotate-12
                  "
                />
              )}
            </span>

            <span>
              {isDark
                ? 'Modo claro'
                : 'Modo escuro'}
            </span>
          </button>
        </div>

        {/* =====================================================
            CARDS DE MÉTRICAS
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {indicators.map((ind, index) => {
            const Icon = ind.icon;

            return (
              <button
                key={ind.label}
                type="button"
                onClick={() =>
                  onFilterSelect?.(ind.status)
                }
                className={[
                  'group relative flex min-h-[112px]',
                  'items-center justify-between overflow-hidden',
                  'rounded-2xl border p-5 text-left shadow-sm',
                  'transition-all duration-300',
                  'hover:-translate-y-1 hover:shadow-lg',
                  'focus:outline-none focus:ring-2',
                  'focus:ring-teal-500/50',
                  isDark
                    ? 'border-white/10 bg-[#0b1624] hover:border-teal-500/40 hover:bg-[#102033]'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40',
                ].join(' ')}
                style={{
                  animation: `stiFadeUp 0.45s ease-out ${
                    index * 80
                  }ms both`,
                }}
              >
                <div
                  className={[
                    'pointer-events-none absolute -right-8 -top-8',
                    'h-24 w-24 rounded-full blur-2xl',
                    'transition-opacity duration-500',
                    isDark
                      ? 'bg-teal-500/10 opacity-0 group-hover:opacity-100'
                      : 'bg-teal-300/30 opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                />

                <div className="relative z-10 flex items-center gap-4">

                  <div
                    className={[
                      'flex h-12 w-12 shrink-0 items-center justify-center',
                      'rounded-xl transition-all duration-300',
                      'group-hover:scale-110 group-hover:rotate-2',
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
                        'transition-colors duration-300',
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
                        'transition-colors duration-300',
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
                    'relative z-10 h-5 w-5 shrink-0',
                    'translate-x-2 opacity-0',
                    'transition-all duration-300',
                    'group-hover:translate-x-0 group-hover:opacity-100',
                    isDark
                      ? 'text-teal-300'
                      : 'text-teal-600',
                  ].join(' ')}
                />
              </button>
            );
          })}
        </div>

        {/* =====================================================
            CHAMADOS QUE PRECISAM DE ATENÇÃO
        ====================================================== */}

        <section
          className={[
            'overflow-hidden rounded-2xl border shadow-sm',
            'transition-colors duration-500',
            isDark
              ? 'border-white/10 bg-[#0b1624]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
          style={{
            animation:
              'stiFadeUp 0.55s ease-out 280ms both',
          }}
        >

          {/* Cabeçalho */}

          <div
            className={[
              'flex flex-col gap-3 border-b p-5',
              'transition-colors duration-500',
              'sm:flex-row sm:items-center sm:justify-between',
              isDark
                ? 'border-white/10'
                : 'border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">

              <div
                className={[
                  'flex h-10 w-10 items-center justify-center',
                  'rounded-xl transition-colors duration-500',
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
                    'transition-colors duration-500',
                    isDark
                      ? 'text-white'
                      : 'text-slate-900',
                  ].join(' ')}
                >
                  Chamados que precisam de atenção
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Acompanhe os atendimentos pendentes da equipe.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                onNavigateToQueue?.()
              }
              className={[
                'inline-flex min-h-[42px] items-center',
                'justify-center gap-2 rounded-lg px-3',
                'text-sm font-semibold',
                'transition-all duration-200',
                'hover:translate-x-0.5',
                'focus:outline-none focus:ring-2',
                'focus:ring-teal-500/50',
                isDark
                  ? 'text-teal-300 hover:bg-teal-500/10 hover:text-teal-200'
                  : 'text-teal-600 hover:bg-teal-50 hover:text-teal-700',
              ].join(' ')}
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* =================================================
              TABELA
          ================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">

              <thead>
                <tr
                  className={[
                    'border-b text-xs font-bold uppercase',
                    'tracking-wider transition-colors duration-500',
                    isDark
                      ? 'border-white/10 bg-white/[0.02] text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-500',
                  ].join(' ')}
                >
                  <th className="px-5 py-4">
                    Protocolo
                  </th>

                  <th className="px-5 py-4">
                    Assunto
                  </th>

                  <th className="px-5 py-4">
                    Solicitante
                  </th>

                  <th className="px-5 py-4">
                    Setor
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Ação
                  </th>
                </tr>
              </thead>

              <tbody>
                {attention.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={[
                        'px-5 py-14 text-center',
                        'transition-colors duration-500',
                        isDark
                          ? 'text-slate-400'
                          : 'text-slate-500',
                      ].join(' ')}
                    >
                      <div className="flex flex-col items-center justify-center gap-3">

                        <div
                          className={[
                            'flex h-12 w-12 items-center justify-center',
                            'rounded-full',
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
                              isDark
                                ? 'text-slate-200'
                                : 'text-slate-700',
                            ].join(' ')}
                          >
                            Tudo em dia!
                          </p>

                          <p className="mt-1 text-sm">
                            Nenhum chamado pendente no momento.
                          </p>
                        </div>

                      </div>
                    </td>
                  </tr>
                ) : (
                  attention.map((t, index) => (
                    <tr
                      key={t.id}
                      onClick={() =>
                        onOpenTicket(t.id)
                      }
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' ||
                          e.key === ' '
                        ) {
                          e.preventDefault();
                          onOpenTicket(t.id);
                        }
                      }}
                      className={[
                        'group cursor-pointer border-b',
                        'transition-colors duration-200',
                        'last:border-b-0',
                        'focus:outline-none focus:ring-2',
                        'focus:ring-inset focus:ring-teal-500/50',
                        isDark
                          ? 'border-white/[0.06] hover:bg-teal-500/[0.04]'
                          : 'border-slate-100 hover:bg-teal-50/60',
                      ].join(' ')}
                      style={{
                        animation: `stiFadeIn ${
                          0.35
                        }s ease-out ${
                          350 + index * 60
                        }ms both`,
                      }}
                    >

                      {/* Protocolo */}

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'font-mono text-sm font-bold',
                            'transition-colors',
                            isDark
                              ? 'text-slate-200 group-hover:text-teal-300'
                              : 'text-slate-800 group-hover:text-teal-600',
                          ].join(' ')}
                        >
                          #{t.id}
                        </span>
                      </td>

                      {/* Assunto */}

                      <td className="max-w-[280px] px-5 py-4">
                        <span
                          className={[
                            'block truncate text-sm font-semibold',
                            'transition-colors',
                            isDark
                              ? 'text-slate-200 group-hover:text-white'
                              : 'text-slate-800 group-hover:text-slate-900',
                          ].join(' ')}
                        >
                          {t.title}
                        </span>
                      </td>

                      {/* Solicitante */}

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm transition-colors duration-500',
                            isDark
                              ? 'text-slate-300'
                              : 'text-slate-700',
                          ].join(' ')}
                        >
                          {t.requesterName}
                        </span>
                      </td>

                      {/* Setor */}

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'text-sm transition-colors duration-500',
                            isDark
                              ? 'text-slate-400'
                              : 'text-slate-600',
                          ].join(' ')}
                        >
                          {t.requesterDepartment}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        {getStatusBadge(t.status)}
                      </td>

                      {/* Ação */}

                      <td className="px-5 py-4 text-right">
                        <span
                          className={[
                            'inline-flex items-center gap-1.5',
                            'text-sm font-bold',
                            'transition-all duration-200',
                            'group-hover:translate-x-0.5',
                            isDark
                              ? 'text-teal-300'
                              : 'text-teal-600',
                          ].join(' ')}
                        >
                          Atender

                          <ArrowRight
                            className="
                              h-4 w-4
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                            "
                          />
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

      {/* =======================================================
          ANIMAÇÕES
      ======================================================== */}

      <style>{`
        @keyframes stiFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes stiFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}