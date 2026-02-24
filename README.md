# Backend - Sistema de Candidatos

Este projeto é um backend desenvolvido em Node.js, Express, TypeScript e MariaDB, destinado a gerenciar candidatos em uma aplicação web.

---

## Tecnologias utilizadas

- Node.js v18+
- Express v5
- TypeScript v5
- MariaDB v11+
- ts-node-dev para desenvolvimento
- dotenv para variáveis de ambiente
- cors para permitir requisições de diferentes origens

---

## Estrutura do Projeto

backend/
│
├─ src/
│  ├─ server.ts        # Arquivo principal do servidor
│  ├─ routes/          # Rotas da API
│  ├─ controllers/     # Lógica das rotas
│  └─ models/          # Conexão e modelos de banco de dados
│
├─ .env                # Variáveis de ambiente (não comitar)
├─ package.json
├─ tsconfig.json
└─ README.md

---

## Configuração do Ambiente

1. Instalar dependências:

npm install

2. Criar arquivo `.env` na raiz com as configurações do banco:

DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=db_candidatos
DB_PORT=3306
PORT=5000

3. Configurar TypeScript (tsconfig.json):

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true
  }
}

> ⚠ Importante: não use "type": "module" no package.json para evitar conflitos com ts-node-dev.

---

## Scripts disponíveis

- Desenvolvimento:

npm run dev

- Build (produção):

npm run build

- Start (produção):

npm start

---

## Conexão com MariaDB

Exemplo de conexão no src/models/db.ts:

import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  connectionLimit: 5
});

---

## Rotas de Exemplo

- GET /api/candidatos → lista todos os candidatos
- POST /api/candidatos → cria um novo candidato
- PUT /api/candidatos/:id → atualiza um candidato
- DELETE /api/candidatos/:id → deleta um candidato

> As rotas devem ser definidas em src/routes/candidatos.ts e a lógica no controllers.

---

## Testes

- Pode-se utilizar Insomnia ou Postman para testar a API.
- Certifique-se que o MariaDB esteja rodando e que o .env esteja configurado corretamente.

---

## Observações

- O projeto utiliza CommonJS para evitar conflitos com ts-node-dev.
- Variáveis de ambiente são obrigatórias para a conexão com o banco.
- Estrutura modular com routes, controllers e models facilita manutenção e escalabilidade.

---

## Contato

Desenvolvido por Abel Eduardo.  
Projeto destinado ao gerenciamento de candidatos para aplicações web.