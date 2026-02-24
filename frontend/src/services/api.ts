import { Candidato } from "../types/candidatos";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não está definida");
}

const API_URL = `${API_BASE_URL}/api/candidatos`;

export const listarCandidatos = async (): Promise<Candidato[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Erro ao buscar candidatos");
  }

  return res.json();
};

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
};