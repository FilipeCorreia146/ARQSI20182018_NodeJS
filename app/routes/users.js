var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

var userController = require('../controllers/userController');

//Registar um novo utilizador
router.post('/Registar', userController.registarUser);

module.exports = router;