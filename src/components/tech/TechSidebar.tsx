import { ReactNode } from 'react';
import Logo from '@/components/Logo';
import { Home, ClipboardList, Headphones, User, LogOut, Users, CircleDot, Activity } from 'lucide-react';
import { Ticket, User as UserType } from '@/types';
import { mockTechnicians } from '@/data';

export type TechPage = 'tech-inicio' | 'tech-chamados' | 'tech-atendimentos' | 'tech-perfil';

interface TechSidebarProps {
  current: TechPage;
  onNavigate: (p: TechPage) => void;
  onLogout: () => void;
  userName: string;
  tickets?: Ticket[];
}

export default function TechSidebar({ current, onNavigate, onLogout, userName, tickets = [] }: TechSidebarProps) {
  // Cálculos dinâmicos em tempo real
  const unassignedCount = tickets.filter((t) => !t.assignee && t.status !== 'fechado' && t.status !== 'resolvido').length;
  const myActiveCount = tickets.filter((t) => t.assignee === userName && t.status !== 'fechado' && t.status !== 'resolvido').length;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#0b1624] border-r border-white/5 text-slate-200">
      {/* Topo / Logo */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
        <Logo variant="full" light className="h-9" />
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Sistema Operacional" />
      </div>

      {/* Navegação Principal */}
      <nav className="mt-4 flex flex-col gap-1.5 px-3">
        <button
          onClick={() => onNavigate('tech-inicio')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
            current === 'tech-inicio'
              ? 'bg-white/10 text-white font-semibold shadow-inner'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Home className="h-4 w-4 shrink-0 text-cyan-400" />
            Início
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
            <ClipboardList className="h-4 w-4 shrink-0 text-teal-400" />
            Fila de Chamados
          </div>
          {unassignedCount > 0 && (
            <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
              {unassignedCount} livres
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('tech-atendimentos')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
            current === 'tech-atendimentos'
              ? 'bg-white/10 text-white font-semibold shadow-inner'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Headphones className="h-4 w-4 shrink-0 text-cyan-400" />
            Meus Atendimentos
          </div>
          {myActiveCount > 0 && (
            <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold">
              {myActiveCount}
            </span>
          )}
        </button>
      </nav>

      {/* ÁREA CENTRAL POVOADA: Equipe & Métricas */}
      <div className="mt-4 flex-1 overflow-y-auto px-3 py-2 space-y-4 border-t border-white/5 scrollbar-thin">
        {/* Bloco 1: Plantão do Técnico Logado */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-teal-400" />
              Seu Plantão
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-black/20 p-2 border border-white/5">
              <span className="block text-base font-bold text-white">{myActiveCount}</span>
              <span className="text-[10px] text-slate-400">Em Aberto</span>
            </div>
            <div className="rounded-lg bg-black/20 p-2 border border-white/5">
              <span className="block text-base font-bold text-cyan-400">{unassignedCount}</span>
              <span className="text-[10px] text-slate-400">Na Fila</span>
            </div>
          </div>
        </div>

        {/* Bloco 2: Equipe Manutenção / TI */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2.5">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              Manutenção / TI
            </span>
            <span className="text-[10px] text-slate-500 font-mono">4 Técnicos</span>
          </div>

          <div className="space-y-1.5">
            {mockTechnicians.map((tech) => {
              const isMe = tech.name === userName;
              const techTickets = tickets.filter(
                (t) => t.assignee === tech.name && t.status !== 'fechado' && t.status !== 'resolvido'
              ).length;

              return (
                <div
                  key={tech.email}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isMe ? 'bg-cyan-500/10 border border-cyan-500/20 text-white' : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isMe ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                    <span className="truncate text-[11px] font-medium">
                      {tech.name.split(' ')[0]} {tech.name.split(' ')[1]?.[0]}.
                      {isMe && <span className="ml-1 text-[9px] text-cyan-300 font-bold">(Você)</span>}
                    </span>
                  </div>
                  <span className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                    {techTickets}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rodapé / Usuário */}
      <div className="border-t border-white/5 bg-black/20 p-3">
        <button
          onClick={() => onNavigate('tech-perfil')}
          className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
            current === 'tech-perfil' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 text-sm font-bold text-white shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{userName}</p>
            <p className="truncate text-[10px] text-cyan-300/80">Manutenção / TI</p>
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

export function TechPageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="ml-64 min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-8 py-8 animate-fade-in">{children}</div>
    </main>
  );
}