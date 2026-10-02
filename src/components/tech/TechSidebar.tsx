import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  LogOut,
  ShieldCheck,
  MessageSquareHeart,
} from 'lucide-react';
import { Ticket, User as UserType, UserRole } from '@/types';
import { mockTechnicians } from '@/data';
import Logo from '../Logo';

export type TechPage =
  | 'tech-inicio'
  | 'tech-chamados'
  | 'tech-atendimentos'
  | 'tech-perfil';

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
  return (

    <main className="ml-64 flex-1 overflow-y-auto bg-[#070e17] p-6 lg:p-8 min-h-screen text-slate-100">
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
  const unassignedCount = tickets.filter(
    (ticket) =>
      !ticket.assignee &&
      ticket.status !== 'fechado' &&
      ticket.status !== 'resolvido'
  ).length;

  const myActiveCount = tickets.filter(
    (ticket) =>
      ticket.assignee === userName &&
      ticket.status !== 'fechado' &&
      ticket.status !== 'resolvido'
  ).length;

  const isHybridGestor =
    userName === 'Wanderson Silveira' ||
    activeUser?.roles?.includes('gestor') ||
    (activeUser as any)?.userRole === 'gestor';

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/5 bg-[#0b1624] text-slate-200">
      {/* Logo centralizado */}

      <div className="flex h-16 shrink-0 items-center border-b border-white/5 px-6">
        <Logo
          variant="dashboard"
          light={true}
        />
      </div>

      {/* Acesso ao perfil de gestor */}
      {isHybridGestor && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() =>
              onSwitchRole
                ? onSwitchRole('gestor')
                : window.location.reload()
            }
            className="group flex w-full items-center justify-between rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs transition-all hover:border-amber-400 hover:bg-amber-500/20"
          >
            <div className="flex min-w-0 items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
              <div className="text-left">
                <span className="block text-[10px] leading-tight text-amber-200/70">
                  Acesso Executivo
                </span>
                <span className="text-xs font-semibold text-amber-300">
                  Entrar como Gestor
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400">
              &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Navegação */}
      <nav className="mt-3 flex flex-col gap-1.5 px-3">
        <button
          type="button"
          onClick={() => onNavigate('tech-inicio')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'tech-inicio'
            ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Painel Técnico</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tech-chamados')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'tech-chamados'
            ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <Inbox className="h-4 w-4 shrink-0" />
            <span>Fila Geral</span>
          </div>

          {unassignedCount > 0 && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              {unassignedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tech-atendimentos')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'tech-atendimentos'
            ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Meus Atendimentos</span>
          </div>

          {myActiveCount > 0 && (
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              {myActiveCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tech-feedbacks' as any)}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${(current as string) === 'tech-feedbacks'
            ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquareHeart className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>Feedbacks &amp; Ideias</span>
          </div>
        </button>
      </nav>

      {/* Equipe de plantão */}
      <div className="mt-4 flex-1 overflow-y-auto px-4">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Equipe de Plantão
        </span>

        <div className="space-y-1.5">
          {mockTechnicians.map((tech) => {
            const isMe = tech.name === userName;

            const techTickets = tickets.filter(
              (ticket) =>
                ticket.assignee === tech.name &&
                ticket.status !== 'fechado' &&
                ticket.status !== 'resolvido'
            ).length;

            return (
              <div
                key={tech.email || tech.name}
                className={`flex items-center justify-between rounded-lg p-2 text-xs transition-colors ${isMe
                  ? 'border border-cyan-500/20 bg-cyan-500/10'
                  : 'bg-white/[0.02]'
                  }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full ${(tech as any).status === 'disponivel' ||
                      (tech as any).available !== false
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-600'
                      }`}
                  />

                  <span
                    className={`truncate ${isMe
                      ? 'font-semibold text-cyan-300'
                      : 'text-slate-300'
                      }`}
                  >
                    {tech.name} {isMe && '(Você)'}
                  </span>
                </div>

                <span className="shrink-0 font-mono text-[10px] text-slate-400">
                  {techTickets} ativ.
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Perfil e saída */}
      <div className="shrink-0 border-t border-white/5 bg-black/20 p-3">
        <button
          type="button"
          onClick={() => onNavigate('tech-perfil')}
          title="Clique para gerenciar seu perfil"
          className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${current === 'tech-perfil'
            ? 'bg-white/10 ring-1 ring-cyan-500/40'
            : 'hover:bg-white/5'
            }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 text-sm font-bold text-white shadow-sm">
            {userName.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {userName}
            </p>
            <p className="truncate text-[10px] text-cyan-300/80">
              Ver Perfil Técnico &rarr;
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}