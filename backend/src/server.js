// server.js
require("dotenv").config();
const app = require("./app");

// Usa a porta do Render ou fallback para 3000
const PORT = process.env.PORT || 3000;

// Log do banco de dados para debug (opcional)
console.log("Conectando ao banco em:", process.env.DB_HOST);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});