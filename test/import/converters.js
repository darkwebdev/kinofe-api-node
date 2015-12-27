const { expect, } = require('chai');

const { convertListToSchema, convertDetailsToSchema, } = require('../../app/import/converters');
const { rt, myapi, } = require('../../app/import/providers');
const newReleases = require('./data/newReleases');
const movieDetails = require('./data/movieDetails');
const movieDetailsNoDirectors = require('./data/movieDetailsNoDirectors');
const movieDetailsNoActors = require('./data/movieDetailsNoActors');
const movieDetailsNoGenres = require('./data/movieDetailsNoGenres');
const convertedReleases = require('./data/convertedReleases');
const convertedDetails = require('./data/convertedDetails');

const releasesProvider = rt;
const detailsProvider = myapi;

describe('Converters', () => {
    it('should create proper data structures from New Releases JSON', () => {
        expect(convertListToSchema(newReleases, releasesProvider)).to.deep.equal(convertedReleases);
    });
    it('should create proper data structures from Movie Details JSON', () => {
        expect(convertDetailsToSchema(movieDetails, detailsProvider)).to.deep.equal(convertedDetails);
    });

    context('on JSON without directors', () => {
        it('should throw an exeption', () => {
            expect(() => convertDetailsToSchema(movieDetailsNoDirectors, detailsProvider)).to.throw(TypeError);
        });
    });

    context('on JSON without actors', () => {
        it('should throw an exeption', () => {
            expect(() => convertDetailsToSchema(movieDetailsNoActors, detailsProvider)).to.throw(TypeError);
        });
    });

    context('on JSON without genres', () => {
        it('should throw an exeption', () => {
            expect(() => convertDetailsToSchema(movieDetailsNoGenres, detailsProvider)).to.throw(TypeError);
        });
    });
});