var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

var receitaController = require('../controllers/receitaController');

var config = require('../../config');

// route middleware to verify a token
//router.use(function(req, res, next) {
function isUser(req, res, next) {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
      // decode token
      if (token) {
    
        // verifies secret and checks exp
        config.jwt.verify(token, /*app.get('superSecret')*/config.secret, function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes      
            req.decoded = decoded;
            next();
          }
        });
    
      } else {
    
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    
      }
}/*);*/

function isMedico(req, res, next) {
  if(req.decoded._doc.medico !== true){
    return next(err);
  }else{
    return next();
  }
}

//Retorna todas as receitas na base de dados
router.get('/', isUser/*, andRestrictTo('medico')*/, receitaController.listarReceitas);

//Cria uma nova receita
router.post('/', receitaController.criarReceita);

//Lista uma receita por ID
router.get('/:receita_id', receitaController.listaReceitaPorId);

//Lista prescricao por ID
router.get('/:receita_id/Prescricao/:prescricao_id', receitaController.listaPrescricaoPorId);

module.exports = router;