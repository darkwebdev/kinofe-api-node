const _ = require('lodash');
const fetch = require('node-fetch');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

const Movie = require('../../app/models/Movie');
const movieData = require('./data/movie');
const createFakeMovie = () =>
    Movie.create(_.extend({}, movieData, {
        _id: mongoose.Types.ObjectId(),
    }));

const port = '3001';
const apiUrl = 'http://localhost:' + port;

describe('API', () => {
    before(() => {
        process.env.config_path = './config/test';
        require('../../app/');
    });

    beforeEach(done => {
        Movie
            .remove({})
            .then(createFakeMovie())
            .then(createFakeMovie())
            .then(createFakeMovie())
            .then(done())
    });

    it('should return a proper amount of Movies', () => {
        const limit = 2;
        const uri = apiUrl + '/movies?limit=' + limit;

        const json = fetch(uri).then(response => response.json());
        return expect(json).to.eventually.have.length(limit);
    });
});