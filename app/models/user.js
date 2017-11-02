var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    nome: String,
    password: String,
    email: String,
    medico: Boolean,
    farmaceutico: Boolean
}));

