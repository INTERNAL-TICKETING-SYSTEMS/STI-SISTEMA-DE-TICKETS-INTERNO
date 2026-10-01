import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Clock, 
  LogOut, 
  Wrench,
  ShieldCheck
, MessageSquareHeart } from 'lucide-react';
import { Ticket, User as UserType, UserRole } from '@/types';
import { mockTechnicians } from '@/data';

export type TechPage = 'tech-inicio' | 'tech-chamados' | 'tech-atendimentos' | 'tech-perfil';

interface TechSidebarProps {
  current: TechPage;
  onNavigate: (p: TechPage) => void;
  onLogout: () => void;
  userName: string;
  tickets?: Ticket[];
  activeUser?: UserType;
  onSwitchRole?: (newRole: UserRole) => void;
}

export function TechPageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="ml-64 flex-1 overflow-y-auto bg-slate-100 p-6 lg:p-8 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
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
  onSwitchRole
}: TechSidebarProps) {
  const unassignedCount = tickets.filter((t) => !t.assignee && t.status !== 'fechado' && t.status !== 'resolvido').length;
  const myActiveCount = tickets.filter((t) => t.assignee === userName && t.status !== 'fechado' && t.status !== 'resolvido').length;

  // Reconhece papel gestor pelo objeto ou se for a conta do Wanderson Silveira
  const isHybridGestor = userName === 'Wanderson Silveira' || 
    activeUser?.roles?.includes('gestor') || 
    (activeUser as any)?.userRole === 'gestor';

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#0b1624] border-r border-white/5 text-slate-200">
      {/* Topo / Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 shadow-md shadow-teal-500/20 text-white">
          <Wrench className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-white tracking-wide text-sm block">STI OPERACIONAL</span>
          <span className="text-[10px] text-cyan-400 font-medium block">Console do Técnico</span>
        </div>
      </div>

      {/* Switcher para Gestor (Exclusivo para Wanderson / Gestores) */}
      {isHybridGestor && (
        <div className="px-3 pt-3">
          <button
            onClick={() => onSwitchRole ? onSwitchRole('gestor') : window.location.reload()}
            className="group flex w-full items-center justify-between rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs transition-all hover:border-amber-400 hover:bg-amber-500/20"
          >
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] text-amber-200/70 leading-tight">Acesso Executivo</span>
                <span className="font-semibold text-amber-300 text-xs">
                  Entrar como Gestor
                </span>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-bold">&rarr;</span>
          </button>
        </div>
      )}

      {/* Navegação */}
      <nav className="mt-3 flex flex-col gap-1.5 px-3">
        <button
          onClick={() => onNavigate('tech-inicio')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
            current === 'tech-inicio'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Painel Técnico</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('tech-chamados')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
            current === 'tech-chamados'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Inbox className="h-4 w-4 shrink-0" />
            <span>Fila Geral</span>
          </div>
          {unassignedCount > 0 && (
            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              {unassignedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('tech-atendimentos')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
            current === 'tech-atendimentos'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Meus Atendimentos</span>
          </div>
          {myActiveCount > 0 && (
            <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              {myActiveCount}
            </span>
          )}
        </button>

          <button
            onClick={() => onNavigate('tech-feedbacks' as any)}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
              (current as string) === 'tech-feedbacks'
                ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquareHeart className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>Feedbacks & Ideias</span>
            </div>
          </button>
  
      </nav>

      {/* Lista de Equipe de Campo */}
      <div className="mt-4 flex-1 overflow-y-auto px-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Equipe de Plantão
        </span>
        <div className="space-y-1.5">
          {mockTechnicians.map((tech) => {
            const isMe = tech.name === userName;
            const techTickets = tickets.filter(
              (t) => t.assignee === tech.name && t.status !== 'fechado' && t.status !== 'resolvido'
            ).length;

            return (
              <div
                key={tech.email || tech.name}
                className={`flex items-center justify-between rounded-lg p-2 text-xs transition-colors ${
                  isMe ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`h-2 w-2 rounded-full ${(tech as any).status === 'disponivel' || (tech as any).available !== false ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                  <span className={`truncate ${isMe ? 'font-semibold text-cyan-300' : 'text-slate-300'}`}>
                    {tech.name} {isMe && '(Você)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {techTickets} ativ.
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rodapé com Acesso ao Perfil */}
      <div className="border-t border-white/5 bg-black/20 p-3">
        <button
          onClick={() => onNavigate('tech-perfil')}
          title="Clique para gerenciar seu perfil"
          className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
            current === 'tech-perfil' ? 'bg-white/10 ring-1 ring-cyan-500/40' : 'hover:bg-white/5'
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 text-sm font-bold text-white shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{userName}</p>
            <p className="truncate text-[10px] text-cyan-300/80">Ver Perfil Técnico &rarr;</p>
          </div>
        </button>

        <button
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
