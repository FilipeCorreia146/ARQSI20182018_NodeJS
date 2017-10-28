// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Receita    = require('./app/models/receita');
var Medico     = require('./app/models/medico');
var User       = require('./app/models/user');
var Prescricao = require('./app/models/prescricao');
var bcrypt     = require('bcryptjs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose');

//mongodb://mcn:mcn@ds121575.mlab.com:21575/arqsi2 // connection string para MongoDB local

mongoose.connect('mongodb://1150524:arqsi2017@ds040837.mlab.com:40837/arqsi', { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
console.log("we're connected!");
});
mongoose.Promise = global.Promise;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to a RESTful api' });   
});

router.route('/registar')

    .post(function(req,res){

        var user = new User();
        user.name = req.body.name;
        hashedPassword = bcrypt.hashSync(req.body.password,8);
        user.password = hashedPassword;
        user.email = req.body.email;
        user.medico = req.body.medico;
        
        user.save(function(err) {
            console.log("A guardar");
            if(err)
                return res.status(500).send("Problema ao guardar o utilizador!");
            
            
            res.json({message : 'Utilizador registado!'});
        })

        if(user.medico){
            var medico = new Medico();
            medico.userId = user.id;
            medico.save(function(err) {
                console.log("A guardar");
                if(err)
                    return res.status(500).send("Problema ao guardar o medico!");
            
                res.json({message : 'Medico registado!'});
            })
        }
    });

router.route('/Receita')

    // create a receita (accessed at POST http://localhost:8080/api/Receita)
    .post(function(req, res) {

        var receita = new Receita();      // create a new instance of the Receita model
        receita.utente = req.body.user;
        receita.medico = req.body.medico;
        receita.prescricoes = req.body.prescricoes;

        // save the receita and check for errors
        receita.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Receita criada com sucesso!' });
        });
    })

        .get(function(req, res) {
            Receita.find(function(err, receita) {
                if (err)
                    res.send(err);
    
                res.json(receita);
            });
    });

router.route('/Receita/:receita_id')

    .get(function(req, res) {
        Receita.findById(req.params.receita_id, function(err, receita) {
            if (err)
                res.send(err);
            res.json(receita);
        });
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);