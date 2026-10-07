import { smtpEmailService } from './smtpEmailService';
/**
 * Repositório Central de Dados - STI
 * Integrado ao subsistema oficial Spring Boot: DATA-AUDIT (porta 8081)
 */

import { 
  UsuarioDB, 
  ChamadoDB, 
  AtivoDB, 
  StatusChamado, 
  PrioridadeChamado, 
  AuditoriaLogDB, 
  AcaoAuditoria 
} from '../types/database';

const DATA_AUDIT_API_URL = import.meta.env.VITE_DATA_AUDIT_URL || 'http://localhost:8081/api/v1/audit/events';

const STORAGE_KEYS = {
  USUARIOS: 'sti_db_usuarios',
  CHAMADOS: 'sti_db_chamados',
  ATIVOS: 'sti_db_ativos',
  RECUPERACOES_OTP: 'sti_db_recuperacoes_otp',
  AUDITORIA_LOGS: 'sti_db_auditoria_logs'
};

function seedDatabaseSeVazio() {
  if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
    const defaultUsers: UsuarioDB[] = [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        nome: 'Administrador STI',
        email: 'admin@sti.local',
        matricula: 'STI-001',
        telefone_whatsapp: '5563992466252',
        perfil: 'ADMIN',
        departamento_id: 'a0000000-0000-0000-0000-000000000001',
        ativo: true,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000002',
        nome: 'Suporte Técnico N1',
        email: 'suporte@sti.local',
        matricula: 'STI-002',
        telefone_whatsapp: '5563992466252',
        perfil: 'TECNICO',
        departamento_id: 'a0000000-0000-0000-0000-000000000001',
        ativo: true,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000003',
        nome: 'Carlos Servidor',
        email: 'carlos@sti.local',
        matricula: 'SER-1044',
        telefone_whatsapp: '5563992466252',
        perfil: 'SOLICITANTE',
        departamento_id: 'a0000000-0000-0000-0000-000000000002',
        ativo: true,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CHAMADOS)) {
    const defaultTickets: ChamadoDB[] = [
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        protocolo: 'STI-2026-0001',
        titulo: 'Computador não conecta à rede interna',
        descricao: 'Ao ligar a máquina após o almoço, o ícone de rede exibe triângulo amarelo.',
        categoria: 'REDE_INTERNET',
        prioridade: 'ALTA',
        status: 'ABERTO',
        solicitante_id: 'b0000000-0000-0000-0000-000000000003',
        tecnico_id: 'b0000000-0000-0000-0000-000000000002',
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CHAMADOS, JSON.stringify(defaultTickets));
  }
}

seedDatabaseSeVazio();

export const dbRepository = {
  // --- INTEGRAÇÃO COM SUBSISTEMA SPRING BOOT: DATA-AUDIT ---
  async despacharParaDataAudit(evento: {
    entidade: string;
    idEntidade: string;
    tipoOperacao: string;
    autor: string;
    estadoAnterior?: any;
    estadoAtual?: any;
    metadados?: any;
  }) {
    // Formata timestamp ISO sem timezone para LocalDateTime do Java
    const now = new Date();
    const localIso = now.toISOString().split('.')[0];

    const payload = {
      origem: 'STI-TICKETS',
      entidade: evento.entidade,
      idEntidade: String(evento.idEntidade),
      tipoOperacao: evento.tipoOperacao,
      autor: evento.autor,
      dataHoraEvento: localIso,
      estadoAnterior: evento.estadoAnterior ? JSON.stringify(evento.estadoAnterior) : null,
      estadoAtual: evento.estadoAtual ? JSON.stringify(evento.estadoAtual) : null,
      metadados: evento.metadados ? JSON.stringify(evento.metadados) : JSON.stringify({ userAgent: navigator.userAgent })
    };

    try {
      const resp = await fetch(DATA_AUDIT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const auditResult = await resp.json();
        console.log('[DATA-AUDIT Integrado] Evento persistido no Spring Boot com ID:', auditResult.id);
        return auditResult;
      } else {
        console.warn('[DATA-AUDIT Aviso] Servidor retornou status:', resp.status);
      }
    } catch (error) {
      console.info('[DATA-AUDIT Info] API Spring Boot offline na porta 8081. Fallback local mantido.');
    }
    return null;
  },

  // --- LOG DE AUDITORIA UNIFICADO ---
  async registrarAuditoria(log: {
    usuarioId?: string;
    usuarioIdentificacao: string;
    acao: AcaoAuditoria;
    entidade: 'USUARIOS' | 'CHAMADOS' | 'RECUPERACOES_OTP' | 'ATIVOS' | 'SISTEMA';
    entidadeId?: string;
    dadosAnteriores?: Record<string, any>;
    dadosNovos?: Record<string, any>;
    detalhes?: string;
  }): Promise<AuditoriaLogDB> {
    // 1. Persistência local de segurança
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDITORIA_LOGS) || '[]');
    const record: AuditoriaLogDB = {
      id: crypto.randomUUID(),
      usuario_id: log.usuarioId,
      usuario_identificacao: log.usuarioIdentificacao,
      acao: log.acao,
      entidade: log.entidade,
      entidade_id: log.entidadeId,
      user_agent: navigator.userAgent,
      dados_anteriores: log.dadosAnteriores,
      dados_novos: log.dadosNovos,
      detalhes: log.detalhes,
      criado_em: new Date().toISOString()
    };
    logs.unshift(record);
    if (logs.length > 1000) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDITORIA_LOGS, JSON.stringify(logs));

    // 2. Despacho direto para o DATA-AUDIT (Spring Boot)
    await this.despacharParaDataAudit({
      entidade: log.entidade === 'CHAMADOS' ? 'TICKET' : log.entidade,
      idEntidade: log.entidadeId || record.id,
      tipoOperacao: log.acao,
      autor: log.usuarioIdentificacao,
      estadoAnterior: log.dadosAnteriores,
      estadoAtual: log.dadosNovos,
      metadados: { detalhes: log.detalhes, usuarioId: log.usuarioId }
    });

    return record;
  },

  async listarAuditoria(): Promise<AuditoriaLogDB[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDITORIA_LOGS) || '[]');
  },

  // --- USUÁRIOS & AUTENTICAÇÃO ---
  async buscarUsuarios(): Promise<UsuarioDB[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USUARIOS) || '[]');
  },

  async buscarUsuarioPorLogin(identificador: string): Promise<UsuarioDB | null> {
    const users = await this.buscarUsuarios();
    const termo = identificador.trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === termo || u.matricula?.toLowerCase() === termo) || null;
  },

  async salvarRecuperacaoOtp(usuarioId: string, otpCode: string, metaMsgId?: string) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECUPERACOES_OTP) || '[]');
    const record = {
      id: crypto.randomUUID(),
      usuario_id: usuarioId,
      otp_code: otpCode,
      meta_message_id: metaMsgId,
      expira_em: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      utilizado: false,
      criado_em: new Date().toISOString()
    };
    list.push(record);
    localStorage.setItem(STORAGE_KEYS.RECUPERACOES_OTP, JSON.stringify(list));

    await this.registrarAuditoria({
      usuarioId,
      usuarioIdentificacao: usuarioId,
      acao: 'OTP_DISPARADO',
      entidade: 'RECUPERACOES_OTP',
      entidadeId: record.id,
      detalhes: `Código OTP gerado e despachado via Meta WhatsApp API (Msg ID: ${metaMsgId || 'N/A'})`
    });

    return record;
  },

  async validarOtpRecuperacao(usuarioId: string, otpCode: string): Promise<boolean> {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECUPERACOES_OTP) || '[]');
    const record = list.find((r: any) => 
      r.usuario_id === usuarioId && 
      r.otp_code === otpCode && 
      !r.utilizado && 
      new Date(r.expira_em).getTime() > Date.now()
    );

    if (record) {
      record.utilizado = true;
      localStorage.setItem(STORAGE_KEYS.RECUPERACOES_OTP, JSON.stringify(list));

      await this.registrarAuditoria({
        usuarioId,
        usuarioIdentificacao: usuarioId,
        acao: 'OTP_VALIDADO',
        entidade: 'RECUPERACOES_OTP',
        entidadeId: record.id,
        detalhes: 'Código OTP validado com sucesso pelo usuário.'
      });

      return true;
    }
    return false;
  },

  // --- CHAMADOS (TICKETS) ---
  async listarChamados(): Promise<ChamadoDB[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAMADOS) || '[]');
  },

  async buscarChamadoPorProtocolo(protocolo: string): Promise<ChamadoDB | null> {
    const chamados = await this.listarChamados();
    return chamados.find(c => c.protocolo.toUpperCase() === protocolo.toUpperCase()) || null;
  },

  async criarChamado(novo: Omit<ChamadoDB, 'id' | 'protocolo' | 'criado_em' | 'atualizado_em'>, autorIdentificacao: string): Promise<ChamadoDB> {
    const chamados = await this.listarChamados();
    const anoAtual = new Date().getFullYear();
    const sequencial = String(chamados.length + 1).padStart(4, '0');
    const protocolo = `STI-${anoAtual}-${sequencial}`;

    const record: ChamadoDB = {
      ...novo,
      id: crypto.randomUUID(),
      protocolo,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    chamados.unshift(record);
    localStorage.setItem(STORAGE_KEYS.CHAMADOS, JSON.stringify(chamados));

    await this.registrarAuditoria({
      usuarioId: novo.solicitante_id,
      usuarioIdentificacao: autorIdentificacao,
      acao: 'TICKET_CRIADO',
      entidade: 'CHAMADOS',
      entidadeId: protocolo,
      dadosNovos: record,
      detalhes: `Chamado ${protocolo} aberto com prioridade ${novo.prioridade}.`
    });

    return record;
  },

  async atualizarStatusChamado(
    chamadoId: string, 
    novoStatus: StatusChamado, 
    autorIdentificacao: string, 
    tecnicoId?: string,
    parecerTecnico?: string
  ): Promise<boolean> {
    const chamados = await this.listarChamados();
    const idx = chamados.findIndex(c => c.id === chamadoId);
    if (idx === -1) return false;

    const statusAnterior = chamados[idx].status;
    chamados[idx].status = novoStatus;
    chamados[idx].atualizado_em = new Date().toISOString();
    if (tecnicoId) chamados[idx].tecnico_id = tecnicoId;
    if (novoStatus === 'RESOLVIDO') chamados[idx].resolvido_em = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.CHAMADOS, JSON.stringify(chamados));

    // Despacha com parecer técnico para respeitar regras de conformidade (REG-001 do DATA-AUDIT)
    await this.registrarAuditoria({
      usuarioIdentificacao: autorIdentificacao,
      acao: 'TICKET_STATUS_ALTERADO',
      entidade: 'CHAMADOS',
      entidadeId: chamados[idx].protocolo,
      dadosAnteriores: { status: statusAnterior },
      dadosNovos: { status: novoStatus, tecnico_id: tecnicoId, resolucao: parecerTecnico },
      detalhes: parecerTecnico || `Status do chamado ${chamados[idx].protocolo} alterado de ${statusAnterior} para ${novoStatus}.`
    });

    return true;
  }
};
