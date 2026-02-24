const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidato.controller');

router.get('/', candidatoController.listarCandidatos);
router.get('/:id', candidatoController.buscarCandidato);
router.post('/', candidatoController.criarCandidato);
router.put('/:id', candidatoController.atualizarCandidato);
router.delete('/:id', candidatoController.deletarCandidato);

module.exports = router;