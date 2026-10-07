import { Ticket, User, TicketStatus } from '@/types';

export const currentUser: User = {
  name: 'Ana Carolina Mendes',
  email: 'ana.mendes@empresa.com.br',
  department: 'Financeiro',
  role: 'Analista Financeiro',
  phone: '(11) 98765-4321',
  userRole: 'usuario',
  roles: ['usuario'],
};

export const mockTechnicians: User[] = [

  {
    name: 'Daniel Santos',
    email: 'danielandsanfer@gmail.com',
    department: 'Manutenção / TI',
    role: 'Técnico de Suporte',
    phone: '(63) 99999-0001',
    userRole: 'tecnico',
  },

  {
    name: 'Guilherme Ferreira',
    email: 'guidetranto@gmail.com',
    department: 'Manutenção / TI',
    role: 'Técnico de Suporte',
    phone: '(63) 99999-0003',
    userRole: 'tecnico',
  },

  {
    name: 'João Pedro Moreira',
    email: 'joaopedromms20@gmail.com',
    department: 'Manutenção / TI',
    role: 'Técnico de Suporte',
    phone: '(63) 99999-0002',
    userRole: 'tecnico',
  },

  {
    name: 'Wanderson Alves',
    email: 'wandersonmaior@gmail.com',
    department: 'Manutenção / TI',
    role: ' Chefe TI/Técnico de Suporte',
    phone: '(63) 99999-0004',
    userRole: 'tecnico',
  },
];

export const currentTech: User = mockTechnicians[0];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    protocol: 'STI-2026-0148',
    title: 'Não consigo entrar no sistema financeiro',
    description:
      'Quando tento abrir o módulo de notas fiscais, a tela fica carregando e nunca termina. Já tentei fechar e abrir de novo.',
    category: 'Sistema / Acesso',
    status: 'em_andamento',
    priority: 'alta',
    createdAt: '2026-09-22T10:30:00',
    updatedAt: '2026-09-28T14:15:00',
    updates: [
      {
        id: 'u1',
        author: 'tecnico',
        authorName: 'Marina Alves',
        message: 'Estou analisando o problema. Pode me confirmar se aparece alguma mensagem de erro?',
        createdAt: '2026-09-22T11:00:00',
      },
      {
        id: 'u2',
        author: 'usuario',
        authorName: 'André Santos',
        message: 'Consigo acessar outros sistemas normalmente. Só o financeiro que não abre.',
        createdAt: '2026-09-22T11:10:00',
      },
      {
        id: 'u3',
        author: 'tecnico',
        authorName: 'Marina Alves',
        message: 'Perfeito, obrigada. Já estou verificando os logs do servidor. Em breve trago uma atualização.',
        createdAt: '2026-09-28T14:15:00',
      },
    ],
    requesterName: 'André Santos',
    requesterDepartment: 'Financeiro',
    requesterLocation: 'Sala 302 — 3º andar',
    requesterContact: '(11) 98123-4567',
    equipmentOrSystem: 'Sistema Financeiro ERP',
    approximateDate: '2026-09-22',
    impact: 'Alto — não consigo emitir notas fiscais',
    errorMessage: 'Timeout ao conectar com o servidor',
    attachments: ['erro_tela.png'],
    assignee: 'Marina Alves',
    attendanceStartedAt: '2026-09-22T11:00:00',
    solution: null,
    internalNotes: [
      {
        id: 'n1',
        authorName: 'Marina Alves',
        message: 'Possível problema de permissão no perfil do usuário. Verificar grupo de acesso no ERP.',
        createdAt: '2026-09-22T11:30:00',
      },
    ],
  },
  {
    id: '2',
    protocol: 'STI-2026-0149',
    title: 'Impressora não está funcionando',
    description: 'A impressora da sala 105 não responde quando mando imprimir. A luz fica piscando.',
    category: 'Hardware / Impressora',
    status: 'aberto',
    priority: 'media',
    createdAt: '2026-09-22T08:00:00',
    updatedAt: '2026-09-22T08:00:00',
    updates: [],
    requesterName: 'João Silva',
    requesterDepartment: 'Administrativo',
    requesterLocation: 'Sala 105 — 1º andar',
    requesterContact: '(11) 98234-5678',
    equipmentOrSystem: 'Impressora HP LaserJet 400',
    approximateDate: '2026-09-22',
    impact: 'Médio — consigo usar outra impressora',
    errorMessage: 'Luz de erro piscando no painel',
    attachments: [],
    assignee: null,
    attendanceStartedAt: null,
    solution: null,
    internalNotes: [],
  },
  {
    id: '3',
    protocol: 'STI-2026-0150',
    title: 'Internet cai com frequência no 2º andar',
    description: 'A internet fica caindo várias vezes ao dia, principalmente à tarde.',
    category: 'Rede / Internet',
    status: 'aberto',
    priority: 'alta',
    createdAt: '2026-09-23T09:00:00',
    updatedAt: '2026-09-23T09:00:00',
    updates: [],
    requesterName: 'Patrícia Lima',
    requesterDepartment: 'Marketing',
    requesterLocation: 'Sala 210 — 2º andar',
    requesterContact: '(11) 98345-6789',
    equipmentOrSystem: 'Rede Wi-Fi corporativa',
    approximateDate: '2026-09-20',
    impact: 'Alto — afeta toda a equipe do andar',
    errorMessage: 'Sem conexão — "Rede não identificada"',
    attachments: [],
    assignee: null,
    attendanceStartedAt: null,
    solution: null,
    internalNotes: [],
  },
  {
    id: '4',
    protocol: 'STI-2026-0151',
    title: 'Solicitação de instalação do Adobe Acrobat',
    description: 'Preciso do Adobe Acrobat para assinar documentos digitais.',
    category: 'Software / Instalação',
    status: 'aguardando',
    priority: 'baixa',
    createdAt: '2026-09-21T13:00:00',
    updatedAt: '2026-09-23T16:00:00',
    updates: [
      {
        id: 'u4',
        author: 'tecnico',
        authorName: 'Marina Alves',
        message: 'Preciso da aprovação do seu gestor para instalar o software. Pode solicitar?',
        createdAt: '2026-09-23T16:00:00',
      },
    ],
    requesterName: 'Carlos Ferreira',
    requesterDepartment: 'Jurídico',
    requesterLocation: 'Sala 401 — 4º andar',
    requesterContact: '(11) 98456-7890',
    equipmentOrSystem: 'Adobe Acrobat Pro',
    approximateDate: '2026-09-21',
    impact: 'Baixo — não impede o trabalho',
    errorMessage: 'Nenhuma',
    attachments: [],
    assignee: 'Marina Alves',
    attendanceStartedAt: '2026-09-23T15:00:00',
    solution: null,
    internalNotes: [],
  },
  {
    id: '5',
    protocol: 'STI-2026-0145',
    title: 'Computador lento ao abrir planilhas grandes',
    description: 'As planilhas do financeiro que tinham muitos dados estão demorando muito para abrir.',
    category: 'Hardware / Desempenho',
    status: 'resolvido',
    priority: 'media',
    createdAt: '2026-09-15T09:00:00',
    updatedAt: '2026-09-18T17:00:00',
    updates: [
      {
        id: 'u5',
        author: 'tecnico',
        authorName: 'Marina Alves',
        message: 'Memória RAM aumentada de 8GB para 16GB. Problema resolvido.',
        createdAt: '2026-09-18T17:00:00',
      },
    ],
    requesterName: 'Roberto Costa',
    requesterDepartment: 'Financeiro',
    requesterLocation: 'Sala 305 — 3º andar',
    requesterContact: '(11) 98567-8901',
    equipmentOrSystem: 'Desktop Dell OptiPlex 7090',
    approximateDate: '2026-09-15',
    impact: 'Médio — trabalhos demoram mais do que o normal',
    errorMessage: 'Nenhuma',
    attachments: [],
    assignee: 'Marina Alves',
    attendanceStartedAt: '2026-09-15T10:00:00',
    solution: 'Identificado que a máquina tinha apenas 8GB de RAM, insuficiente para planilhas grandes do setor financeiro. Realizada upgrade para 16GB de RAM. Testes realizados com o usuário, que confirmou que as planilhas agora abrem normalmente.',
    internalNotes: [],
  },
  {
    id: '6',
    protocol: 'STI-2026-0140',
    title: 'Erro ao salvar documentos na rede',
    description: 'Ao tentar salvar arquivos na pasta de rede, aparece mensagem de erro.',
    category: 'Rede / Arquivos',
    status: 'fechado',
    priority: 'media',
    createdAt: '2026-09-10T14:00:00',
    updatedAt: '2026-09-12T11:00:00',
    updates: [
      {
        id: 'u6',
        author: 'tecnico',
        authorName: 'Marina Alves',
        message: 'Mapeamento de rede reconfigurado. Arquivos salvos normalmente.',
        createdAt: '2026-09-12T11:00:00',
      },
    ],
    requesterName: 'Fernanda Souza',
    requesterDepartment: 'Recursos Humanos',
    requesterLocation: 'Sala 201 — 2º andar',
    requesterContact: '(11) 98678-9012',
    equipmentOrSystem: 'Pasta de rede compartilhada',
    approximateDate: '2026-09-10',
    impact: 'Médio — precisava salvar em pen drive',
    errorMessage: 'Erro: Não foi possível acessar o local de rede',
    attachments: [],
    assignee: 'Marina Alves',
    attendanceStartedAt: '2026-09-10T15:00:00',
    solution: 'Identificado que o mapeamento da unidade de rede estava incorreto após atualização do servidor. Reconfigurado o mapeamento e testado com o usuário. Arquivos sendo salvos normalmente na rede.',
    internalNotes: [],
  },
];

export function filterByStatus(tickets: Ticket[], status: TicketStatus | 'todos'): Ticket[] {
  if (status === 'todos') return tickets;
  return tickets.filter((t) => t.status === status);
}

export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date('2026-09-29T13:00:00');
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (days >= 1) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  if (hours >= 1) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const mins = Math.floor(diff / (1000 * 60));
  return `há ${mins} min`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
