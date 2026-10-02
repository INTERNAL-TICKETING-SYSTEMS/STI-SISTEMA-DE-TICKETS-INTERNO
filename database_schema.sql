-- ====================================================================
-- STI - SISTEMA DE TICKETS INTERNO
-- Schema de Banco de Dados Relacional (PostgreSQL Padrão ANSI)
-- ====================================================================

-- Habilitar suporte a UUID para chaves primárias seguras
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. TABELA: departamentos
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    bloco_sala VARCHAR(100),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. TABELA: usuarios
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    matricula VARCHAR(50) UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone_whatsapp VARCHAR(20) NOT NULL,
    perfil VARCHAR(30) NOT NULL DEFAULT 'SOLICITANTE' CHECK (perfil IN ('ADMIN', 'TECNICO', 'GESTOR', 'SOLICITANTE')),
    departamento_id UUID REFERENCES departamentos(id) ON DELETE SET NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_matricula ON usuarios(matricula);

-- --------------------------------------------------------------------
-- 3. TABELA: recuperacoes_otp (Controle do WhatsApp Cloud API)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recuperacoes_otp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    otp_hash VARCHAR(255) NOT NULL,
    telefone_destino VARCHAR(20) NOT NULL,
    meta_message_id VARCHAR(120),
    tentativas INT NOT NULL DEFAULT 0,
    expira_em TIMESTAMP WITH TIME ZONE NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_usuario ON recuperacoes_otp(usuario_id);

-- --------------------------------------------------------------------
-- 4. TABELA: ativos_ti (Patrimônio e Infraestrutura)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ativos_ti (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_tombo VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('DESKTOP', 'NOTEBOOK', 'MONITOR', 'IMPRESSORA', 'SWITCH', 'ROTEADOR', 'OUTRO')),
    marca_modelo VARCHAR(120) NOT NULL,
    ip_rede VARCHAR(45),
    mac_address VARCHAR(17),
    departamento_id UUID REFERENCES departamentos(id) ON DELETE SET NULL,
    usuario_responsavel_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPERACIONAL' CHECK (status IN ('OPERACIONAL', 'EM_MANUTENCAO', 'DEFEITO', 'BAIXADO')),
    especificacoes JSONB DEFAULT '{}',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ativos_tombo ON ativos_ti(numero_tombo);

-- --------------------------------------------------------------------
-- 5. TABELA: chamados (Tickets do STI)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chamados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocolo VARCHAR(40) NOT NULL UNIQUE,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('HARDWARE', 'REDE_INTERNET', 'SISTEMAS_SOFTWARE', 'ACESSO_SENHAS', 'IMPRESSORAS', 'OUTROS')),
    prioridade VARCHAR(20) NOT NULL DEFAULT 'MEDIA' CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE')),
    status VARCHAR(30) NOT NULL DEFAULT 'ABERTO' CHECK (status IN ('ABERTO', 'EM_ATENDIMENTO', 'AGUARDANDO_SOLICITANTE', 'RESOLVIDO', 'CANCELADO')),
    solicitante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    ativo_id UUID REFERENCES ativos_ti(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolvido_em TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_chamados_protocolo ON chamados(protocolo);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_solicitante ON chamados(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_chamados_tecnico ON chamados(tecnico_id);

-- --------------------------------------------------------------------
-- 6. TABELA: chamados_interacoes (Timeline de conversas e notas)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chamados_interacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chamado_id UUID NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    mensagem TEXT NOT NULL,
    interno_somente_ti BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interacoes_chamado ON chamados_interacoes(chamado_id);

-- --------------------------------------------------------------------
-- 7. TABELA: auditoria_logs (Subsistema de Rastreabilidade e Segurança)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_identificacao VARCHAR(180) NOT NULL, -- Email, matrícula ou 'SISTEMA'
    acao VARCHAR(80) NOT NULL, -- Ex: 'AUTH_LOGIN', 'OTP_DISPARADO', 'TICKET_STATUS_ALTERADO'
    entidade VARCHAR(50) NOT NULL, -- Ex: 'USUARIOS', 'CHAMADOS', 'RECUPERACOES_OTP', 'ATIVOS'
    entidade_id VARCHAR(100), -- ID ou Protocolo do registro afetado
    ip_origem VARCHAR(45),
    user_agent TEXT,
    dados_anteriores JSONB,
    dados_novos JSONB,
    detalhes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade ON auditoria_logs(entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_criado_em ON auditoria_logs(criado_em DESC);
