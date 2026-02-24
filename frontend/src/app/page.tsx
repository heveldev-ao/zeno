"use client";

import { useEffect, useState } from "react";
import { listarCandidatos, deletarCandidato, atualizarCandidato } from "../services/api";
import Card from "../components/Card";
import CandidatoTable from "../components/CandidatoTable";
import { Candidato } from "../types/candidatos";
import { useRouter } from "next/navigation";

export default function Home() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const router = useRouter();

  const carregarCandidatos = async () => {
    try {
      const data = await listarCandidatos();
      setCandidatos(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar candidatos");
    }
  };

  useEffect(() => {
    carregarCandidatos();
  }, []);

  const total = candidatos.length;
  const aprovados = 0;
  const reprovados = 0;
  const pendentes = total - aprovados - reprovados;

  // Função para deletar candidato
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este candidato?")) return;
    try {
      await deletarCandidato(id);
      setCandidatos(candidatos.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar candidato");
    }
  };

  // Função para atualizar candidato
  const handleUpdate = async (candidato: Candidato) => {
    try {
      await atualizarCandidato(candidato); // chamar API PUT
      setCandidatos(
        candidatos.map((c) => (c.id === candidato.id ? candidato : c))
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar candidato");
    }
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Candidatos</h1>
        <button
          onClick={() => router.push("/novo-candidato")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Adicionar Candidato
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card title="Total" value={total} color="#0070f3" />
        <Card title="Aprovados" value={aprovados} color="#28a745" />
        <Card title="Reprovados" value={reprovados} color="#dc3545" />
        <Card title="Pendentes" value={pendentes} color="#ffc107" />
      </div>

      {/* Passando funções para o CandidatoTable */}
      <CandidatoTable
        candidatos={candidatos}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </main>
  );
}