export const smtpEmailService = {
  async enviarEmailOtp(destinatario: string, nomeUsuario: string, otpCode: string): Promise<boolean> {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://data-audit-f72h.onrender.com';
      const endpoint = `${baseUrl}/api/v1/notifications/email`;

      console.log(`[SMTP] A enviar pedido para o backend em ${endpoint}...`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatario,
          assunto: 'Código de Recuperação - STI',
          corpo: `Olá ${nomeUsuario}, o seu código de recuperação de senha é: ${otpCode}`
        })
      });

      if (response.ok) {
        console.log('[SMTP] E-mail enviado com sucesso pelo backend Java!');
        return true;
      } else {
        const erroTxt = await response.text();
        console.error('[SMTP] Erro retornado pelo backend:', erroTxt);
        return false;
      }
    } catch (error) {
      console.error('[SMTP] Falha de ligação com o backend:', error);
      return false;
    }
  }
};