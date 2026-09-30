import { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Field';
import { formatDate } from '@/data';
import { Page } from '@/components/Sidebar';
import { ArrowLeft, Send, User as UserIcon, Headphones, Clock } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onNavigate: (p: Page) => void;
  onReply: (id: string, message: string) => void;
}

export default function TicketDetail({ ticket, onNavigate, onReply }: TicketDetailProps) {
  const [reply, setReply] = useState('');

  const handleSend = () => {
    if (!reply.trim()) return;
    onReply(ticket.id, reply.trim());
    setReply('');
  };

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => onNavigate('meus-chamados')}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-sti-navy-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para meus chamados
      </button>

      {/* Header card */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sti">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400">{ticket.protocol}</p>
            <h1 className="mt-1 text-xl font-bold text-sti-navy-800">{ticket.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5" />
                {ticket.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Aberto em {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversation */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sti">
            <h2 className="mb-5 text-sm font-semibold text-sti-navy-800">Conversa com a TI</h2>

            <div className="flex flex-col gap-4">
              {/* Original report */}
              <div className="flex gap-3">
                <Avatar author="usuario" />
                <div className="flex-1">
                  <div className="rounded-xl rounded-tl-sm bg-slate-50 px-4 py-3">
                    <p className="text-sm leading-relaxed text-slate-700">{ticket.description}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Você · {formatDate(ticket.createdAt)}
                  </p>
                </div>
              </div>

              {/* Updates */}
              {ticket.updates.map((u) => (
                <div key={u.id} className={`flex gap-3 ${u.author === 'usuario' ? '' : 'flex-row-reverse'}`}>
                  <Avatar author={u.author} />
                  <div className={`flex-1 ${u.author === 'usuario' ? '' : 'flex flex-col items-end'}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 ${
                        u.author === 'usuario'
                          ? 'rounded-tl-sm bg-slate-50'
                          : 'rounded-tr-sm bg-sti-navy-800 text-white'
                      }`}
                    >
                      <p className={`text-sm leading-relaxed ${u.author === 'usuario' ? 'text-slate-700' : 'text-slate-100'}`}>
                        {u.message}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {u.authorName} · {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            {ticket.status !== 'fechado' ? (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <label className="mb-2 block text-sm font-medium text-sti-navy-800">
                  Adicionar uma mensagem
                </label>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Escreva aqui sua resposta…"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <Button onClick={handleSend} disabled={!reply.trim()}>
                    <Send className="h-4 w-4" />
                    Enviar mensagem
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm text-slate-400">
                Este chamado está fechado. Se precisar de ajuda novamente, abra um novo chamado.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sti">
            <h3 className="mb-4 text-sm font-semibold text-sti-navy-800">Detalhes</h3>
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Protocolo</dt>
                <dd className="font-medium text-sti-navy-800">{ticket.protocol}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Categoria</dt>
                <dd className="font-medium text-sti-navy-800">{ticket.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Prioridade</dt>
                <dd className="font-medium text-sti-navy-800 capitalize">{ticket.priority}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Aberto em</dt>
                <dd className="font-medium text-sti-navy-800">{formatDate(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Última atualização</dt>
                <dd className="font-medium text-sti-navy-800">{formatDate(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sti">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sti-navy-50 text-sti-navy-600">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-sti-navy-800">Atendimento TI</p>
                <p className="text-xs text-slate-400">Respondemos em até 4h úteis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ author }: { author: 'usuario' | 'tecnico' }) {
  if (author === 'tecnico') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-navy-800 text-white">
        <Headphones className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-teal-100 text-sm font-semibold text-sti-teal-700">
      A
    </div>
  );
}
