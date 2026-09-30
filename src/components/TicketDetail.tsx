import React, { useState, useRef } from 'react';
import { Ticket } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/data';
import { Page } from '@/components/Sidebar';
import {
  ArrowLeft,
  Send, Star, CheckCircle,
  User as UserIcon,
  Headphones,
  Clock,
  Paperclip,
  X,
  Maximize2,
  ShieldCheck,
  Hourglass,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface TicketDetailProps {
  onRateTicket?: (id: string, rating: number, comment?: string) => void;
  ticket: Ticket;
  onNavigate: (p: Page) => void;
  onReply: (id: string, message: string) => void;
}

export default function TicketDetail({ ticket, onNavigate, onReply, onRateTicket }: TicketDetailProps) {
  const [reply, setReply] = useState('');
  const [userRating, setUserRating] = useState(ticket.rating ?? 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState(ticket.ratingComment ?? '');
  const [submittedRating, setSubmittedRating] = useState(false);
  const [chatAttachments, setChatAttachments] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setChatAttachments((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setChatAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!reply.trim() && chatAttachments.length === 0) return;

    let fullMessage = reply.trim();
    if (chatAttachments.length > 0) {
      const imgPayloads = chatAttachments.map((img) => `[ATTACHMENT:${img}]`).join(' ');
      fullMessage = fullMessage ? `${fullMessage}\n${imgPayloads}` : imgPayloads;
    }

    onReply(ticket.id, fullMessage);
    setReply('');
    setChatAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        {cleanText && <p className="text-sm leading-relaxed whitespace-pre-wrap">{cleanText}</p>}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative group rounded-lg overflow-hidden border border-black/10 cursor-pointer aspect-video bg-black/5"
                onClick={() => setSelectedImage(src)}
              >
                <img src={src} alt="Evidência" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
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
        onClick={() => onNavigate('meus-chamados')}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para meus chamados
      </button>

      {/* Cabeçalho do Chamado */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
              {ticket.protocol}
            </span>
            <h1 className="mt-1 text-xl font-bold text-slate-900">{ticket.title}</h1>
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
        {/* Painel Central: Chat e Mensagens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-h-[500px]">
            
            {/* Banner de Custódia Técnica */}
            <div className="mb-6">
              {ticket.assignee ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Headphones className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                        Atendimento Técnico em Andamento
                      </p>
                      <p className="text-sm font-medium text-emerald-800">
                        Responsável: <strong>{ticket.assignee}</strong> (DTI - Suporte Técnico)
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                    <ShieldCheck className="h-3 w-3" /> Vinculado
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-amber-50/70 border border-amber-200 p-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Hourglass className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                      Chamado em Fila de Triagem
                    </p>
                    <p className="text-xs text-amber-800">
                      Aguardando distribuição para um técnico da DTI. Você já pode registrar observações ou anexar prints adicionais abaixo.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Linha do Tempo de Mensagens / Bolhas */}
            <div className="flex-1 space-y-5 overflow-y-auto pr-1">
              {/* Relato Inicial do Solicitante */}
              <div className="flex flex-col items-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-900 px-4 py-3 text-white shadow-sm">
                  <p className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1">
                    Relato Inicial
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>

                  {/* Fotos enviadas na abertura do chamado */}
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-700 pt-2">
                      {ticket.attachments.map((src, i) => (
                        <div
                          key={i}
                          className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-800 cursor-pointer"
                          onClick={() => setSelectedImage(src)}
                        >
                          <img src={src} alt="Evidência Inicial" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

              {/* Histórico de Mensagens */}
              {ticket.updates.map((u) => {
                const isUser = u.author === 'usuario';
                return (
                  <div
                    key={u.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white mt-1 shadow-sm">
                          <Headphones className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          isUser
                            ? 'rounded-tr-sm bg-slate-900 text-white'
                            : 'rounded-tl-sm bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {!isUser && (
                          <p className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                            {u.authorName} <span className="font-normal text-slate-400">&bull; Suporte Técnico</span>
                          </p>
                        )}
                        {renderMessageContent(u.message)}
                      </div>
                    </div>
                    <span className={`mt-1 text-[11px] text-slate-400 ${isUser ? 'mr-1' : 'ml-10'}`}>
                      {isUser ? 'Você' : u.authorName} &bull; {formatDate(u.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Caixa de Entrada de Mensagem com Upload de Fotos */}
            {ticket.status !== 'fechado' && ticket.status !== 'resolvido' ? (
              <div className="mt-6 border-t border-slate-200 pt-4">
                {/* Previews de fotos antes do envio */}
                {chatAttachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {chatAttachments.map((img, idx) => (
                      <div key={idx} className="relative h-16 w-20 rounded-lg overflow-hidden border border-slate-300">
                        <img src={img} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="absolute top-1 right-1 rounded-full bg-slate-900/80 p-0.5 text-white hover:bg-rose-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-2 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-400 transition-all">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem para o técnico... (Pressione Enter para enviar)"
                    rows={2}
                    className="w-full resize-none bg-transparent px-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 px-1">
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
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Anexar foto ou print
                    </button>

                    <Button
                      onClick={handleSend}
                      disabled={!reply.trim() && chatAttachments.length === 0}
                      variant="primary"
                      className="h-8 px-3 text-xs"
                    >
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
                              <div className="mt-6 space-y-4">
                  {/* Se o chamado está resolvido e aguardando avaliação do usuário */}
                  {ticket.status === 'resolvido' && !ticket.rating && !submittedRating ? (
                    <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/60 p-6 shadow-sm animate-fade-in">
                      <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm mb-1">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Atendimento Concluído pelo Suporte!
                      </div>
                      <p className="text-xs text-slate-600 mb-4">
                        Por favor, avalie a qualidade do atendimento técnico recebido para fecharmos o chamado.
                      </p>

                      <div className="mb-4 flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-700 mr-2">Sua nota:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (hoverRating || userRating)
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
                          className="w-full rounded-xl border border-emerald-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onRateTicket) {
                            onRateTicket(ticket.id, userRating, ratingComment.trim() || undefined);
                            setSubmittedRating(true);
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Enviar Avaliação e Concluir Chamado
                      </button>
                    </div>
                  ) : (ticket.rating || submittedRating) ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          Avaliação do Solicitante Registrada
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${s <= (ticket.rating ?? userRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {(ticket.ratingComment || ratingComment) && (
                        <p className="text-xs text-slate-700 italic bg-white/70 rounded-lg p-2.5 border border-amber-100">
                          "{ticket.ratingComment || ratingComment}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-xs text-slate-500">
                      Este chamado está <strong>{ticket.status}</strong>. O canal de mensagens está arquivado para fins de auditoria.
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>

        {/* Barra Lateral com Metadados Oficiais */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ficha do Atendimento
            </h3>
            <dl className="flex flex-col gap-3 text-xs">
              <div>
                <dt className="text-slate-400">Número de Protocolo</dt>
                <dd className="font-mono font-bold text-slate-900 mt-0.5">{ticket.protocol}</dd>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <dt className="text-slate-400">Categoria Técnica</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{ticket.category}</dd>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <dt className="text-slate-400">Prioridade</dt>
                <dd className="mt-0.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                    ticket.priority === 'alta'
                      ? 'bg-rose-100 text-rose-700'
                      : ticket.priority === 'media'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ticket.priority}
                  </span>
                </dd>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <dt className="text-slate-400">Aberto em</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{formatDate(ticket.createdAt)}</dd>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <dt className="text-slate-400">Última Atualização</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{formatDate(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Suporte DTI DETRAN-TO</p>
                <p className="text-xs text-slate-500">Horário: 08:00 às 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Zoom da Imagem */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Ampliação da Evidência"
              className="max-h-[85vh] w-auto rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
