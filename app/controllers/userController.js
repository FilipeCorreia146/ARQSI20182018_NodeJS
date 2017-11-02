var User = require('../models/user');


exports.registarUser = function (req, res) {

    var user = new User();
    user.name = req.body.name;
    hashedPassword = bcrypt.hashSync(req.body.password, 8);
    user.password = hashedPassword;
    user.email = req.body.email;
    user.medico = req.body.medico;

    user.save(function (err) {
        console.log("A guardar");
        if (err)
            return res.status(500).send("Problema ao guardar o utilizador!");


        res.json({ message: 'Utilizador registado!' });
    })

};