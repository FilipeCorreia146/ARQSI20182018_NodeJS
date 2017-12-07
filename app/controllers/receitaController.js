var Receita = require('../models/receita');

var User = require('../models/user');

var VerifyToken = require('../../VerifyToken');

var userController = require('./userController');

var Client = require('node-rest-client').Client;

var client = new Client();

client.registerMethod("getPosologia", "http://localhost:50609/api/Posologias/${id}", "GET");

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 2525, // 8025, 587 and 25 can also be used. 
    auth: {
        user: "smtpARQSI_1150524_1150595",
        pass: "limao2017"
    }
});


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
            receita.prescricoes.forEach(function (element) {
                var args = {
                    path: { "id": element.posologiaID }, // path substitution var
                    //headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNDlhYzJmMy1kYjI3LTQwZTgtYjI1My02NTZiODMwYzRlZDIiLCJzdWIiOiJ1dGVudGU1QGdtYWlsLmNvbSIsImV4cCI6MTUxMDQxODg4NSwiaXNzIjoiaHR0cDovL3NlbWVudGV3ZWJhcGkubG9jYWwiLCJhdWQiOiJodHRwOi8vc2VtZW50ZXdlYmFwaS5sb2NhbCJ9.0PjdNrDXsXlbsfAqkk317qqxvm_dQIQn8U7DWZcfnAs"}                 
                }
                client.methods.getPosologia(args, function (data, response) {
                    receita.prescricao = response.descricao;
                    console.log(data);
                    console.log(response);
                })

            }, this);
            receita.save(function (err) {
                if (err)
                    res.send(err);
                /*smtpTransport.sendMail({
                    from: "server@example.com",
                    to: "recipient@example.com",
                    subject: "Your Subject",
                    text: "It is a test message"
                }, function (error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                });*/
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
                    if (receita == undefined) {
                        res.send("A receita nao existe!");
                    } else {
                        var prescricao = receita.prescricoes.find(o => o._id = req.params.prescricao_id);
                        if (err) {
                            res.send(err);
                        } else if (prescricao == undefined) {
                            res.send("A prescricao nao existe!");
                        } else if (prescricao.validade < Date.now() || prescricao.validade < req.body.data) {
                            res.send("Aviamento nao pode ser criado pois excede a data de validade da prescricao!")
                        } else {

                            if (req.body.quantidade > prescricao.quantidade) {
                                res.send("Aviamento nao pode ser criado, pois excede a quantidade prescrita!")
                            } else {

                                prescricao.quantidade = prescricao.quantidade - req.body.quantidade;

                                prescricao.aviamento.push({ farmaceutico: req.userId, quantidade: req.body.quantidade });

                                receita.save(function (err) {
                                    if (err)
                                        res.send(err);
                                    res.json({ message: 'Aviamento criado com sucesso!' });

                                })
                            }

                        }
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