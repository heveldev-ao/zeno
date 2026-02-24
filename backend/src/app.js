const express = require('express');
const cors = require('cors');
const candidatoRoutes = require('./routes/candidato.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/candidatos', candidatoRoutes);

module.exports = app;