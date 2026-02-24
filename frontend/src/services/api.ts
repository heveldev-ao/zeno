import { Candidato } from "../types/candidatos";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não está definida");
}

const API_URL = `${API_BASE_URL}/api/candidatos`;

// LISTAR TODOS
export const listarCandidatos = async (): Promise<Candidato[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Erro ao buscar candidatos");
  }

  return res.json();
};

// CRIAR
export const criarCandidato = async (data: Candidato) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Erro ao criar candidato");
  }

  return res.json(); // retorna o candidato criado
};

// DELETAR
export const deletarCandidato = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Erro ao deletar candidato");
  }

  return res.json(); // retorna { message: "..." }
};

// ATUALIZAR
export const atualizarCandidato = async (candidato: Candidato) => {
  if (!candidato.id) throw new Error("ID do candidato é obrigatório para atualizar");

  const res = await fetch(`${API_URL}/${candidato.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidato),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Erro ao atualizar candidato");
  }

  return res.json(); // retorna o candidato atualizado
};