import React, { useState, useRef } from 'react';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Field';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle2,
  Monitor,
  Printer,
  Wifi,
  KeyRound,
  HelpCircle,
  Server,
  Phone,
  ShieldAlert,
  Building2,
  Paperclip,
  X,
  Copy,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { Page } from '@/components/Sidebar';

interface OpenTicketProps {
  user?: User;
  onNavigate: (p: Page) => void;
  onSubmit: (data: {
    title: string;
    category: string;
    description: string;
    urgency: string;
    startDate: string;
    blocking: string;
    attachments: string[];
  }) => void;
}

const categories = [
  { id: 'sistemas', label: 'Sistemas DETRAN (RENAVAM, CNH, DetranNet)', icon: Monitor },
  { id: 'rede', label: 'Redes e Internet (Wi-Fi, Cabeamento, VPN)', icon: Wifi },
  { id: 'hardware', label: 'Equipamentos (Computador, Monitor, Nobreak)', icon: Server },
  { id: 'impressora', label: 'Impressão (Impressora, Scanner, Toner)', icon: Printer },
  { id: 'telefonia', label: 'Telefonia e Comunicação (Ramal mudo, E-mail)', icon: Phone },
  { id: 'acesso', label: 'Acessos e Senhas (Desbloqueio, Permissões)', icon: KeyRound },
  { id: 'outro', label: 'Outro problema / Dúvida geral', icon: HelpCircle },
];

const steps = ['Classificação', 'Detalhamento & Anexos', 'Impacto & Urgência'];

export default function OpenTicket({ user, onNavigate, onSubmit }: OpenTicketProps) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [blocking, setBlocking] = useState('');
  const [urgency, setUrgency] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [copied, setCopied] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canNext = () => {
    if (step === 0) return category !== '' && title.trim() !== '';
    if (step === 1) return description.trim() !== '' && startDate !== '' && blocking !== '';
    if (step === 2) return urgency !== '';
    return false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAttachments((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCopyProtocol = () => {
    navigator.clipboard.writeText(protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    const generatedProtocol = 'STI-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    setProtocol(generatedProtocol);
    setTimestamp(new Date().toLocaleString('pt-BR'));

    onSubmit({
      title,
      category: categories.find((c) => c.id === category)?.label ?? 'Outro problema',
      description,
      urgency,
      startDate,
      blocking,
      attachments,
    });

    setSubmitted(true);
  };

  // TELA DE CONFIRMAÇÃO / COMPROVANTE PROFISSIONAL ANIMADO
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg text-center relative overflow-hidden">
          {/* Faixa decorativa superior institucional */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"></div>

          {/* Animação com ícone de sucesso */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" style={{ animationIterationCount: '2' }} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Registro Oficial Homologado
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Chamado Aberto com Sucesso!
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
            Sua solicitação foi registrada no STI e encaminhada para a triagem da equipe técnica da Diretoria de Tecnologia da Informação.
          </p>

          {/* Card do Protocolo em Destaque */}
          <div className="mt-8 rounded-2xl bg-slate-900 text-white p-6 shadow-md relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Número de Protocolo
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-mono mt-0.5">
                  {protocol}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyProtocol}
                className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-medium text-white transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-300" />
                    <span>Copiar Protocolo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resumo do Recibo / Comprovante */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Assunto:</span>
              <span className="font-semibold text-slate-800 text-right max-w-xs truncate">{title}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Categoria:</span>
              <span className="font-semibold text-slate-800">
                {categories.find((c) => c.id === category)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Prioridade / Urgência:</span>
              <span className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                urgency === 'alta'
                  ? 'bg-rose-100 text-rose-700'
                  : urgency === 'media'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {urgency === 'alta' ? 'Alta / Crítica' : urgency === 'media' ? 'Média / Urgente' : 'Baixa / Normal'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Evidências Anexadas:</span>
              <span className="font-semibold text-slate-800">
                {attachments.length > 0 ? `${attachments.length} foto(s) anexada(s)` : 'Nenhuma imagem'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Data e Hora do Registro:
              </span>
              <span className="font-semibold text-slate-800">{timestamp}</span>
            </div>
          </div>

          {/* Notificação informativa */}
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50/70 border border-blue-200 p-4 text-left">
            <FileCheck2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              O chamado já está disponível na lista de atendimentos. Você pode acompanhar a interação técnica, adicionar mensagens ou enviar mais fotos a qualquer momento através do chat de acompanhamento.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => onNavigate('inicio')}
            >
              Voltar ao Início
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5"
              onClick={() => onNavigate('meus-chamados')}
            >
              <ExternalLink className="h-4 w-4" />
              Ver Meus Chamados
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Abertura de Chamado</h1>
        <p className="mt-1 text-sm text-slate-500">
          Registre incidentes ou solicitações de serviço com evidências visuais para a equipe de TI.
        </p>
      </div>

      {/* Identificação Automática */}
      {user && (
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Solicitante Identificado</p>
            <p className="text-sm text-blue-800 mt-0.5">
              <strong>{user.name}</strong> &mdash; Lotação: {user.department}
            </p>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-slate-100"></div>
          <div
            className="absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-slate-800 transition-all duration-300"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  step > i
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : step === i
                    ? 'border-slate-900 bg-white text-slate-900'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {step > i ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${step >= i ? 'text-slate-800' : 'text-slate-400'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* STEP 0: Categoria e Título */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <Field label="1. Qual é a categoria do problema ou solicitação?">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="2. Resumo da solicitação (Título)" hint="Ex: Erro de comunicação no módulo de habilitação">
              <Input
                placeholder="Digite um título claro e objetivo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </Field>
          </div>
        )}

        {/* STEP 1: Detalhamento & Anexos */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <Field label="3. Descreva o problema detalhadamente" hint="Descreva o que ocorreu e os sistemas envolvidos.">
              <Textarea
                rows={4}
                placeholder="Explique o que aconteceu, telas acessadas e mensagens de erro exibidas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Field>

            {/* Seção de Anexo de Fotos / Evidências */}
            <Field label="Evidências Visuais / Fotos do Erro (Opcional)" hint="Adicione capturas de tela ou fotos da tela/equipamento.">
              <div className="mt-2 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 mb-2">
                    <Paperclip className="h-5 w-5 text-slate-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Clique para anexar fotos ou capturas de tela</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Formatos suportados: PNG, JPG ou WEBP</p>
                </div>

                {/* Previews dos Anexos */}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {attachments.map((imgSrc, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                        <img src={imgSrc} alt={`Anexo ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          title="Remover anexo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="4. Quando o problema começou?">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Field>

              <Field label="5. O problema impede suas atividades?">
                <Select value={blocking} onChange={(e) => setBlocking(e.target.value)} required>
                  <option value="">Selecione...</option>
                  <option value="sim_total">Sim, paralisação total das tarefas</option>
                  <option value="sim_parcial">Parcialmente (consigo fazer outras atividades)</option>
                  <option value="nao">Não, apenas ajuste ou solicitação pontual</option>
                </Select>
              </Field>
            </div>
          </div>
        )}

        {/* STEP 2: Urgência e Impacto */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <Field label="6. Nível de Impacto Operacional">
              <div className="space-y-3 mt-2">
                <button
                  type="button"
                  onClick={() => setUrgency('baixa')}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    urgency === 'baixa'
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    urgency === 'baixa' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${urgency === 'baixa' ? 'text-blue-900' : 'text-slate-800'}`}>Baixa / Normal</p>
                    <p className={`text-sm ${urgency === 'baixa' ? 'text-blue-700' : 'text-slate-500'}`}>Afeta apenas 1 usuário, sem interrupção crítica do trabalho.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('media')}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    urgency === 'media'
                      ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    urgency === 'media' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${urgency === 'media' ? 'text-amber-900' : 'text-slate-800'}`}>Média / Urgente</p>
                    <p className={`text-sm ${urgency === 'media' ? 'text-amber-700' : 'text-slate-500'}`}>Afeta um setor inteiro ou processo importante da unidade.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('alta')}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    urgency === 'alta'
                      ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    urgency === 'alta' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`font-semibold ${urgency === 'alta' ? 'text-rose-900' : 'text-slate-800'}`}>Alta / Crítica</p>
                    <p className={`text-sm ${urgency === 'alta' ? 'text-rose-700' : 'text-slate-500'}`}>Paralisação geral de serviço essencial do órgão.</p>
                  </div>
                </button>
              </div>
            </Field>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => (step === 0 ? onNavigate('inicio') : setStep(step - 1))}
        >
          {step === 0 ? 'Cancelar' : (
            <span className="flex items-center gap-1"><ChevronLeft className="h-4 w-4"/> Voltar</span>
          )}
        </Button>

        {step < steps.length - 1 ? (
          <Button variant="primary" disabled={!canNext()} onClick={() => setStep(step + 1)}>
            <span className="flex items-center gap-1">Próximo Passo <ChevronRight className="h-4 w-4"/></span>
          </Button>
        ) : (
          <Button variant="primary" disabled={!canNext()} onClick={handleSubmit}>
            <span className="flex items-center gap-1.5"><Send className="h-4 w-4"/> Abrir Chamado Oficial</span>
          </Button>
        )}
      </div>
    </div>
  );
}
