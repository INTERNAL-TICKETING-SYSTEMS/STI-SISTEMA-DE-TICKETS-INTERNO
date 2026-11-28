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

const API_BASE_URL =
  (
    import.meta.env.VITE_API_URL || "https://data-audit-production.up.railway.app"
  ).replace(/\/$/, "") + "/api/v1";

export const dbRepository = {
  async buscarUsuarios(): Promise<UsuarioDB[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chamados/equipe`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.error("[DB Repository] Erro ao buscar usuários:", e);
      return [];
    }
  },

  async buscarUsuarioPorLogin(identificador: string): Promise<UsuarioDB | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/chamados/equipe`);
      if (!response.ok) return null;
      const lista = await response.json();
      if (!Array.isArray(lista)) return null;
      const termo = identificador.trim().toLowerCase();
      return (
        lista.find(
          (u: any) =>
            String(u.email || "").toLowerCase() === termo ||
            String(u.nome || "").toLowerCase() === termo
        ) || null
      );
    } catch (e) {
      console.error("[DB Repository] Erro ao buscar usuário por login:", e);
      return null;
    }
  },

  async salvarRecuperacaoOtp(_usuarioId: string, otpCode: string, emailPessoal: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinatario: emailPessoal,
        assunto: "Código de Recuperação de Senha - STI",
        corpo: `O seu código OTP de recuperação de senha é: ${otpCode}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
  },

  async atualizarStatusChamado(
    chamadoId: string,
    novoStatus: string,
    tecnicoNome?: string,
    _tecnicoId?: string,
    solucao?: string
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/chamados/${chamadoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: novoStatus,
          responsavel: tecnicoNome,
          solucao,
        }),
      });
      if (!response.ok) {
        console.error("[DB Repository] Falha ao atualizar chamado no backend");
      }
    } catch (e) {
      console.error("[DB Repository] Erro de rede ao atualizar chamado:", e);
    }
  },
};