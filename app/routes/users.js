var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

var userController = require('../controllers/userController');

var VerifyToken = require('../../VerifyToken');

//Registar um novo utilizador
router.post('/Registar', userController.registarUser);

//Retorna todos os users na base de dados
router.get('/', userController.listarUsers);

//Autenticar um utilizador
router.post('/Autenticar', userController.autenticarUser);

router.get('/Me', VerifyToken, userController.me);

router.post('/Login', userController.login);

router.get('/Logout', userController.logout);

// add the middleware function
router.use(function (user, req, res, next) {
    res.status(200).send(user);
});

module.exports = router;