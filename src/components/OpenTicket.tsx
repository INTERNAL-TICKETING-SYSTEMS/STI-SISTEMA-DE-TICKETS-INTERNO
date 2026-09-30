import { useState } from 'react';
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
  Package,
  HelpCircle,
} from 'lucide-react';
import { Page } from '@/components/Sidebar';

interface OpenTicketProps {
  onNavigate: (p: Page) => void;
  onSubmit: (data: { title: string; category: string; description: string; urgency: string; startDate: string; blocking: string }) => void;
}

const categories = [
  { id: 'sistema', label: 'Sistema ou programa não abre', icon: Monitor },
  { id: 'impressora', label: 'Impressora', icon: Printer },
  { id: 'internet', label: 'Internet ou rede', icon: Wifi },
  { id: 'acesso', label: 'Senha ou acesso', icon: KeyRound },
  { id: 'software', label: 'Instalar um programa', icon: Package },
  { id: 'outro', label: 'Outro problema', icon: HelpCircle },
];

const steps = ['O que você precisa?', 'Conte o que está acontecendo', 'Quão urgente é?'];

export default function OpenTicket({ onNavigate, onSubmit }: OpenTicketProps) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [blocking, setBlocking] = useState('');
  const [urgency, setUrgency] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState('');

  const canNext = () => {
    if (step === 0) return category !== '' && title.trim() !== '';
    if (step === 1) return description.trim() !== '' && startDate !== '' && blocking !== '';
    if (step === 2) return urgency !== '';
    return false;
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      category: categories.find((c) => c.id === category)?.label ?? 'Outro problema',
      description,
      urgency,
      startDate,
      blocking,
    });
    setProtocol(`STI-2026-${String(Math.floor(4200 + Math.random() * 100)).padStart(4, '0')}`);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-slide-up">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-sti-navy-800">Chamado enviado!</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          Seu chamado foi registrado com o protocolo <span className="font-semibold text-sti-navy-700">{protocol}</span>.
          A equipe de TI vai analisar e entrar em contato pelo sistema.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={() => onNavigate('inicio')}>
            Voltar ao início
          </Button>
          <Button onClick={() => onNavigate('meus-chamados')}>Ver meus chamados</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sti-navy-800">Abrir um chamado</h1>
        <p className="mt-2 text-sm text-slate-500">
          Responda algumas perguntas rápidas para que possamos ajudar você.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i < step
                    ? 'bg-sti-teal-500 text-white'
                    : i === step
                    ? 'bg-sti-navy-800 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  i <= step ? 'text-sti-navy-800' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-sti-teal-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sti animate-fade-in">
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <Field label="O que você precisa?" hint="Escolha a opção que mais se aproxima do seu problema.">
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        active
                          ? 'border-sti-teal-400 bg-sti-teal-50 ring-2 ring-sti-teal-100'
                          : 'border-slate-200 hover:border-sti-navy-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-sti-teal-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${active ? 'text-sti-navy-800' : 'text-slate-600'}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Dê um título curto para o problema" hint="Por exemplo: 'Não consigo imprimir na sala 302'">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escreva um título curto"
                maxLength={80}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <Field label="Conte o que está acontecendo" hint="Quanto mais detalhes, mais rápido conseguimos ajudar.">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Quando eu tento abrir o sistema de notas, ele fica carregando e nunca abre. Já reiniciei o computador mas não resolveu."
                rows={5}
              />
            </Field>

            <Field label="Quando começou o problema?">
              <Select value={startDate} onChange={(e) => setStartDate(e.target.value)}>
                <option value="">Selecione…</option>
                <option value="hoje">Hoje</option>
                <option value="ontem">Ontem ou nos últimos 2 dias</option>
                <option value="semana">Esta semana</option>
                <option value="mais">Há mais de uma semana</option>
              </Select>
            </Field>

            <Field label="Esse problema está atrapalhando seu trabalho?">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'sim', label: 'Sim, não consigo trabalhar' },
                  { v: 'parcial', label: 'Mais ou menos, dá para contornar' },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setBlocking(opt.v)}
                    className={`rounded-xl border p-4 text-sm font-medium transition-all ${
                      blocking === opt.v
                        ? 'border-sti-teal-400 bg-sti-teal-50 text-sti-navy-800 ring-2 ring-sti-teal-100'
                        : 'border-slate-200 text-slate-600 hover:border-sti-navy-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <Field label="Quão urgente é?" hint="Isso nos ajuda a organizar a fila de atendimento.">
              <div className="flex flex-col gap-3">
                {[
                  { v: 'alta', label: 'Urgente — não consigo trabalhar', desc: 'Atendemos o mais rápido possível', color: 'red' },
                  { v: 'media', label: 'Importante, mas posso esperar', desc: 'Atendemos no mesmo dia', color: 'amber' },
                  { v: 'baixa', label: 'Não tenho pressa', desc: 'Atendemos quando possível', color: 'slate' },
                ].map((opt) => {
                  const active = urgency === opt.v;
                  return (
                    <button
                      key={opt.v}
                      onClick={() => setUrgency(opt.v)}
                      className={`flex items-start gap-4 rounded-xl border p-5 text-left transition-all ${
                        active
                          ? 'border-sti-teal-400 bg-sti-teal-50 ring-2 ring-sti-teal-100'
                          : 'border-slate-200 hover:border-sti-navy-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                          active ? 'border-sti-teal-500 bg-sti-teal-500' : 'border-slate-300'
                        }`}
                      />
                      <div>
                        <p className={`text-sm font-semibold ${active ? 'text-sti-navy-800' : 'text-slate-700'}`}>
                          {opt.label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => (step === 0 ? onNavigate('inicio') : setStep(step - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </Button>

        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Avançar
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canNext()}>
            <Send className="h-4 w-4" />
            Enviar chamado
          </Button>
        )}
      </div>
    </div>
  );
}
