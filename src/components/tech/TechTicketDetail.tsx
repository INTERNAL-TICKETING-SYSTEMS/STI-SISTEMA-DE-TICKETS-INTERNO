import { CloseTicketModal } from './CloseTicketModal';
﻿import { useState } from 'react';
import { Ticket, TicketStatus, User } from '@/types';
import StatusBadge, { statusLabel } from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { Textarea, Select } from '@/components/ui/Field';
import { formatDate, formatDateShort } from '@/data';
import { TechPage } from '@/components/tech/TechSidebar';
import {
  ArrowLeft,
  Send,
  User as UserIcon,
  Headphones, ArrowRightLeft, UserCheck,
  Clock,
  MapPin,
  Phone,
  Monitor,
  AlertTriangle,
  FileText,
  Paperclip, Tag, Wrench,
  CheckCircle2, Star,
  StickyNote,
  MessageCircle,
} from 'lucide-react';

interface TechTicketDetailProps {
  ticket: Ticket;
  onNavigate: (p: TechPage) => void;
  onSendMessage: (id: string, message: string) => void;
  onRequestInfo: (id: string, question: string) => void;
  onChangeStatus: (id: string, status: TicketStatus) => void;
  onResolve: (id: string, solution: string, assetTag?: string, replacedParts?: string) => void;
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
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const handleConfirmClose = async (parecerTecnico: string) => {
    onResolve(ticket.id, parecerTecnico);
    setIsCloseModalOpen(false);
  };

  const [selectedTransferTech, setSelectedTransferTech] = useState('');
  const [showTransferSelect, setShowTransferSelect] = useState(false);
  const [tab, setTab] = useState<Tab>('interactions');
  const [message, setMessage] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [showRequest, setShowRequest] = useState(false);
  const [statusSelect, setStatusSelect] = useState<TicketStatus>(ticket.status);
  const [solution, setSolution] = useState(ticket.solution ?? '');
  const [assetTag, setAssetTag] = useState(ticket.assetTag ?? '');
  const [replacedParts, setReplacedParts] = useState(ticket.replacedParts ?? '');
  const [note, setNote] = useState('');
  // Localiza a última transferência
  const latestTransfer = [...ticket.updates].reverse().find((u) => u.message.toLowerCase().includes('transferido'));

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

  const handleResolve = () => {
    if (!solution.trim()) return;
    onResolve(ticket.id, solution.trim());
  };

  const handleNote = () => {
    if (!note.trim()) return;
    onAddInternalNote(ticket.id, note.trim());
    setNote('');
  };

  const canChangeStatus = ticket.status !== 'fechado';

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => onNavigate('tech-chamados')}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-sti-navy-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para chamados
      </button>

      {/* Header card */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sti">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400">{ticket.protocol}</p>
            <h1 className="mt-1 text-xl font-bold text-sti-navy-800">{ticket.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Aberto em {formatDate(ticket.createdAt)}
              </span>
              {ticket.attendanceStartedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5" />
                  Atendimento iniciado em {formatDate(ticket.attendanceStartedAt)}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — main content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sti">
            <TabButton active={tab === 'interactions'} onClick={() => setTab('interactions')} icon={MessageCircle} label="Interações" />
            <TabButton active={tab === 'solution'} onClick={() => setTab('solution')} icon={CheckCircle2} label="Solução" />
            <TabButton active={tab === 'notes'} onClick={() => setTab('notes')} icon={StickyNote} label="Observações internas" />
          </div>

          {/* Tab content */}
          {tab === 'interactions' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sti animate-fade-in">
              <h2 className="mb-5 text-sm font-semibold text-sti-navy-800">Linha do tempo</h2>

              <div className="flex flex-col gap-4">
                {/* Original report */}
                <div className="flex gap-3">
                  <Avatar author="usuario" name={ticket.requesterName} />
                  <div className="flex-1">
                    <div className="rounded-xl rounded-tl-sm bg-slate-50 px-4 py-3">
                      <p className="text-sm leading-relaxed text-slate-700">{ticket.description}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {ticket.requesterName} — Solicitante · {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Updates */}
                {ticket.updates.map((u) => (
                  <div key={u.id} className={`flex gap-3 ${u.author === 'tecnico' ? 'flex-row-reverse' : ''}`}>
                    <Avatar author={u.author} name={u.authorName} />
                    <div className={`flex-1 ${u.author === 'tecnico' ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-3 ${
                          u.author === 'tecnico'
                            ? 'rounded-tr-sm bg-sti-navy-800 text-white'
                            : 'rounded-tl-sm bg-slate-50'
                        }`}
                      >
                        <p className={`text-sm leading-relaxed ${u.author === 'tecnico' ? 'text-slate-100' : 'text-slate-700'}`}>
                          {u.message}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {u.authorName} — {u.author === 'tecnico' ? 'Técnico' : 'Solicitante'} · {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              {ticket.status !== 'fechado' && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  {showRequest ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                      <label className="mb-2 block text-sm font-medium text-sti-navy-800">
                        Solicitar informações ao usuário
                      </label>
                      <Textarea
                        value={requestMsg}
                        onChange={(e) => setRequestMsg(e.target.value)}
                        placeholder="Escreva a pergunta para o solicitante…"
                        rows={2}
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowRequest(false)}>
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={handleRequest} disabled={!requestMsg.trim()}>
                          <Send className="h-3.5 w-3.5" />
                          Enviar pergunta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="mb-2 block text-sm font-medium text-sti-navy-800">
                        Escreva uma mensagem
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escreva aqui sua resposta…"
                        rows={3}
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setShowRequest(true)}>
                          Solicitar informações
                        </Button>
                        <Button size="sm" onClick={handleSend} disabled={!message.trim()}>
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

          {tab === 'solution' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sti animate-fade-in">
              <h2 className="mb-2 text-sm font-semibold text-sti-navy-800">Registrar solução</h2>
              <p className="mb-5 text-sm text-slate-500">Descreva como o problema foi solucionado.</p>

                              {ticket.solution ? (
                  <div className="mb-5 space-y-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                          {ticket.rating && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            Avaliação do Solicitante
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-4 w-4 ${s <= (ticket.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {ticket.ratingComment && (
                          <p className="text-xs text-slate-700 italic bg-white/80 p-2.5 rounded-lg border border-amber-100">
                            "{ticket.ratingComment}"
                          </p>
                        )}
                      </div>
                    )}
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Parecer Técnico Registrado
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{ticket.solution}</p>
                    </div>

                    {(ticket.assetTag || ticket.replacedParts) && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {ticket.assetTag && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              <Tag className="h-3.5 w-3.5 text-sti-teal-600" />
                              Patrimônio / Tombamento
                            </span>
                            <span className="font-mono text-sm font-bold text-slate-800">{ticket.assetTag}</span>
                          </div>
                        )}
                        {ticket.replacedParts && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              <Wrench className="h-3.5 w-3.5 text-amber-600" />
                              Peças / Insumos Utilizados
                            </span>
                            <span className="text-sm font-medium text-slate-700">{ticket.replacedParts}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Descrição Técnica da Solução *
                      </label>
                      <Textarea
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="Registre: diagnóstico técnico realizado, procedimento aplicado e validação funcional..."
                        rows={5}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <Tag className="h-3.5 w-3.5 text-slate-400" />
                          Nº do Patrimônio / Tombamento (Opcional)
                        </label>
                        <input
                          type="text"
                          value={assetTag}
                          onChange={(e) => setAssetTag(e.target.value)}
                          placeholder="Ex: PAT-2024-0891 ou Placa 10423"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sti-teal-500 focus:outline-none focus:ring-1 focus:ring-sti-teal-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <Wrench className="h-3.5 w-3.5 text-slate-400" />
                          Peças ou Insumos Trocados (Opcional)
                        </label>
                        <input
                          type="text"
                          value={replacedParts}
                          onChange={(e) => setReplacedParts(e.target.value)}
                          placeholder="Ex: Cabo de rede Cat6 2m, SSD 256GB, Fonte ATX"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sti-teal-500 focus:outline-none focus:ring-1 focus:ring-sti-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

              {!ticket.solution && ticket.status !== 'fechado' && (
                <div className="flex justify-end">
                  <Button onClick={handleResolve} disabled={!solution.trim()}>
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar como resolvido
                  </Button>

      <CloseTicketModal
        isOpen={isCloseModalOpen}
        ticketProtocolo={ticket.protocol || ticket.id}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleConfirmClose}
      />

      </div>
              )}

              {ticket.solution && ticket.status === 'resolvido' && (
                <div className="flex justify-end">
                  <Button onClick={() => onChangeStatus(ticket.id, 'fechado')}>
                    Fechar chamado
                  </Button>
                </div>
              )}

              {ticket.status === 'fechado' && (
                <div className="rounded-lg bg-slate-50 px-4 py-3 text-center text-sm text-slate-400">
                  Este chamado está fechado.
                </div>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sti animate-fade-in">
              <h2 className="mb-2 text-sm font-semibold text-sti-navy-800">Observações internas</h2>
              <p className="mb-5 text-sm text-slate-500">
                Anotações visíveis apenas para a equipe de TI.
              </p>

              <div className="flex flex-col gap-3">
                {ticket.internalNotes.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">Nenhuma observação registrada.</p>
                )}
                {ticket.internalNotes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <StickyNote className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-medium text-slate-500">{n.authorName}</span>
                      <span className="text-xs text-slate-400">· {formatDate(n.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700">{n.message}</p>
                  </div>
                ))}
              </div>

              {ticket.status !== 'fechado' && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <label className="mb-2 block text-sm font-medium text-sti-navy-800">
                    Adicionar observação
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anote algo relevante para a equipe de TI…"
                    rows={2}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button variant="secondary" size="sm" onClick={handleNote} disabled={!note.trim()}>
                      <StickyNote className="h-3.5 w-3.5" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — info sidebar */}
        <div className="flex flex-col gap-4">
          {/* Solicitant info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sti">
            <h3 className="mb-4 text-sm font-semibold text-sti-navy-800">Solicitante</h3>
            <dl className="flex flex-col gap-3 text-sm">
              <InfoRow icon={UserIcon} label="Nome" value={ticket.requesterName} />
              <InfoRow icon={MapPin} label="Setor" value={ticket.requesterDepartment} />
              <InfoRow icon={MapPin} label="Localização" value={ticket.requesterLocation} />
              <InfoRow icon={Phone} label="Contato" value={ticket.requesterContact} />
            </dl>
          </div>

          {/* Problem info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sti">
            <h3 className="mb-4 text-sm font-semibold text-sti-navy-800">Sobre o problema</h3>
            <dl className="flex flex-col gap-3 text-sm">
              <InfoRow icon={Monitor} label="Categoria" value={ticket.category} />
              <InfoRow icon={Monitor} label="Equipamento / Sistema" value={ticket.equipmentOrSystem} />
              <InfoRow icon={Clock} label="Data aproximada" value={formatDateShort(ticket.approximateDate)} />
              <InfoRow icon={AlertTriangle} label="Impacto" value={ticket.impact} />
              <div>
                <dt className="mb-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <FileText className="h-3.5 w-3.5" />
                  Mensagem de erro
                </dt>
                <dd className="text-slate-700">{ticket.errorMessage}</dd>
              </div>
              {ticket.attachments.length > 0 && (
                <div>
                  <dt className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Paperclip className="h-3.5 w-3.5" />
                    Anexos
                  </dt>
                  <dd className="flex flex-col gap-1">
                    {ticket.attachments.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-sm text-sti-teal-600">
                        <Paperclip className="h-3.5 w-3.5" />
                        {a}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Attendance info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sti">
            <h3 className="mb-4 text-sm font-semibold text-sti-navy-800">Atendimento</h3>
            <dl className="flex flex-col gap-3 text-sm">
                              <div>
                  <dt className="mb-1 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Headphones className="h-3.5 w-3.5" />
                      Responsável Atual
                    </span>
                    {ticket.assignee && (
                      <span className="font-semibold text-emerald-600 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Atribuído
                      </span>
                    )}
                  </dt>
                  <dd className="font-medium text-slate-800 text-sm">
                    {ticket.assignee || <span className="text-amber-600 font-semibold italic">Aguardando Técnico</span>}
                  </dd>

                  {/* Ações de Gestão de Custódia */}
                  {onAssign && ticket.status !== 'fechado' && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                      {ticket.assignee !== techName ? (
                        <button
                          type="button"
                          onClick={() => onAssign(ticket.id, techName)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
                        >
                          <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                          Assumir Atendimento
                        </button>
                      ) : (
                        <div className="rounded-lg bg-emerald-50 p-2 text-center text-xs font-medium text-emerald-800 border border-emerald-200">
                          Você é o responsável por este chamado
                        </div>
                      )}

                      {/* Botão de Transferência entre os 4 técnicos */}
                      {!showTransferSelect ? (
                        <button
                          type="button"
                          onClick={() => setShowTransferSelect(true)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5 text-slate-400" />
                          Transferir para outro colega
                        </button>
                      ) : (
                        <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Selecione o técnico de destino:
                          </label>
                          <select
                            value={selectedTransferTech}
                            onChange={(e) => setSelectedTransferTech(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                          >
                            <option value="">Escolha na equipe...</option>
                            {technicians
                              .filter((t) => t.name !== ticket.assignee)
                              .map((t) => (
                                <option key={t.email} value={t.name}>
                                  {t.name} (Manutenção / TI)
                                </option>
                              ))}
                          </select>
                          <div className="flex gap-1.5 pt-1">
                            <button
                              type="button"
                              disabled={!selectedTransferTech}
                              onClick={() => {
                                if (selectedTransferTech) {
                                  onAssign(ticket.id, selectedTransferTech);
                                  setShowTransferSelect(false);
                                  setSelectedTransferTech('');
                                }
                              }}
                              className="flex-1 rounded-lg bg-slate-900 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:bg-slate-800"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowTransferSelect(false);
                                setSelectedTransferTech('');
                              }}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
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
                <dt className="mb-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  Status atual
                </dt>
                <dd className="mt-1"><StatusBadge status={ticket.status} /></dd>
              </div>
              {ticket.attendanceStartedAt && (
                <InfoRow icon={Clock} label="Início" value={formatDate(ticket.attendanceStartedAt)} />
              )}
            </dl>

            {/* Status changer */}
            {canChangeStatus && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="mb-2 block text-xs font-medium text-slate-400">Alterar status</label>
                <div className="flex gap-2">
                  <Select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value as TicketStatus)}
                  >
                    <option value="em_andamento">Em atendimento</option>
                    <option value="aguardando">Aguardando usuário</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Fechado</option>
                  </Select>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleStatus}
                    disabled={statusSelect === ticket.status}
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
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof MessageCircle;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-sti-navy-800 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-sti-navy-700'
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
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="mb-0.5 flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="text-slate-700">{value}</dd>
    </div>
  );
}

function Avatar({ author, name }: { author: 'usuario' | 'tecnico'; name: string }) {
  if (author === 'tecnico') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-navy-800 text-white">
        <Headphones className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-teal-100 text-sm font-semibold text-sti-teal-700">
      {name.charAt(0)}
      
      </div>
  );
}
