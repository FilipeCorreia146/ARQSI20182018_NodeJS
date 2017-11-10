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

    var query = {
        $or: [
            { utente: req.userId },
            { medico: req.userId }
        ]
    }

    Receita.find(query, function (err, receita) {
        if (err)
            res.send("Nao ha receitas para visualizar.");
        res.json(receita);
    });

};

exports.listaReceitaPorId = function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        userController.hasRole(user.email, 'farmaceutico', function (decision) {
            if (!decision) {

                var query = {
                    _id: req.params.receita_id,
                    $or: [
                        { utente: req.userId },
                        { medico: req.userId }
                    ]
                }

                Receita.findOne(query, function (err, receita) {
                    if (receita == undefined) {
                        res.send("A Receita nao existe ou nao tem autorizacao para aceder à mesma!");
                    } else {
                        if (err)
                            res.send("A Receita nao existe ou nao tem autorizacao para aceder à mesma!");
                        res.json(receita);
                    }
                })
            } else {

                Receita.findById(req.params.receita_id, function (err, receita) {
                    if (err)
                        res.send("A Receita nao existe!");
                    res.json(receita);

                })
            }

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

exports.aviarReceita = function (req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        userController.hasRole(user.email, 'farmaceutico', function (decision) {
            if (decision) {

                Receita.findById(req.params.receita_id, function (err, receita) {
                    var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);
                    if (err) {
                        res.send(err);
                    } else if (prescricao.validade > Date.now || prescricao.validade > req.body.data) {
                        res.send("Aviamento nao pode ser criado pois excede a data de validade da prescricao!")
                    } else {

                        var cont = req.body.quantidade;

                        prescricao.aviamentos.forEach(function (aviamento) {
                             cont += aviamento.quantidade;
                        })

                        if (cont > prescricao.quantidade) {
                        }

                        var farmaceutico = user._id;

                        prescricao.aviamento.push(farmaceutico);

                        receita.save(function (err) {
                            if (err)
                                res.send(err);
                            res.json({ message: 'Aviamento criado com sucesso!' });

                        })
                    }

                })
            } else {
                res.send("Apenas um farmaceutico pode aviar uma prescricao!");
            }
        })

    })
};

exports.aviamentos = function (req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        userController.hasRole(user.email, 'farmaceutico', function (decision) {
            if (!decision) {

                var query = {
                    _id: req.params.receita_id,
                    $or: [
                        { utente: req.userId },
                        { medico: req.userId }
                    ]
                }

                Receita.findOne(query, function (err, receita) {
                    if (receita == undefined) {
                        res.send("O aviamento nao existe ou nao tem autorizacao para aceder ao mesmo!");
                    } else {
                        var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);

                        if (err)
                            res.send("O aviamento nao existe ou nao tem autorizacao para aceder ao mesmo!");
                        res.json(prescricao.aviamento);
                    }
                })
            } else {

                Receita.findById(req.params.receita_id, function (err, receita) {
                    var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);

                    if (err)
                        res.send("Nao ha aviamentos para visualizar.");
                    res.json(prescricao.aviamento);
                });
            }

        });

    });
};

exports.atualizarReceita = function (req, res) {

    var query = {
        _id: req.params.receita_id,
        medico: req.userId
    }

    Receita.findOne(query, function (err, receita) {
        if (receita == undefined) {
            res.send("A prescricao nao existe ou nao tem autorizacao para aceder a mesma!");
        } else {
            var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);

            if (err)
                res.send("A prescricao nao existe ou nao tem autorizacao para aceder a mesma!");

            if (prescricao.aviamentos != undefined) {
                prescricao.farmaco = req.body.farmaco;
                prescricao.apresentacao = req.body.apresentacao;
                prescricao.apresentacaoID = req.body.apresentacaoID;
                prescricao.posologiaPrescrita = req.body.posologiaPrescrita;
                prescricao.quantidade = req.body.quantidade;
                receita.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Prescricao atualizada criado com sucesso!' });
                })
            } else {
                res.json({ message: 'A prescricao ja tem aviamentos, logo nao pode ser atualizada!' });
            }
        }

    });

};