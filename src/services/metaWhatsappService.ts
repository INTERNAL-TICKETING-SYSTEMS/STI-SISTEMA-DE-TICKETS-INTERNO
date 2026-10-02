/**
 * Serviço de Integração com a Meta Cloud API (WhatsApp Business Platform)
 * STI - Sistema de Tecnologia da Informação
 */

interface SendOtpParams {
  phoneNumber: string;
  otpCode: string;
  accountEmail: string;
}

interface MetaApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  metaDetails?: any;
}

export async function enviarOtpMetaWhatsApp({
  phoneNumber,
  otpCode,
  accountEmail
}: SendOtpParams): Promise<MetaApiResponse> {
  const digits = phoneNumber.replace(/\D/g, '');
  const cleanWithDdi = digits.startsWith('55') ? digits : `55${digits}`;

  const phoneNumberId = import.meta.env.VITE_META_WA_PHONE_NUMBER_ID;
  const accessToken = import.meta.env.VITE_META_WA_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return {
      success: false,
      error: 'Credenciais da Meta API não configuradas no ficheiro .env.'
    };
  }

  const endpoint = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  // Mapeia variações de número no Brasil (com e sem o 9º dígito)
  const targets: string[] = [];
  if (cleanWithDdi.length === 13 && cleanWithDdi.startsWith('55')) {
    targets.push(cleanWithDdi);
    targets.push(cleanWithDdi.slice(0, 4) + cleanWithDdi.slice(5));
  } else if (cleanWithDdi.length === 12 && cleanWithDdi.startsWith('55')) {
    targets.push(cleanWithDdi);
    targets.push(cleanWithDdi.slice(0, 4) + '9' + cleanWithDdi.slice(4));
  } else {
    targets.push(cleanWithDdi);
  }

  let lastMessageId: string | null = null;
  let lastError: any = null;

  for (const to of targets) {
    console.log(`[Meta API] A enviar modelo sti para +${to}...`);

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: 'sti',
        language: {
          code: 'pt_BR'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: otpCode
              }
            ]
          }
        ]
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log(`[Meta API Resposta para +${to}]:`, data);

      if (response.ok && data.messages?.[0]?.id) {
        lastMessageId = data.messages[0].id;
        console.log(`[Meta API Sucesso] Entregue com ID: ${lastMessageId}`);
      } else {
        lastError = data.error;
      }
    } catch (err: any) {
      console.error(`[Meta API Erro de Ligação com +${to}]:`, err);
      lastError = err;
    }
  }

  if (lastMessageId) {
    return {
      success: true,
      messageId: lastMessageId
    };
  }

  return {
    success: false,
    error: lastError?.message || 'Falha ao entregar o modelo sti no WhatsApp.',
    metaDetails: lastError
  };
}
