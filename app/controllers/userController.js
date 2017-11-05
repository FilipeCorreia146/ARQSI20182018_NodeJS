var User = require('../models/user');
var bcrypt = require('bcryptjs');
var config = require('../../config');


exports.registarUser = function (req, res) {

    var user = new User();
    user.name = req.body.name;
    hashedPassword = bcrypt.hashSync(req.body.password, 8);
    user.password = hashedPassword;
    user.email = req.body.email;
    user.medico = req.body.medico;
    user.farmaceutico = req.body.farmaceutico;

    user.save(function (err) {
        console.log("A guardar");
        if (err)
            return res.status(500).send("Problema ao guardar o utilizador!");


        res.json({ message: 'Utilizador registado!' });
    })

};

exports.listarUsers = function (req, res) {
    User.find(function (err, user) {
        if (err)
            res.send(err);

        res.json(user);
    })
};

exports.autenticarUserMedico = function(req, res) {
    
      // find the user
      User.findOne({
        nome: req.body.nome
      }, function(err, user) {
    
        if (err) throw err;
    
        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
    
          // check if password matches
          //if (user.password != req.body.password) {
          if(!bcrypt.compareSync(req.body.password, user.password)){
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {
    
            // if user is found and password is right
            // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
          medico: user.medico 
        };

            var token = config.jwt.sign(payload, /*app.get('superSecret')*/config.secret, {
              expiresIn : 60*60*24 // expires in 24 hours
            });
    
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }   
    
        }
    
      });
};