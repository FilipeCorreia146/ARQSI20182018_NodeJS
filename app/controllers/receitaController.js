var Receita = require('../models/receita');

var User = require('../models/user');

var VerifyToken = require('../../VerifyToken');

exports.criarReceita = function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        
        if(user.medico == true){

        var receita = new Receita();      // create a new instance of the Receita model
        receita.utente = req.body.utente;
        //receita.medico = req.body.medico;
        receita.medico = user._id;
        receita.prescricoes = req.body.prescricoes;
        // save the receita and check for errors
        receita.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Receita criada com sucesso!' });
        });

        }else{
            res.json({ message: 'Utilizador nao autorizado! Apenas medicos podem criar receitas!' });
        }
    });

};

exports.listarReceitas = function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        Receita.find(function (err, receita) {
        if (err)
            res.send(err);

        if((receita.medico = req.userId) || (receita.utente = req.userId)/* || 
            (user.farmaceutico == true && receita._id == req.body.receitaId)*/) {
            res.json(receita);
        }else {
            res.json({ message: 'Utilizador nao autorizado!'});
        }
        
        })

    });

};

exports.listaReceitaPorId = function (req, res) {

    /*User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");*/

    var query = {
        $or:[
          { utente: req.userId },
          { medico: req.userId }/*,
          { user.farmaceutico: true}*/
        ]
    } 

    Receita.findById(req.params.receita_id, function (err, receita) {
        if (err)
            res.send(err);
        res.json(receita);
    })

    //});

};

exports.listaPrescricaoPorId = function (req, res) {
    Receita.findById(req.params.receita_id, function (err, receita) {
        var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);
        if (err)
            res.send(err);
        res.json(prescricao);

    })
};