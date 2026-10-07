export interface SetorDetran {
  sigla: string;
  nome: string;
  bloco?: string;
}

export const SETORES_DETRAN: SetorDetran[] = [
  // BLOCO 4
  { sigla: 'PROTO', nome: 'Protocolo', bloco: 'Bloco 4' },
  { sigla: 'TRANSP', nome: 'Transporte', bloco: 'Bloco 4' },
  { sigla: 'ALMOX', nome: 'Almoxarifado', bloco: 'Bloco 4' },
  { sigla: 'ADM', nome: 'Administração', bloco: 'Bloco 4' },
  { sigla: 'FIN', nome: 'Financeiro', bloco: 'Bloco 4' },
  { sigla: 'PLAN', nome: 'Planejamento', bloco: 'Bloco 4' },
  { sigla: 'DIRFIN', nome: 'Diretor Financeiro', bloco: 'Bloco 4' },
  { sigla: 'DIRADM', nome: 'Diretor Administrativo', bloco: 'Bloco 4' },
  { sigla: 'CONTL', nome: 'Contratos e Licitações', bloco: 'Bloco 4' },
  { sigla: 'RESSARC', nome: 'Ressarcimento', bloco: 'Bloco 4' },
  { sigla: 'PATR', nome: 'Patrimônio', bloco: 'Bloco 4' },

  // BLOCO 3
  { sigla: 'AT-CNH', nome: 'Atendimento CNH', bloco: 'Bloco 3' },
  { sigla: 'INST-ID', nome: 'Instituto de Identificação', bloco: 'Bloco 3' },
  { sigla: 'CONF-CNH', nome: 'Conferência CNH', bloco: 'Bloco 3' },
  { sigla: 'JMED', nome: 'Junta Médica', bloco: 'Bloco 3' },
  { sigla: 'ACNH', nome: 'Administrativo CNH', bloco: 'Bloco 3' },
  { sigla: 'GER-CNH', nome: 'Gerência CNH', bloco: 'Bloco 3' },
  { sigla: 'REC-CNH', nome: 'Recepção CNH', bloco: 'Bloco 3' },

  // BLOCO 2
  { sigla: 'REC-VEI', nome: 'Recepção Veículos', bloco: 'Bloco 2' },
  { sigla: 'AT-VEI', nome: 'Atendimento Veículos', bloco: 'Bloco 2' },
  { sigla: 'DESP-VEI', nome: 'Despachantes Veículos', bloco: 'Bloco 2' },
  { sigla: 'AP-JUR', nome: 'Apoio Jurídico', bloco: 'Bloco 2' },
  { sigla: 'DOPER', nome: 'DOPER', bloco: 'Bloco 2' },
  { sigla: 'ASTEC', nome: 'ASTEC', bloco: 'Bloco 2' },
  { sigla: 'DIPAC', nome: 'Diretoria de Postos de Atendimento das CIRETRANS', bloco: 'Bloco 2' },
  { sigla: 'GER-VEI', nome: 'Gerência de Veículos', bloco: 'Bloco 2' },
  { sigla: 'DOPER-SET', nome: 'Diretoria de Operações', bloco: 'Bloco 2' },

  // BLOCO 1
  { sigla: 'GGP', nome: 'Gerência de Gestão de Pessoas', bloco: 'Bloco 1' },
  { sigla: 'GSRN', nome: 'Gerência de Sistemas de Registros Nacionais', bloco: 'Bloco 1' },
  { sigla: 'RENAVAM', nome: 'RENAVAM', bloco: 'Bloco 1' },
  { sigla: 'MULTAS', nome: 'Multas', bloco: 'Bloco 1' },
  { sigla: 'RENAINF', nome: 'RENAINF', bloco: 'Bloco 1' },
  { sigla: 'RENACH', nome: 'RENACH', bloco: 'Bloco 1' },
  { sigla: 'OUVID', nome: 'Ouvidoria', bloco: 'Bloco 1' },
  { sigla: 'CALL', nome: 'Call Center', bloco: 'Bloco 1' },
  { sigla: 'NUC-INT', nome: 'Núcleo de Inteligência', bloco: 'Bloco 1' },
  { sigla: 'AP-CIR', nome: 'Apoio CIRETRANS', bloco: 'Bloco 1' },
  { sigla: 'GER-CIR', nome: 'Gerência de CIRETRANS', bloco: 'Bloco 1' },
  { sigla: 'DICPA', nome: 'Diretoria de CIRETRANS e Postos de Atendimento', bloco: 'Bloco 1' },
  { sigla: 'DTEC', nome: 'Diretoria Técnica', bloco: 'Bloco 1' },

  // ANEXO
  { sigla: 'CETRAN', nome: 'CETRAN', bloco: 'Anexo' },
  { sigla: 'JARI', nome: 'JARI', bloco: 'Anexo' },
  { sigla: 'ESTAT', nome: 'Estatísticas', bloco: 'Anexo' },
  { sigla: 'DEF-AUT', nome: 'Defesa e Autuação', bloco: 'Anexo' },
  { sigla: 'CRED', nome: 'Credenciamento', bloco: 'Anexo' },
  { sigla: 'GER-CRED', nome: 'Gerência de Credenciamento', bloco: 'Anexo' },
  { sigla: 'CORREG', nome: 'Corregedoria', bloco: 'Anexo' },
  { sigla: 'ENG-TRAF', nome: 'Engenharia de Tráfego', bloco: 'Anexo' },
  { sigla: 'ED-TRANS', nome: 'Educação para o Trânsito', bloco: 'Anexo' },
  { sigla: 'LEILAO', nome: 'Leilão', bloco: 'Anexo' },
  { sigla: 'FISC', nome: 'Fiscalização', bloco: 'Anexo' },
  { sigla: 'BEXAM', nome: 'Banca Examinadores', bloco: 'Anexo' },
  { sigla: 'SALA-PROV', nome: 'Sala de Provas', bloco: 'Anexo' },
  { sigla: 'REC-BAN', nome: 'Recepção Bancas', bloco: 'Anexo' },

  // BLOCO DA PRESIDÊNCIA
  { sigla: 'ASSEC', nome: 'Assessoria de Comunicação', bloco: 'Bloco da Presidência' },
  { sigla: 'ASGAB', nome: 'Assessoria de Gabinete', bloco: 'Bloco da Presidência' },
  { sigla: 'PRESID', nome: 'Presidência', bloco: 'Bloco da Presidência' },
  { sigla: 'VICE-PRES', nome: 'Vice Presidência', bloco: 'Bloco da Presidência' },
  { sigla: 'AP-JUR-PRES', nome: 'Assessoria Jurídica', bloco: 'Bloco da Presidência' }
];

export const GENEROS_OPCOES: { valor: string; rotulo: string }[] = [
  { valor: 'masculino', rotulo: 'Masculino' },
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'nao_binario', rotulo: 'Não-binário' },
  { valor: 'outro', rotulo: 'Outro' },
  { valor: 'prefiro_nao_informar', rotulo: 'Prefiro não informar' }
];