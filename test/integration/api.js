const _ = require('lodash');
const fetch = require('node-fetch');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

const appPath = '../../app';
const config = require(appPath + '/config/test');
const connectDb = require(appPath + '/db');
const startHttpServer = require(appPath + '/http');
const api = require(appPath + '/api');
const Movie = require(appPath + '/models/Movie');
const movieData = require('./data/movie');
const fakeRatings = [ 4, 6, 9, ];
const fakeGenres = [ 'drama', 'comedy', 'documentary', ];

const createFakeMovies = (dataArr) => {
    const newMoviesData = dataArr.map(data =>
        _.extend({}, movieData, data, {
            _id: mongoose.Types.ObjectId(),
            imdbId: (Math.random()+'').slice(2),
        }));

    return Movie.create(newMoviesData);
};

const apiUrl = 'http://localhost:' + config.http.port;

describe('API', () => {
    before(() => Promise.all([
        connectDb(config.db),
        startHttpServer(api, config.http),
    ]));

    context('Limit option', () => {
        beforeEach(() => Movie
            .remove({})
            .then(createFakeMovies(fakeRatings.map(rating => ({ rating, }))))
        );

        [
            {
                limit: null,
                expectedAmount: fakeRatings.length,
            },
            {
                limit: '',
                expectedAmount: fakeRatings.length,
            },
            {
                limit: 2,
                expectedAmount: 2,
            },
            {
                limit: 4,
                expectedAmount: fakeRatings.length,
            },
        ].map(({ limit, expectedAmount, }) =>
            it('should return ' + limit + '/' + fakeRatings.length + ' movies', () => {
                const url = apiUrl + '/movies' + (limit !== null ? '?limit=' + limit : '');

                const json = fetch(url).then(res => res.json());
                return expect(json).to.eventually.be.of.length(expectedAmount);
            })
        );
    });

    context('Sort option', () => {
        beforeEach(() => Movie
            .remove({})
            .then(createFakeMovies(fakeRatings.map(rating => ({ rating, }))))
        );

        [
            {
                sortBy: 'rating',
                expectedSeq: fakeRatings,
            },
            {
                sortBy: '-rating',
                expectedSeq: fakeRatings.slice(0).reverse(),
            },
        ].map(({ sortBy, expectedSeq, }) =>
            it('should sort movies by ' + sortBy, () => {
                const url = apiUrl + '/movies?sort=' + sortBy;

                const json = fetch(url).then(res => res.json());
                return json.then(movies =>
                    expect(_.pluck(movies, 'rating')).to.deep.equal(expectedSeq))
            })
        );
    });

    context('Skip option', () => {
        beforeEach(() => Movie
            .remove({})
            .then(createFakeMovies(fakeRatings.map(rating => ({ rating, }))))
        );

        [
            {
                skip: 0,
                expectedAmount: fakeRatings.length
            },
            {
                skip: 1,
                expectedAmount: fakeRatings.length - 1
            },
            {
                skip: fakeRatings.length,
                expectedAmount: 0
            },
            {
                skip: fakeRatings.length + 1,
                expectedAmount: 0
            },
        ].map(({ skip, expectedAmount, }) =>
            it('should return ' + expectedAmount + '/' + fakeRatings.length + ' movies', () => {
                const url = apiUrl + '/movies?skip=' + skip;

                const json = fetch(url).then(res => res.json());
                return json.then(movies =>
                    expect(json).to.eventually.be.of.length(expectedAmount))
            })
        );
    });

    context('Genres-exclude option', () => {
        beforeEach(() => Movie
            .remove({})
            .then(createFakeMovies(fakeGenres.map(genres => ({ genres, }))))
        );

        [
            {
                genresExclude: []
            },
            {
                genresExclude: [ 'documentary', ]
            },
            {
                genresExclude: [ 'drama', 'documentary', 'comedy', ]
            },
        ].map(({ genresExclude, }) =>
            it('should ignore ' + genresExclude + ' in movies', () => {
                const url = apiUrl + '/movies?genresIgnore=' + genresExclude.join(',');

                const json = fetch(url).then(res => res.json());
                return json.then(movies => {
                    const genres = _.chain(movies).pluck('genres').flatten().unique().value();
                    const unexpectedGenres = genresExclude.length ? genresExclude : [ 'nonexisting' ];

                    return expect(genres).not.to.include.any.members(unexpectedGenres);
                });
            })
        );
    });

    context('Genres-only option', () => {
        beforeEach(() => Movie
            .remove({})
            .then(createFakeMovies(fakeGenres.map(genres => ({ genres, }))))
        );

        [
            {
                genresOnly: [],
            },
            {
                genresOnly: [ 'drama', ],
            },
            {
                genresOnly: [ 'comedy', 'Documentary', 'DRAMA', ],
            },
            {
                genresOnly: [ 'comedy', 'Documentary', 'dramA', 'muSic', ],
            },
        ].map(({ genresOnly, }) =>
            it('should return only ' + genresOnly + ' in movies', () => {
                const url = apiUrl + '/movies?genresOnly=' + genresOnly.join(',');

                const json = fetch(url).then(res => res.json());
                return json.then(movies => {
                    const genres = _.chain(movies).pluck('genres').flatten().unique().sortBy().value();
                    const expectedGenres = genresOnly.length ? _.sortBy(genresOnly) : genres;

                    console.log(url, genres, expectedGenres);
                    return expect(expectedGenres).to.include.same.members(genres);
                });
            })
        );
    });
});

