// app/models/prescricao.js

var mongoose     = require('mongoose');
//var mongoose_validator = require("mongoose-id-validator");


var prescricaoSchema = mongoose.Schema({
    farmaco : String,
    apresentacao: String,
    apresentacaoID: String, //id de apresentacao em GdM
    posologiaPrescrita: String
});

//receitaSchema.plugin(mongoose_validator);

module.exports = mongoose.model('Prescricao', prescricaoSchema);