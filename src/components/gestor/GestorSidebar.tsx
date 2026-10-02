import React from 'react';
import {
  BarChart3,
  ShieldCheck,
  Users,
  FileSpreadsheet,
  LogOut,
  Activity,
  UserCheck,
  User
  , MessageSquareHeart
} from 'lucide-react';
import { User as UserType, UserRole } from '@/types';

export type GestorPage = 'gestor-dashboard' | 'gestor-equipe' | 'gestor-auditoria' | 'gestor-relatorios' | 'gestor-perfil';

interface GestorSidebarProps {
  current: GestorPage;
  onNavigate: (p: GestorPage) => void;
  onLogout: () => void;
  activeUser: UserType;
  onSwitchRole?: (newRole: UserRole) => void;
}

export function GestorPageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="ml-64 flex-1 overflow-y-auto bg-[#070e17] p-6 lg:p-8 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </main>
  );
}

export default function GestorSidebar({
  current,
  onNavigate,
  onLogout,
  activeUser,
  onSwitchRole,
}: GestorSidebarProps) {
  const canSwitch = (activeUser?.roles && activeUser.roles.length > 1);
  const otherRole: UserRole | undefined = activeUser?.roles?.find((r) => r !== 'gestor');

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#0b1624] border-r border-white/5 text-slate-200">

      {/* Topo / Marca Executiva */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
        <img
          src="/src/logo-sti.png"
          alt="STI — Sistema de Tickets Interno"
          className="w-auto max-w-[260px] max-h-14 h-auto object-contain brightness-110 h-8"
        />
      </div>

      {/* Switcher Rápido de Perfil */}
      {canSwitch && otherRole && onSwitchRole && (
        <div className="px-3 pt-3">
          <button
            onClick={() => onSwitchRole(otherRole)}
            className="group flex w-full items-center justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-2.5 text-xs transition-all hover:border-cyan-400 hover:bg-cyan-900/20"
          >
            <div className="flex items-center gap-2 min-w-0">
              {otherRole === 'tecnico' ? (
                <Activity className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
              ) : (
                <UserCheck className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
              )}
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 leading-tight">Alternar Visão</span>
                <span className="font-semibold text-cyan-300 text-xs">
                  Entrar como {otherRole === 'tecnico' ? 'Técnico' : 'Solicitante'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-cyan-400 font-bold">&rarr;</span>
          </button>
        </div>
      )}

      {/* Navegação Analítica */}
      <nav className="mt-3 flex flex-col gap-1.5 px-3 flex-1">
        <button
          onClick={() => onNavigate('gestor-dashboard')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'gestor-dashboard'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>Dashboard Executivo</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-equipe')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'gestor-equipe'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0" />
            <span>Produtividade da Equipe</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-auditoria')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'gestor-auditoria'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Auditoria & SLA</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-relatorios')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${current === 'gestor-relatorios'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-4 w-4 shrink-0" />
            <span>Relatórios & Exportações</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-feedbacks' as any)}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${(current as string) === 'gestor-feedbacks'
              ? 'bg-[#00A896] text-white font-semibold shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquareHeart className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Feedbacks & Demandas</span>
          </div>
        </button>

      </nav>

      {/* Rodapé / Perfil do Gestor Interativo */}
      <div className="border-t border-white/5 bg-black/20 p-3">
        <button
          onClick={() => onNavigate('gestor-perfil')}
          title="Clique para editar seu perfil de gestor"
          className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${current === 'gestor-perfil' ? 'bg-white/10 ring-1 ring-cyan-500/40' : 'hover:bg-white/5'
            }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-sm font-bold text-white shadow-sm">
            {activeUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{activeUser.name}</p>
            <p className="truncate text-[10px] text-amber-300">Acessar Perfil &rarr;</p>
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
