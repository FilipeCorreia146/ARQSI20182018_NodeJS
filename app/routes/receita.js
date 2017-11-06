var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

var receitaController = require('../controllers/receitaController');

var config = require('../../config');

var VerifyToken = require('../../VerifyToken');

//Retorna todas as receitas na base de dados
router.get('/', VerifyToken, receitaController.listarReceitas);

//Cria uma nova receita
router.post('/', VerifyToken, receitaController.criarReceita);

//Lista uma receita por ID
router.get('/:receita_id', VerifyToken, receitaController.listaReceitaPorId);

//Lista prescricao por ID
router.get('/:receita_id/Prescricao/:prescricao_id', receitaController.listaPrescricaoPorId);

module.exports = router;