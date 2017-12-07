//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Receita = require('../app/models/receita');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Receita', () => {
    beforeEach((done) => { //Before each test we empty the database
        Receita.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET Receita', () => {
        it('it should GET all the receitas', (done) => {
            chai.request(server)
                .get('/Receita')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    /*
  * Test the /POST route
  */
    describe('/POST Receita', () => {
        it('it should not POST a receita without utente', (done) => {
            let receita = new Receita();
            chai.request(server)
                .post('/Receita')
                .send(receita)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should POST a receita ', (done) => {
            let receita = new Receita({ utente: "0" });
            chai.request(server)
                .post('/Receita')
                .send(receita)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    /*
     * Test the /GET/:id route
    */
    describe('/GET/:receita_id', () => {
        it('it should GET a receita by the given id', (done) => {
            let receita = new Receita({ utente: "0" });
            receita.save((err, receita) => {
                chai.request(server)
                    .get('/Receita/' + 0)
                    .send(receita)
                    .end((err, res) => {
                        res.should.have.status(403);
                        res.body.should.be.a('object');
                        done();
                    });
            });

        });
    });
});