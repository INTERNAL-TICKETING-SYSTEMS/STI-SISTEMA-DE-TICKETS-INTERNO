import {
  dataAuditService,
  AuditEventResponse,
  IntegrityCheckResponse,
} from '../../services/dataAuditService';
import { CloseTicketModal } from './CloseTicketModal';
import React, { useEffect, useState } from 'react';
import { Ticket, TicketStatus, User } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { Textarea, Select } from '@/components/ui/Field';
import { formatDate, formatDateShort } from '@/data';

import { TechPage } from '@/components/tech/TechSidebar';
import { useTechTheme } from '@/components/tech/techTheme';

import {
  ArrowLeft,
  Send,
  User as UserIcon,
  Headphones,
  ArrowRightLeft,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Monitor,
  AlertTriangle,
  FileText,
  Paperclip,
  Tag,
  Wrench,
  CheckCircle2,
  Star,
  StickyNote,
  MessageCircle,
  X,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

interface TechTicketDetailProps {
  ticket: Ticket;
  onNavigate: (p: TechPage) => void;
  onSendMessage: (id: string, message: string) => void;
  onRequestInfo: (id: string, question: string) => void;
  onChangeStatus: (id: string, status: TicketStatus) => void;
  onResolve: (
    id: string,
    solution: string,
    assetTag?: string,
    replacedParts?: string
  ) => void;
  onAddInternalNote: (id: string, note: string) => void;
  techName: string;
  technicians?: User[];
  onAssign?: (id: string, assigneeName: string) => void;
}

type Tab = 'interactions' | 'solution' | 'notes';

export default function TechTicketDetail({
  ticket,
  onNavigate,
  onSendMessage,
  onRequestInfo,
  onChangeStatus,
  onResolve,
  onAddInternalNote,
  techName,
  technicians = [],
  onAssign,
}: TechTicketDetailProps) {
  const { isDark } = useTechTheme();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [forensicEvent, setForensicEvent] =
    useState<AuditEventResponse | null>(null);
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [integrityStatus, setIntegrityStatus] =
    useState<IntegrityCheckResponse | null>(null);

  const [selectedTransferTech, setSelectedTransferTech] = useState('');
  const [showTransferSelect, setShowTransferSelect] = useState(false);
  const [tab, setTab] = useState<Tab>('interactions');
  const [message, setMessage] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [showRequest, setShowRequest] = useState(false);
  const [statusSelect, setStatusSelect] =
    useState<TicketStatus>(ticket.status);
  const [solution, setSolution] = useState(ticket.solution ?? '');
  const [assetTag, setAssetTag] = useState(ticket.assetTag ?? '');
  const [replacedParts, setReplacedParts] = useState(
    ticket.replacedParts ?? ''
  );
  const [note, setNote] = useState('');

  // Anexo atualmente aberto em tela cheia
  const [selectedAttachment, setSelectedAttachment] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const protocolo = ticket.protocol || ticket.id;
        const events = await dataAuditService.buscarPorEntidade(
          'CHAMADOS',
          protocolo
        );

        if (events && events.length > 0) {
          setForensicEvent(events[0]);
        }
      } catch (error) {
        console.error(
          '[DATA-AUDIT] Falha ao buscar histórico do chamado:',
          error
        );
      }
    };

    if (ticket.status === 'resolvido') {
      fetchAudit();
    } else {
      setForensicEvent(null);
      setIntegrityStatus(null);
    }
  }, [ticket.status, ticket.protocol, ticket.id]);

  const handleCheckForensic = async () => {
    if (!forensicEvent) return;

    try {
      setCheckingIntegrity(true);

      const result =
        await dataAuditService.verificarIntegridade(
          forensicEvent.id
        );

      setIntegrityStatus(result);
    } catch (error) {
      console.error(
        '[DATA-AUDIT] Falha ao verificar integridade:',
        error
      );
    } finally {
      setCheckingIntegrity(false);
    }
  };

  const handleConfirmClose = async (
    parecerTecnico: string
  ) => {
    onResolve(ticket.id, parecerTecnico);
    setIsCloseModalOpen(false);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    onSendMessage(ticket.id, message.trim());
    setMessage('');
  };

  const handleRequest = () => {
    if (!requestMsg.trim()) return;

    onRequestInfo(ticket.id, requestMsg.trim());
    setRequestMsg('');
    setShowRequest(false);
  };

  const handleStatus = () => {
    if (statusSelect !== ticket.status) {
      onChangeStatus(ticket.id, statusSelect);
    }
  };

  const handleNote = () => {
    if (!note.trim()) return;

    onAddInternalNote(ticket.id, note.trim());
    setNote('');
  };

  const canChangeStatus = ticket.status !== 'fechado';

  const colors = {
    card: isDark
      ? 'border-slate-700/80 bg-[#0b1624]'
      : 'border-slate-200 bg-white',

    cardSecondary: isDark
      ? 'border-slate-700 bg-slate-900/60'
      : 'border-slate-200 bg-slate-50',

    textPrimary: isDark
      ? 'text-slate-100'
      : 'text-slate-900',

    textSecondary: isDark
      ? 'text-slate-300'
      : 'text-slate-700',

    textMuted: isDark
      ? 'text-slate-400'
      : 'text-slate-500',

    textFaint: isDark
      ? 'text-slate-500'
      : 'text-slate-400',

    border: isDark
      ? 'border-slate-700/80'
      : 'border-slate-200',

    borderSoft: isDark
      ? 'border-slate-700/60'
      : 'border-slate-100',

    input: isDark
      ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',

    inner: isDark
      ? 'bg-slate-800/70'
      : 'bg-slate-50',

    hover: isDark
      ? 'hover:bg-slate-800'
      : 'hover:bg-slate-50',
  };

  return (
    <>
      <div className={colors.textPrimary}>
        {/* Voltar */}
        <button
          type="button"
          onClick={() => onNavigate('tech-chamados')}
          className={`mb-6 inline-flex items-center gap-1.5 text-sm font-medium ${colors.textMuted} transition-colors ${isDark
              ? 'hover:text-teal-300'
              : 'hover:text-teal-700'
            }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para chamados
        </button>

        {/* Header */}
        <div
          className={`mb-6 rounded-2xl border p-6 shadow-sti ${colors.card}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-medium ${colors.textFaint}`}
              >
                {ticket.protocol}
              </p>

              <h1
                className={`mt-1 text-xl font-bold ${colors.textPrimary}`}
              >
                {ticket.title}
              </h1>

              <div
                className={`mt-3 flex flex-wrap items-center gap-4 text-xs ${colors.textMuted}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Aberto em {formatDate(ticket.createdAt)}
                </span>

                {ticket.attendanceStartedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Headphones className="h-3.5 w-3.5" />
                    Atendimento iniciado em{' '}
                    {formatDate(ticket.attendanceStartedAt)}
                  </span>
                )}
              </div>
            </div>

            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div
              className={`mb-4 flex gap-1 rounded-xl border p-1 shadow-sti ${colors.card}`}
            >
              <TabButton
                active={tab === 'interactions'}
                onClick={() => setTab('interactions')}
                icon={MessageCircle}
                label="Interações"
                isDark={isDark}
              />

              <TabButton
                active={tab === 'solution'}
                onClick={() => setTab('solution')}
                icon={CheckCircle2}
                label="Solução"
                isDark={isDark}
              />

              <TabButton
                active={tab === 'notes'}
                onClick={() => setTab('notes')}
                icon={StickyNote}
                label="Observações internas"
                isDark={isDark}
              />
            </div>

            {/* INTERAÇÕES */}
            {tab === 'interactions' && (
              <div
                className={`rounded-2xl border p-6 shadow-sti animate-fade-in ${colors.card}`}
              >
                <h2
                  className={`mb-5 text-sm font-semibold ${colors.textPrimary}`}
                >
                  Linha do tempo
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Solicitação original */}
                  <div className="flex gap-3">
                    <Avatar
                      author="usuario"
                      name={ticket.requesterName}
                    />

                    <div className="flex-1">
                      <div
                        className={`rounded-xl rounded-tl-sm px-4 py-3 ${colors.inner}`}
                      >
                        <p
                          className={`text-sm leading-relaxed ${colors.textSecondary}`}
                        >
                          {ticket.description}
                        </p>
                      </div>

                      <p
                        className={`mt-1 text-xs ${colors.textFaint}`}
                      >
                        {ticket.requesterName} — Solicitante ·{' '}
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Atualizações */}
                  {ticket.updates.map((u) => (
                    <div
                      key={u.id}
                      className={`flex gap-3 ${u.author === 'tecnico'
                          ? 'flex-row-reverse'
                          : ''
                        }`}
                    >
                      <Avatar
                        author={u.author}
                        name={u.authorName}
                      />

                      <div
                        className={`flex-1 ${u.author === 'tecnico'
                            ? 'flex flex-col items-end'
                            : ''
                          }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-3 ${u.author === 'tecnico'
                              ? 'rounded-tr-sm bg-sti-navy-800 text-white'
                              : `rounded-tl-sm ${colors.inner}`
                            }`}
                        >
                          <p
                            className={`text-sm leading-relaxed ${u.author === 'tecnico'
                                ? 'text-slate-100'
                                : colors.textSecondary
                              }`}
                          >
                            {u.message}
                          </p>
                        </div>

                        <p
                          className={`mt-1 text-xs ${colors.textFaint}`}
                        >
                          {u.authorName} —{' '}
                          {u.author === 'tecnico'
                            ? 'Técnico'
                            : 'Solicitante'}{' '}
                          · {formatDate(u.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Caixa de resposta */}
                {ticket.status !== 'fechado' && (
                  <div
                    className={`mt-6 border-t pt-5 ${colors.borderSoft}`}
                  >
                    {showRequest ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                        <label
                          className={`mb-2 block text-sm font-medium ${isDark
                              ? 'text-amber-100'
                              : 'text-amber-900'
                            }`}
                        >
                          Solicitar informações ao usuário
                        </label>

                        <Textarea
                          value={requestMsg}
                          onChange={(e) =>
                            setRequestMsg(e.target.value)
                          }
                          placeholder="Escreva a pergunta para o solicitante…"
                          rows={2}
                        />

                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setShowRequest(false)
                            }
                          >
                            Cancelar
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleRequest}
                            disabled={!requestMsg.trim()}
                          >
                            <Send className="h-3.5 w-3.5" />
                            Enviar pergunta
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <label
                          className={`mb-2 block text-sm font-medium ${colors.textPrimary}`}
                        >
                          Escreva uma mensagem
                        </label>

                        <Textarea
                          value={message}
                          onChange={(e) =>
                            setMessage(e.target.value)
                          }
                          placeholder="Escreva aqui sua resposta…"
                          rows={3}
                        />

                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setShowRequest(true)
                            }
                          >
                            Solicitar informações
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleSend}
                            disabled={!message.trim()}
                          >
                            <Send className="h-3.5 w-3.5" />
                            Enviar mensagem
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SOLUÇÃO */}
            {tab === 'solution' && (
              <div
                className={`rounded-2xl border p-6 shadow-sti animate-fade-in ${colors.card}`}
              >
                <h2
                  className={`mb-2 text-sm font-semibold ${colors.textPrimary}`}
                >
                  Registrar solução
                </h2>

                <p
                  className={`mb-5 text-sm ${colors.textMuted}`}
                >
                  Descreva como o problema foi solucionado.
                </p>

                {ticket.solution ? (
                  <div className="mb-5 space-y-4">
                    {/* Parecer */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                      {/* Avaliação */}
                      {ticket.rating && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-100">
                              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                              Avaliação do Solicitante
                            </span>

                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`h-4 w-4 ${s <= (ticket.rating ?? 0)
                                      ? 'fill-amber-400 text-amber-400'
                                      : isDark
                                        ? 'text-slate-600'
                                        : 'text-slate-300'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>

                          {ticket.ratingComment && (
                            <p
                              className={`rounded-lg border p-2.5 text-xs italic ${isDark
                                  ? 'border-amber-500/20 bg-slate-900/40 text-slate-300'
                                  : 'border-amber-100 bg-white/80 text-slate-700'
                                }`}
                            >
                              "{ticket.ratingComment}"
                            </p>
                          )}
                        </div>
                      )}

                      <div
                        className={`mb-2 flex items-center gap-2 text-sm font-semibold ${isDark
                            ? 'text-emerald-300'
                            : 'text-emerald-800'
                          }`}
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Parecer Técnico Registrado
                      </div>

                      <p
                        className={`whitespace-pre-wrap text-sm leading-relaxed ${colors.textSecondary}`}
                      >
                        {ticket.solution}
                      </p>
                    </div>

                    {/* Patrimônio / peças */}
                    {(ticket.assetTag ||
                      ticket.replacedParts) && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {ticket.assetTag && (
                            <div
                              className={`rounded-xl border p-3.5 ${colors.cardSecondary}`}
                            >
                              <span
                                className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${colors.textMuted}`}
                              >
                                <Tag className="h-3.5 w-3.5 text-sti-teal-600" />
                                Patrimônio / Tombamento
                              </span>

                              <span
                                className={`font-mono text-sm font-bold ${colors.textPrimary}`}
                              >
                                {ticket.assetTag}
                              </span>
                            </div>
                          )}

                          {ticket.replacedParts && (
                            <div
                              className={`rounded-xl border p-3.5 ${colors.cardSecondary}`}
                            >
                              <span
                                className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${colors.textMuted}`}
                              >
                                <Wrench className="h-3.5 w-3.5 text-amber-600" />
                                Peças / Insumos Utilizados
                              </span>

                              <span
                                className={`text-sm font-medium ${colors.textSecondary}`}
                              >
                                {ticket.replacedParts}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="mb-5 space-y-4">
                    <div>
                      <label
                        className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${colors.textMuted}`}
                      >
                        Descrição Técnica da Solução *
                      </label>

                      <Textarea
                        value={solution}
                        onChange={(e) =>
                          setSolution(e.target.value)
                        }
                        placeholder="Registre: diagnóstico técnico realizado, procedimento aplicado e validação funcional..."
                        rows={5}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          className={`mb-1.5 flex items-center gap-1.5 text-xs font-semibold ${colors.textSecondary}`}
                        >
                          <Tag
                            className={`h-3.5 w-3.5 ${colors.textFaint}`}
                          />
                          Nº do Patrimônio / Tombamento (Opcional)
                        </label>

                        <input
                          type="text"
                          value={assetTag}
                          onChange={(e) =>
                            setAssetTag(e.target.value)
                          }
                          placeholder="Ex: PAT-2024-0891 ou Placa 10423"
                          className={`w-full rounded-xl border px-3 py-2 text-sm focus:border-sti-teal-500 focus:outline-none focus:ring-1 focus:ring-sti-teal-500 ${colors.input}`}
                        />
                      </div>

                      <div>
                        <label
                          className={`mb-1.5 flex items-center gap-1.5 text-xs font-semibold ${colors.textSecondary}`}
                        >
                          <Wrench
                            className={`h-3.5 w-3.5 ${colors.textFaint}`}
                          />
                          Peças ou Insumos Trocados (Opcional)
                        </label>

                        <input
                          type="text"
                          value={replacedParts}
                          onChange={(e) =>
                            setReplacedParts(e.target.value)
                          }
                          placeholder="Ex: Cabo de rede Cat6 2m, SSD 256GB, Fonte ATX"
                          className={`w-full rounded-xl border px-3 py-2 text-sm focus:border-sti-teal-500 focus:outline-none focus:ring-1 focus:ring-sti-teal-500 ${colors.input}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Concluir chamado */}
                {!ticket.solution &&
                  ticket.status !== 'fechado' && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() =>
                          setIsCloseModalOpen(true)
                        }
                        className="bg-emerald-600 font-medium text-white hover:bg-emerald-500"
                      >
                        Concluir Chamado (Parecer Técnico)
                      </Button>
                    </div>
                  )}

                {/* DATA-AUDIT */}
                {ticket.status === 'resolvido' && (
                  <div
                    className={`mt-6 rounded-xl border p-4 shadow-lg ${isDark
                        ? 'border-slate-700 bg-slate-900/80'
                        : 'border-slate-200 bg-slate-50'
                      }`}
                  >
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg border p-2.5 ${isDark
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-600'
                            }`}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-sm font-bold tracking-wide ${colors.textPrimary}`}
                            >
                              Trilha de Auditoria Forense
                              (SHA-256)
                            </h4>

                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${isDark
                                  ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                                  : 'border border-blue-200 bg-blue-50 text-blue-700'
                                }`}
                            >
                              DATA-AUDIT Microservice
                            </span>
                          </div>

                          <p
                            className={`mt-0.5 font-mono text-xs ${colors.textMuted}`}
                          >
                            {forensicEvent?.hashIntegridade
                              ? `Hash: ${forensicEvent.hashIntegridade.slice(
                                0,
                                32
                              )}...`
                              : 'Aguardando sincronização de hash com o subsistema forense...'}
                          </p>
                        </div>
                      </div>

                      {forensicEvent && (
                        <div className="flex flex-wrap items-center gap-3">
                          {integrityStatus && (
                            <span
                              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${integrityStatus.statusIntegridade ===
                                  'VALIDO'
                                  ? isDark
                                    ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : isDark
                                    ? 'border-red-500/30 bg-red-500/20 text-red-300'
                                    : 'border-red-200 bg-red-50 text-red-700'
                                }`}
                            >
                              {integrityStatus.statusIntegridade ===
                                'VALIDO'
                                ? '✅ Integridade Verificada'
                                : '❌ Adulteração Detectada'}
                            </span>
                          )}

                          <Button
                            onClick={handleCheckForensic}
                            disabled={checkingIntegrity}
                            className={`border px-3 py-1.5 text-xs ${isDark
                                ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                          >
                            {checkingIntegrity
                              ? 'Recalculando Hash...'
                              : '🔍 Validar Hash no Spring Boot'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <CloseTicketModal
                  isOpen={isCloseModalOpen}
                  ticketProtocolo={
                    ticket.protocol || ticket.id
                  }
                  onClose={() =>
                    setIsCloseModalOpen(false)
                  }
                  onConfirm={handleConfirmClose}
                />

                {/* Fechar chamado */}
                {ticket.solution &&
                  ticket.status === 'resolvido' && (
                    <div className="mt-5 flex justify-end">
                      <Button
                        onClick={() =>
                          onChangeStatus(
                            ticket.id,
                            'fechado'
                          )
                        }
                      >
                        Fechar chamado
                      </Button>
                    </div>
                  )}

                {ticket.status === 'fechado' && (
                  <div
                    className={`rounded-lg px-4 py-3 text-center text-sm ${isDark
                        ? 'bg-slate-800/70 text-slate-400'
                        : 'bg-slate-50 text-slate-500'
                      }`}
                  >
                    Este chamado está fechado.
                  </div>
                )}
              </div>
            )}

            {/* OBSERVAÇÕES */}
            {tab === 'notes' && (
              <div
                className={`rounded-2xl border p-6 shadow-sti animate-fade-in ${colors.card}`}
              >
                <h2
                  className={`mb-2 text-sm font-semibold ${colors.textPrimary}`}
                >
                  Observações internas
                </h2>

                <p
                  className={`mb-5 text-sm ${colors.textMuted}`}
                >
                  Anotações visíveis apenas para a equipe de TI.
                </p>

                <div className="flex flex-col gap-3">
                  {ticket.internalNotes.length === 0 && (
                    <p
                      className={`py-6 text-center text-sm ${colors.textFaint}`}
                    >
                      Nenhuma observação registrada.
                    </p>
                  )}

                  {ticket.internalNotes.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl border px-4 py-3 ${isDark
                          ? 'border-slate-700/60 bg-slate-800/50'
                          : 'border-slate-100 bg-slate-50/80'
                        }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <StickyNote
                          className={`h-3.5 w-3.5 ${colors.textFaint}`}
                        />

                        <span
                          className={`text-xs font-medium ${colors.textMuted}`}
                        >
                          {n.authorName}
                        </span>

                        <span
                          className={`text-xs ${colors.textFaint}`}
                        >
                          · {formatDate(n.createdAt)}
                        </span>
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${colors.textSecondary}`}
                      >
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>

                {ticket.status !== 'fechado' && (
                  <div
                    className={`mt-5 border-t pt-5 ${colors.borderSoft}`}
                  >
                    <label
                      className={`mb-2 block text-sm font-medium ${colors.textPrimary}`}
                    >
                      Adicionar observação
                    </label>

                    <Textarea
                      value={note}
                      onChange={(e) =>
                        setNote(e.target.value)
                      }
                      placeholder="Anote algo relevante para a equipe de TI…"
                      rows={2}
                    />

                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleNote}
                        disabled={!note.trim()}
                      >
                        <StickyNote className="h-3.5 w-3.5" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar direita */}
          <div className="flex flex-col gap-4">
            {/* Solicitante */}
            <div
              className={`rounded-2xl border p-5 shadow-sti ${colors.card}`}
            >
              <h3
                className={`mb-4 text-sm font-semibold ${colors.textPrimary}`}
              >
                Solicitante
              </h3>

              <dl className="flex flex-col gap-3 text-sm">
                <InfoRow
                  icon={UserIcon}
                  label="Nome"
                  value={ticket.requesterName}
                  isDark={isDark}
                />

                <InfoRow
                  icon={MapPin}
                  label="Setor"
                  value={ticket.requesterDepartment}
                  isDark={isDark}
                />

                <InfoRow
                  icon={MapPin}
                  label="Localização"
                  value={ticket.requesterLocation}
                  isDark={isDark}
                />

                <InfoRow
                  icon={Phone}
                  label="Contato"
                  value={ticket.requesterContact}
                  isDark={isDark}
                />
              </dl>
            </div>

            {/* Problema */}
            <div
              className={`rounded-2xl border p-5 shadow-sti ${colors.card}`}
            >
              <h3
                className={`mb-4 text-sm font-semibold ${colors.textPrimary}`}
              >
                Sobre o problema
              </h3>

              <dl className="flex flex-col gap-3 text-sm">
                <InfoRow
                  icon={Monitor}
                  label="Categoria"
                  value={ticket.category}
                  isDark={isDark}
                />

                <InfoRow
                  icon={Monitor}
                  label="Equipamento / Sistema"
                  value={ticket.equipmentOrSystem}
                  isDark={isDark}
                />

                <InfoRow
                  icon={Clock}
                  label="Data aproximada"
                  value={formatDateShort(
                    ticket.approximateDate
                  )}
                  isDark={isDark}
                />

                <InfoRow
                  icon={AlertTriangle}
                  label="Impacto"
                  value={ticket.impact}
                  isDark={isDark}
                />

                <div>
                  <dt
                    className={`mb-0.5 flex items-center gap-1.5 text-xs ${colors.textFaint}`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Mensagem de erro
                  </dt>

                  <dd
                    className={`break-words ${colors.textSecondary}`}
                  >
                    {ticket.errorMessage}
                  </dd>
                </div>

                {/* =====================================================
                    ANEXOS
                   ===================================================== */}
                {ticket.attachments.length > 0 && (
                  <div>
                    <dt
                      className={`mb-2 flex items-center gap-1.5 text-xs ${colors.textFaint}`}
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Anexos
                    </dt>

                    <dd className="flex flex-col gap-3">
                      {ticket.attachments.map((attachment, i) => {
                        const isImage =
                          typeof attachment === 'string' &&
                          attachment.startsWith('data:image/');

                        if (isImage) {
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() =>
                                setSelectedAttachment(
                                  attachment
                                )
                              }
                              className={`group relative w-full overflow-hidden rounded-xl border text-left ${isDark
                                  ? 'border-slate-700 bg-slate-900 hover:border-teal-500/60'
                                  : 'border-slate-200 bg-slate-50 hover:border-teal-500'
                                }`}
                            >
                              <img
                                src={attachment}
                                alt={`Anexo ${i + 1}`}
                                className="block max-h-56 w-full object-contain bg-black/5"
                              />

                              <div
                                className={`flex items-center justify-between border-t px-3 py-2 text-xs ${isDark
                                    ? 'border-slate-700 text-slate-300'
                                    : 'border-slate-200 text-slate-600'
                                  }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <ImageIcon className="h-3.5 w-3.5 text-teal-500" />
                                  Imagem {i + 1}
                                </span>

                                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Visualizar
                                </span>
                              </div>
                            </button>
                          );
                        }

                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${isDark
                                ? 'border-slate-700 bg-slate-800/60 text-slate-300'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                              }`}
                          >
                            <Paperclip className="h-3.5 w-3.5 shrink-0 text-teal-500" />

                            <span className="break-all">
                              {attachment}
                            </span>
                          </div>
                        );
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Atendimento */}
            <div
              className={`rounded-2xl border p-5 shadow-sti ${colors.card}`}
            >
              <h3
                className={`mb-4 text-sm font-semibold ${colors.textPrimary}`}
              >
                Atendimento
              </h3>

              <dl className="flex flex-col gap-3 text-sm">
                <div>
                  <dt
                    className={`mb-1 flex items-center justify-between text-xs ${colors.textFaint}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Headphones className="h-3.5 w-3.5" />
                      Responsável Atual
                    </span>

                    {ticket.assignee && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Atribuído
                      </span>
                    )}
                  </dt>

                  <dd
                    className={`text-sm font-medium ${colors.textPrimary}`}
                  >
                    {ticket.assignee || (
                      <span className="font-semibold italic text-amber-600">
                        Aguardando Técnico
                      </span>
                    )}
                  </dd>

                  {/* Gestão de custódia */}
                  {onAssign &&
                    ticket.status !== 'fechado' && (
                      <div
                        className={`mt-3 space-y-2 border-t pt-3 ${colors.borderSoft}`}
                      >
                        {ticket.assignee !== techName ? (
                          <button
                            type="button"
                            onClick={() =>
                              onAssign(
                                ticket.id,
                                techName
                              )
                            }
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm transition-colors ${isDark
                                ? 'bg-slate-800 text-white hover:bg-slate-700'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                          >
                            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                            Assumir Atendimento
                          </button>
                        ) : (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center text-xs font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                            Você é o responsável por este chamado
                          </div>
                        )}

                        {!showTransferSelect ? (
                          <button
                            type="button"
                            onClick={() =>
                              setShowTransferSelect(true)
                            }
                            className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${colors.border} ${colors.textSecondary} ${colors.hover}`}
                          >
                            <ArrowRightLeft
                              className={`h-3.5 w-3.5 ${colors.textFaint}`}
                            />
                            Transferir para outro colega
                          </button>
                        ) : (
                          <div
                            className={`space-y-1.5 rounded-xl border p-2.5 ${colors.border} ${colors.inner}`}
                          >
                            <label
                              className={`block text-[11px] font-semibold ${colors.textSecondary}`}
                            >
                              Selecione o técnico de destino:
                            </label>

                            <select
                              value={selectedTransferTech}
                              onChange={(e) =>
                                setSelectedTransferTech(
                                  e.target.value
                                )
                              }
                              className={`w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sti-teal-500 ${colors.input}`}
                            >
                              <option value="">
                                Escolha na equipe...
                              </option>

                              {technicians
                                .filter(
                                  (t) =>
                                    t.name !==
                                    ticket.assignee
                                )
                                .map((t) => (
                                  <option
                                    key={t.email}
                                    value={t.name}
                                  >
                                    {t.name} (Manutenção / TI)
                                  </option>
                                ))}
                            </select>

                            <div className="flex gap-1.5 pt-1">
                              <button
                                type="button"
                                disabled={
                                  !selectedTransferTech
                                }
                                onClick={() => {
                                  if (
                                    selectedTransferTech
                                  ) {
                                    onAssign(
                                      ticket.id,
                                      selectedTransferTech
                                    );

                                    setShowTransferSelect(
                                      false
                                    );

                                    setSelectedTransferTech(
                                      ''
                                    );
                                  }
                                }}
                                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold text-white disabled:opacity-40 ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700'
                                    : 'bg-slate-900 hover:bg-slate-800'
                                  }`}
                              >
                                Confirmar
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setShowTransferSelect(
                                    false
                                  );
                                  setSelectedTransferTech(
                                    ''
                                  );
                                }}
                                className={`rounded-lg border px-2.5 py-1.5 text-xs ${colors.border} ${colors.textMuted} ${colors.hover}`}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                <div>
                  <dt
                    className={`mb-0.5 flex items-center gap-1.5 text-xs ${colors.textFaint}`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Status atual
                  </dt>

                  <dd className="mt-1">
                    <StatusBadge status={ticket.status} />
                  </dd>
                </div>

                {ticket.attendanceStartedAt && (
                  <InfoRow
                    icon={Clock}
                    label="Início"
                    value={formatDate(
                      ticket.attendanceStartedAt
                    )}
                    isDark={isDark}
                  />
                )}
              </dl>

              {/* Alterar status */}
              {canChangeStatus && (
                <div
                  className={`mt-4 border-t pt-4 ${colors.borderSoft}`}
                >
                  <label
                    className={`mb-2 block text-xs font-medium ${colors.textMuted}`}
                  >
                    Alterar status
                  </label>

                  <div className="flex gap-2">
                    <Select
                      value={statusSelect}
                      onChange={(e) =>
                        setStatusSelect(
                          e.target.value as TicketStatus
                        )
                      }
                    >
                      <option value="em_andamento">
                        Em atendimento
                      </option>

                      <option value="aguardando">
                        Aguardando usuário
                      </option>

                      <option value="resolvido">
                        Resolvido
                      </option>

                      <option value="fechado">
                        Fechado
                      </option>
                    </Select>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleStatus}
                      disabled={
                        statusSelect === ticket.status
                      }
                      className="shrink-0"
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          VISUALIZADOR DO ANEXO
         ========================================================= */}
      {selectedAttachment && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAttachment(null)}
        >
          <div
            className={`relative flex max-h-[92vh] max-w-6xl items-center justify-center overflow-hidden rounded-2xl border p-2 shadow-2xl ${isDark
                ? 'border-slate-700 bg-slate-900'
                : 'border-slate-200 bg-white'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedAttachment(null)
              }
              aria-label="Fechar visualização"
              className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg transition ${isDark
                  ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={selectedAttachment}
              alt="Visualização do anexo"
              className="max-h-[88vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   COMPONENTES AUXILIARES
   ========================================================= */

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  isDark,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof MessageCircle;
  label: string;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
          ? 'bg-sti-navy-800 text-white'
          : isDark
            ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isDark,
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div>
      <dt
        className={`mb-0.5 flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>

      <dd
        className={`break-words ${isDark ? 'text-slate-200' : 'text-slate-700'
          }`}
      >
        {value}
      </dd>
    </div>
  );
}

function Avatar({
  author,
  name,
}: {
  author: 'usuario' | 'tecnico';
  name: string;
}) {
  if (author === 'tecnico') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-navy-800 text-white">
        <Headphones className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-teal-100 text-sm font-semibold text-sti-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
      {name.charAt(0)}
    </div>
  );
}