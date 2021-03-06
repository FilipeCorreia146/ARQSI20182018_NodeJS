// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var bcrypt = require('bcryptjs');
var Api = require('./app/routes/api');
var Users = require('./app/routes/users');
var Receita = require('./app/routes/receita');
module.exports = app;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: /*false*/true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose');

var config = require('./config');

//mongodb://mcn:mcn@ds121575.mlab.com:21575/arqsi2 // connection string para MongoDB local

mongoose.connect(config.database, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});
mongoose.Promise = global.Promise;

// ROUTES FOR OUR API
// =============================================================================

app.use('/', Api);
app.use('/Receita', Receita);
app.use('/Users', Users);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);