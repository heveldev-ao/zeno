const pool = require("../config/db");

// LISTAR TODOS OS CANDIDATOS
exports.listarCandidatos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM candidatos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar candidatos:", err);
    res.status(500).json({ error: err.message });
  }
};

// BUSCAR CANDIDATO POR ID
exports.buscarCandidato = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM candidatos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};

// CRIAR CANDIDATO
exports.criarCandidato = async (req, res) => {
  const { nome, email, numBI } = req.body;
  if (!nome || !email || !numBI) {
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });
  }

  try {
    // Verificar duplicidade de email
    const emailCheck = await pool.query("SELECT id FROM candidatos WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Já existe um candidato com este email" });
    }

    // Verificar duplicidade de numBI
    const biCheck = await pool.query("SELECT id FROM candidatos WHERE numBI = $1", [numBI]);
    if (biCheck.rows.length > 0) {
      return res.status(400).json({ error: "Já existe um candidato com este número do BI" });
    }

    // Inserir candidato
    const result = await pool.query(
      "INSERT INTO candidatos (nome, email, numBI) VALUES ($1, $2, $3) RETURNING id",
      [nome, email, numBI]
    );

    res.status(201).json({ id: result.rows[0].id, nome, email, numBI });
  } catch (err) {
    console.error("Erro ao criar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR CANDIDATO
exports.atualizarCandidato = async (req, res) => {
  const { id } = req.params;
  const { nome, email, numBI } = req.body;

  if (!nome || !email || !numBI) {
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });
  }

  try {
    // Verificar duplicidade de email em outros candidatos
    const emailCheck = await pool.query(
      "SELECT id FROM candidatos WHERE email = $1 AND id != $2",
      [email, id]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Outro candidato já possui este email" });
    }

    // Verificar duplicidade de numBI em outros candidatos
    const biCheck = await pool.query(
      "SELECT id FROM candidatos WHERE numBI = $1 AND id != $2",
      [numBI, id]
    );
    if (biCheck.rows.length > 0) {
      return res.status(400).json({ error: "Outro candidato já possui este número do BI" });
    }

    const result = await pool.query(
      "UPDATE candidatos SET nome = $1, email = $2, numBI = $3 WHERE id = $4 RETURNING id",
      [nome, email, numBI, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }

    res.json({ id: Number(id), nome, email, numBI });
  } catch (err) {
    console.error("Erro ao atualizar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETAR CANDIDATO
exports.deletarCandidato = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM candidatos WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }
    res.json({ message: "Candidato deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};