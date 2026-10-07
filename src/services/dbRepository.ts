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

export const dbRepository = {
  async buscarUsuarios(): Promise<UsuarioDB[]> {
    const data = localStorage.getItem('sti_db_usuarios');
    if (!data) return [];
    try { return JSON.parse(data); } catch { return []; }
  },

  async buscarUsuarioPorLogin(identificador: string): Promise<UsuarioDB | null> {
    const users = await this.buscarUsuarios();
    const termo = identificador.trim().toLowerCase();
    let found = users.find(u => u.email.toLowerCase() === termo || u.matricula?.toLowerCase() === termo);
    
    if (!found) {
      found = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        nome: termo.split('@')[0].replace('.', ' ').toUpperCase(),
        email: termo.includes('@') ? termo : `${termo}@sti.chamados.com`,
        email_pessoal: 'danielandsanfer@gmail.com',
        matricula: termo.includes('@') ? 'MAT-' + Math.floor(1000 + Math.random() * 9000) : termo.toUpperCase(),
        perfil: 'TECNICO',
        departamento_id: 'a0000000-0000-0000-0000-000000000001',
        ativo: true,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      };
      users.push(found);
      localStorage.setItem('sti_db_usuarios', JSON.stringify(users));
    }
    return found;
  },

  async salvarRecuperacaoOtp(usuarioId: string, otpCode: string, emailPessoal: string) {
    const list = JSON.parse(localStorage.getItem('sti_recuperacoes_otp') || '[]');
    const record = {
      id: crypto.randomUUID(),
      usuario_id: usuarioId,
      otp_code: otpCode,
      email_pessoal: emailPessoal,
      criado_em: new Date().toISOString(),
      expira_em: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
    list.push(record);
    localStorage.setItem('sti_recuperacoes_otp', JSON.stringify(list));
    
    // Dispara o envio real do e-mail através do backend Java no Docker
    try {
      console.log('[SMTP Docker] A disparar e-mail real via backend para:', emailPessoal);
      await fetch('http://localhost:8081/api/v1/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatario: emailPessoal,
          assunto: 'Código de Recuperação de Senha - STI',
          corpo: `O seu código OTP de recuperação de senha é: ${otpCode}`
        })
      });
      console.log('[SMTP Docker] Requisição de e-mail enviada ao backend com sucesso!');
    } catch (e) {
      console.error('[SMTP Docker] Erro ao comunicar com o backend:', e);
    }
  },

  async atualizarStatusChamado(chamadoId: string, novoStatus: string, arg3?: any, arg4?: any, arg5?: any) {
    const chamados = JSON.parse(localStorage.getItem('sti_db_chamados') || '[]');
    const atualizados = chamados.map((c: any) => c.id === chamadoId ? { ...c, status: novoStatus, atualizado_em: new Date().toISOString() } : c);
    localStorage.setItem('sti_db_chamados', JSON.stringify(atualizados));
  }
};