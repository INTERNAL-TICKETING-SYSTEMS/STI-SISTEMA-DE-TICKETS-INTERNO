-- ====================================================================
-- STI - SISTEMA DE TICKETS INTERNO
-- Seeds Iniciais: Departamentos / Setores por Blocos (DETRAN-TO)
-- ====================================================================

-- Limpar dados anteriores caso necessário (opcional)
-- TRUNCATE TABLE departamentos RESTART IDENTITY CASCADE;

INSERT INTO departamentos (sigla, nome, bloco_sala) VALUES
-- BLOCO 4
('PROTO', 'Protocolo', 'Bloco 4'),
('TRANSP', 'Transporte', 'Bloco 4'),
('ALMOX', 'Almoxarifado', 'Bloco 4'),
('ADM', 'Administração', 'Bloco 4'),
('FIN', 'Financeiro', 'Bloco 4'),
('PLAN', 'Planejamento', 'Bloco 4'),
('DIRFIN', 'Diretor Financeiro', 'Bloco 4'),
('DIRADM', 'Diretor Administrativo', 'Bloco 4'),
('CONTL', 'Contratos e Licitações', 'Bloco 4'),
('RESSARC', 'Ressarcimento', 'Bloco 4'),
('PATR', 'Patrimônio', 'Bloco 4'),

-- BLOCO 3
('AT-CNH', 'Atendimento CNH', 'Bloco 3'),
('INST-ID', 'Instituto de Identificação', 'Bloco 3'),
('CONF-CNH', 'Conferência CNH', 'Bloco 3'),
('JMED', 'Junta Médica', 'Bloco 3'),
('ACNH', 'Administrativo CNH', 'Bloco 3'),
('GER-CNH', 'Gerência CNH', 'Bloco 3'),
('REC-CNH', 'Recepção CNH', 'Bloco 3'),

-- BLOCO 2
('REC-VEI', 'Recepção Veículos', 'Bloco 2'),
('AT-VEI', 'Atendimento Veículos', 'Bloco 2'),
('DESP-VEI', 'Despachantes Veículos', 'Bloco 2'),
('AP-JUR', 'Apoio Jurídico', 'Bloco 2'),
('DOPER', 'DOPER', 'Bloco 2'),
('ASTEC', 'ASTEC', 'Bloco 2'),
('DIPAC', 'Diretoria de Postos de Atendimento das CIRETRANS', 'Bloco 2'),
('GER-VEI', 'Gerência de Veículos', 'Bloco 2'),
('DOPER-SET', 'Diretoria de Operações', 'Bloco 2'),

-- BLOCO 1
('GGP', 'Gerência de Gestão de Pessoas', 'Bloco 1'),
('GSRN', 'Gerência de Sistemas de Registros Nacionais', 'Bloco 1'),
('RENAVAM', 'RENAVAM', 'Bloco 1'),
('MULTAS', 'Multas', 'Bloco 1'),
('RENAINF', 'RENAINF', 'Bloco 1'),
('RENACH', 'RENACH', 'Bloco 1'),
('OUVID', 'Ouvidoria', 'Bloco 1'),
('CALL', 'Call Center', 'Bloco 1'),
('NUC-INT', 'Núcleo de Inteligência', 'Bloco 1'),
('AP-CIR', 'Apoio CIRETRANS', 'Bloco 1'),
('GER-CIR', 'Gerência de CIRETRANS', 'Bloco 1'),
('DICPA', 'Diretoria de CIRETRANS e Postos de Atendimento', 'Bloco 1'),
('DTEC', 'Diretoria Técnica', 'Bloco 1'),

-- ANEXO
('CETRAN', 'CETRAN', 'Anexo'),
('JARI', 'JARI', 'Anexo'),
('ESTAT', 'Estatísticas', 'Anexo'),
('DEF-AUT', 'Defesa e Autuação', 'Anexo'),
('CRED', 'Credenciamento', 'Anexo'),
('GER-CRED', 'Gerência de Credenciamento', 'Anexo'),
('CORREG', 'Corregedoria', 'Anexo'),
('ENG-TRAF', 'Engenharia de Tráfego', 'Anexo'),
('ED-TRANS', 'Educação para o Trânsito', 'Anexo'),
('LEILAO', 'Leilão', 'Anexo'),
('FISC', 'Fiscalização', 'Anexo'),
('BEXAM', 'Banca Examinadores', 'Anexo'),
('SALA-PROV', 'Sala de Provas', 'Anexo'),
('REC-BAN', 'Recepção Bancas', 'Anexo'),

-- BLOCO DA PRESIDÊNCIA
('ASSEC', 'Assessoria de Comunicação', 'Bloco da Presidência'),
('ASGAB', 'Assessoria de Gabinete', 'Bloco da Presidência'),
('PRESID', 'Presidência', 'Bloco da Presidência'),
('VICE-PRES', 'Vice Presidência', 'Bloco da Presidência'),
('AP-JUR-PRES', 'Assessoria Jurídica', 'Bloco da Presidência')

ON CONFLICT (sigla) DO NOTHING;

-- --------------------------------------------------------------------
-- SEEDS: Utilizadores Oficiais do Sistema (Mapeados do App.tsx)
-- --------------------------------------------------------------------
INSERT INTO usuarios (nome, email, matricula, senha_hash, telefone_whatsapp, perfil, ativo) VALUES
('Servidor Padrão', 'servidor@sti.chamados.com', 'MAT-0000', '', '(63) 98765-4321', 'SOLICITANTE', TRUE),
('Carlos Daniel Santos', 'carlos.daniel@sti.chamados.com', 'MAT-2020', '@!#$%2020HashSimuladoAqui', '(63) 98400-2020', 'TECNICO', TRUE),
('João Pedro Moreira', 'joao.pedro@sti.chamados.com', 'MAT-2021', '@!#$%2020HashSimuladoAqui', '(63) 98400-2021', 'TECNICO', TRUE),
('Guilherme Ferreira', 'guilherme.ferreira@sti.chamados.com', 'MAT-2022', '@!#$%2020HashSimuladoAqui', '(63) 98400-2022', 'TECNICO', TRUE),
('Wanderson Alves', 'wanderson.maior@sti.chamados.com', 'MAT-1001', '@!#$%2020HashSimuladoAqui', '(63) 98400-1001', 'TECNICO', TRUE),
('Luigue Soares Brandão', 'luigue.brandao@sti.chamados.com', 'MAT-3001', '', '(63) 98400-3001', 'GESTOR', TRUE),
('Elias Nunes da Silva Junior', 'elias.junior@sti.chamados.com', 'MAT-3002', '', '(63) 98400-3002', 'GESTOR', TRUE)
ON CONFLICT (email) DO NOTHING;
