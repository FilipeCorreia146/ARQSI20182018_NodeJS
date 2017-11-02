var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

var receitaController = require('../controllers/receitaController');

//Retorna todas as receitas na base de dados
router.get('/', receitaController.listarReceitas);

//Cria uma nova receita
router.post('/', receitaController.criarReceita);

//Lista uma receita por ID
router.get('/:receita_id', receitaController.listaReceitaPorId);

module.exports = router;