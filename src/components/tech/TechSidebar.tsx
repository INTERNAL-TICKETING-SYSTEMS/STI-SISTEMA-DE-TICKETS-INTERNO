
import React from 'react';
import { useTechTheme } from './techTheme';

import {
  LayoutDashboard,
  Inbox,
  Clock,
  LogOut,
  ShieldCheck,
  MessageSquareHeart,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react';

import {
  Ticket,
  User as UserType,
  UserRole,
} from '@/types';

import { mockTechnicians } from '@/data';
import Logo from '../Logo';

export type TechPage =
  | 'tech-inicio'
  | 'tech-chamados'
  | 'tech-atendimentos'
  | 'tech-perfil'
  | 'auditoria';

interface TechSidebarProps {
  current: TechPage;
  onNavigate: (p: TechPage) => void;
  onLogout: () => void;
  userName: string;
  tickets?: Ticket[];
  activeUser?: UserType;
  onSwitchRole?: (newRole: UserRole) => void;
}

export function TechPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTechTheme();

  return (
    <main
      className={[
        'ml-64 min-h-screen flex-1 overflow-y-auto p-6 lg:p-8',
        isDark
          ? 'bg-[#070e17] text-slate-100'
          : 'bg-slate-50 text-slate-900',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {children}
      </div>
    </main>
  );
}

export default function TechSidebar({
  current,
  onNavigate,
  onLogout,
  userName,
  tickets = [],
  activeUser,
  onSwitchRole,
}: TechSidebarProps) {
  const { isDark, toggleTheme } = useTechTheme();

  const unassignedCount = tickets.filter(
    (ticket) =>
      !ticket.assignee &&
      ticket.status !== 'fechado' &&
      ticket.status !== 'resolvido',
  ).length;

  const myActiveCount = tickets.filter(
    (ticket) =>
      ticket.assignee === userName &&
      ticket.status !== 'fechado' &&
      ticket.status !== 'resolvido',
  ).length;

  const isHybridGestor =
    userName === 'Wanderson Silveira' ||
    activeUser?.roles?.includes('gestor') ||
    (activeUser as any)?.userRole === 'gestor';

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const navButtonClass = (active: boolean) =>
    [
      'group relative flex min-h-[42px] items-center justify-between rounded-xl px-3.5 py-2.5',
      'text-xs font-medium transition-all duration-200 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50',
      active
        ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
        : isDark
          ? 'text-slate-400 hover:translate-x-0.5 hover:bg-white/[0.06] hover:text-white'
          : 'text-slate-600 hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

  const iconClass = (active: boolean) =>
    [
      'h-[17px] w-[17px] shrink-0 transition-transform duration-200',
      active
        ? 'text-white'
        : isDark
          ? 'text-slate-500 group-hover:text-teal-300'
          : 'text-slate-400 group-hover:text-teal-600',
    ].join(' ');

  return (
    <aside
      className={[
        'fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r',
        'transition-colors duration-300',
        isDark
          ? 'border-white/10 bg-[#0b1624] text-slate-200'
          : 'border-slate-200 bg-white text-slate-700',
      ].join(' ')}
    >
      {/* LOGO */}
      <div
        className={[
          'flex h-16 shrink-0 items-center border-b px-6',
          isDark ? 'border-white/10' : 'border-slate-200',
        ].join(' ')}
      >
        <Logo variant="dashboard" light={isDark} />
      </div>

      {/* ACESSO EXECUTIVO */}
      {isHybridGestor && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() =>
              onSwitchRole
                ? onSwitchRole('gestor')
                : window.location.reload()
            }
            className={[
              'group flex w-full items-center justify-between rounded-xl border p-2.5 text-xs',
              'transition-all duration-200 hover:-translate-y-0.5',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40',
              isDark
                ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400/50 hover:bg-amber-500/15'
                : 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100',
            ].join(' ')}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  isDark
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-amber-100 text-amber-600',
                ].join(' ')}
              >
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div className="text-left">
                <span
                  className={[
                    'block text-[10px] leading-tight',
                    isDark ? 'text-amber-200/70' : 'text-amber-700/70',
                  ].join(' ')}
                >
                  Acesso Executivo
                </span>

                <span
                  className={[
                    'text-xs font-semibold',
                    isDark ? 'text-amber-300' : 'text-amber-700',
                  ].join(' ')}
                >
                  Entrar como Gestor
                </span>
              </div>
            </div>

            <ChevronRight
              className={[
                'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
                isDark ? 'text-amber-400' : 'text-amber-600',
              ].join(' ')}
            />
          </button>
        </div>
      )}

      {/* NAVEGAÇÃO */}
      <nav className="mt-4 flex flex-col gap-1.5 px-3">
        <button
          type="button"
          onClick={() => onNavigate('tech-inicio')}
          aria-current={current === 'tech-inicio' ? 'page' : undefined}
          className={navButtonClass(current === 'tech-inicio')}
        >
          <span className="flex items-center gap-3">
            <LayoutDashboard className={iconClass(current === 'tech-inicio')} />
            Painel Técnico
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tech-chamados')}
          aria-current={current === 'tech-chamados' ? 'page' : undefined}
          className={navButtonClass(current === 'tech-chamados')}
        >
          <span className="flex items-center gap-3">
            <Inbox className={iconClass(current === 'tech-chamados')} />
            Fila Geral
          </span>

          {unassignedCount > 0 && (
            <span
              className={[
                'rounded-full border px-2 py-0.5 text-[10px] font-bold',
                'transition-transform duration-200 group-hover:scale-105',
                isDark
                  ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              ].join(' ')}
            >
              {unassignedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tech-atendimentos')}
          aria-current={current === 'tech-atendimentos' ? 'page' : undefined}
          className={navButtonClass(current === 'tech-atendimentos')}
        >
          <span className="flex items-center gap-3">
            <Clock className={iconClass(current === 'tech-atendimentos')} />
            Meus Atendimentos
          </span>

          {myActiveCount > 0 && (
            <span
              className={[
                'rounded-full border px-2 py-0.5 text-[10px] font-bold',
                'transition-transform duration-200 group-hover:scale-105',
                isDark
                  ? 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300'
                  : 'border-cyan-200 bg-cyan-50 text-cyan-700',
              ].join(' ')}
            >
              {myActiveCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tech-feedbacks' as any)}
          aria-current={
            (current as string) === 'tech-feedbacks' ? 'page' : undefined
          }
          className={navButtonClass(
            (current as string) === 'tech-feedbacks',
          )}
        >
          <span className="flex items-center gap-3">
            <MessageSquareHeart
              className={iconClass(
                (current as string) === 'tech-feedbacks',
              )}
            />
            Feedbacks &amp; Ideias
          </span>
        </button>
      </nav>

      {/* EQUIPE DE PLANTÃO */}
      <div className="mt-6 flex-1 overflow-y-auto px-3 pb-3">
        <div className="mb-3 flex items-center justify-between px-1">
          <span
            className={[
              'text-[10px] font-bold uppercase tracking-[0.12em]',
              isDark ? 'text-slate-500' : 'text-slate-400',
            ].join(' ')}
          >
            Equipe de plantão
          </span>

          <span
            className={[
              'rounded-full px-2 py-0.5 text-[9px] font-semibold',
              isDark
                ? 'bg-white/[0.05] text-slate-400'
                : 'bg-slate-100 text-slate-500',
            ].join(' ')}
          >
            {mockTechnicians.length} técnicos
          </span>
        </div>

        <div className="space-y-1.5">
          {mockTechnicians.map((tech) => {
            const isMe = tech.name === userName;

            const techTickets = tickets.filter(
              (ticket) =>
                ticket.assignee === tech.name &&
                ticket.status !== 'fechado' &&
                ticket.status !== 'resolvido',
            ).length;

            const available =
              (tech as any).status === 'disponivel' ||
              (tech as any).available !== false;

            return (
              <div
                key={tech.email || tech.name}
                title={`${tech.name} — ${
                  available ? 'Disponível' : 'Indisponível'
                }`}
                className={[
                  'group flex items-center justify-between gap-2 rounded-xl border p-2',
                  'transition-all duration-200 ease-out',
                  isMe
                    ? isDark
                      ? 'border-cyan-500/25 bg-cyan-500/[0.08] shadow-sm shadow-cyan-950/20'
                      : 'border-cyan-200 bg-cyan-50/80 shadow-sm shadow-cyan-100/50'
                    : isDark
                      ? 'border-transparent bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.05]'
                      : 'border-transparent bg-slate-50 hover:border-slate-200 hover:bg-slate-100',
                ].join(' ')}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {/* AVATAR */}
                  <div className="relative shrink-0">
                    <div
                      className={[
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        'text-[10px] font-bold transition-transform duration-200 group-hover:scale-105',
                        isMe
                          ? 'bg-gradient-to-br from-[#00A896] to-cyan-500 text-white shadow-sm shadow-teal-500/20'
                          : isDark
                            ? 'bg-slate-700/80 text-slate-200'
                            : 'bg-slate-200 text-slate-600',
                      ].join(' ')}
                    >
                      {getInitials(tech.name)}
                    </div>

                    {/* DISPONIBILIDADE */}
                    <span
                      className={[
                        'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2',
                        isDark ? 'border-[#0b1624]' : 'border-white',
                        available ? 'bg-emerald-400' : 'bg-slate-400',
                      ].join(' ')}
                    />
                  </div>

                  {/* NOME */}
                  <div className="min-w-0">
                    <span
                      className={[
                        'block truncate text-[11px]',
                        isMe
                          ? isDark
                            ? 'font-semibold text-cyan-300'
                            : 'font-semibold text-cyan-800'
                          : isDark
                            ? 'text-slate-300'
                            : 'text-slate-600',
                      ].join(' ')}
                    >
                      {tech.name}
                    </span>

                    <span
                      className={[
                        'mt-0.5 block text-[9px]',
                        available
                          ? isDark
                            ? 'text-emerald-400/80'
                            : 'text-emerald-600'
                          : isDark
                            ? 'text-slate-500'
                            : 'text-slate-400',
                      ].join(' ')}
                    >
                      {isMe
                        ? 'Você • '
                        : ''}
                      {available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>

                {/* CHAMADOS ATIVOS */}
                <span
                  className={[
                    'shrink-0 rounded-md px-1.5 py-1 text-[9px] font-semibold tabular-nums',
                    isDark
                      ? 'bg-white/[0.05] text-slate-400'
                      : 'bg-white text-slate-500',
                  ].join(' ')}
                >
                  {techTickets} ativ.
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RODAPÉ */}
      <div
        className={[
          'shrink-0 space-y-1.5 border-t p-3',
          isDark
            ? 'border-white/10 bg-[#08121f]'
            : 'border-slate-200 bg-white',
        ].join(' ')}
      >
        {/* BOTÃO DE TEMA */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          className={[
            'flex min-h-[44px] w-full items-center justify-between gap-3',
            'rounded-xl border px-3.5 py-2.5 text-xs font-medium',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40',
            isDark
              ? 'border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/10'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
          ].join(' ')}
        >
          <span className="flex items-center gap-2.5">
            {isDark ? (
              <Moon className="h-4 w-4 text-cyan-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}

            {isDark ? 'Modo escuro' : 'Modo claro'}
          </span>

          <span
            className={[
              'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300',
              isDark ? 'bg-[#00A896]' : 'bg-slate-300',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm',
                'transition-all duration-300 ease-out',
                isDark ? 'left-[18px]' : 'left-0.5',
              ].join(' ')}
            />
          </span>
        </button>

        {/* PERFIL */}
        <button
          type="button"
          onClick={() => onNavigate('tech-perfil')}
          title="Clique para gerenciar seu perfil"
          aria-current={current === 'tech-perfil' ? 'page' : undefined}
          className={[
            'group flex w-full items-center gap-3 rounded-xl p-2 text-left',
            'transition-all duration-200',
            current === 'tech-perfil'
              ? isDark
                ? 'bg-white/[0.08] ring-1 ring-cyan-500/40'
                : 'bg-cyan-50 ring-1 ring-cyan-500/30'
              : isDark
                ? 'hover:bg-white/[0.05]'
                : 'hover:bg-slate-50',
          ].join(' ')}
        >
          <div
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
              'bg-gradient-to-tr from-[#00A896] to-cyan-500',
              'text-sm font-bold text-white shadow-sm',
              'transition-transform duration-200 group-hover:scale-105',
            ].join(' ')}
          >
            {getInitials(userName)}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={[
                'truncate text-xs font-semibold',
                isDark ? 'text-white' : 'text-slate-800',
              ].join(' ')}
            >
              {userName}
            </p>

            <p
              className={[
                'truncate text-[10px]',
                isDark ? 'text-cyan-300/80' : 'text-cyan-700',
              ].join(' ')}
            >
              Ver Perfil Técnico
            </p>
          </div>

          <ChevronRight
            className={[
              'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
              isDark ? 'text-slate-500' : 'text-slate-400',
            ].join(' ')}
          />
        </button>

        {/* SAIR */}
        <button
          type="button"
          onClick={onLogout}
          className={[
            'flex min-h-[36px] w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5',
            'text-xs font-medium transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40',
            isDark
              ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
              : 'text-slate-500 hover:bg-red-50 hover:text-red-500',
          ].join(' ')}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}
