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





];

export function filterByStatus(tickets: Ticket[], status: TicketStatus | 'todos'): Ticket[] {
  if (status === 'todos') return tickets;
  return tickets.filter((t) => t.status === status);
}

export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
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
