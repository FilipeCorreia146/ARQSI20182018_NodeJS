var express = require('express');        // call express
var router = express.Router();              // get an instance of the express Router

router.get('/', function (req, res) {
  res.json({ message: 'Bem vindo à API de gestão de receitas!' });
});

router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

module.exports = router;