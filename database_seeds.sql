-- ====================================================================
-- CARGA DE DADOS INICIAL (SEEDS) - STI
-- ====================================================================

-- 1. Departamentos Iniciais
INSERT INTO departamentos (id, nome, sigla, bloco_sala) VALUES 
('a0000000-0000-0000-0000-000000000001', 'Tecnologia da Informação e Suporte', 'DTI', 'Bloco Central - Sala 102'),
('a0000000-0000-0000-0000-000000000002', 'Recursos Humanos', 'RH', 'Bloco A - Sala 04'),
('a0000000-0000-0000-0000-000000000003', 'Diretoria de Operações', 'DIR', 'Bloco B - Sala 201')
ON CONFLICT (sigla) DO NOTHING;

-- 2. Usuários Iniciais (Admin / Técnico / Solicitante)
-- A senha padrão nos testes pode ser tratada via hash bcrypt
INSERT INTO usuarios (id, nome, email, matricula, senha_hash, telefone_whatsapp, perfil, departamento_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'Administrador STI', 'admin@sti.local', 'STI-001', '$2b$10$abcdefghijklmnopqrstuvwx', '5563992466252', 'ADMIN', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002', 'Suporte Técnico N1', 'suporte@sti.local', 'STI-002', '$2b$10$abcdefghijklmnopqrstuvwx', '5563992466252', 'TECNICO', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000003', 'Carlos Servidor', 'carlos@sti.local', 'SER-1044', '$2b$10$abcdefghijklmnopqrstuvwx', '5563992466252', 'SOLICITANTE', 'a0000000-0000-0000-0000-000000000002')
ON CONFLICT (email) DO NOTHING;

-- 3. Chamado de Teste
INSERT INTO chamados (protocolo, titulo, descricao, categoria, prioridade, status, solicitante_id, tecnico_id) VALUES
('STI-2026-0001', 'Computador não conecta à rede interna', 'Ao ligar a máquina após o almoço, o ícone de rede exibe triângulo amarelo.', 'REDE_INTERNET', 'ALTA', 'ABERTO', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT (protocolo) DO NOTHING;
