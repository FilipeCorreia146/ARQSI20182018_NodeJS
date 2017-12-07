//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../app/models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET Users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/Users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    /*
  * Test the /POST route
  */
    describe('/POST Users/Registar', () => {
        it('it should not POST a user without email', (done) => {
            let user = {
                nome: "nome",
                password: "Qwerty1!"
            }
            chai.request(server)
                .post('/Users/Registar')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should POST a user ', (done) => {
            let user = {
                nome: "nome",
                password: "Qwerty1!",
                email: "nome@gmail.com"
            }
            chai.request(server)
                .post('/Users/Registar')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});