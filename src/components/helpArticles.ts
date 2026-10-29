import type { User } from '@/types';

export interface HelpArticle {
  id: string;
  title: string;
  keywords: string;
  category: string;
  solution: string[];
  ticketTitle: string;
  descriptionTemplate: string;
}

const criarDescricao = (problema: string) => `
Olá, equipe de TI.

Solicito suporte técnico para o problema descrito abaixo.

DADOS DO SOLICITANTE
Nome: {{nome}}
CPF: {{cpf}}
E-mail: {{email}}
Setor/Lotação: {{setor}}

PROBLEMA RELATADO
${problema}

INFORMAÇÕES COMPLEMENTARES
Mensagem de erro: [Informe a mensagem apresentada, se houver.]
Quando começou: [Informe quando o problema começou.]
Procedimentos já realizados: [Informe o que já tentou fazer.]

Atenciosamente,
{{nome}}
`.trim();

export const helpArticles: HelpArticle[] = [
  {
    id: 'internet',
    title: 'Não consigo acessar a internet',
    keywords: 'internet wifi wi-fi rede conexão vpn sem acesso',
    category: 'rede',
    ticketTitle: 'Problema de acesso à internet',
    descriptionTemplate: criarDescricao(
      'Estou enfrentando dificuldades para acessar a internet ou a rede institucional. Descrevo abaixo os detalhes do problema.',
    ),
    solution: [
      'Verifique se o problema acontece em outros dispositivos.',
      'Confira se o Wi-Fi ou o cabo de rede está conectado.',
      'Se estiver usando VPN, registre a mensagem apresentada.',
      'Se o problema continuar, abra um chamado para a equipe de TI.',
    ],
  },
  {
    id: 'senha',
    title: 'Esqueci minha senha ou não consigo entrar',
    keywords: 'senha login acesso bloqueio conta usuário permissão',
    category: 'acesso',
    ticketTitle: 'Solicitação de suporte para acesso ou senha',
    descriptionTemplate: criarDescricao(
      'Não estou conseguindo acessar minha conta ou preciso de auxílio com a recuperação da senha ou o desbloqueio do acesso. Solicito orientação da equipe de TI.',
    ),
    solution: [
      'Confira se o usuário informado está correto.',
      'Verifique se aparece alguma mensagem de erro.',
      'Utilize somente o procedimento oficial de recuperação de senha da organização.',
      'Nunca compartilhe sua senha no chamado.',
    ],
  },
  {
    id: 'impressora',
    title: 'A impressora não imprime',
    keywords: 'impressora impressão papel toner scanner fila',
    category: 'impressora',
    ticketTitle: 'Problema com impressora',
    descriptionTemplate: criarDescricao(
      'Estou enfrentando dificuldades para imprimir documentos. Solicito verificação do equipamento e da fila de impressão.',
    ),
    solution: [
      'Verifique se a impressora está ligada.',
      'Confira se há papel e se o equipamento apresenta algum aviso.',
      'Verifique se a impressora correta foi selecionada.',
      'Se continuar sem imprimir, informe o equipamento e a mensagem de erro.',
    ],
  },
  {
    id: 'computador',
    title: 'Computador lento ou travando',
    keywords: 'computador pc lento travando equipamento monitor nobreak',
    category: 'hardware',
    ticketTitle: 'Computador lento ou apresentando travamentos',
    descriptionTemplate: criarDescricao(
      'Meu computador está apresentando lentidão ou travamentos que prejudicam minhas atividades. Solicito análise do equipamento.',
    ),
    solution: [
      'Observe se o problema acontece em um programa específico ou em todo o computador.',
      'Feche os programas que não estiver usando, se for possível.',
      'Registre quando o problema começou e se aparece alguma mensagem.',
      'Se continuar, abra um chamado descrevendo o comportamento observado.',
    ],
  },
  {
    id: 'email',
    title: 'Não consigo acessar meu e-mail',
    keywords: 'email e-mail correio eletrônico caixa postal acesso mensagem',
    category: 'telefonia',
    ticketTitle: 'Problema de acesso ao e-mail institucional',
    descriptionTemplate: criarDescricao(
      'Estou enfrentando dificuldades para acessar ou utilizar meu e-mail institucional. Solicito suporte para identificar e solucionar o problema.',
    ),
    solution: [
      'Confira se sua conexão com a internet está funcionando.',
      'Verifique se o endereço de e-mail foi informado corretamente.',
      'Registre a mensagem de erro, sem incluir senhas ou informações confidenciais.',
      'Se o acesso continuar indisponível, solicite suporte.',
    ],
  },
  {
    id: 'sistema',
    title: 'Um sistema apresenta erro',
    keywords: 'sistema aplicativo erro falha tela mensagem programa',
    category: 'outro',
    ticketTitle: 'Erro em sistema ou aplicativo',
    descriptionTemplate: criarDescricao(
      'Um sistema ou aplicativo está apresentando um erro durante sua utilização. Solicito análise da equipe de TI para identificar a causa do problema.',
    ),
    solution: [
      'Anote qual sistema estava utilizando.',
      'Registre a mensagem de erro apresentada.',
      'Informe qual operação estava tentando realizar.',
      'Se possível, anexe uma captura de tela sem dados confidenciais.',
    ],
  },
];

/**
 * Substitui os dados do solicitante no modelo de descrição.
 * Os campos ausentes ficam identificados para conferência antes do envio.
 */
export function preencherDescricao(
  template: string,
  user?: User,
): string {
  const valores: Record<string, string> = {
    '{{nome}}': user?.name?.trim() || '[Preencher nome completo]',
    '{{cpf}}': user?.cpf?.trim() || '[Conferir CPF antes de enviar]',
    '{{email}}': user?.email?.trim() || '[Preencher e-mail]',
    '{{setor}}': user?.department?.trim() || '[Preencher setor/lotação]',
  };

  return template.replace(
    /\{\{nome\}\}|\{\{cpf\}\}|\{\{email\}\}|\{\{setor\}\}/g,
    (marcador) => valores[marcador] ?? marcador,
  );
}