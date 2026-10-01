import { ReactNode, useState } from 'react';
import Logo from '@/components/Logo';
import { 
  Home, 
  ClipboardList, 
  PlusCircle, 
  User, 
  LogOut, 
  Bug, 
  CheckCircle2, 
  Clock, 
  Headphones, 
  X, 
  Send 
} from 'lucide-react';
import { Ticket } from '@/types';

export type Page = 'inicio' | 'meus-chamados' | 'abrir-chamado' | 'perfil';

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  userName: string;
  userRole?: string;
  tickets?: Ticket[];
}

export default function Sidebar({
  current,
  onNavigate,
  onLogout,
  userName,
  userRole = 'Servidor',
  tickets = [],
}: SidebarProps) {
  // Chamados do usuário
  const userTickets = tickets.filter(
    (t) => t.requesterName.toLowerCase() === userName.toLowerCase()
  );
  const activeCount = userTickets.filter((t) => t.status !== 'fechado' && t.status !== 'resolvido').length;
  const resolvedCount = userTickets.filter((t) => t.status === 'resolvido').length;

  // Estado do modal de Reportar Falha / Sugestão
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugCategory, setBugCategory] = useState<'bug' | 'sugestao'>('bug');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSent, setBugSent] = useState(false);

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDescription.trim()) return;

    // Simulação de envio com confirmação imediata
    setBugSent(true);
    setTimeout(() => {
      setBugSent(false);
      setBugDescription('');
      setIsBugModalOpen(false);
    }, 1800);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#0b1624] border-r border-white/5 text-slate-200">
        {/* Topo / Logo */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <Logo variant="full" light className="h-9" />
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Portal do Usuário Conectado" />
        </div>

        {/* Botão de Abertura em Destaque */}
        <div className="px-3 pt-4">
          <button
            onClick={() => onNavigate('abrir-chamado')}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all shadow-md ${
              current === 'abrir-chamado'
                ? 'bg-gradient-to-r from-[#00A896] to-cyan-500 text-white shadow-teal-500/20'
                : 'bg-[#00A896] text-white hover:bg-[#008f80] shadow-teal-500/10'
            }`}
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            ABRIR NOVO CHAMADO
          </button>
        </div>

        {/* Navegação Principal */}
        <nav className="mt-3 flex flex-col gap-1 px-3">
          <button
            onClick={() => onNavigate('inicio')}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
              current === 'inicio'
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
            onClick={() => onNavigate('meus-chamados')}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
              current === 'meus-chamados'
                ? 'bg-white/10 text-white font-semibold shadow-inner'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4 shrink-0 text-teal-400" />
              Meus Chamados
            </div>
            {activeCount > 0 && (
              <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('perfil')}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
              current === 'perfil'
                ? 'bg-white/10 text-white font-semibold shadow-inner'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 shrink-0 text-cyan-400" />
              Meu Perfil
            </div>
          </button>
        </nav>

        {/* ÁREA CENTRAL POVOADA: Status do Solicitante & Suporte */}
        <div className="mt-3 flex-1 overflow-y-auto px-3 py-2 space-y-3.5 border-t border-white/5 scrollbar-thin">
          {/* Card 1: Resumo dos Meus Chamados */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-400" />
                Suas Solicitações
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                <span className="block text-base font-bold text-white">{activeCount}</span>
                <span className="text-[10px] text-slate-400">Em Aberto</span>
              </div>
              <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                <span className="block text-base font-bold text-emerald-400">{resolvedCount}</span>
                <span className="text-[10px] text-slate-400">Resolvidos</span>
              </div>
            </div>
          </div>

          {/* Card 2: Reportar Falha ou Sugestão no STI */}
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 hover:bg-white/[0.05] transition-all">
            <div className="flex items-start gap-2.5">
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-1.5 text-amber-400">
                <Bug className="h-4 w-4 shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200">Notou um problema no STI?</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  Envie um relatório direto aos desenvolvedores do sistema.
                </p>
                <button
                  type="button"
                  onClick={() => setIsBugModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Reportar falha ou ideia &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Bloco 3: Contato Rápido Suporte Local */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-cyan-400" />
              Ramal Suporte STI
            </span>
            <span className="font-mono text-cyan-300 font-semibold">1234 / 2030</span>
          </div>
        </div>

        {/* Rodapé / Usuário */}
        <div className="border-t border-white/5 bg-black/20 p-3">
          <button
            onClick={() => onNavigate('perfil')}
            className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
              current === 'perfil' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A896] to-cyan-500 text-sm font-bold text-white shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{userName}</p>
              <p className="truncate text-[10px] text-slate-400">{userRole}</p>
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

      {/* Modal Interativo de Reportar Falha / Sugestão */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Bug className="h-4 w-4 text-amber-500" />
                Reportar ao time de TI do STI
              </div>
              <button
                onClick={() => setIsBugModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {bugSent ? (
              <div className="py-8 text-center animate-fade-in">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Relatório enviado com sucesso!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Obrigado por ajudar a aprimorar o STI. O time técnico já recebeu seu feedback.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    O que você gostaria de enviar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBugCategory('bug')}
                      className={`rounded-xl border py-2 text-xs font-medium transition-all ${
                        bugCategory === 'bug'
                          ? 'border-rose-500 bg-rose-50 font-bold text-rose-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🐞 Problema / Erro
                    </button>
                    <button
                      type="button"
                      onClick={() => setBugCategory('sugestao')}
                      className={`rounded-xl border py-2 text-xs font-medium transition-all ${
                        bugCategory === 'sugestao'
                          ? 'border-teal-500 bg-teal-50 font-bold text-teal-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      💡 Sugestão de Melhoria
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição detalhada
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder={
                      bugCategory === 'bug'
                        ? 'Explique o que aconteceu, botão que não funcionou ou comportamento inesperado...'
                        : 'Qual ideia ou ajuste tornaria o sistema mais prático para o seu trabalho?'
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBugModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Enviar Relatório
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="ml-64 min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-10 py-10 animate-fade-in">{children}</div>
    </main>
  );
}