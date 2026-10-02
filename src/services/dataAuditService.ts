/**
 * Serviço de Integração com o Subsistema DATA-AUDIT (Spring Boot / porta 8081)
 */

const BASE_URL = import.meta.env.VITE_DATA_AUDIT_URL || 'http://localhost:8081/api/v1/audit';

export interface AuditEventResponse {
  id: number;
  origem: string;
  entidade: string;
  idEntidade: string;
  tipoOperacao: string;
  autor: string;
  dataHoraEvento: string;
  estadoAnterior?: string;
  estadoAtual?: string;
  metadados?: string;
  hashIntegridade: string;
}

export interface DataViolationResponse {
  id: number;
  idEntidadeAfetada: string;
  tipoRegraViolada: string;
  descricaoInconformidade: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  statusResolucao: 'PENDENTE' | 'RESOLVIDO' | 'IGNORADO';
  dataHoraDeteccao: string;
  justificativaResolucao?: string;
}

export interface IntegrityCheckResponse {
  eventoId: number;
  statusIntegridade: 'VALIDO' | 'CORROMPIDO';
  hashArmazenado: string;
  hashRecalculado: string;
  detalhe?: string;
}

export const dataAuditService = {
  // Lista eventos de auditoria paginados
  async listarEventos(page = 0, size = 15): Promise<AuditEventResponse[]> {
    try {
      const res = await fetch(`${BASE_URL}/events?page=${page}&size=${size}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.content || [];
    } catch {
      return [];
    }
  },

  // Consulta histórico de um chamado específico
  async buscarPorEntidade(entidade: string, idEntidade: string): Promise<AuditEventResponse[]> {
    try {
      const res = await fetch(`${BASE_URL}/events/${entidade}/${idEntidade}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.content || [];
    } catch {
      return [];
    }
  },

  // Lista violações de conformidade
  async listarViolacoes(): Promise<DataViolationResponse[]> {
    try {
      const res = await fetch(`${BASE_URL}/violations`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.content || [];
    } catch {
      return [];
    }
  },

  // Resolve uma violação detectada
  async resolverViolacao(id: number, justificativa?: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/violations/${id}/resolver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ justificativa })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Executa checagem criptográfica forense de integridade
  async verificarIntegridade(eventoId: number): Promise<IntegrityCheckResponse | null> {
    try {
      const res = await fetch(`${BASE_URL}/events/${eventoId}/verificar-integridade`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
