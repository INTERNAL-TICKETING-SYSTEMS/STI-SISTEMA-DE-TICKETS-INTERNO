const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8081"
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
  protocolo: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  prioridade: string;
  solicitanteNome: string;
  solicitanteEmail?: string;
  solicitanteDepartamento?: string;
  responsavel?: string;
  solucao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export async function criarChamado(
  dados: CriarChamadoDTO
): Promise<ChamadoAPI> {
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

    throw new Error(
      mensagem || `Erro ao criar chamado (HTTP ${resposta.status}).`
    );
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

    throw new Error(
      mensagem || `Erro ao listar chamados (HTTP ${resposta.status}).`
    );
  }

  return resposta.json() as Promise<ChamadoAPI[]>;
}

export interface AtualizarChamadoDTO {
  status?: string;
  responsavel?: string | null;
  solucao?: string | null;
}

export async function atualizarChamado(
  id: number,
  dados: AtualizarChamadoDTO
): Promise<ChamadoAPI> {
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

    throw new Error(
      mensagem || `Erro ao atualizar chamado (HTTP ${resposta.status}).`
    );
  }

  return resposta.json() as Promise<ChamadoAPI>;
}