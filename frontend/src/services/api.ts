import { Candidato } from "../types/candidatos";

const API_URL = "http://localhost:5000/api/candidatos";

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