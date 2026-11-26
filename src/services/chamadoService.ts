const API_URL = (
  import.meta.env.VITE_API_URL || "https://data-audit-production.up.railway.app"
).replace(/\/$/, "");

export interface CriarChamadoDTO {
  protocolo: string;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  solicitanteNome: string;
  solicitanteEmail?: string;
  solicitanteDepartamento?: string;
}

export interface ChamadoAPI {
  id: number;
  protocolo?: string;
  titulo: string;
  descricao: string;
  categoria?: string;
  status: string;
  prioridade: string;
  solicitanteNome?: string;
  solicitanteEmail?: string;
  solicitanteDepartamento?: string;
  responsavel?: string | null;
  tecnico_atribuido_email?: string | null;
  solucao?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
  solicitante_email?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface MensagemAPI {
  id: number;
  chamado_id: number;
  remetente_email: string;
  mensagem: string | null;
  imagem_url: string | null;
  criado_em: string;
}

export interface FeedbackAPI {
  id: number;
  chamado_id: number | null;
  usuario_email: string;
  tipo: string;
  comentario: string;
  nota: number | null;
  criado_em: string;
}

export async function criarChamado(dados: CriarChamadoDTO): Promise<ChamadoAPI> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao criar chamado (HTTP ${resposta.status}).`);
  }

  return resposta.json() as Promise<ChamadoAPI>;
}

export async function listarChamados(): Promise<ChamadoAPI[]> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao listar chamados (HTTP ${resposta.status}).`);
  }

  return resposta.json() as Promise<ChamadoAPI[]>;
}

export interface AtualizarChamadoDTO {
  status?: string;
  responsavel?: string | null;
  solucao?: string | null;
}

export async function atualizarChamado(id: number, dados: AtualizarChamadoDTO): Promise<any> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao atualizar chamado (HTTP ${resposta.status}).`);
  }

  return resposta.json();
}

export async function listarMensagensChamado(chamadoId: number | string): Promise<MensagemAPI[]> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados/${chamadoId}/mensagens`, {
    headers: { Accept: "application/json" },
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao listar mensagens (HTTP ${resposta.status}).`);
  }

  return resposta.json() as Promise<MensagemAPI[]>;
}

export async function enviarMensagemChamado(
  chamadoId: number | string,
  payload: { remetenteEmail: string; mensagem?: string; imagemUrl?: string | null }
): Promise<MensagemAPI> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados/${chamadoId}/mensagens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao enviar mensagem (HTTP ${resposta.status}).`);
  }

  return resposta.json() as Promise<MensagemAPI>;
}

export async function uploadImagemChamado(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const resposta = await fetch(`${API_URL}/api/v1/chamados/upload`, {
    method: "POST",
    body: formData,
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao enviar imagem (HTTP ${resposta.status}).`);
  }

  const data = await resposta.json();
  const caminho: string = data.url || "";
  return caminho.startsWith("http") ? caminho : `${API_URL}${caminho}`;
}

export async function listarFeedbacks(): Promise<FeedbackAPI[]> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados/feedbacks`, {
    headers: { Accept: "application/json" },
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao listar feedbacks (HTTP ${resposta.status}).`);
  }

  return resposta.json() as Promise<FeedbackAPI[]>;
}

export async function criarFeedback(payload: {
  chamadoId?: number | string | null;
  usuarioEmail: string;
  tipo: string;
  comentario: string;
  nota?: number | null;
}): Promise<FeedbackAPI> {
  const resposta = await fetch(`${API_URL}/api/v1/chamados/feedbacks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ao enviar feedback (HTTP ${resposta.status}).`);
  }

  return resposta.json() as Promise<FeedbackAPI>;
}