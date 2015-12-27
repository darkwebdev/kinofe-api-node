const qs = require('qs');

module.exports = {
    rt: {
        buildUri: ({ key, limit, page, }) =>
            'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?' +
            qs.stringify({
                country: 'us',
                page_limit: limit || 20,
                page: page || 1,
                apikey: key,
            }),
        moviesProp: 'movies',
        converters: {
            title: ({ title, }) => title,
            year: ({ year, }) => year,
            imdbId: ({ alternate_ids, }) => alternate_ids ? 'tt'+alternate_ids.imdb : null,
            poster: ({ posters, }) => ({ small: posters.thumbnail, }),
            desc: ({ synopsis, }) => synopsis,
            runtime: ({ runtime, }) => runtime,
        },
    },
    tmdb: {
        buildUri: ({ key, }) =>
            'http://api.themoviedb.org/3/discover/movie?' +
            qs.stringify({ api_key: key, }),
        moviesProp: 'results',
    },
    myapi: {
        buildUri: ({ key, imdbId, title, year, }) =>
            'http://api.myapifilms.com/imdb/idIMDB?' +
            qs.stringify(Object.assign({
                token: key,
                format: 'json',
                language: 'en-us',
                filter: 3,
                exactFilter: 1,
                limit: 1,
                actors: 1,
            }, imdbId ? { idIMDB: imdbId, } : { title, year, })),
        movieProp: 'data.movies.0',
        converters: {
            imdbId: ({ idIMDB, }) => idIMDB,
            votes: ({ votes, }) => votes ? Number(votes.replace(',', '')) : 0,
            rating: ({ rating, }) => Number(rating),
            poster: ({ urlPoster, }) => ({ normal: urlPoster, }),
            genres: ({ genres, }) => genres.map(genre => genre.toLowerCase()),
            directors: ({ directors, }) =>
                directors.map(({ name, nameId, }) => ({
                    name,
                    imdbId: nameId,
                })),
            actors: ({ actors, }) =>
                actors.map(({ actorName, urlPhoto, actorId, character, }) => ({
                    name: actorName,
                    photo: urlPhoto,
                    imdbId: actorId,
                    character,
                })),
        },
    }
};