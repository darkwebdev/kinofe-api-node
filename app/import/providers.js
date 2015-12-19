module.exports = {
    rt: {
        buildUri: (key) => 'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?' +
            'country=us&page_limit=20&apikey=' + key,
        moviesProp: 'movies',
        converters: {
            title: ({ title }) => title,
            year: ({ year }) => year,
            imdbId: ({ alternate_ids }) => alternate_ids ? 'tt'+alternate_ids.imdb : null,
            poster: ({ posters }) => ({ small: posters.thumbnail }),
            desc: ({ synopsis }) => synopsis,
            runtime: ({ runtime }) => runtime,
        },
    },
    tmdb: {
        buildUri: (key) => 'http://api.themoviedb.org/3/discover/movie?' + 'api_key=' + key,
        moviesProp: 'results',
    },
    myapi: {
        buildUri: (key, imdbId) => 'http://api.myapifilms.com/imdb/idIMDB?' +
            'idIMDB=' + imdbId + '&token=' + key + '&format=json&language=en-us&actors=1',
        movieProp: 'data.movies.0',
        converters: {
            votes: ({ votes }) => votes ? Number(votes.replace(',', '')) : 0,
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
    }
};