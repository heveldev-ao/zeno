import { Candidato } from "../types/candidatos";

interface TableProps {
  candidatos: Candidato[];
}

export default function CandidatoTable({ candidatos }: TableProps) {
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
          </tr>
        </thead>
        <tbody>
          {candidatos.map(c => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{c.id}</td>
              <td className="px-6 py-4">{c.nome}</td>
              <td className="px-6 py-4">{c.email}</td>
              <td className="px-6 py-4">{c.numbi}</td>
              <td className="px-6 py-4">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
