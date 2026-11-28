import { Ticket } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelative } from '@/data';
import { PlusCircle, ClipboardList, ArrowRight, MessagesSquare, Lightbulb, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useState, type FormEvent } from 'react';
import { Page } from '@/components/Sidebar';
import { useTechTheme } from '@/components/tech/techTheme';
import { criarFeedback } from '@/services/chamadoService';

interface DashboardProps {
  tickets: Ticket[];
  onNavigate: (p: Page) => void;
  onOpenTicket: (id: string) => void;
  userName: string;
  userEmail?: string;
}

export default function Dashboard({
  tickets,
  onNavigate,
  onOpenTicket,
  userName,
  userEmail,
}: DashboardProps) {
  const recent = tickets.slice(0, 4);
  const { isDark } = useTechTheme();

  const [feedbackType, setFeedbackType] = useState<
    'falha' | 'sugestao' | null
  >(null);

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);

  const openFeedback = (type: 'falha' | 'sugestao') => {
    setFeedbackType(type);
    setFeedbackMessage('');
    setFeedbackSuccess('');
    setFeedbackError('');
  };

  const closeFeedback = () => {
    setFeedbackType(null);
    setFeedbackMessage('');
  };

  const handleSubmitFeedback = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const message = feedbackMessage.trim();

    if (!message || !feedbackType || feedbackSending) return;

    setFeedbackSending(true);
    setFeedbackError('');

    try {
      await criarFeedback({
        usuarioEmail: userEmail || userName || 'usuario@sti.chamados.com',
        tipo: feedbackType === 'falha' ? 'Falha' : 'Sugestão',
        comentario: message,
        nota: feedbackType === 'falha' ? 2 : 5,
      });

      setFeedbackSuccess(
        feedbackType === 'falha'
          ? 'Problema enviado com sucesso à equipe técnica!'
          : 'Sugestão enviada com sucesso!'
      );

      closeFeedback();
    } catch (err) {
      console.error('[Dashboard] Erro ao enviar feedback:', err);
      setFeedbackError(
        'Não foi possível enviar seu feedback. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setFeedbackSending(false);
    }
  };
  const colors = {
    heading: isDark ? 'text-slate-100' : 'text-sti-navy-800',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    card: isDark
      ? 'border-slate-700 bg-slate-900'
      : 'border-slate-200 bg-white',
    divider: isDark ? 'border-slate-800' : 'border-slate-100',
    hover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
    iconBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
    iconText: isDark ? 'text-slate-300' : 'text-slate-400',
    arrow: isDark ? 'text-slate-500' : 'text-slate-300',
  };

  return (
    <div>
      {/* SaudaÃ§Ã£o */}
      <div className="mb-8">
        <p className={`text-sm font-medium ${colors.muted}`}>
          Olá, {userName || 'Usuário'}
        </p>

        <h1 className={`mt-1 text-2xl font-bold ${colors.heading}`}>
          Como podemos ajudar?
        </h1>
      </div>

      {/* Ações principais */}
      <div className="mb-12 grid gap-5 sm:grid-cols-2">
        <button
          onClick={() => onNavigate('abrir-chamado')}
          className={`group flex items-center gap-5 rounded-2xl border p-6 text-left shadow-sti transition-all hover:border-sti-teal-400 hover:shadow-sti-md ${colors.card}`}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sti-teal-50 text-sti-teal-600 transition-colors group-hover:bg-sti-teal-500 group-hover:text-white">
            <PlusCircle className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <h2 className={`text-lg font-semibold ${colors.heading}`}>
              Abrir um chamado
            </h2>

            <p className={`mt-0.5 text-sm ${colors.muted}`}>
              Conte o que está acontecendo e a TI vai ajudar você.
            </p>
          </div>

          <ArrowRight
            className={`h-5 w-5 transition-all group-hover:translate-x-1 group-hover:text-sti-teal-400 ${colors.arrow}`}
          />
        </button>

        <button
          onClick={() => onNavigate('meus-chamados')}
          className={`group flex items-center gap-5 rounded-2xl border p-6 text-left shadow-sti transition-all hover:border-sti-navy-400 hover:shadow-sti-md ${colors.card}`}
        >
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-sti-navy-800 group-hover:text-white ${isDark
              ? 'bg-slate-800 text-slate-200'
              : 'bg-sti-navy-50 text-sti-navy-600'
              }`}
          >
            <ClipboardList className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <h2 className={`text-lg font-semibold ${colors.heading}`}>
              Meus chamados
            </h2>

            <p className={`mt-0.5 text-sm ${colors.muted}`}>
              Veja como estão seus pedidos de ajuda.
            </p>
          </div>

          <ArrowRight
            className={`h-5 w-5 transition-all group-hover:translate-x-1 group-hover:text-sti-navy-400 ${colors.arrow}`}
          />
        </button>
      </div>


      {/* Ações rápidas de feedback */}
      <div className="mb-12 grid gap-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => openFeedback('falha')}

          className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${colors.card} hover:border-red-400`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${colors.heading}`}>
              Reportar Falha
            </h3>
            <p className={`text-xs ${colors.muted}`}>
              Envie um reporte direto aos desenvolvedores.
            </p>
          </div>

          <ArrowRight className={`h-4 w-4 ${colors.arrow}`} />
        </button>

        <button
          type="button"
          onClick={() => openFeedback('sugestao')}

          className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${colors.card} hover:border-amber-400`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Lightbulb className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${colors.heading}`}>
              Enviar Sugestão
            </h3>
            <p className={`text-xs ${colors.muted}`}>
              Compartilhe ideias de aprimoramento do sistema.
            </p>
          </div>

          <ArrowRight className={`h-4 w-4 ${colors.arrow}`} />
        </button>
      </div>

      {feedbackSuccess && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {feedbackSuccess}
        </div>
      )}


      {/* Modal do Canal dos Desenvolvedores */}
      {feedbackType && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={closeFeedback}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            className={`w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl ${isDark
                ? 'border-slate-700 bg-[#0b1727] text-slate-100'
                : 'border-slate-200 bg-white text-slate-800'
              }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                    {feedbackType === 'falha' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <Lightbulb className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <h2
                      id="feedback-modal-title"
                      className="text-base font-bold"
                    >
                      Canal dos Desenvolvedores
                    </h2>
                    <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                    >
                      Feedback interno de usabilidade e melhorias do STI
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeFeedback}
                  aria-label="Fechar modal"
                  className={`rounded-lg p-1.5 transition ${isDark
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>

              <div
                className={`mb-5 grid grid-cols-2 rounded-xl border p-1 ${isDark
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-slate-200 bg-slate-50'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackType('falha');
                    setFeedbackMessage('');
                  }}
                  className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition ${feedbackType === 'falha'
                      ? 'border border-amber-300 bg-amber-100 text-amber-800'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Reportar Problema
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFeedbackType('sugestao');
                    setFeedbackMessage('');
                  }}
                  className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition ${feedbackType === 'sugestao'
                      ? 'border border-teal-300 bg-teal-100 text-teal-800'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Sugerir Ideia
                </button>
              </div>

              {feedbackError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                  {feedbackError}
                </div>
              )}

              <form onSubmit={handleSubmitFeedback}>
                <label
                  htmlFor="feedback-message"
                  className={`mb-2 block text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                >
                  {feedbackType === 'falha'
                    ? 'O que aconteceu de errado?'
                    : 'Qual melhoria você gostaria de sugerir?'}
                </label>

                <textarea
                  id="feedback-message"
                  value={feedbackMessage}
                  onChange={(event) =>
                    setFeedbackMessage(event.target.value.slice(0, 3000))
                  }
                  maxLength={3000}
                  required
                  autoFocus
                  rows={4}
                  placeholder={
                    feedbackType === 'falha'
                      ? 'Descreva a instabilidade, botÃ£o que nÃ£o respondeu ou erro visual...'
                      : 'Conte sua ideia e como ela poderia melhorar o STI...'
                  }
                  className={`w-full resize-y rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-teal-500/30 ${isDark
                      ? 'border-slate-700 bg-[#101e30] text-slate-100 placeholder:text-slate-500 focus:border-teal-400'
                      : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-teal-500'
                    }`}
                />

                <div
                  className={`mt-1 text-right text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                >
                  {feedbackMessage.length}/3000 caracteres
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <p
                    className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                  >
                    Enviado com sua identificação
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeFeedback}
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark
                          ? 'text-slate-400 hover:bg-slate-800'
                          : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={!feedbackMessage.trim() || feedbackSending}
                      className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {feedbackSending ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Chamados recentes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-base font-semibold ${colors.heading}`}>
            Chamados recentes
          </h3>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('meus-chamados')}
          >
            Ver todos
          </Button>
        </div>

        {recent.length === 0 ? (
          <div
            className={`rounded-xl border py-12 text-center ${colors.card}`}
          >
            <p className={`text-sm ${colors.muted}`}>
              VocÃª ainda nÃ£o abriu nenhum chamado.
            </p>
          </div>
        ) : (
          <div
            className={`overflow-hidden rounded-xl border shadow-sti ${colors.card}`}
          >
            {recent.map((ticket, index) => (
              <button
                key={ticket.id}
                onClick={() => onOpenTicket(ticket.id)}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${colors.hover} ${index > 0 ? `border-t ${colors.divider}` : ''
                  }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg} ${colors.iconText}`}
                >
                  <MessagesSquare className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${colors.heading}`}
                  >
                    {ticket.title}
                  </p>

                  <p className={`mt-0.5 text-xs ${colors.muted}`}>
                    {ticket.protocol} Â· atualizado{' '}
                    {formatRelative(ticket.updatedAt)}
                  </p>
                </div>

                <StatusBadge status={ticket.status} />

                <ArrowRight
                  className={`h-4 w-4 shrink-0 ${colors.arrow}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
