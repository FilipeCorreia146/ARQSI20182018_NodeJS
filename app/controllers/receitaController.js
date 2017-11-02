var Receita = require('../models/receita');


exports.criarReceita = function (req, res) {

    var receita = new Receita();      // create a new instance of the Receita model
    receita.utente = req.body.user;
    receita.medico = req.body.medico;
    receita.prescricoes = req.body.prescricoes;
    // save the receita and check for errors
    receita.save(function (err) {
        if (err)
            res.send(err);
        res.json({ message: 'Receita criada com sucesso!' });
    });
};

exports.listarReceitas = function (req, res) {
    Receita.find(function (err, receita) {
        if (err)
            res.send(err);

        res.json(receita);
    })
};

exports.listaReceitaPorId = function (req, res) {
    Receita.findById(req.params.receita_id, function (err, receita) {
        if (err)
            res.send(err);
        res.json(receita);
    })
};