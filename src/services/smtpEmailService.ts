export const smtpEmailService = {
  async enviarEmailOtp(destinatario: string, nomeUsuario: string, otpCode: string): Promise<boolean> {
    try {
      console.log(`[SMTP] A enviar pedido para o backend em http://localhost:8081/api/v1/notifications/email...`);
      
      const response = await fetch('http://localhost:8081/api/v1/notifications/email', {
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