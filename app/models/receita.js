// app/models/receita.js

var mongoose     = require('mongoose');
var mongoose_validator = require("mongoose-id-validator");


var receitaSchema = mongoose.Schema({
    utente: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    medico: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    data: {type: Date, default: Date.now},
    prescricoes: [{
        farmaco : String,
        apresentacao: String,
        apresentacaoID: String, //id de apresentacao em GdM
        posologiaPrescrita: String,
        posologiaID: Number,
        quantidade: Number,
        validade: Date,
        aviamento: [{
            data: {type: Date, default: Date.now},
            farmaceutico: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            quantidade: Number
        }]
    }]
});

receitaSchema.plugin(mongoose_validator);

module.exports = mongoose.model('Receita', receitaSchema);