const expect = require('chai').expect;

const { convertListToSchema, convertDetailsToSchema } = require('../../app/import/converters');
const newReleases = require('./data/newReleases.json');
const movieDetails = require('./data/movieDetails.json');
const convertedReleases = require('./data/convertedReleases');
const convertedDetails = require('./data/convertedDetails');

const releasesProvider = {
    moviesProp: 'movies',
    converters: {
        title: ({ title }) => title,
        year: ({ year }) => year,
        imdbId: ({ alternate_ids }) => alternate_ids ? 'tt'+alternate_ids.imdb : null,
        poster: ({ posters }) => ({ small: posters.thumbnail }),
        desc: ({ synopsis }) => synopsis,
        runtime: ({ runtime }) => runtime,
    },
};

const detailsProvider = {
    movieProp: 'data.movies.0',
    converters: {
        votes: ({ votes }) => Number(votes.replace(',', '')),
        rating: ({ rating }) => Number(rating),
        poster: ({ urlPoster }) => ({ normal: urlPoster }),
        genres: ({ genres }) => genres,
        directors: ({ directors=[] }) =>
            directors.map(({ name, nameId }) => ({
                name,
                imdbId: nameId,
            })),
        actors: ({ actors=[] }) =>
            actors.map(({ actorName, urlPhoto, actorId, character, }) => ({
                name: actorName,
                photo: urlPhoto,
                imdbId: actorId,
                character,
            })),
    },
};

describe('Converters', () => {
    it('should create proper data structures from New Releases JSON', () => {
        expect(convertListToSchema(newReleases, releasesProvider)).to.deep.equal(convertedReleases);
    });
    it('should create proper data structures from Movie Details JSON', () => {
        expect(convertDetailsToSchema(movieDetails, detailsProvider)).to.deep.equal(convertedDetails);
    });
});