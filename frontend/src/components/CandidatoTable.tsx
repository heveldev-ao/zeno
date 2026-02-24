'use client';

import { useState } from "react";
import { Candidato } from "../types/candidatos";

interface TableProps {
  candidatos: Candidato[];
  onDelete: (id: number) => void;
  onUpdate: (candidato: Candidato) => void;
}

export default function CandidatoTable({ candidatos, onDelete, onUpdate }: TableProps) {
  const [editarCandidato, setEditarCandidato] = useState<Candidato | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Form state para editar
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    numBI: "",
  });

  const abrirEditar = (c: Candidato) => {
    setEditarCandidato(c);
    setFormData({
      nome: c.nome,
      email: c.email,
      numBI: c.numBI,
    });
  };

  const salvarEdicao = () => {
    if (editarCandidato) {
      onUpdate({ ...editarCandidato, ...formData });
      setEditarCandidato(null);
    }
  };

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-6 py-3">ID</th>
            <th className="text-left px-6 py-3">Nome</th>
            <th className="text-left px-6 py-3">Email</th>
            <th className="text-left px-6 py-3">BI</th>
            <th className="text-left px-6 py-3">Criado em</th>
            <th className="text-left px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {candidatos.map(c => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{c.id}</td>
              <td className="px-6 py-4">{c.nome}</td>
              <td className="px-6 py-4">{c.email}</td>
              <td className="px-6 py-4">{c.numBI}</td>
              <td className="px-6 py-4">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                  onClick={() => abrirEditar(c)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => setConfirmDeleteId(c.id!)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmação de delete */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <p className="mb-4">Tem certeza que deseja deletar este candidato?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  onDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editarCandidato && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Editar Candidato</h2>
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome"
              />
              <input
                className="w-full border px-3 py-2 rounded"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
              />
              <input
                className="w-full border px-3 py-2 rounded"
                value={formData.numBI}
                onChange={(e) => setFormData({ ...formData, numBI: e.target.value })}
                placeholder="Num BI"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditarCandidato(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={salvarEdicao}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}