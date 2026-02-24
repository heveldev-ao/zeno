import { Candidato } from "../types/candidatos";

const API_BASE_URL = process.env.NEXT_API_URL;
const API_URL = `${API_BASE_URL}/api/candidatos`;

export const listarCandidatos = async (): Promise<Candidato[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erro ao buscar candidatos");
  return res.json();
};

export const criarCandidato = async (data: Candidato) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar candidato");
};