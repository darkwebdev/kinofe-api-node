const { expect } = require('chai');

const { convertListToSchema, convertDetailsToSchema } = require('../../app/import/converters');
const { rt, myapi } = require('../../app/import/providers');
const newReleases = require('./data/newReleases');
const movieDetails = require('./data/movieDetails');
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
});