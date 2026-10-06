import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  ShieldCheck,
  Users,
  FileSpreadsheet,
  LogOut,
  Activity,
  UserCheck,
  Sun,
  Moon,
  MessageSquareHeart,
} from 'lucide-react';
import { User as UserType, UserRole } from '@/types';
import Logo from '../Logo';


export type GestorPage =
  | 'gestor-dashboard'
  | 'gestor-equipe'
  | 'gestor-auditoria'
  | 'gestor-relatorios'
  | 'gestor-feedbacks'
  | 'gestor-perfil';

interface GestorSidebarProps {
  current: GestorPage;
  onNavigate: (p: GestorPage) => void;
  onLogout: () => void;
  activeUser: UserType;
  onSwitchRole?: (newRole: UserRole) => void;
}

/* =========================================================
   TEMA DO GESTOR
   ========================================================= */

const GESTOR_THEME_KEY = 'sti_gestor_theme';

export function useGestorTheme() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;

    const saved = localStorage.getItem(GESTOR_THEME_KEY);

    if (saved === 'light') return false;
    if (saved === 'dark') return true;

    return document.documentElement.classList.contains('dark');
  };

  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const applyTheme = (dark: boolean) => {
      const root = document.documentElement;

      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(isDark);

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;

      if (typeof customEvent.detail === 'boolean') {
        setIsDark(customEvent.detail);
      }
    };

    window.addEventListener(
      'gestor-theme-change',
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        'gestor-theme-change',
        handleThemeChange
      );
    };
  }, [isDark]);

  const toggleTheme = () => {
    const nextTheme = !isDark;

    localStorage.setItem(
      GESTOR_THEME_KEY,
      nextTheme ? 'dark' : 'light'
    );

    document.documentElement.classList.toggle(
      'dark',
      nextTheme
    );

    setIsDark(nextTheme);

    window.dispatchEvent(
      new CustomEvent('gestor-theme-change', {
        detail: nextTheme,
      })
    );
  };

  return {
    isDark,
    toggleTheme,
  };
}

/* =========================================================
   CONTAINER DAS PÁGINAS DO GESTOR
   ========================================================= */

export function GestorPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useGestorTheme();

  return (
    <main
      className={`ml-64 min-h-screen flex-1 overflow-y-auto p-6 lg:p-8 ${isDark
          ? 'bg-[#070e17] text-slate-100'
          : 'bg-slate-50 text-slate-900'
        }`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {children}
      </div>
    </main>
  );
}

/* =========================================================
   SIDEBAR
   ========================================================= */

export default function GestorSidebar({
  current,
  onNavigate,
  onLogout,
  activeUser,
  onSwitchRole,
}: GestorSidebarProps) {
  const { isDark, toggleTheme } = useGestorTheme();

  const canSwitch =
    activeUser?.roles && activeUser.roles.length > 1;

  const otherRole: UserRole | undefined =
    activeUser?.roles?.find((r) => r !== 'gestor');

  const colors = {
    sidebar: isDark
      ? 'bg-[#0b1624] border-white/5'
      : 'bg-white border-slate-200',

    text: isDark
      ? 'text-slate-200'
      : 'text-slate-700',

    muted: isDark
      ? 'text-slate-400'
      : 'text-slate-500',

    hover: isDark
      ? 'hover:bg-white/5 hover:text-white'
      : 'hover:bg-slate-100 hover:text-slate-900',

    border: isDark
      ? 'border-white/5'
      : 'border-slate-200',

    footer: isDark
      ? 'bg-black/20'
      : 'bg-slate-50',

    switcher: isDark
      ? 'border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/60'
      : 'border-cyan-200 bg-gradient-to-r from-cyan-50 to-slate-50',

    switcherHover: isDark
      ? 'hover:border-cyan-400 hover:bg-cyan-900/20'
      : 'hover:border-cyan-400 hover:bg-cyan-50',

    profileHover: isDark
      ? 'hover:bg-white/5'
      : 'hover:bg-slate-100',

    profileActive: isDark
      ? 'bg-white/10 ring-1 ring-cyan-500/40'
      : 'bg-cyan-50 ring-1 ring-cyan-500/30',
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r ${colors.sidebar} ${colors.text}`}
    >
      {/* Topo / Marca */}
      <div
        className={`flex h-20 shrink-0 items-center border-b px-6 ${colors.border}`}
      >
        <Logo
          variant="dashboard"
          light={isDark}
        />
      </div>

      {/* Switcher de Perfil */}
      {canSwitch && otherRole && onSwitchRole && (
        <div className="px-3 pt-3">
          <button
            onClick={() => onSwitchRole(otherRole)}
            className={`group flex w-full items-center justify-between rounded-xl border p-2.5 text-xs ${colors.switcher} ${colors.switcherHover}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              {otherRole === 'tecnico' ? (
                <Activity className="h-4 w-4 text-cyan-400" />
              ) : (
                <UserCheck className="h-4 w-4 text-cyan-400" />
              )}

              <div className="text-left">
                <span
                  className={`block text-[10px] leading-tight ${colors.muted}`}
                >
                  Alternar Visão
                </span>

                <span className="block text-xs font-semibold text-cyan-500 dark:text-cyan-300">
                  Entrar como{' '}
                  {otherRole === 'tecnico'
                    ? 'Técnico'
                    : 'Solicitante'}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-bold text-cyan-500">
              &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Navegação */}
      <nav className="mt-3 flex flex-1 flex-col gap-1.5 px-3">
        <button
          onClick={() => onNavigate('gestor-dashboard')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium ${current === 'gestor-dashboard'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : `${colors.muted} ${colors.hover}`
            }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>Dashboard Executivo</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-equipe')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium ${current === 'gestor-equipe'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : `${colors.muted} ${colors.hover}`
            }`}
        >
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0" />
            <span>Produtividade da Equipe</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-auditoria')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium ${current === 'gestor-auditoria'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : `${colors.muted} ${colors.hover}`
            }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Auditoria & SLA</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('gestor-relatorios')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium ${current === 'gestor-relatorios'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : `${colors.muted} ${colors.hover}`
            }`}
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-4 w-4 shrink-0" />
            <span>Relatórios & Exportações</span>
          </div>
        </button>


        <button
          onClick={() => onNavigate('gestor-feedbacks')}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium ${current === 'gestor-feedbacks'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : `${colors.muted} ${colors.hover}`
            }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquareHeart className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Feedbacks & Demandas</span>
          </div>
        </button>
      </nav>

      {/* Rodapé */}
      <div
        className={`border-t p-3 ${colors.border} ${colors.footer}`}
      >
        {/* Botão de tema */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`mb-2 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 ${isDark
              ? 'border-white/10 bg-white/5 hover:bg-white/10'
              : 'border-slate-200 bg-white hover:bg-slate-100'
            }`}
          title={
            isDark
              ? 'Ativar modo claro'
              : 'Ativar modo escuro'
          }
        >
          <div className="flex items-center gap-2.5">
            {isDark ? (
              <Moon className="h-4 w-4 text-cyan-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}

            <span
              className={`text-xs font-medium ${isDark
                  ? 'text-slate-300'
                  : 'text-slate-600'
                }`}
            >
              {isDark ? 'Modo escuro' : 'Modo claro'}
            </span>
          </div>

          <div
            className={`relative h-5 w-9 rounded-full ${isDark
                ? 'bg-cyan-600'
                : 'bg-slate-300'
              }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm ${isDark
                  ? 'left-[18px]'
                  : 'left-0.5'
                }`}
            />
          </div>
        </button>

        {/* Perfil */}
        <button
          onClick={() => onNavigate('gestor-perfil')}
          title="Clique para editar seu perfil de gestor"
          className={`flex w-full items-center gap-3 rounded-xl p-2 text-left ${current === 'gestor-perfil'
              ? colors.profileActive
              : colors.profileHover
            }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-sm font-bold text-white shadow-sm">
            {activeUser.name.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-xs font-semibold ${isDark
                  ? 'text-white'
                  : 'text-slate-800'
                }`}
            >
              {activeUser.name}
            </p>

            <p className="truncate text-[10px] text-amber-500 dark:text-amber-300">
              Acessar Perfil &rarr;
            </p>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${isDark
              ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
              : 'text-slate-500 hover:bg-red-50 hover:text-red-500'
            }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}