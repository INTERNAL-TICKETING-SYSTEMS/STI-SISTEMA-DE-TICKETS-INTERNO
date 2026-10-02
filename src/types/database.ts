export type PerfilUsuario = 'ADMIN' | 'TECNICO' | 'GESTOR' | 'SOLICITANTE';
export type CategoriaChamado = 'HARDWARE' | 'REDE_INTERNET' | 'SISTEMAS_SOFTWARE' | 'ACESSO_SENHAS' | 'IMPRESSORAS' | 'OUTROS';
export type PrioridadeChamado = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type StatusChamado = 'ABERTO' | 'EM_ATENDIMENTO' | 'AGUARDANDO_SOLICITANTE' | 'RESOLVIDO' | 'CANCELADO';

export interface UsuarioDB {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  telefone_whatsapp: string;
  perfil: PerfilUsuario;
  departamento_id?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface ChamadoDB {
  id: string;
  protocolo: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  solicitante_id: string;
  tecnico_id?: string;
  ativo_id?: string;
  criado_em: string;
  atualizado_em: string;
  resolvido_em?: string;
}

export interface AtivoDB {
  id: string;
  numero_tombo: string;
  tipo: string;
  marca_modelo: string;
  ip_rede?: string;
  mac_address?: string;
  departamento_id?: string;
  status: string;
}

export type AcaoAuditoria = 
  | 'AUTH_LOGIN_SUCESSO'
  | 'AUTH_LOGIN_FALHA'
  | 'AUTH_LOGOUT'
  | 'OTP_DISPARADO'
  | 'OTP_VALIDADO'
  | 'SENHA_REDEFINIDA'
  | 'TICKET_CRIADO'
  | 'TICKET_STATUS_ALTERADO'
  | 'TICKET_PRIORIDADE_ALTERADA'
  | 'TICKET_TECNICO_ATRIBUIDO'
  | 'ATIVO_CADASTRADO'
  | 'ATIVO_STATUS_ALTERADO';

export interface AuditoriaLogDB {
  id: string;
  usuario_id?: string;
  usuario_identificacao: string;
  acao: AcaoAuditoria;
  entidade: 'USUARIOS' | 'CHAMADOS' | 'RECUPERACOES_OTP' | 'ATIVOS' | 'SISTEMA';
  entidade_id?: string;
  ip_origem?: string;
  user_agent?: string;
  dados_anteriores?: Record<string, any>;
  dados_novos?: Record<string, any>;
  detalhes?: string;
  criado_em: string;
}
