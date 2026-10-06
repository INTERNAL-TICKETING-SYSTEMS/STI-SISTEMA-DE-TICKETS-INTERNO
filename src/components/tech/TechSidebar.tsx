import React, {
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  LayoutDashboard,
  Inbox,
  Clock,
  LogOut,
  ShieldCheck,
  MessageSquareHeart,
} from 'lucide-react';

import {
  Ticket,
  User as UserType,
  UserRole,
} from '@/types';

import { mockTechnicians } from '@/data';
import Logo from '../Logo';

/*
|--------------------------------------------------------------------------
| PÁGINAS
|--------------------------------------------------------------------------
*/

export type TechPage =
  | 'tech-inicio'
  | 'tech-chamados'
  | 'tech-atendimentos'
  | 'tech-perfil'
  | 'auditoria';

/*
|--------------------------------------------------------------------------
| TEMA GLOBAL
|--------------------------------------------------------------------------
*/

export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY =
  'sti_theme_preference';

export const THEME_EVENT =
  'sti-theme-change';

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

interface TechSidebarProps {
  current: TechPage;
  onNavigate: (p: TechPage) => void;
  onLogout: () => void;
  userName: string;
  tickets?: Ticket[];
  activeUser?: UserType;
  onSwitchRole?: (newRole: UserRole) => void;
}

/*
|--------------------------------------------------------------------------
| ESTADO GLOBAL DO TEMA
|--------------------------------------------------------------------------
*/

let currentTheme: ThemeMode = 'dark';

const themeListeners = new Set<
  () => void
>();

let themeInitialized = false;

/*
|--------------------------------------------------------------------------
| LEITURA DO TEMA
|--------------------------------------------------------------------------
*/

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const saved =
      localStorage.getItem(
        THEME_STORAGE_KEY
      );

    if (
      saved === 'light' ||
      saved === 'dark'
    ) {
      return saved;
    }

    const prefersDark =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

    return prefersDark
      ? 'dark'
      : 'light';
  } catch {
    return 'dark';
  }
}

/*
|--------------------------------------------------------------------------
| APLICAÇÃO GLOBAL DO TEMA
|--------------------------------------------------------------------------
*/

function applyGlobalTheme(
  theme: ThemeMode
) {
  if (typeof document === 'undefined') {
    return;
  }

  const html =
    document.documentElement;

  /*
   * O HTML recebe o tema para compatibilidade
   * com Tailwind/dark mode.
   */
  html.dataset.theme = theme;

  html.classList.toggle(
    'dark',
    theme === 'dark'
  );

  html.style.colorScheme = theme;

  /*
   * Fundo global.
   *
   * Não usamos transition aqui.
   * A troca precisa ser instantânea.
   */
  html.style.backgroundColor =
    theme === 'dark'
      ? '#070e17'
      : '#f8fafc';

  if (document.body) {
    document.body.style.backgroundColor =
      theme === 'dark'
        ? '#070e17'
        : '#f8fafc';

    document.body.style.color =
      theme === 'dark'
        ? '#f1f5f9'
        : '#0f172a';

    /*
     * Evita que o body tenha alguma
     * transição global herdada.
     */
    document.body.style.transition =
      'none';
  }
}

/*
|--------------------------------------------------------------------------
| INICIALIZA TEMA GLOBAL
|--------------------------------------------------------------------------
*/

function initializeTheme() {
  if (themeInitialized) {
    return;
  }

  themeInitialized = true;

  currentTheme =
    getInitialTheme();

  applyGlobalTheme(
    currentTheme
  );
}

/*
|--------------------------------------------------------------------------
| ALTERA TEMA GLOBAL
|--------------------------------------------------------------------------
*/

function setGlobalTheme(
  theme: ThemeMode
) {
  currentTheme = theme;

  /*
   * Primeiro muda o DOM.
   * Depois notifica os componentes.
   *
   * Assim a troca visual e o estado
   * acontecem juntos.
   */
  applyGlobalTheme(theme);

  try {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme
    );
  } catch {
    // Ignora erro de localStorage.
  }

  themeListeners.forEach(
    (listener) => listener()
  );

  /*
   * Compatibilidade com componentes
   * antigos que ainda escutam o evento.
   */
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ThemeMode>(
        THEME_EVENT,
        {
          detail: theme,
        }
      )
    );
  }
}

/*
|--------------------------------------------------------------------------
| STORE DO TEMA
|--------------------------------------------------------------------------
*/

function subscribeTheme(
  listener: () => void
) {
  initializeTheme();

  themeListeners.add(
    listener
  );

  return () => {
    themeListeners.delete(
      listener
    );
  };
}

function getThemeSnapshot(): ThemeMode {
  initializeTheme();

  return currentTheme;
}

function getThemeServerSnapshot(): ThemeMode {
  return 'dark';
}

/*
|--------------------------------------------------------------------------
| HOOK GLOBAL DE TEMA
|--------------------------------------------------------------------------
*/

export function useTechTheme() {
  const theme =
    useSyncExternalStore(
      subscribeTheme,
      getThemeSnapshot,
      getThemeServerSnapshot
    );

  useEffect(() => {
    initializeTheme();

    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        event.key !==
        THEME_STORAGE_KEY
      ) {
        return;
      }

      if (
        event.newValue !==
          'light' &&
        event.newValue !==
          'dark'
      ) {
        return;
      }

      const nextTheme =
        event.newValue as ThemeMode;

      currentTheme =
        nextTheme;

      applyGlobalTheme(
        nextTheme
      );

      themeListeners.forEach(
        (listener) =>
          listener()
      );
    };

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  const updateTheme = (
    nextTheme: ThemeMode
  ) => {
    setGlobalTheme(
      nextTheme
    );
  };

  const toggleTheme = () => {
    setGlobalTheme(
      currentTheme === 'dark'
        ? 'light'
        : 'dark'
    );
  };

  return {
    theme,
    isDark:
      theme === 'dark',
    updateTheme,
    toggleTheme,
  };
}

/*
|--------------------------------------------------------------------------
| CONTAINER DAS PÁGINAS TÉCNICAS
|--------------------------------------------------------------------------
*/

export function TechPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } =
    useTechTheme();

  return (
    <main
      className={[
        'ml-64 min-h-screen flex-1 overflow-y-auto',
        'p-6 lg:p-8',

        /*
         * IMPORTANTE:
         * não existe transition-colors aqui.
         * O fundo troca imediatamente.
         */
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

/*
|--------------------------------------------------------------------------
| SIDEBAR TÉCNICA
|--------------------------------------------------------------------------
*/

export default function TechSidebar({
  current,
  onNavigate,
  onLogout,
  userName,
  tickets = [],
  activeUser,
  onSwitchRole,
}: TechSidebarProps) {
  const { isDark } =
    useTechTheme();

  /*
   * Chamados sem técnico.
   */
  const unassignedCount =
    tickets.filter(
      (ticket) =>
        !ticket.assignee &&
        ticket.status !== 'fechado' &&
        ticket.status !== 'resolvido'
    ).length;

  /*
   * Chamados ativos do técnico.
   */
  const myActiveCount =
    tickets.filter(
      (ticket) =>
        ticket.assignee ===
          userName &&
        ticket.status !==
          'fechado' &&
        ticket.status !==
          'resolvido'
    ).length;

  /*
   * Verifica perfil híbrido.
   */
  const isHybridGestor =
    userName ===
      'Wanderson Silveira' ||
    activeUser?.roles?.includes(
      'gestor'
    ) ||
    (activeUser as any)
      ?.userRole === 'gestor';

  return (
    <aside
      className={[
        'fixed left-0 top-0 z-30',
        'flex h-screen w-64 flex-col',
        'border-r',

        /*
         * SEM transition-colors.
         *
         * A sidebar troca imediatamente.
         */
        isDark
          ? 'border-white/10 bg-[#0b1624] text-slate-200'
          : 'border-slate-200 bg-white text-slate-700',
      ].join(' ')}
    >
      {/* LOGO */}

      <div
        className={[
          'flex h-16 shrink-0 items-center',
          'border-b px-6',

          isDark
            ? 'border-white/10'
            : 'border-slate-200',
        ].join(' ')}
      >
        <Logo
          variant="dashboard"
          light={isDark}
        />
      </div>

      {/* ACESSO EXECUTIVO */}

      {isHybridGestor && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() =>
              onSwitchRole
                ? onSwitchRole(
                    'gestor'
                  )
                : window.location.reload()
            }
            className={[
              'group flex w-full',
              'items-center justify-between',
              'rounded-xl border p-2.5',
              'text-xs',
              'transition-all duration-200',
              isDark
                ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400/50 hover:bg-amber-500/15'
                : 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100',
            ].join(' ')}
          >
            <div className="flex min-w-0 items-center gap-2">
              <ShieldCheck
                className={[
                  'h-4 w-4 shrink-0',
                  isDark
                    ? 'text-amber-400'
                    : 'text-amber-600',
                ].join(' ')}
              />

              <div className="text-left">
                <span
                  className={[
                    'block text-[10px] leading-tight',
                    isDark
                      ? 'text-amber-200/70'
                      : 'text-amber-700/70',
                  ].join(' ')}
                >
                  Acesso Executivo
                </span>

                <span
                  className={[
                    'text-xs font-semibold',
                    isDark
                      ? 'text-amber-300'
                      : 'text-amber-700',
                  ].join(' ')}
                >
                  Entrar como Gestor
                </span>
              </div>
            </div>

            <span
              className={[
                'text-xs font-bold',
                isDark
                  ? 'text-amber-400'
                  : 'text-amber-600',
              ].join(' ')}
            >
              →
            </span>
          </button>
        </div>
      )}

      {/* NAVEGAÇÃO */}

      <nav className="mt-3 flex flex-col gap-1.5 px-3">
        {/* PAINEL */}

        <button
          type="button"
          onClick={() =>
            onNavigate(
              'tech-inicio'
            )
          }
          className={[
            'flex items-center justify-between',
            'rounded-xl px-3.5 py-2.5',
            'text-xs font-medium',
            'transition-all duration-200',

            current ===
            'tech-inicio'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : isDark
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4 shrink-0" />

            <span>
              Painel Técnico
            </span>
          </div>
        </button>

        {/* FILA GERAL */}

        <button
          type="button"
          onClick={() =>
            onNavigate(
              'tech-chamados'
            )
          }
          className={[
            'flex items-center justify-between',
            'rounded-xl px-3.5 py-2.5',
            'text-xs font-medium',
            'transition-all duration-200',

            current ===
            'tech-chamados'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : isDark
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <Inbox className="h-4 w-4 shrink-0" />

            <span>
              Fila Geral
            </span>
          </div>

          {unassignedCount > 0 && (
            <span
              className={[
                'rounded-full border',
                'px-2 py-0.5',
                'text-[10px] font-bold',
                isDark
                  ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              ].join(' ')}
            >
              {unassignedCount}
            </span>
          )}
        </button>

        {/* MEUS ATENDIMENTOS */}

        <button
          type="button"
          onClick={() =>
            onNavigate(
              'tech-atendimentos'
            )
          }
          className={[
            'flex items-center justify-between',
            'rounded-xl px-3.5 py-2.5',
            'text-xs font-medium',
            'transition-all duration-200',

            current ===
            'tech-atendimentos'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : isDark
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0" />

            <span>
              Meus Atendimentos
            </span>
          </div>

          {myActiveCount > 0 && (
            <span
              className={[
                'rounded-full border',
                'px-2 py-0.5',
                'text-[10px] font-bold',
                isDark
                  ? 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300'
                  : 'border-cyan-200 bg-cyan-50 text-cyan-700',
              ].join(' ')}
            >
              {myActiveCount}
            </span>
          )}
        </button>

        {/* FEEDBACK */}

        <button
          type="button"
          onClick={() =>
            onNavigate(
              'tech-feedbacks' as any
            )
          }
          className={[
            'flex items-center justify-between',
            'rounded-xl px-3.5 py-2.5',
            'text-xs font-medium',
            'transition-all duration-200',

            (current as string) ===
            'tech-feedbacks'
              ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
              : isDark
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <MessageSquareHeart
              className={[
                'h-4 w-4 shrink-0',
                isDark
                  ? 'text-cyan-400'
                  : 'text-cyan-600',
              ].join(' ')}
            />

            <span>
              Feedbacks &amp; Ideias
            </span>
          </div>
        </button>
      </nav>

      {/* EQUIPE */}

      <div className="mt-4 flex-1 overflow-y-auto px-4">
        <span
          className={[
            'mb-2 block text-[10px]',
            'font-bold uppercase tracking-wider',
            isDark
              ? 'text-slate-500'
              : 'text-slate-400',
          ].join(' ')}
        >
          Equipe de Plantão
        </span>

        <div className="space-y-1.5">
          {mockTechnicians.map(
            (tech) => {
              const isMe =
                tech.name ===
                userName;

              const techTickets =
                tickets.filter(
                  (ticket) =>
                    ticket.assignee ===
                      tech.name &&
                    ticket.status !==
                      'fechado' &&
                    ticket.status !==
                      'resolvido'
                ).length;

              return (
                <div
                  key={
                    tech.email ||
                    tech.name
                  }
                  className={[
                    'flex items-center justify-between',
                    'rounded-lg p-2 text-xs',

                    /*
                     * Sem transition de cor.
                     */
                    isMe
                      ? isDark
                        ? 'border border-cyan-500/20 bg-cyan-500/10'
                        : 'border border-cyan-200 bg-cyan-50'
                      : isDark
                        ? 'bg-white/[0.025]'
                        : 'bg-slate-50',
                  ].join(' ')}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className={[
                        'h-2 w-2 shrink-0 rounded-full',

                        (tech as any)
                          .status ===
                          'disponivel' ||
                        (tech as any)
                          .available !==
                          false
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : isDark
                            ? 'bg-slate-600'
                            : 'bg-slate-300',
                      ].join(' ')}
                    />

                    <span
                      className={[
                        'truncate',
                        isMe
                          ? isDark
                            ? 'font-semibold text-cyan-300'
                            : 'font-semibold text-cyan-700'
                          : isDark
                            ? 'text-slate-300'
                            : 'text-slate-600',
                      ].join(' ')}
                    >
                      {tech.name}{' '}
                      {isMe &&
                        '(Você)'}
                    </span>
                  </div>

                  <span
                    className={[
                      'shrink-0 font-mono text-[10px]',
                      isDark
                        ? 'text-slate-500'
                        : 'text-slate-400',
                    ].join(' ')}
                  >
                    {techTickets}{' '}
                    ativ.
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* PERFIL */}

      <div
        className={[
          'shrink-0 border-t p-3',

          /*
           * Sem transition de tema.
           */
          isDark
            ? 'border-white/10 bg-[#08121f]'
            : 'border-slate-200 bg-white',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() =>
            onNavigate(
              'tech-perfil'
            )
          }
          title="Clique para gerenciar seu perfil"
          className={[
            'flex w-full items-center gap-3',
            'rounded-xl p-2 text-left',
            'transition-colors duration-200',

            current ===
            'tech-perfil'
              ? isDark
                ? 'bg-white/[0.08] ring-1 ring-cyan-500/40'
                : 'bg-cyan-50 ring-1 ring-cyan-500/30'
              : isDark
                ? 'hover:bg-white/[0.05]'
                : 'hover:bg-slate-100',
          ].join(' ')}
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              bg-gradient-to-tr
              from-[#00A896]
              to-cyan-500
              text-sm font-bold
              text-white
              shadow-sm
            "
          >
            {userName.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={[
                'truncate text-xs font-semibold',
                isDark
                  ? 'text-white'
                  : 'text-slate-800',
              ].join(' ')}
            >
              {userName}
            </p>

            <p
              className={[
                'truncate text-[10px]',
                isDark
                  ? 'text-cyan-300/80'
                  : 'text-cyan-700',
              ].join(' ')}
            >
              Ver Perfil Técnico →
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className={[
            'mt-1.5 flex w-full items-center gap-2.5',
            'rounded-lg px-2.5 py-1.5',
            'text-xs font-medium',
            'transition-colors duration-200',

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