// app/models/medico.js

var mongoose     = require('mongoose');
//var mongoose_validator = require("mongoose-id-validator");


var medicoSchema = mongoose.Schema({
    userId : String
});

//medicoSchema.plugin(mongoose_validator);

module.exports = mongoose.model('Medico', medicoSchema);