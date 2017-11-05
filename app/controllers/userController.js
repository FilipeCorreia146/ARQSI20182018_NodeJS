var User = require('../models/user');
var bcrypt = require('bcryptjs');

var config = require('../../config');
var VerifyToken = require('../../VerifyToken');


exports.registarUser = function (req, res) {

    var user = new User();
    user.nome = req.body.nome;
    hashedPassword = bcrypt.hashSync(req.body.password, 8);
    user.password = hashedPassword;
    user.email = req.body.email;
    user.medico = req.body.medico;
    user.farmaceutico = req.body.farmaceutico;

    user.save(function (err) {
        console.log("A guardar");
        if (err)
            return res.status(500).send("Problema ao guardar o utilizador!");


        //res.json({ message: 'Utilizador registado!' });

        //create a token
        var token = config.jwt.sign({ id: user._id}, config.secret, {
          expiresIn: 86400 //expires in 24 hours
        });

        res.status(200).send({ message: 'Utilizador registado!', auth: true, token: token});

    })

};

exports.listarUsers = function (req, res) {
    User.find(function (err, user) {
        if (err)
            res.send(err);

        res.json(user);
    })
};

exports.autenticarUser = function(req, res) {
    
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
            
            //req.user = user;

            // if user is found and password is right
            // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
          //medico: user.medico 
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

exports.me = function(req, res, next) {

  //var token = req.headers['x-access-token'];
  //if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  //config.jwt.verify(token, config.secret, function(err, decoded) {
    //if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    //res.status(200).send(decoded);

    //User.findById(decoded.id, 
      //{ password: 0 }, // projection
      //function (err, user) {
        //if (err) return res.status(500).send("There was a problem finding the user.");
        //if (!user) return res.status(404).send("No user found.");
        
        //res.status(200).send(user);
        //next(user);
    //});

  //});

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    
    return user;
    res.status(200).send(user);
  });

};

exports.login = function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = config.jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });

};

exports.logout = function(req, res) {
  res.status(200).send({ auth: false, token: null });
};