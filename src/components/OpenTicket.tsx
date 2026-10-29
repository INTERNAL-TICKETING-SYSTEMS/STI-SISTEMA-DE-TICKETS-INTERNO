import React, { useEffect, useState, useRef } from 'react';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import { preencherDescricao } from './helpArticles';
import './open-ticket-theme.css';
import { SETORES_DETRAN } from '@/data/setores';
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
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Undo2,
  Redo2,
} from 'lucide-react';
import { Page } from '@/components/Sidebar';

export interface OpenTicketSubmitData {
  title: string;
  category: string;
  description: string;
  urgency: string;
  startDate: string;
  blocking: string;
  attachments: string[];
}

interface OpenTicketProps {
  user?: User;
  onNavigate: (p: Page) => void;
  onSubmit: (
    data: OpenTicketSubmitData
  ) => Promise<{ protocolo: string }>;
}

const categories = [

  {
    id: 'rede',
    label: 'Redes e Internet (Wi-Fi, Cabeamento, VPN)',
    icon: Wifi,
  },
  {
    id: 'hardware',
    label: 'Equipamentos (Computador, Monitor, Nobreak)',
    icon: Server,
  },
  {
    id: 'impressora',
    label: 'Impressão (Impressora, Scanner, Toner)',
    icon: Printer,
  },
  {
    id: 'telefonia',
    label: 'Telefonia e Comunicação (Ramal mudo, E-mail)',
    icon: Phone,
  },
  {
    id: 'acesso',
    label: 'Acessos e Senhas (Desbloqueio, Permissões)',
    icon: KeyRound,
  },
  {
    id: 'outro',
    label: 'Outro problema / Dúvida geral',
    icon: HelpCircle,
  },
];

function gerarModeloChamado(
  categoryId: string,
  user?: User,
  tipoAcesso?: string,
): { title: string; description: string } {
  const nome = user?.name?.trim() || '[Preencher nome completo]';
  const cpf = user?.cpf?.trim() || '[Conferir CPF, se necessário]';
  const email = user?.email?.trim() || '[Preencher e-mail]';
  const setor = user?.department?.trim() || '[Preencher setor/lotação]';

  const identificacao = `
Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}`;

  const modelos: Record<string, { title: string; problema: string }> = {
    rede: {
      title: 'Solicitação de suporte de rede ou internet',
      problema: `Solicito análise técnica para solucionar dificuldades de conexão com a rede ou internet institucional.

DESCRIÇÃO DO PROBLEMA
[Descreva o problema, o local onde ocorre e quando começou.]

INFORMAÇÕES COMPLEMENTARES
Mensagem de erro: [Informar, se houver.]
Equipamento afetado: [Informar, se necessário.]
Procedimentos já realizados: [Informar, se houver.]`,
    },

    hardware: {
      title: 'Solicitação de suporte para equipamento',
      problema: `Solicito análise técnica do equipamento utilizado em minhas atividades institucionais.

DESCRIÇÃO DO PROBLEMA
[Descreva a falha, a lentidão ou o comportamento observado.]

INFORMAÇÕES COMPLEMENTARES
Identificação ou patrimônio: [Informar, se disponível.]
Quando começou: [Informar.]
Mensagem de erro: [Informar, se houver.]
Procedimentos já realizados: [Informar, se houver.]`,
    },

    impressora: {
      title: 'Solicitação de suporte para impressão',
      problema: `Solicito verificação técnica da impressora ou do serviço de impressão utilizado nas atividades institucionais.

DESCRIÇÃO DO PROBLEMA
[Descreva o que acontece ao tentar imprimir ou digitalizar.]

INFORMAÇÕES COMPLEMENTARES
Identificação ou localização da impressora: [Informar.]
Mensagem apresentada: [Informar, se houver.]
Procedimentos já realizados: [Informar, se houver.]`,
    },

    telefonia: {
      title: 'Solicitação de suporte de comunicação',
      problema: `Solicito suporte técnico para solucionar uma dificuldade relacionada à telefonia ou à comunicação institucional.

DESCRIÇÃO DO PROBLEMA
[Informe se o problema está relacionado ao ramal, e-mail ou outro serviço de comunicação.]

INFORMAÇÕES COMPLEMENTARES
Ramal ou serviço afetado: [Informar.]
Mensagem de erro: [Informar, se houver.]
Quando começou: [Informar.]`,
    },

    acesso: {
      title:
        tipoAcesso === 'pasta'
          ? 'Solicitação de acesso a pasta compartilhada'
          : tipoAcesso === 'desbloqueio'
            ? 'Solicitação de desbloqueio de conta'
            : 'Solicitação de redefinição de senha',

      problema:
        tipoAcesso === 'pasta'
          ? `Solicito acesso a uma pasta compartilhada da rede institucional para realizar minhas atividades de trabalho.`

          : tipoAcesso === 'desbloqueio'
            ? `Solicito a verificação e o desbloqueio da conta de acesso indicada abaixo, caso seja confirmado o bloqueio.

Solicito a regularização do acesso conforme os procedimentos de segurança da organização.`

            : `Solicito suporte para a redefinição da senha de acesso ao computador, domínio ou sistema institucional.`,
    },

    outro: {
      title: 'Solicitação de suporte técnico',
      problema: `Solicito análise da equipe de TI para a situação descrita a seguir.

DESCRIÇÃO DA SOLICITAÇÃO
[Explique o que aconteceu e qual suporte é necessário.]

INFORMAÇÕES COMPLEMENTARES
Quando começou: [Informar.]
Mensagem de erro: [Informar, se houver.]
Procedimentos já realizados: [Informar, se houver.]`,
    },
  };

  const modelo = modelos[categoryId] ?? modelos.outro;

  return {
    title: modelo.title,
    description: `Bom dia,

${identificacao}




Atenciosamente,
${nome}`,
  };
}

const steps = [
  'Classificação',
  'Detalhamento & Anexos',
  'Impacto & Urgência',
];

function executarFormatacao(comando: string, valor?: string) {
  document.execCommand(comando, false, valor);
}

export default function OpenTicket({
  user,
  onNavigate,
  onSubmit,
}: OpenTicketProps) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Destinatário do chamado: o próprio solicitante ou outra pessoa.
  const [showRecipientChoice, setShowRecipientChoice] = useState(false);
  const [recipientType, setRecipientType] = useState<'self' | 'other' | null>(null);
  const [baseDescription, setBaseDescription] = useState('');

  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryCpf, setBeneficiaryCpf] = useState('');
  const [beneficiaryEmail, setBeneficiaryEmail] = useState('');
  const [beneficiaryDepartment, setBeneficiaryDepartment] = useState(
    user?.department?.trim() || ''
  );
  const [sameDepartment, setSameDepartment] = useState(true);
  const [beneficiaryError, setBeneficiaryError] = useState('');
  useEffect(() => {
    const raw = sessionStorage.getItem('sti_help_prefill_ticket');

    if (!raw) return;

    setShowSuggestions(false);

    try {
      const data = JSON.parse(raw) as {
        category?: unknown;
        title?: unknown;
        descriptionTemplate?: unknown;
      };

      if (typeof data.category === 'string') {
        setCategory(data.category);
      }

      if (typeof data.title === 'string') {
        setTitle(data.title);
      }

      if (typeof data.descriptionTemplate === 'string') {
        setDescription(
          preencherDescricao(data.descriptionTemplate, user),
        );
      }

      setStep(0);
    } catch {
      // Ignora dados inválidos armazenados.
    } finally {
      sessionStorage.removeItem('sti_help_prefill_ticket');
    }
  }, [user]);
  const [startDate, setStartDate] = useState('');
  const [blocking, setBlocking] = useState('');
  const [urgency, setUrgency] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [copied, setCopied] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelosSolicitacao = [
    {
      id: 'reset_senha',
      titulo: 'Reset de senha do computador',
      descricao: 'Redefinição de senha do domínio TOCANTINS.',
      categoria: 'acesso',
      icone: KeyRound,
    },
    {
      id: 'pasta_compartilhada',
      titulo: 'Liberar acesso a pasta compartilhada',
      descricao: 'Solicitar permissão para acessar uma pasta da rede.',
      categoria: 'acesso',
      icone: Server,
    },
    {
      id: 'zimbra_detran',
      titulo: 'Criar acesso ao e-mail Zimbra',
      descricao: 'Solicitar criação de acesso ao e-mail institucional do DETRAN.',
      categoria: 'acesso',
      icone: ShieldCheck,
    },
    {
      id: 'acesso_computador',
      titulo: 'Criar acesso ao computador',
      descricao: 'Solicitar criação ou configuração de acesso ao computador.',
      categoria: 'acesso',
      icone: Monitor,
    },
    {
      id: 'acesso_completo',
      titulo: 'Criar acessos completos',
      descricao: 'Computador, e-mail Zimbra e pasta compartilhada.',
      categoria: 'acesso',
      icone: Building2,
    },
    {
      id: 'impressora_acesso',
      titulo: 'Liberar acesso à impressora',
      descricao: 'Solicitar permissão para utilizar uma impressora institucional.',
      categoria: 'impressora',
      icone: Printer,
    },
    {
      id: 'outro',
      titulo: 'Outro problema ou solicitação',
      descricao: 'Abrir um chamado para uma necessidade diferente das opções anteriores.',
      categoria: 'outro',
      icone: HelpCircle,
    },
  ];

  
  function selecionarModelo(modeloId: string) {
    const modelo = modelosSolicitacao.find(
      (item) => item.id === modeloId,
    );

    if (!modelo) return;

    const nome =
      user?.name?.trim() || '[Preencher nome completo]';

    const cpf =
      user?.cpf?.trim() || '[Conferir CPF, se necessário]';

    const email =
      user?.email?.trim() || '[Preencher e-mail]';

    const setor =
      user?.department?.trim() || '[Preencher setor/lotação]';

    const identificacao = `Bom dia,

Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}`;

    let novoTitulo = modelo.titulo;
    let novaDescricao = '';

    switch (modeloId) {
      case 'reset_senha': {
        novoTitulo = 'Reset de senha do computador — Domínio TOCANTINS';

        novaDescricao = `Bom dia,

Solicito a redefinição da senha de acesso ao computador no domínio TOCANTINS.


Atenciosamente,
${nome}`;

        break;
      }

      case 'pasta_compartilhada': {
        novoTitulo = 'Liberar acesso a pasta compartilhada';

        novaDescricao = `Bom dia,

Solicito acesso a uma pasta compartilhada da rede para realizar atividades correlacionadas.


Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}


Atenciosamente,
${nome}`;

        break;
      }

      case 'zimbra_detran': {
        novoTitulo = 'Criar acesso ao e-mail Zimbra do DETRAN';

        novaDescricao = `Bom dia,

Solicito a criação e configuração de acesso ao e-mail institucional Zimbra do DETRAN.

DADOS DO SOLICITANTE
Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}



Atenciosamente,
${nome}`;

        break;
      }

      case 'acesso_computador': {
        novoTitulo = 'Criar acesso ao computador — Domínio TOCANTINS';

        novaDescricao = `Bom dia,

Solicito a criação ou configuração de acesso ao computador no domínio TOCANTINS.

DADOS DO SOLICITANTE
Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}

Atenciosamente,
${nome}`;

        break;
      }

      case 'acesso_completo': {
        novoTitulo =
          'Criar acesso ao computador, e-mail Zimbra e liberar acesso a pasta compartilhada';

        novaDescricao = `Bom dia,

Solicito a criação dos seguintes acessos institucionais:
- Acesso ao computador no domínio TOCANTINS;
- Acesso ao e-mail institucional Zimbra do DETRAN;
- Acesso a pasta compartilhada da rede institucional.

DADOS DO SOLICITANTE
Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}


Atenciosamente,
${nome}`;

        break;
      }

      case 'impressora_acesso': {
        novoTitulo = 'Liberar acesso à impressora — Domínio TOCANTINS';

        novaDescricao = `Bom dia,

Solicito a liberação de acesso à impressora institucional no domínio TOCANTINS.

DADOS DO SOLICITANTE
Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}


Atenciosamente,
${nome}`;

        break;
      }

      case 'outro': {
        novoTitulo = 'Solicitação de suporte técnico';

        novaDescricao = `Bom dia,

Solicito suporte técnico para a seguinte situação:
[Descreva o problema ou a necessidade.]

DADOS DO SOLICITANTE
Nome: ${nome}
CPF: ${cpf}
E-mail: ${email}
Setor/Lotação: ${setor}



Atenciosamente,
${nome}`;

        break;
      }

      default:
        return;
    }

    // Atualiza a sauda��o conforme o hor�rio local do computador.
    const horaAtual = new Date().getHours();
    const saudacao = horaAtual < 12 ? 'Bom dia,' : 'Boa tarde,';
    novaDescricao = novaDescricao.replace(/^Bom dia,/i, saudacao);

    setCategory(modelo.categoria);
    setTitle(novoTitulo);
    setBaseDescription(novaDescricao);
    setRecipientType(null);
    setBeneficiaryError('');
    setBeneficiaryName('');
    setBeneficiaryCpf('');
    setBeneficiaryEmail('');
    setSameDepartment(true);
    setBeneficiaryDepartment(user?.department?.trim() || '');
    setShowRecipientChoice(true);
    setStep(0);
    setShowSuggestions(false);
  }

  const canNext = () => {
    if (step === 0) {
      return category !== '' && title.trim() !== '';
    }

    if (step === 1) {
      return (
        description.trim() !== '' &&
        startDate !== '' &&
        blocking !== ''
      );
    }

    if (step === 2) {
      return urgency !== '';
    }

    return false;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAttachments((prev) => [
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

  const removeAttachment = (
    indexToRemove: number
  ) => {
    setAttachments((prev) =>
      prev.filter(
        (_, idx) => idx !== indexToRemove
      )
    );
  };

  const handleCopyProtocol = () => {
    navigator.clipboard.writeText(protocol);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const continuarComoOutraPessoa = () => {
    const nome = beneficiaryName.trim();
    const cpf = beneficiaryCpf.trim();
    const email = beneficiaryEmail.trim();
    const setor = beneficiaryDepartment.trim();

    if (!nome || !cpf || !email || !setor) {
      setBeneficiaryError(
        'Preencha o nome, CPF, e-mail e setor da pessoa que será atendida.'
      );
      return;
    }

    if (!/^\d{11}$/.test(cpf.replace(/\D/g, ''))) {
      setBeneficiaryError('Informe um CPF válido com 11 dígitos.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setBeneficiaryError('Informe um endereço de e-mail válido.');
      return;
    }

    const solicitanteNome = user?.name?.trim() || 'Não informado';
    const solicitanteCpf = user?.cpf?.trim() || 'Não informado';
    const solicitanteEmail = user?.email?.trim() || 'Não informado';
    const solicitanteSetor = user?.department?.trim() || 'Não informado';

    // Retira a sauda��o, os dados antigos do solicitante e a assinatura
    // para evitar informa��es duplicadas na descri��o final.
    const corpoModelo = baseDescription
      .replace(/^\s*(?:Bom dia|Boa tarde),\s*/i, '')
      .replace(
        /DADOS DO SOLICITANTE\s*\r?\n\s*Nome:[^\r\n]*\r?\n\s*CPF:[^\r\n]*\r?\n\s*E-mail:[^\r\n]*\r?\n\s*Setor\/Lota��o:[^\r\n]*/i,
        ''
      )
      .replace(
        /(?:^|\r?\n)\s*Nome:[^\r\n]*\r?\n\s*CPF:[^\r\n]*\r?\n\s*E-mail:[^\r\n]*\r?\n\s*Setor\/Lota��o:[^\r\n]*/i,
        ''
      )
      .replace(/\r?\n?\s*Atenciosamente,\s*\r?\n[\s\S]*$/i, '')
      .trim();

    // Usa o hor�rio local do computador.
    const horaAtual = new Date().getHours();
    const saudacao = horaAtual < 12 ? 'Bom dia,' : 'Boa tarde,';

    // A solicita��o aparece logo ap�s a sauda��o.
    const descricaoFinal = [
      saudacao,
      '',
      corpoModelo,
      '',
      'DADOS DE QUEM ABRIU O CHAMADO',
      `Nome: ${solicitanteNome}`,
      `CPF: ${solicitanteCpf}`,
      `E-mail: ${solicitanteEmail}`,
      `Setor/Lotação: ${solicitanteSetor}`,
      '',
      'DADOS DA PESSOA QUE SERÁ ATENDIDA',
      `Nome: ${nome}`,
      `CPF: ${cpf}`,
      `E-mail: ${email}`,
      `Setor/Lotação: ${setor}`,
      '',
      'Atenciosamente,',
      solicitanteNome,
    ].join('\n');

    setDescription(descricaoFinal);
    setBeneficiaryError('');
    setShowRecipientChoice(false);
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const ticketData: OpenTicketSubmitData = {
        title,
        category:
          categories.find((c) => c.id === category)?.label ??
          'Outro problema',
        description,
        urgency,
        startDate,
        blocking,
        attachments,
      };

      const resultado = await onSubmit(ticketData);

      setProtocol(resultado.protocolo);
      setTimestamp(new Date().toLocaleString('pt-BR'));
      setSubmitted(true);
    } catch (error) {
      console.error('[STI] Erro ao abrir chamado:', error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar o chamado. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // TELA DE CONFIRMAÇÃO
  // ============================================================

  if (submitted) {
    return (
      <div className="open-ticket max-w-2xl mx-auto py-10 px-4 animate-fade-in">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg text-center relative overflow-hidden dark:border-slate-700 dark:bg-slate-900">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"></div>

          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
              <CheckCircle2
                className="h-12 w-12 text-emerald-600 animate-bounce"
                style={{
                  animationIterationCount: '2',
                }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Registro Oficial Homologado
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">
            Chamado Aberto com Sucesso!
          </h2>

          <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto dark:text-slate-300">
            Sua solicitação foi registrada no STI e encaminhada para a triagem da equipe técnica da Diretoria de Tecnologia da Informação.
          </p>

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
                    <span className="text-emerald-400 font-semibold">
                      Copiado!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-300" />
                    <span>
                      Copiar Protocolo
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-left text-xs space-y-3 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">
                Assunto:
              </span>

              <span className="font-semibold text-slate-800 text-right max-w-xs truncate dark:text-slate-100">
                {title}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">
                Categoria:
              </span>

              <span className="font-semibold text-slate-800">
                {
                  categories.find(
                    (c) => c.id === category
                  )?.label
                }
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">
                Prioridade / Urgência:
              </span>

              <span
                className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${urgency === 'alta'
                  ? 'bg-rose-100 text-rose-700'
                  : urgency === 'media'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}
              >
                {urgency === 'alta'
                  ? 'Alta / Crítica'
                  : urgency === 'media'
                    ? 'Média / Urgente'
                    : 'Baixa / Normal'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">
                Evidências Anexadas:
              </span>

              <span className="font-semibold text-slate-800">
                {attachments.length > 0
                  ? `${attachments.length} foto(s) anexada(s)`
                  : 'Nenhuma imagem'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Data e Hora do Registro:
              </span>

              <span className="font-semibold text-slate-800">
                {timestamp}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50/70 border border-blue-200 p-4 text-left dark:bg-blue-950/40 dark:border-blue-900">
            <FileCheck2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />

            <p className="text-xs text-blue-900 leading-relaxed dark:text-blue-200">
              O chamado já está disponível na lista de atendimentos. Você pode acompanhar a interação técnica, adicionar mensagens ou enviar mais fotos a qualquer momento através do chat de acompanhamento.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() =>
                onNavigate('inicio')
              }
            >
              Voltar ao Início
            </Button>

            <Button
              variant="primary"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5"
              onClick={() =>
                onNavigate('meus-chamados')
              }
            >
              <ExternalLink className="h-4 w-4" />
              Ver Meus Chamados
            </Button>
          </div>
        </div>
      </div>
    );
  }


  if (showSuggestions) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => onNavigate('inicio')}
            className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={18} />
            Voltar ao início
          </button>

          <div className="mb-8">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              <ShieldCheck size={16} />
              Central de solicitações
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Como podemos ajudar?
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Selecione o tipo de solicitação. Vamos preparar o formulário
              com as informações iniciais para facilitar a abertura do seu
              chamado.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modelosSolicitacao.map((modelo) => {
              const Icone = modelo.icone;

              return (
                <button
                  key={modelo.id}
                  type="button"
                  onClick={() => selecionarModelo(modelo.id)}
                  className="group flex min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500 dark:focus:ring-offset-slate-950"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:group-hover:bg-teal-900">
                    <Icone size={24} />
                  </span>

                  <span className="text-base font-semibold leading-6 text-slate-900 dark:text-white">
                    {modelo.titulo}
                  </span>

                  <span className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {modelo.descricao}
                  </span>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    Selecionar solicitação
                    <ChevronRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">
                Antes de enviar:
              </strong>{' '}
              confira o assunto, complete os campos pendentes e verifique
              se a solicitação contém as informações necessárias.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // FORMULÁRIO
  // ============================================================

  if (showRecipientChoice && recipientType === null) {
    return (
      <div className="open-ticket mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setShowRecipientChoice(false);
              setShowSuggestions(true);
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
          >
            <ChevronLeft size={16} />
            Voltar aos modelos
          </button>

          <h1 className="text-2xl font-bold">Para quem é este chamado?</h1>
          <p className="text-sm text-muted-foreground">
            Escolha quem precisa do atendimento. Os dados de quem abriu o chamado
            serão mantidos separadamente.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              const nome = user?.name?.trim() || 'Não informado';
              const cpf = user?.cpf?.trim() || 'Não informado';
              const email = user?.email?.trim() || 'Não informado';
              const setor = user?.department?.trim() || 'Não informado';

              const saudacao =
                new Date().getHours() < 12 ? 'Bom dia,' : 'Boa tarde,';

              const isResetSenha = baseDescription.includes(
                'Solicito a redefinição da senha de acesso ao computador no domínio TOCANTINS.'
              );

              if (isResetSenha) {
                const corpo = baseDescription
                  .replace(/^\s*(?:Bom dia|Boa tarde),\s*/i, '')
                  .replace(/\s*Atenciosamente,[\s\S]*$/i, '')
                  .trim();

                const descricaoFinal = [
                  saudacao,
                  '',
                  corpo,
                  '',
                  'DADOS DE QUEM ABRIU O CHAMADO',
                  `Nome: ${nome}`,
                  `CPF: ${cpf}`,
                  `E-mail: ${email}`,
                  `Setor/Lotação: ${setor}`,
                  '',
                  'Atenciosamente,',
                  nome,
                ].join('\n');

                setDescription(descricaoFinal);
              } else {
                setDescription(baseDescription);
              }

              setRecipientType('self');
              setShowRecipientChoice(false);
            }}
            className="rounded-xl border p-6 text-left transition hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-lg font-semibold">Para mim</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Eu preciso do atendimento. Usar meus dados cadastrados.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setRecipientType('other');
              setBeneficiaryError('');
            }}
            className="rounded-xl border p-6 text-left transition hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Building2 size={24} />
              </div>
              <span className="text-lg font-semibold">Para outra pessoa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Estou abrindo o chamado em nome de outra pessoa.
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (showRecipientChoice && recipientType === 'other') {
    return (
      <div className="open-ticket mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setRecipientType(null);
              setBeneficiaryError('');
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
          >
            <ChevronLeft size={16} />
            Voltar à escolha
          </button>

          <h1 className="text-2xl font-bold">Dados da pessoa atendida</h1>
          <p className="text-sm text-muted-foreground">
            Informe os dados de quem precisa do serviço solicitado.
          </p>
        </header>

        <div className="space-y-5 rounded-xl border p-5 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="beneficiary-name" className="text-sm font-medium">
              Nome completo *
            </label>
            <Input
              id="beneficiary-name"
              value={beneficiaryName}
              onChange={(event) => setBeneficiaryName(event.target.value)}
              placeholder="Nome completo da pessoa atendida"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="beneficiary-cpf" className="text-sm font-medium">
              CPF *
            </label>
            <Input
              id="beneficiary-cpf"
              type="text"
              value={beneficiaryCpf}
              onChange={(event) => {
                const digitos = event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 11);

                let cpfFormatado = digitos;

                if (digitos.length > 9) {
                  cpfFormatado =
                    `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9, 11)}`;
                } else if (digitos.length > 6) {
                  cpfFormatado =
                    `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
                } else if (digitos.length > 3) {
                  cpfFormatado =
                    `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
                }

                setBeneficiaryCpf(cpfFormatado);
              }}
              placeholder="000.000.000-00"
              inputMode="numeric"
              maxLength={14}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="beneficiary-email" className="text-sm font-medium">
              E-mail institucional *
            </label>
            <Input
              id="beneficiary-email"
              type="email"
              value={beneficiaryEmail}
              onChange={(event) => setBeneficiaryEmail(event.target.value)}
              placeholder="nome@orgao.gov.br"
              autoComplete="email"
            />
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={sameDepartment}
                onChange={(event) => {
                  const marcado = event.target.checked;
                  setSameDepartment(marcado);
                  if (marcado) {
                    setBeneficiaryDepartment(user?.department?.trim() || '');
                  } else if (
                    beneficiaryDepartment === user?.department?.trim()
                  ) {
                    setBeneficiaryDepartment('');
                  }
                }}
                className="mt-1"
              />
              <span>
                <span className="block font-medium">
                  Utilizar o mesmo setor do solicitante
                </span>
                <span className="text-muted-foreground">
                  {user?.department?.trim() || 'O setor do solicitante não está informado.'}
                </span>
              </span>
            </label>

            <div className="space-y-2">
              <label htmlFor="beneficiary-department" className="text-sm font-medium">
                Setor/Lotação da pessoa atendida *
              </label>

              <Select
                id="beneficiary-department"
                value={beneficiaryDepartment}
                onChange={(event) => setBeneficiaryDepartment(event.target.value)}
                disabled={sameDepartment}
              >
                <option value="">Selecione o setor</option>

                {beneficiaryDepartment &&
                  !SETORES_DETRAN.some(
                    (setor) => setor.nome === beneficiaryDepartment
                  ) && (
                    <option value={beneficiaryDepartment}>
                      {beneficiaryDepartment}
                    </option>
                  )}

                {SETORES_DETRAN.map((setor) => (
                  <option key={setor.sigla} value={setor.nome}>
                    {setor.sigla} - {setor.nome}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {beneficiaryError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {beneficiaryError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setRecipientType(null);
                setBeneficiaryError('');
              }}
            >
              Voltar
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={continuarComoOutraPessoa}
            >
              Continuar
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="open-ticket mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Abertura de Chamado
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Descreva sua solicitação para a equipe de Tecnologia da Informação.
        </p>
      </header>

      {user && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Solicitante identificado
          </p>

          <p className="mt-1 text-sm text-blue-900 dark:text-blue-100">
            <strong>{user.name}</strong>
            {' — Lotação: '}
            {user.department}
          </p>
        </div>
      )}

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
        <div>
          <label
            htmlFor="ticket-subject"
            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Assunto:
          </label>

          <Input
            id="ticket-subject"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Informe o assunto do chamado"
            maxLength={100}
            required
          />
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Isso pode ser útil
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Consulte uma sugestão relacionada ao assunto do seu chamado.
            </p>
          </div>

          <div className="p-4">
            {title.trim() ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Antes de enviar, descreva o que você estava tentando fazer,
                  o que aconteceu e se apareceu alguma mensagem de erro.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const sugestao =
                      `Solicito análise técnica referente ao seguinte assunto: ${title.trim()}.\n\n` +
                      'DESCRIÇÃO DO PROBLEMA\n' +
                      '[Descreva o que aconteceu e em qual sistema ou equipamento.]\n\n' +
                      'MENSAGEM DE ERRO\n' +
                      '[Informe a mensagem apresentada, se houver.]\n\n' +
                      'PROCEDIMENTOS REALIZADOS\n' +
                      '[Informe as tentativas de solução, se houver.]';

                    setDescription(sugestao);
                  }}
                  className="text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300"
                >
                  Usar modelo de descrição
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Insira um assunto para receber orientações úteis.
              </p>
            )}
          </div>
        </section>

        <div>
          <label
            htmlFor="ticket-description"
            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Texto:
          </label>

          <div className="overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950">
            <div
              role="toolbar"
              aria-label="Formatação do texto"
              className="flex flex-wrap items-center gap-1 border-b border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
            >
              {[
                { label: 'Negrito', command: 'bold', icon: Bold },
                { label: 'Itálico', command: 'italic', icon: Italic },
                { label: 'Sublinhado', command: 'underline', icon: Underline },
                { label: 'Lista', command: 'insertUnorderedList', icon: List },
                { label: 'Lista numerada', command: 'insertOrderedList', icon: ListOrdered },
                { label: 'Alinhar à esquerda', command: 'justifyLeft', icon: AlignLeft },
                { label: 'Centralizar', command: 'justifyCenter', icon: AlignCenter },
                { label: 'Alinhar à direita', command: 'justifyRight', icon: AlignRight },
                { label: 'Desfazer', command: 'undo', icon: Undo2 },
                { label: 'Refazer', command: 'redo', icon: Redo2 },
              ].map(({ label, command, icon: Icon }) => (
                <button
                  key={command}
                  type="button"
                  title={label}
                  aria-label={label}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => executarFormatacao(command)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <Textarea
              id="ticket-description"
              rows={12}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descreva sua solicitação..."
              className="min-h-[300px] resize-y rounded-none border-0 shadow-none focus-visible:ring-0"
              required
            />
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Informe os detalhes necessários para que a equipe técnica possa
            compreender e analisar sua solicitação.
          </p>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Arquivos anexados
            </p>

            <div className="flex flex-wrap gap-2">
              {attachments.map((arquivo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700"
                >
                  <span>Imagem {index + 1}</span>

                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remover imagem ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />

          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Anexar imagens
            </span>
          </Button>
        </div>

        {submitError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {submitError}
          </div>
        )}

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => onNavigate('inicio')}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            disabled={!title.trim() || !description.trim() || submitting}
            onClick={handleSubmit}
          >
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {submitting ? 'Registrando chamado...' : 'Abrir chamado'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
