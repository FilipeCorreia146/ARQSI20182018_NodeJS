var Receita = require('../models/receita');

var User = require('../models/user');

var VerifyToken = require('../../VerifyToken');

var userController = require('./userController');

exports.criarReceita = function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        if (user.medico == true) {

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

        } else {
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

            if ((receita.medico = req.userId) || (receita.utente = req.userId)) {
                res.json(receita);
            } else {
                res.json({ message: 'Utilizador nao autorizado!' });
            }

        })

    });

};

exports.listaReceitaPorId = function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        userController.hasRole(user.email, 'farmaceutico', function (decision) {
<<<<<<< HEAD
            if (!decision) {
                //return res.status(403).send(
                //  { auth: false, token: null, message: 'You have no authorization.' });
=======
<<<<<<< HEAD
            if (!decision)
                return res.status(403).send(
                    { auth: false, token: null, message: 'You have no authorization.' });
            else
=======
            if (!decision) {
                //return res.status(403).send(
                //  { auth: false, token: null, message: 'You have no authorization.' });
>>>>>>> b3f8f60211a9e6ef1521ef43a06ff02de2368e80
>>>>>>> 33183ea870f47d61fd08c24dda9a8082f3ae5820

                var query = {
                    _id: req.params.receita_id,
                    $or: [
                        { utente: req.userId },
                        { medico: req.userId }
                    ]
                }

<<<<<<< HEAD
=======
<<<<<<< HEAD
            Receita.findById(/*req.params.receita_id*/query, function (err, receita) {
                if (err)
                    res.send(err);
                res.json(receita);
            })
=======
>>>>>>> 33183ea870f47d61fd08c24dda9a8082f3ae5820
                Receita.findOne/*ById*/(/*req.params.receita_id*/query, function (err, receita) {
                    if (err)
                        res.send(err);
                    res.json(receita);
                })
            } else {

                Receita.findById(req.params.receita_id, function (err, receita) {
                    if (err)
                        res.send(err);
                    res.json(receita);

                })
            }
<<<<<<< HEAD
=======
>>>>>>> b3f8f60211a9e6ef1521ef43a06ff02de2368e80
>>>>>>> 33183ea870f47d61fd08c24dda9a8082f3ae5820

        });

    });

};

exports.listaPrescricaoPorId = function (req, res) {
    Receita.findById(req.params.receita_id, function (err, receita) {
        var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);
        if (err)
            res.send(err);
        res.json(prescricao);

    })
};