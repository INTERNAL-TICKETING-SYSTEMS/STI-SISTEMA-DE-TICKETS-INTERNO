export interface UsuarioDB {
  id: string;
  nome: string;
  email: string;
  email_pessoal?: string;
  matricula?: string;
  perfil: string;
  departamento_id: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

const API_BASE_URL = 'https://data-audit-f72h.onrender.com';

export const dbRepository = {
  async buscarUsuarios(): Promise<UsuarioDB[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.error('[DB Repository] Erro ao buscar utilizadores:', e);
      return [];
    }
  },

  async buscarUsuarioPorLogin(identificador: string): Promise<UsuarioDB | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador })
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('[DB Repository] Erro ao buscar utilizador por login:', e);
      return null;
    }
  },

  async salvarRecuperacaoOtp(usuarioId: string, otpCode: string, emailPessoal: string) {
    try {
      console.log('[SMTP Docker] A disparar e-mail real via backend para:', emailPessoal);
      const response = await fetch(`${API_BASE_URL}/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatario: emailPessoal,
          assunto: 'Código de Recuperação de Senha - STI',
          corpo: `O seu código OTP de recuperação de senha é: ${otpCode}`
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      console.log('[SMTP Docker] Requisição de e-mail enviada ao backend com sucesso!');
    } catch (e) {
      console.error('[SMTP Docker] Erro ao comunicar com o backend:', e);
      throw e;
    }
  },

  async atualizarStatusChamado(chamadoId: string, novoStatus: string, tecnicoNome?: string, tecnicoId?: string, solucao?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/violations/${chamadoId}/resolver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novoStatus,
          tecnicoNome,
          tecnicoId,
          solucao
        })
      });
      if (!response.ok) {
        console.error('[DB Repository] Falha ao atualizar status no backend');
      }
    } catch (e) {
      console.error('[DB Repository] Erro de rede ao atualizar status:', e);
    }
  }
};