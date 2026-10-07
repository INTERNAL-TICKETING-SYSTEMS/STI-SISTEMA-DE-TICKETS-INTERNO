
import React, { useState } from 'react';
import {
  LayoutDashboard,
  TicketCheck,
  PlusCircle,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Bug,
  PhoneCall,
  X,
  Send,
  Check,
  Moon,
  Sun,
} from 'lucide-react';

import { registrarAuditoria } from '../services/auditService';
import Logo from '@/components/Logo';
import { Ticket, User as UserType, UserRole } from '@/types';
import { useTechTheme } from '@/components/tech/techTheme';

export type Page = 'inicio' | 'meus-chamados' | 'abrir-chamado' | 'perfil';

export function PageContainer({ children }: { children: React.ReactNode }) {
  const { isDark } = useTechTheme();

  return (
    <main
      className={[
        'ml-64 min-h-screen flex-1 overflow-y-auto p-6 lg:p-8',
        isDark ? 'bg-[#070e17] text-slate-100' : 'bg-slate-50 text-slate-900',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </main>
  );
}

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  userName: string;
  userRole?: string;
  tickets?: Ticket[];
  unreadCount?: number;
  activeUser?: UserType;
  onSwitchRole?: (newRole: UserRole) => void;
}

export default function Sidebar({
  current,
  onNavigate,
  onLogout,
  userName,
  userRole = 'Servidor',
  tickets = [],
  activeUser,
  onSwitchRole,
}: SidebarProps) {
  const { isDark, toggleTheme } = useTechTheme();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'falha' | 'ideia'>('falha');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const displayName = activeUser?.name || userName || 'Servidor';
  const displayRole = activeUser?.department || userRole || 'Colaborador';

  const canSwitchToGestor =
    activeUser?.roles?.includes('gestor') ||
    (activeUser as any)?.userRole === 'gestor' ||
    displayName.includes('Diretor') ||
    displayName.includes('Roberto') ||
    displayName.includes('Wanderson');

  const myTickets = tickets.filter(
    (ticket) =>
      ticket.requesterName === userName ||
      ticket.requesterName === activeUser?.name ||
      (ticket as any).requesterEmail === activeUser?.email,
  );

  const myOpenCount = myTickets.filter((ticket) =>
    ['aberto', 'em_andamento', 'aguardando'].includes(ticket.status),
  ).length;

  const myResolvedCount = myTickets.filter((ticket) =>
    ['resolvido', 'fechado'].includes(ticket.status),
  ).length;

  const panelClass = isDark
    ? 'border-white/10 bg-white/[0.03]'
    : 'border-slate-200 bg-white';

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';
  const primaryText = isDark ? 'text-white' : 'text-slate-900';

  const navButtonClass = (active: boolean) =>
    [
      'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors',
      active
        ? 'bg-[#00A896] font-semibold text-white shadow-md shadow-teal-500/20'
        : isDark
          ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

  const handleSendFeedback = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const description = feedbackText.trim();
    if (!description) return;

    const newEntry = {
      id: `FB-${Date.now().toString().slice(-4)}`,
      type: feedbackType,
      title:
        feedbackType === 'falha'
          ? 'Falha reportada por servidor'
          : 'Sugestão de melhoria do sistema',
      description,
      authorName: displayName,
      authorDepartment: activeUser?.department || 'Órgão',
      authorRole: 'Servidor',
      createdAt: new Date().toISOString(),
      status: 'novo',
      priority: feedbackType === 'falha' ? 'alta' : 'media',
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem('sti_feedbacks') || '[]',
      );

      if (!Array.isArray(existing)) {
        throw new Error('O formato dos feedbacks salvos é inválido.');
      }

      localStorage.setItem(
        'sti_feedbacks',
        JSON.stringify([newEntry, ...existing]),
      );
    } catch (error) {
      console.error('[Feedback] Não foi possível salvar o feedback:', error);
      return;
    }

    let authorEmail = 'servidor@sti.chamados.com';

    try {
      const raw =
        localStorage.getItem('sti_user') ||
        localStorage.getItem('sti_active_user');

      if (raw) {
        authorEmail = JSON.parse(raw).email || authorEmail;
      }
    } catch {
      // Mantém o e-mail padrão para a auditoria.
    }

    try {
      void registrarAuditoria({
        entidade: 'CONFORMIDADE',
        idEntidade: newEntry.id,
        tipoOperacao: 'REGISTRO_FEEDBACK',
        autor: authorEmail,
        estadoAtual: {
          tipo: feedbackType,
          titulo: newEntry.title,
          descricao: description,
        },
        metadados: { origem: 'Ouvidoria / Feedback Sidebar' },
      }).catch((error) => {
        console.error('[Auditoria] Falha ao registrar feedback:', error);
      });
    } catch (error) {
      console.error('[Auditoria] Erro ao iniciar o registro:', error);
    }

    setFeedbackSent(true);

    window.setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setIsFeedbackOpen(false);
    }, 1800);
  };

  const closeFeedback = () => {
    setIsFeedbackOpen(false);
    setFeedbackSent(false);
  };

  return (
    <>
      <aside
        className={[
          'fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r transition-colors',
          isDark
            ? 'border-white/10 bg-[#0b1624] text-slate-200'
            : 'border-slate-200 bg-white text-slate-700',
        ].join(' ')}
      >
        <div
          className={[
            'flex h-20 shrink-0 items-center border-b px-6',
            isDark ? 'border-white/10' : 'border-slate-200',
          ].join(' ')}
        >
          <Logo variant="dashboard" light={isDark} />
        </div>

        {canSwitchToGestor && onSwitchRole && (
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => onSwitchRole('gestor')}
              className={[
                'group flex w-full items-center justify-between rounded-xl border p-2.5 text-xs',
                isDark
                  ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400/50 hover:bg-amber-500/15'
                  : 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100',
              ].join(' ')}
            >
              <div className="flex min-w-0 items-center gap-2">
                <ShieldCheck
                  className={[
                    'h-4 w-4 shrink-0',
                    isDark ? 'text-amber-400' : 'text-amber-600',
                  ].join(' ')}
                />
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
              <span
                className={[
                  'text-xs font-bold',
                  isDark ? 'text-amber-400' : 'text-amber-600',
                ].join(' ')}
              >
                →
              </span>
            </button>
          </div>
        )}

        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => onNavigate('abrir-chamado')}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-md',
              'bg-[#00A896] shadow-teal-500/10 hover:bg-[#009181]',
              current === 'abrir-chamado' ? 'ring-2 ring-teal-400/40' : '',
            ].join(' ')}
          >
            <PlusCircle className="h-4 w-4" />
            <span>ABRIR NOVO CHAMADO</span>
          </button>
        </div>

        <nav className="mt-3 flex flex-col gap-1 px-3">
          <button
            type="button"
            onClick={() => onNavigate('inicio')}
            className={navButtonClass(current === 'inicio')}
          >
            <span className="flex items-center gap-3">
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Início
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('meus-chamados')}
            className={navButtonClass(current === 'meus-chamados')}
          >
            <span className="flex items-center gap-3">
              <TicketCheck className="h-4 w-4 shrink-0" />
              Meus Chamados
            </span>

            {myOpenCount > 0 && (
              <span
                className={[
                  'rounded-full border px-2 py-0.5 text-[10px] font-bold',
                  isDark
                    ? 'border-cyan-500/30 bg-cyan-500/20 text-cyan-300'
                    : 'border-cyan-200 bg-cyan-50 text-cyan-700',
                ].join(' ')}
              >
                {myOpenCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('perfil')}
            className={navButtonClass(current === 'perfil')}
          >
            <span className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 shrink-0" />
              Meu Perfil
            </span>
          </button>
        </nav>

        <div
          className={[
            'mx-3 mt-4 rounded-xl border p-3 text-xs',
            panelClass,
          ].join(' ')}
        >
          <span
            className={[
              'mb-2 block text-[10px] font-semibold uppercase tracking-wider',
              mutedText,
            ].join(' ')}
          >
            Suas Solicitações
          </span>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div
              className={[
                'rounded-lg border p-2',
                isDark
                  ? 'border-white/5 bg-black/20'
                  : 'border-slate-100 bg-slate-50',
              ].join(' ')}
            >
              <span className={['block text-base font-bold', primaryText].join(' ')}>
                {myOpenCount}
              </span>
              <span className={['text-[10px]', mutedText].join(' ')}>
                Em Aberto
              </span>
            </div>

            <div
              className={[
                'rounded-lg border p-2',
                isDark
                  ? 'border-white/5 bg-black/20'
                  : 'border-slate-100 bg-slate-50',
              ].join(' ')}
            >
              <span className="block text-base font-bold text-emerald-500">
                {myResolvedCount}
              </span>
              <span className={['text-[10px]', mutedText].join(' ')}>
                Resolvidos
              </span>
            </div>
          </div>
        </div>

        <div
          className={[
            'mx-3 mt-3 rounded-xl border p-3 text-xs',
            isDark
              ? 'border-amber-500/20 bg-amber-500/5'
              : 'border-amber-200 bg-amber-50',
          ].join(' ')}
        >
          <div className="flex items-start gap-2.5">
            <div
              className={[
                'shrink-0 rounded-lg p-1.5',
                isDark
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-amber-100 text-amber-700',
              ].join(' ')}
            >
              <Bug className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p
                className={[
                  'text-xs font-semibold',
                  isDark ? 'text-slate-200' : 'text-slate-800',
                ].join(' ')}
              >
                Notou um problema no STI?
              </p>
              <p className={['mt-0.5 text-[11px] leading-relaxed', mutedText].join(' ')}>
                Envie um relatório direto aos desenvolvedores do sistema.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFeedbackType('falha');
                  setFeedbackSent(false);
                  setIsFeedbackOpen(true);
                }}
                className={[
                  'mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold',
                  isDark
                    ? 'text-amber-400 hover:text-amber-300'
                    : 'text-amber-700 hover:text-amber-800',
                ].join(' ')}
              >
                Reportar falha ou ideia →
              </button>
            </div>
          </div>
        </div>

        <div
          className={[
            'mx-3 mt-2 flex items-center justify-between rounded-lg border px-3 py-2 text-[11px]',
            isDark
              ? 'border-white/5 bg-black/20 text-slate-400'
              : 'border-slate-200 bg-slate-50 text-slate-500',
          ].join(' ')}
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-cyan-500" />
            <span>Ramal Suporte STI</span>
          </div>
          <span
            className={[
              'font-mono font-semibold',
              isDark ? 'text-slate-300' : 'text-slate-700',
            ].join(' ')}
          >
            1234 / 2030
          </span>
        </div>

        <div className="flex-1" />

        <div
          className={[
            'shrink-0 space-y-1 border-t p-3',
            isDark
              ? 'border-white/10 bg-[#08121f]'
              : 'border-slate-200 bg-white',
          ].join(' ')}
        >
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className={[
              'flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/40',
              isDark
                ? 'border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/10'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
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
                'relative h-5 w-9 shrink-0 rounded-full',
                isDark ? 'bg-[#00A896]' : 'bg-slate-300',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all',
                  isDark ? 'left-[18px]' : 'left-0.5',
                ].join(' ')}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('perfil')}
            title="Clique para acessar seu perfil"
            className={[
              'flex w-full items-center gap-3 rounded-xl p-2 text-left',
              current === 'perfil'
                ? isDark
                  ? 'bg-white/[0.08] ring-1 ring-cyan-500/40'
                  : 'bg-cyan-50 ring-1 ring-cyan-500/30'
                : isDark
                  ? 'hover:bg-white/[0.05]'
                  : 'hover:bg-slate-100',
            ].join(' ')}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 text-sm font-bold text-white shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className={['truncate text-xs font-semibold', primaryText].join(' ')}>
                {displayName}
              </p>
              <p
                className={[
                  'truncate text-[10px]',
                  isDark ? 'text-cyan-300/80' : 'text-cyan-700',
                ].join(' ')}
              >
                {displayRole}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className={[
              'mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium',
              isDark
                ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                : 'text-slate-500 hover:bg-red-50 hover:text-red-600',
            ].join(' ')}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {isFeedbackOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFeedback();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            className={[
              'w-full max-w-md rounded-2xl border p-6 shadow-2xl',
              isDark
                ? 'border-white/10 bg-[#0b1624] text-white'
                : 'border-slate-200 bg-white text-slate-900',
            ].join(' ')}
          >
            <div
              className={[
                'flex items-center justify-between border-b pb-4',
                isDark ? 'border-white/10' : 'border-slate-200',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={[
                    'rounded-xl p-2',
                    isDark
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-amber-100 text-amber-700',
                  ].join(' ')}
                >
                  <Bug className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="feedback-modal-title" className="text-base font-bold">
                    Canal dos Desenvolvedores
                  </h3>
                  <p className={['text-xs', mutedText].join(' ')}>
                    Feedback interno de usabilidade e melhorias do STI
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Fechar janela"
                onClick={closeFeedback}
                className={[
                  'rounded-lg p-1.5',
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {feedbackSent ? (
              <div className="space-y-2 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-500">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold">
                  Relatório enviado aos devs!
                </h4>
                <p className={['text-xs', mutedText].join(' ')}>
                  Obrigado por ajudar a aprimorar a plataforma do órgão.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="mt-4 space-y-4">
                <div
                  className={[
                    'flex rounded-xl border p-1',
                    isDark
                      ? 'border-white/10 bg-white/5'
                      : 'border-slate-200 bg-slate-50',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => setFeedbackType('falha')}
                    className={[
                      'flex-1 rounded-lg border py-2 text-xs font-semibold',
                      feedbackType === 'falha'
                        ? isDark
                          ? 'border-amber-500/30 bg-amber-500/20 text-amber-300'
                          : 'border-amber-300 bg-amber-100 text-amber-800'
                        : mutedText,
                    ].join(' ')}
                  >
                    Reportar Problema
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('ideia')}
                    className={[
                      'flex-1 rounded-lg border py-2 text-xs font-semibold',
                      feedbackType === 'ideia'
                        ? isDark
                          ? 'border-cyan-500/30 bg-cyan-500/20 text-cyan-300'
                          : 'border-cyan-300 bg-cyan-100 text-cyan-800'
                        : mutedText,
                    ].join(' ')}
                  >
                    Sugerir Ideia
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="feedback-description"
                    className={[
                      'mb-1.5 block text-xs font-medium',
                      isDark ? 'text-slate-300' : 'text-slate-700',
                    ].join(' ')}
                  >
                    {feedbackType === 'falha'
                      ? 'O que aconteceu de errado?'
                      : 'Qual a sua sugestão para o STI?'}
                  </label>

                  <textarea
                    id="feedback-description"
                    rows={4}
                    required
                    maxLength={3000}
                    value={feedbackText}
                    onChange={(event) => setFeedbackText(event.target.value)}
                    placeholder={
                      feedbackType === 'falha'
                        ? 'Descreva a instabilidade, botão que não respondeu ou erro visual...'
                        : 'Conte como o sistema de chamados pode ficar mais prático para seu setor...'
                    }
                    className={[
                      'w-full resize-y rounded-xl border p-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500',
                      isDark
                        ? 'border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-500',
                    ].join(' ')}
                  />

                  <p className={['mt-1 text-right text-[10px]', mutedText].join(' ')}>
                    {feedbackText.length}/3000 caracteres
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className={['text-[11px]', mutedText].join(' ')}>
                    Enviado com sua identificação
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={closeFeedback}
                      className={[
                        'rounded-lg px-3 py-2 text-xs font-medium',
                        isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-900',
                      ].join(' ')}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={!feedbackText.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00A896] to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Enviar</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}