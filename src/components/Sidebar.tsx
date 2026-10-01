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
  Check
} from 'lucide-react';
import Logo from '@/components/Logo';
import { Ticket, User as UserType, UserRole } from '@/types';

export type Page = 'inicio' | 'meus-chamados' | 'abrir-chamado' | 'perfil';

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="ml-64 flex-1 overflow-y-auto bg-slate-100 p-6 lg:p-8 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'falha' | 'ideia'>('falha');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('sti_feedbacks') || '[]');
      const newEntry = {
        id: `FB-${Date.now().toString().slice(-4)}`,
        type: feedbackType,
        title: feedbackType === 'falha' ? 'Falha reportada por servidor' : 'Sugestão de melhoria do sistema',
        description: feedbackText.trim(),
        authorName: displayName,
        authorDepartment: activeUser?.department || 'Órgão',
        authorRole: 'Servidor',
        createdAt: new Date().toISOString(),
        status: 'novo',
        priority: feedbackType === 'falha' ? 'alta' : 'media'
      };
      localStorage.setItem('sti_feedbacks', JSON.stringify([newEntry, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setIsFeedbackOpen(false);
    }, 1800);
  };

  const myTickets = tickets.filter((t) => 
    t.requesterName === userName || 
    t.requesterName === activeUser?.name ||
    (t as any).requesterEmail === activeUser?.email
  );
  const myOpenCount = myTickets.filter((t) => t.status === 'aberto' || t.status === 'em_andamento' || t.status === 'aguardando').length;
  const myResolvedCount = myTickets.filter((t) => t.status === 'resolvido' || t.status === 'fechado').length;

  const displayName = activeUser?.name || userName || 'Servidor';
  const displayRole = activeUser?.department || userRole || 'Colaborador';

  const canSwitchToGestor = activeUser?.roles?.includes('gestor') || 
    (activeUser as any)?.userRole === 'gestor' ||
    displayName.includes('Diretor') || 
    displayName.includes('Roberto') ||
    displayName.includes('Wanderson');

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#0b1624] border-r border-white/5 text-slate-200">
        <div className="flex h-16 items-center px-6 border-b border-white/5">
          <Logo variant="full" light className="h-8" />
        </div>

        {canSwitchToGestor && onSwitchRole && (
          <div className="px-3 pt-3">
            <button
              onClick={() => onSwitchRole('gestor')}
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

        <div className="px-3 pt-3">
          <button
            onClick={() => onNavigate('abrir-chamado')}
            className={
              current === 'abrir-chamado'
                ? 'flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all shadow-md bg-gradient-to-r from-[#00A896] to-cyan-500 text-white shadow-teal-500/20'
                : 'flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all shadow-md bg-[#00A896] hover:bg-[#009181] text-white shadow-teal-500/10'
            }
          >
            <PlusCircle className="h-4 w-4" />
            <span>ABRIR NOVO CHAMADO</span>
          </button>
        </div>

        <nav className="mt-3 flex flex-col gap-1 px-3">
          <button
            onClick={() => onNavigate('inicio')}
            className={
              current === 'inicio'
                ? 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all bg-white/10 text-white font-semibold shadow-inner'
                : 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all text-slate-400 hover:bg-white/5 hover:text-white'
            }
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Início</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('meus-chamados')}
            className={
              current === 'meus-chamados'
                ? 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all bg-white/10 text-white font-semibold shadow-inner'
                : 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all text-slate-400 hover:bg-white/5 hover:text-white'
            }
          >
            <div className="flex items-center gap-3">
              <TicketCheck className="h-4 w-4 shrink-0" />
              <span>Meus Chamados</span>
            </div>
            {myOpenCount > 0 && (
              <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                {myOpenCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('perfil')}
            className={
              current === 'perfil'
                ? 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all bg-white/10 text-white font-semibold shadow-inner'
                : 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all text-slate-400 hover:bg-white/5 hover:text-white'
            }
          >
            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>Meu Perfil</span>
            </div>
          </button>
        </nav>

        <div className="mx-3 mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Suas Solicitações
          </span>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-black/20 p-2 border border-white/5">
              <span className="block text-base font-bold text-white">{myOpenCount}</span>
              <span className="text-[10px] text-slate-400">Em Aberto</span>
            </div>
            <div className="rounded-lg bg-black/20 p-2 border border-white/5">
              <span className="block text-base font-bold text-emerald-400">{myResolvedCount}</span>
              <span className="text-[10px] text-slate-400">Resolvidos</span>
            </div>
          </div>
        </div>

        <div className="mx-3 mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400 shrink-0">
              <Bug className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">Notou um problema no STI?</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Envie um relatório direto aos desenvolvedores do sistema.
              </p>
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="mt-1.5 inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 text-[11px] cursor-pointer"
              >
                Reportar falha ou ideia &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="mx-3 mt-2 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-[11px] text-slate-400 border border-white/5">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ramal Suporte STI</span>
          </div>
          <span className="font-mono font-semibold text-slate-300">1234 / 2030</span>
        </div>

        <div className="flex-1" />

        <div className="border-t border-white/5 bg-black/20 p-3">
          <button
            onClick={() => onNavigate('perfil')}
            title="Clique para acessar seu perfil"
            className={
              current === 'perfil'
                ? 'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors bg-white/10 ring-1 ring-cyan-500/40'
                : 'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5'
            }
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 text-sm font-bold text-white shadow-sm">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{displayName}</p>
              <p className="truncate text-[10px] text-cyan-300/80">{displayRole}</p>
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

      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1624] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400">
                  <Bug className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Canal dos Desenvolvedores</h3>
                  <p className="text-xs text-slate-400">Feedback interno de usabilidade e melhorias do STI</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {feedbackSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Relatório enviado aos devs!</h4>
                <p className="text-xs text-slate-400">Obrigado por ajudar a aprimorar a plataforma do órgão.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="mt-4 space-y-4">
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('falha')}
                    className={
                      feedbackType === 'falha'
                        ? 'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-slate-400 hover:text-white'
                    }
                  >
                    Reportar Problema
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('ideia')}
                    className={
                      feedbackType === 'ideia'
                        ? 'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-slate-400 hover:text-white'
                    }
                  >
                    Sugerir Ideia
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {feedbackType === 'falha' ? 'O que aconteceu de errado?' : 'Qual a sua sugestão para o STI?'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={
                      feedbackType === 'falha'
                        ? 'Descreva a instabilidade, botão que não respondeu ou erro visual...'
                        : 'Conte como o sistema de chamados pode ficar mais prático para seu setor...'
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">Enviado com sua matrícula</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackOpen(false)}
                      className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00A896] to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:brightness-110 cursor-pointer"
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