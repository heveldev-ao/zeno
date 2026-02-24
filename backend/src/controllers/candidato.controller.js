const pool = require("../config/db");
const isProd = process.env.NODE_ENV === "production";

// Regex do BI: 9 dígitos + 2 letras maiúsculas + 3 dígitos
const numBIRegex = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/;

// Helper: padroniza retorno e converte BigInt para string
const getRows = (result) => {
  const rows = result.rows ? result.rows : result;
  return rows.map((r) => ({
    ...r,
    id: typeof r.id === "bigint" ? r.id.toString() : r.id,
    numBI: r.numBI || r.numbi || "",
  }));
};

// ================= LISTAR =================
exports.listarCandidatos = async (req, res) => {
  try {
    const query = "SELECT * FROM candidatos ORDER BY id ASC";
    const result = await pool.query(query);
    res.json(getRows(result));
  } catch (err) {
    console.error("Erro ao listar candidatos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ================= BUSCAR =================
exports.buscarCandidato = async (req, res) => {
  const { id } = req.params;
  try {
    const query = isProd
      ? "SELECT * FROM candidatos WHERE id = $1"
      : "SELECT * FROM candidatos WHERE id = ?";
    const result = await pool.query(query, [id]);
    const rows = getRows(result);

    if (rows.length === 0) return res.status(404).json({ error: "Candidato não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar candidato:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ================= CRIAR =================
exports.criarCandidato = async (req, res) => {
  const { nome, email, numBI } = req.body;

  // Validação obrigatória
  if (!nome || !email || !numBI)
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });

  // Validação do BI
  if (!numBIRegex.test(numBI))
    return res.status(400).json({
      error:
        "Número do BI inválido. Formato esperado: 9 dígitos + 2 letras maiúsculas + 3 dígitos",
    });

  try {
    // Checa duplicidade
    const emailQuery = isProd
      ? "SELECT id FROM candidatos WHERE email = $1"
      : "SELECT id FROM candidatos WHERE email = ?";
    const biQuery = isProd
      ? "SELECT id FROM candidatos WHERE numBI = $1"
      : "SELECT id FROM candidatos WHERE numBI = ?";

    const emailCheck = await pool.query(emailQuery, [email]);
    const biCheck = await pool.query(biQuery, [numBI]);

    if (getRows(emailCheck).length > 0)
      return res.status(400).json({ error: "Já existe um candidato com este email" });
    if (getRows(biCheck).length > 0)
      return res.status(400).json({ error: "Já existe um candidato com este número do BI" });

    // Inserção
    if (isProd) {
      const result = await pool.query(
        "INSERT INTO candidatos (nome, email, numBI) VALUES ($1, $2, $3) RETURNING id",
        [nome, email, numBI]
      );
      return res
        .status(201)
        .json({ id: result.rows[0].id.toString(), nome, email, numBI });
    } else {
      const result = await pool.query(
        "INSERT INTO candidatos (nome, email, numBI) VALUES (?, ?, ?)",
        [nome, email, numBI]
      );
      return res
        .status(201)
        .json({ id: result.insertId.toString(), nome, email, numBI });
    }
  } catch (err) {
    console.error("Erro ao criar candidato:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ================= ATUALIZAR =================
exports.atualizarCandidato = async (req, res) => {
  const { id } = req.params;
  const { nome, email, numBI } = req.body;

  if (!nome || !email || !numBI)
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });

  if (!numBIRegex.test(numBI))
    return res.status(400).json({
      error:
        "Número do BI inválido. Formato esperado: 9 dígitos + 2 letras maiúsculas + 3 dígitos",
    });

  try {
    const query = isProd
      ? "UPDATE candidatos SET nome=$1,email=$2,numBI=$3 WHERE id=$4 RETURNING id"
      : "UPDATE candidatos SET nome=?,email=?,numBI=? WHERE id=?";
    const result = await pool.query(query, [nome, email, numBI, id]);

    const exists = isProd ? result.rows.length > 0 : result.affectedRows > 0;
    if (!exists) return res.status(404).json({ error: "Candidato não encontrado" });

    res.json({ id: id.toString(), nome, email, numBI });
  } catch (err) {
    console.error("Erro ao atualizar candidato:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ================= DELETAR =================
exports.deletarCandidato = async (req, res) => {
  const { id } = req.params;
  try {
    const query = isProd
      ? "DELETE FROM candidatos WHERE id=$1 RETURNING id"
      : "DELETE FROM candidatos WHERE id=?";
    const result = await pool.query(query, [id]);

    const exists = isProd ? result.rows.length > 0 : result.affectedRows > 0;
    if (!exists) return res.status(404).json({ error: "Candidato não encontrado" });

    res.json({ message: "Candidato deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar candidato:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};