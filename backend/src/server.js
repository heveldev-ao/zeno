// server.js
const fs = require("fs");
const path = require("path");

// Se estiver em desenvolvimento e existir o arquivo .env local, carrega ele
if (process.env.NODE_ENV !== "production") {
  const envPath = path.resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
    console.log("Arquivo .env local carregado");
  }
}

const app = require("./app");

// Usa a porta do Render (via variável de ambiente) ou fallback
const PORT = process.env.PORT || 3000;

console.log("Ambiente:", process.env.NODE_ENV);
console.log("Banco utilizado:", process.env.NODE_ENV === "production" ? "PRODUÇÃO" : "DESENVOLVIMENTO");

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});