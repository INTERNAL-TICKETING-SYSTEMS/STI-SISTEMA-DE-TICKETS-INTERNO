import React, { useState, useRef } from 'react';
import { useTechTheme } from '@/components/tech/techTheme';
import { Ticket } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/data';
import { Page } from '@/components/Sidebar';
import {
  ArrowLeft,
  Send,
  Star,
  CheckCircle,
  Headphones,
  Clock,
  Paperclip,
  X,
  Maximize2,
  ShieldCheck,
  Hourglass,
  Layers,
} from 'lucide-react';

interface TicketDetailProps {
  onRateTicket?: (
    id: string,
    rating: number,
    comment?: string
  ) => void;
  ticket: Ticket;
  onNavigate: (p: Page) => void;
  onReply: (id: string, message: string) => void;
}

export default function TicketDetail({
  ticket,
  onNavigate,
  onReply,
  onRateTicket,
}: TicketDetailProps) {
  const { isDark } = useTechTheme();

  const [reply, setReply] = useState('');
  const [userRating, setUserRating] = useState(ticket.rating ?? 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState(
    ticket.ratingComment ?? ''
  );
  const [submittedRating, setSubmittedRating] = useState(false);
  const [chatAttachments, setChatAttachments] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setChatAttachments((prev) => [
            ...prev,
            reader.result as string,
          ]);
        }
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setChatAttachments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSend = () => {
    if (!reply.trim() && chatAttachments.length === 0) return;

    let fullMessage = reply.trim();

    if (chatAttachments.length > 0) {
      const imgPayloads = chatAttachments
        .map((img) => `[ATTACHMENT:${img}]`)
        .join(' ');

      fullMessage = fullMessage
        ? `${fullMessage}\n${imgPayloads}`
        : imgPayloads;
    }

    onReply(ticket.id, fullMessage);
    setReply('');
    setChatAttachments([]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (rawText: string) => {
    const attachmentRegex = /\[ATTACHMENT:(.*?)\]/g;
    const images: string[] = [];
    let match;

    while ((match = attachmentRegex.exec(rawText)) !== null) {
      images.push(match[1]);
    }

    const cleanText = rawText.replace(attachmentRegex, '').trim();

    return (
      <div className="space-y-2">
        {cleanText && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {cleanText}
          </p>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative group aspect-video cursor-pointer overflow-hidden rounded-lg border border-black/10 bg-black/5"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt="Evidência"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Botão de retorno */}
      <button
        type="button"
        onClick={() => onNavigate('meus-chamados')}
        className={`mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark
          ? 'text-slate-400 hover:text-white'
          : 'text-slate-500 hover:text-slate-800'
          }`}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para meus chamados
      </button>

      {/* Cabeçalho do chamado */}
      <div
        className={`mb-6 rounded-2xl border p-6 shadow-sm ${isDark
          ? 'border-slate-700 bg-slate-900'
          : 'border-slate-200 bg-white'
          }`}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
              {ticket.protocol}
            </span>

            <h1
              className={`mt-1 text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
            >
              {ticket.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                {ticket.category}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Aberto em {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>

          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Painel central: chat e mensagens */}
        <div className="space-y-6 lg:col-span-2">
          <div
            className={`flex min-h-[500px] flex-col rounded-2xl border p-6 shadow-sm ${isDark
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
              }`}
          >
            {/* Banner de atendimento técnico */}
            <div className="mb-6">
              {ticket.assignee ? (
                <div
                  className={`flex items-center justify-between rounded-xl border p-3.5 ${isDark
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-emerald-200 bg-emerald-50/70'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Headphones className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-900'}">
                        Atendimento Técnico em Andamento
                      </p>

                      <p className="text-sm font-medium ${isDark ? 'text-emerald-200' : 'text-emerald-800'}">
                        Responsável: <strong>{ticket.assignee}</strong>{' '}
                        (DTI - Suporte Técnico)
                      </p>
                    </div>
                  </div>

                  <span className="hidden items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 sm:inline-flex">
                    <ShieldCheck className="h-3 w-3" />
                    Vinculado
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Hourglass className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                      Chamado em Fila de Triagem
                    </p>

                    <p className="text-xs text-amber-800">
                      Aguardando distribuição para um técnico da DTI.
                      Você já pode registrar observações ou anexar
                      prints adicionais abaixo.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Histórico de mensagens */}
            <div className="flex-1 space-y-5 overflow-y-auto pr-1">
              {/* Relato inicial */}
              <div className="flex flex-col items-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-900 px-4 py-3 text-white shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Relato Inicial
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {ticket.description}
                  </p>

                  {/* Anexos da abertura do chamado */}
                  {ticket.attachments &&
                    ticket.attachments.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-700 pt-2">
                        {ticket.attachments.map((src, i) => (
                          <div
                            key={i}
                            className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-slate-700 bg-slate-800"
                            onClick={() => setSelectedImage(src)}
                          >
                            <img
                              src={src}
                              alt="Evidência inicial"
                              className="h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <Maximize2 className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <span className="mt-1 text-[11px] text-slate-400">
                  Você &bull; {formatDate(ticket.createdAt)}
                </span>
              </div>

              {/* Respostas e atualizações */}
              {ticket.updates.map((u) => {
                const isUser = u.author === 'usuario';

                return (
                  <div
                    key={u.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'
                      }`}
                  >
                    <div
                      className={`flex max-w-[85%] items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'
                        }`}
                    >
                      {!isUser && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                          <Headphones className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${isUser
                          ? 'rounded-tr-sm bg-slate-900 text-white'
                          : isDark
                            ? 'rounded-tl-sm border border-slate-700 bg-slate-800 text-slate-100'
                            : 'rounded-tl-sm border border-slate-200 bg-slate-100 text-slate-800'
                          }`}
                      >
                        {!isUser && (
                          <p
                            className={`mb-1 flex items-center gap-1 text-[11px] font-bold ${isDark
                              ? 'text-slate-200'
                              : 'text-slate-600'
                              }`}
                          >
                            {u.authorName}
                            <span className="font-normal text-slate-400">
                              &bull; Suporte Técnico
                            </span>
                          </p>
                        )}

                        {renderMessageContent(u.message)}
                      </div>
                    </div>

                    <span
                      className={`mt-1 text-[11px] text-slate-400 ${isUser ? 'mr-1' : 'ml-10'
                        }`}
                    >
                      {isUser ? 'Você' : u.authorName} &bull;{' '}
                      {formatDate(u.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Caixa de resposta */}
            {ticket.status !== 'fechado' &&
              ticket.status !== 'resolvido' ? (
              <div
                className={`mt-6 border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'
                  }`}
              >
                {/* Pré-visualização dos anexos */}
                {chatAttachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {chatAttachments.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-16 w-20 overflow-hidden rounded-lg border border-slate-300"
                      >
                        <img
                          src={img}
                          alt="Pré-visualização do anexo"
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          aria-label="Remover anexo"
                          className="absolute right-1 top-1 rounded-full bg-slate-900/80 p-0.5 text-white hover:bg-rose-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`relative rounded-xl border p-2 transition-all focus-within:ring-1 ${isDark
                    ? 'border-slate-700 bg-slate-800 focus-within:border-slate-500 focus-within:ring-slate-500'
                    : 'border-slate-200 bg-slate-50/50 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-slate-400'
                    }`}
                >
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem para o técnico... (Pressione Enter para enviar)"
                    rows={2}
                    className={`mb-1 w-full resize-none bg-transparent px-2 text-sm focus:outline-none ${isDark
                      ? 'text-slate-100 placeholder:text-slate-400'
                      : 'text-slate-800 placeholder:text-slate-400'
                      }`}
                  />

                  <div
                    className={`flex items-center justify-between border-t px-1 pt-2 ${isDark
                      ? 'border-slate-700'
                      : 'border-slate-200/60'
                      }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${isDark
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                        }`}
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Anexar foto ou print
                    </button>

                    <Button
                      onClick={handleSend}
                      disabled={
                        !reply.trim() && chatAttachments.length === 0
                      }
                      variant="primary"
                      className="h-8 px-3 text-xs"
                    >
                      <Send className="mr-1 h-3.5 w-3.5" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {/* Avaliação após resolução */}
                {ticket.status === 'resolvido' &&
                  !ticket.rating &&
                  !submittedRating ? (
                  <div className="animate-fade-in rounded-2xl border-2 border-emerald-400 bg-emerald-50/60 p-6 shadow-sm">
                    <div className="mb-1 flex items-center gap-2.5 text-sm font-bold text-emerald-800">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      Atendimento Concluído pelo Suporte!
                    </div>

                    <p className="mb-4 text-xs text-slate-600">
                      Por favor, avalie a qualidade do atendimento técnico
                      recebido para fecharmos o chamado.
                    </p>

                    <div className="mb-4 flex items-center gap-1.5">
                      <span className="mr-2 text-xs font-semibold text-slate-700">
                        Sua nota:
                      </span>

                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`Avaliar com ${star} estrelas`}
                          className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= (hoverRating || userRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                              }`}
                          />
                        </button>
                      ))}

                      <span className="ml-2 text-xs font-medium text-amber-600">
                        {userRating === 5 && 'Excelente'}
                        {userRating === 4 && 'Muito Bom'}
                        {userRating === 3 && 'Regular'}
                        {userRating === 2 && 'Ruim'}
                        {userRating === 1 && 'Péssimo'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="Deixe um comentário opcional sobre a solução ou o técnico responsável..."
                        rows={2}
                        className={`w-full rounded-xl border p-3 text-xs placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isDark
                            ? 'border-emerald-500/30 bg-slate-800 text-slate-100'
                            : 'border-emerald-200 bg-white text-slate-800'
                          }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onRateTicket) {
                          onRateTicket(
                            ticket.id,
                            userRating,
                            ratingComment.trim() || undefined
                          );
                          setSubmittedRating(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Enviar Avaliação e Concluir Chamado
                    </button>
                  </div>
                ) : ticket.rating || submittedRating ? (
                  <div className="animate-fade-in rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        Avaliação do Solicitante Registrada
                      </span>

                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${s <= (ticket.rating ?? userRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    {(ticket.ratingComment || ratingComment) && (
                      <p className="rounded-lg border border-amber-100 bg-white/70 p-2.5 text-xs italic text-slate-700">
                        "{ticket.ratingComment || ratingComment}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                    Este chamado está <strong>{ticket.status}</strong>.
                    O canal de mensagens está arquivado para fins de auditoria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Barra lateral com metadados */}
        <div className="flex flex-col gap-4">
          <div
            className={`rounded-2xl border p-5 shadow-sm ${isDark
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
              }`}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ficha do Atendimento
            </h3>

            <dl className="flex flex-col gap-3 text-xs">
              <div>
                <dt className="text-slate-400">Número de Protocolo</dt>
                <dd
                  className={`mt-0.5 font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                >
                  {ticket.protocol}
                </dd>
              </div>

              <div
                className={`border-t pt-2 ${isDark ? 'border-slate-700' : 'border-slate-100'
                  }`}
              >
                <dt className="text-slate-400">Categoria Técnica</dt>
                <dd
                  className={`mt-0.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                >
                  {ticket.category}
                </dd>
              </div>

              <div
                className={`border-t pt-2 ${isDark ? 'border-slate-700' : 'border-slate-100'
                  }`}
              >
                <dt className="text-slate-400">Prioridade</dt>
                <dd className="mt-0.5">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold capitalize ${ticket.priority === 'alta'
                      ? 'bg-rose-100 text-rose-700'
                      : ticket.priority === 'media'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    {ticket.priority}
                  </span>
                </dd>
              </div>

              <div
                className={`border-t pt-2 ${isDark ? 'border-slate-700' : 'border-slate-100'
                  }`}
              >
                <dt className="text-slate-400">Aberto em</dt>
                <dd
                  className={`mt-0.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                >
                  {formatDate(ticket.createdAt)}
                </dd>
              </div>

              <div
                className={`border-t pt-2 ${isDark ? 'border-slate-700' : 'border-slate-100'
                  }`}
              >
                <dt className="text-slate-400">Última Atualização</dt>
                <dd
                  className={`mt-0.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                >
                  {formatDate(ticket.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm ${isDark
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark
                  ? 'bg-blue-950 text-blue-300'
                  : 'bg-blue-50 text-blue-600'
                  }`}
              >
                <Headphones className="h-5 w-5" />
              </div>

              <div>
                <p
                  className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                >
                  Suporte DTI DETRAN-TO
                </p>

                <p className="text-xs text-slate-500">
                  Horário: 08:00 às 18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de ampliação da imagem */}
      {selectedImage && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Fechar imagem ampliada"
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>

            <img
              src={selectedImage}
              alt="Ampliação da evidência"
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}