// app/models/receita.js

var mongoose     = require('mongoose');
//var mongoose_validator = require("mongoose-id-validator");


var receitaSchema = mongoose.Schema({
    utente: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    medico: {type: mongoose.Schema.Types.ObjectId, ref: 'Medico'},
    prescricoes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Prescricao'}
    ]
});

//receitaSchema.plugin(mongoose_validator);

module.exports = mongoose.model('Receita', receitaSchema);