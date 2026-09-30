export interface SetorDetran {
  sigla: string;
  nome: string;
}

export const SETORES_DETRAN: SetorDetran[] = [
  { sigla: 'PRESID', nome: 'Presidência' },
  { sigla: 'DTI', nome: 'Diretoria de Tecnologia da Informação' },
  { sigla: 'DCH', nome: 'Diretoria de Operações e Habilitação' },
  { sigla: 'DRV', nome: 'Diretoria de Registro de Veículos' },
  { sigla: 'DFIS', nome: 'Diretoria de Fiscalização e Segurança de Trânsito' },
  { sigla: 'DAF', nome: 'Diretoria Administrativa e Financeira' },
  { sigla: 'GERH', nome: 'Gerência de Gestão de Pessoas e Recursos Humanos' },
  { sigla: 'PROTO', nome: 'Gerência de Protocolo Geral e Arquivo' },
  { sigla: 'JARI', nome: 'Junta Administrativa de Recursos de Infrações' },
  { sigla: 'OUVID', nome: 'Ouvidoria Setorial' },
  { sigla: 'ASSEC', nome: 'Assessoria de Comunicação' },
  { sigla: 'CORREG', nome: 'Corregedoria Geral' },
  { sigla: 'CIRETRAN-PM', nome: 'CIRETRAN - Palmas Centro' },
  { sigla: 'CIRETRAN-TZ', nome: 'CIRETRAN - Taquaralto' },
  { sigla: 'CIRETRAN-AG', nome: 'CIRETRAN - Araguaína' },
  { sigla: 'CIRETRAN-GP', nome: 'CIRETRAN - Gurupi' }
];

export const GENEROS_OPCOES: { valor: string; rotulo: string }[] = [
  { valor: 'masculino', rotulo: 'Masculino' },
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'nao_binario', rotulo: 'Não-binário' },
  { valor: 'outro', rotulo: 'Outro' },
  { valor: 'prefiro_nao_informar', rotulo: 'Prefiro não informar' }
];