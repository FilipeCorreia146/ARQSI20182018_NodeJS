// app/models/receita.js

var mongoose     = require('mongoose');
//var mongoose_validator = require("mongoose-id-validator");


var receitaSchema = mongoose.Schema({
    utente: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    medico: {type: mongoose.Schema.Types.ObjectId, ref: 'Medico'},
    prescricoes: [{
        farmaco : String,
        apresentacao: String,
        apresentacaoID: String, //id de apresentacao em GdM
        posologiaPrescrita: String
    }]
});

//receitaSchema.plugin(mongoose_validator);

module.exports = mongoose.model('Receita', receitaSchema);