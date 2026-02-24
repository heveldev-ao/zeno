"use client";

import { useState } from "react";
import { Candidato } from "../types/candidatos";
import { useRouter } from "next/navigation";

interface Props {
  onSuccess: () => void;
}

export default function CandidatoForm({ onSuccess }: Props) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numBI, setNumBI] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Regex do BI: 9 dígitos + 2 letras maiúsculas + 3 dígitos
  const numBIRegex = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/;

  const handleNumBIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Permite apenas números e letras
    if (/^[0-9A-Z]*$/.test(value)) {
      setNumBI(value);
    }
  };

  const validarCampos = (): string | null => {
    if (!nome.trim()) return "⚠️ Nome é obrigatório.";
    if (!email.trim()) return "⚠️ Email é obrigatório.";
    if (!numBI.trim()) return "⚠️ Número do BI é obrigatório.";
    if (!numBIRegex.test(numBI))
      return "⚠️ Número do BI inválido. Formato esperado: 9 dígitos + 2 letras maiúsculas + 3 dígitos (Ex: 123456789AB123).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    // Validação local antes de enviar para backend
    const erro = validarCampos();
    if (erro) {
      setMsg({ type: "error", text: erro });
      return; // **Não envia para o backend**
    }

    setLoading(true);

    try {
      if (!API_BASE_URL) throw new Error("API URL não definida");

      const data: Candidato = { nome, email, numBI };

      const res = await fetch(`${API_BASE_URL}/api/candidatos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Erro ao cadastrar candidato");
      }

      setNome("");
      setEmail("");
      setNumBI("");
      setMsg({ type: "success", text: "✅ Candidato cadastrado com sucesso!" });

      onSuccess();
    } catch (error: any) {
      console.error(error);
      setMsg({ type: "error", text: `⚠️ ${error.message}` });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold mb-2 text-center">Cadastro de Candidato</h1>
      <p className="text-gray-600 mb-6 text-center">
        Preencha os campos abaixo para adicionar um novo candidato. Email e Número do BI não podem se repetir.
      </p>

      {msg && (
        <div
          className={`mb-4 p-3 rounded-md shadow-md text-center ${
            msg.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 hover:border-blue-400"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 hover:border-blue-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 hover:border-blue-400"
          placeholder="Número do BI"
          value={numBI}
          onChange={handleNumBIChange}
          maxLength={14}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}