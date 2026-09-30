export type TicketStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado' | 'aguardando';

export type Priority = 'baixa' | 'media' | 'alta';

export type UserRole = 'usuario' | 'tecnico' | 'gestor';

export type GenderOption = 
  | 'masculino'
  | 'feminino'
  | 'nao_binario'
  | 'outro'
  | 'prefiro_nao_informar';

export interface TicketUpdate {
  id: string;
  author: 'usuario' | 'tecnico';
  authorName: string;
  message: string;
  createdAt: string;
}

export interface InternalNote {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  protocol: string;
  title: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  updates: TicketUpdate[];
  requesterName: string;
  requesterDepartment: string;
  requesterLocation: string;
  requesterContact: string;
  equipmentOrSystem: string;
  approximateDate: string;
  impact: string;
  errorMessage: string;
  attachments: string[];
  assignee: string | null;
  attendanceStartedAt: string | null;
  solution: string | null;
  assetTag?: string;
  replacedParts?: string;
  rating?: number;
  ratingComment?: string;
  internalNotes: InternalNote[];
}

export interface User {
  name: string;
  email: string;
  cpf?: string;
  birthDate?: string;
  gender?: GenderOption;
  department: string; // Setor/Lotação Oficial
  role: string;
  phone: string;
  userRole: UserRole;
}