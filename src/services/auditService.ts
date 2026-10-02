export interface AuditPayload {
  entidade: 'CHAMADO' | 'AUTENTICACAO' | 'USUARIO' | 'RELATORIO' | 'CONFORMIDADE' | string;
  idEntidade: string;
  tipoOperacao: 
    | 'CRIACAO' 
    | 'ATUALIZACAO_STATUS' 
    | 'LOGIN' 
    | 'LOGOUT' 
    | 'ATRIBUICAO' 
    | 'TRANSFERENCIA'
    | 'RESOLUCAO'
    | 'AVALIACAO'
    | 'NOTA_INTERNA'
    | 'EXPORTACAO_RELATORIO'
    | string;
  autor: string;
  estadoAnterior?: Record<string, any> | null;
  estadoAtual?: Record<string, any> | null;
  metadados?: Record<string, any>;
}

const AUDIT_API_URL = 'http://localhost:8081/api/v1/audit/events';

export async function registrarAuditoria(payload: AuditPayload): Promise<boolean> {
  try {
    const agoraLocal = new Date();
    const ano = agoraLocal.getFullYear();
    const mes = String(agoraLocal.getMonth() + 1).padStart(2, '0');
    const dia = String(agoraLocal.getDate()).padStart(2, '0');
    const hora = String(agoraLocal.getHours()).padStart(2, '0');
    const min = String(agoraLocal.getMinutes()).padStart(2, '0');
    const seg = String(agoraLocal.getSeconds()).padStart(2, '0');
    const dataHoraEvento = `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;

    const body = {
      origem: 'STI-FRONTEND',
      entidade: payload.entidade,
      idEntidade: payload.idEntidade,
      tipoOperacao: payload.tipoOperacao,
      autor: payload.autor || 'sistema@sti.chamados.com',
      dataHoraEvento,
      estadoAnterior: payload.estadoAnterior ? JSON.stringify(payload.estadoAnterior) : null,
      estadoAtual: payload.estadoAtual ? JSON.stringify(payload.estadoAtual) : null,
      metadados: JSON.stringify({
        userAgent: navigator.userAgent,
        timestampMs: Date.now(),
        ...payload.metadados,
      }),
    };

    const res = await fetch(AUDIT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn('[Auditoria] Falha ao registrar evento:', res.status);
      return false;
    }

    const data = await res.json();
    console.log(`[Auditoria STI - ${payload.tipoOperacao}] Registrado com sucesso! Hash:`, data.hashIntegridade);
    return true;
  } catch (err) {
    console.error('[Auditoria STI] Erro de conexão:', err);
    return false;
  }
}

export async function buscarEventosAuditoria(entidade: string, idEntidade: string) {
  try {
    const res = await fetch(`${AUDIT_API_URL}/${entidade}/${idEntidade}?size=50`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.content || [];
  } catch (err) {
    console.error('[Auditoria STI] Falha ao buscar histórico:', err);
    return [];
  }
}
