"use client";

import { useState } from "react";
import CandidatoForm from "../../components/CandidatoForm";

export default function NovoCandidato() {
  const [sucesso, setSucesso] = useState(false);

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <CandidatoForm onSuccess={() => setSucesso(true)} />
      {sucesso && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          Candidato cadastrado com sucesso!
        </div>
      )}
    </main>
  );
}