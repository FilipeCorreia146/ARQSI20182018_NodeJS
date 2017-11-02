// app/models/farmaceutico.js

var mongoose     = require('mongoose');
//var mongoose_validator = require("mongoose-id-validator");


var farmaceuticoSchema = mongoose.Schema({
    userId : String
});

//medicoSchema.plugin(mongoose_validator);

module.exports = mongoose.model('Farmaceutico', medicoSchema);