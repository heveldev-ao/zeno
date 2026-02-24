const pool = require("../config/db");

// Função auxiliar para converter BigInt -> Number
function safeJson(obj) {
  return JSON.parse(JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? Number(value) : value
  ));
}

exports.listarCandidatos = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const candidatos = await conn.query("SELECT * FROM candidatos");
    res.json(safeJson(candidatos));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.buscarCandidato = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const candidato = await conn.query("SELECT * FROM candidatos WHERE id = ?", [id]);
    if (candidato.length === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }
    res.json(safeJson(candidato[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.criarCandidato = async (req, res) => {
  const { nome, email, numBI } = req.body;
  if (!nome || !email || !numBI) {
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar duplicidade de email
    const emailExist = await conn.query("SELECT id FROM candidatos WHERE email = ?", [email]);
    if (emailExist.length > 0) {
      return res.status(400).json({ error: "Já existe um candidato com este email" });
    }

    // Verificar duplicidade de numBI
    const biExist = await conn.query("SELECT id FROM candidatos WHERE numBI = ?", [numBI]);
    if (biExist.length > 0) {
      return res.status(400).json({ error: "Já existe um candidato com este número do BI" });
    }

    // Inserção
    const result = await conn.query("INSERT INTO candidatos (nome, email, numBI) VALUES (?, ?, ?)", [nome, email, numBI]);

    res.status(201).json(safeJson({ id: result.insertId, nome, email, numBI }));
  } catch (err) {
    console.error("Erro ao criar candidato:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.atualizarCandidato = async (req, res) => {
  const { id } = req.params;
  const { nome, email, numBI } = req.body;

  if (!nome || !email || !numBI) {
    return res.status(400).json({ error: "Nome, email e número do BI são obrigatórios" });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar duplicidade de email em outros candidatos
    const emailExist = await conn.query("SELECT id FROM candidatos WHERE email = ? AND id != ?", [email, id]);
    if (emailExist.length > 0) {
      return res.status(400).json({ error: "Outro candidato já possui este email" });
    }

    // Verificar duplicidade de numBI em outros candidatos
    const biExist = await conn.query("SELECT id FROM candidatos WHERE numBI = ? AND id != ?", [numBI, id]);
    if (biExist.length > 0) {
      return res.status(400).json({ error: "Outro candidato já possui este número do BI" });
    }

    const result = await conn.query(
      "UPDATE candidatos SET nome = ?, email = ?, numBI = ? WHERE id = ?",
      [nome, email, numBI, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }

    res.json(safeJson({ id: Number(id), nome, email, numBI }));
  } catch (err) {
    console.error("Erro ao atualizar candidato:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.deletarCandidato = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM candidatos WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Candidato não encontrado" });
    }
    res.json({ message: "Candidato deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar candidato:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};