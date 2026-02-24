const pool = require("../config/db");

const isProd = process.env.NODE_ENV === "production";

// Função helper para adaptar retorno
const getRows = (result) => (isProd ? result.rows : result);

// LISTAR TODOS
exports.listarCandidatos = async (req, res) => {
  try {
    const query = "SELECT * FROM candidatos ORDER BY id ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar candidatos:", err);
    res.status(500).json({ error: err.message });
  }
};

// BUSCAR POR ID
exports.buscarCandidato = async (req, res) => {
  const { id } = req.params;

  try {
    const query = isProd
      ? "SELECT * FROM candidatos WHERE id = $1"
      : "SELECT * FROM candidatos WHERE id = ?";

    const result = await pool.query(query, [id]);
    const rows = getRows(result);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};

// CRIAR
exports.criarCandidato = async (req, res) => {
  const { nome, email, numBI } = req.body;

  if (!nome || !email || !numBI) {
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });
  }

  try {
    const emailQuery = isProd
      ? "SELECT id FROM candidatos WHERE email = $1"
      : "SELECT id FROM candidatos WHERE email = ?";

    const biQuery = isProd
      ? "SELECT id FROM candidatos WHERE numBI = $1"
      : "SELECT id FROM candidatos WHERE numBI = ?";

    const emailCheck = await pool.query(emailQuery, [email]);
    const biCheck = await pool.query(biQuery, [numBI]);

    if (getRows(emailCheck).length > 0) {
      return res.status(400).json({ error: "Já existe um candidato com este email" });
    }

    if (getRows(biCheck).length > 0) {
      return res.status(400).json({ error: "Já existe um candidato com este número do BI" });
    }

    if (isProd) {
      const result = await pool.query(
        "INSERT INTO candidatos (nome, email, numBI) VALUES ($1, $2, $3) RETURNING id",
        [nome, email, numBI]
      );

      return res.status(201).json({
        id: result.rows[0].id,
        nome,
        email,
        numBI,
      });
    } else {
      const result = await pool.query(
        "INSERT INTO candidatos (nome, email, numBI) VALUES (?, ?, ?)",
        [nome, email, numBI]
      );

      return res.status(201).json({
        id: result.insertId,
        nome,
        email,
        numBI,
      });
    }
  } catch (err) {
    console.error("Erro ao criar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR
exports.atualizarCandidato = async (req, res) => {
  const { id } = req.params;
  const { nome, email, numBI } = req.body;

  if (!nome || !email || !numBI) {
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });
  }

  try {
    const query = isProd
      ? "UPDATE candidatos SET nome = $1, email = $2, numBI = $3 WHERE id = $4 RETURNING id"
      : "UPDATE candidatos SET nome = ?, email = ?, numBI = ? WHERE id = ?";

    const result = await pool.query(query, [nome, email, numBI, id]);

    if (isProd) {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Candidato não encontrado" });
      }
    } else {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Candidato não encontrado" });
      }
    }

    res.json({ id: Number(id), nome, email, numBI });
  } catch (err) {
    console.error("Erro ao atualizar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETAR
exports.deletarCandidato = async (req, res) => {
  const { id } = req.params;

  try {
    const query = isProd
      ? "DELETE FROM candidatos WHERE id = $1 RETURNING id"
      : "DELETE FROM candidatos WHERE id = ?";

    const result = await pool.query(query, [id]);

    if (isProd) {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Candidato não encontrado" });
      }
    } else {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Candidato não encontrado" });
      }
    }

    res.json({ message: "Candidato deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar candidato:", err);
    res.status(500).json({ error: err.message });
  }
};
