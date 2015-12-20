const _ = require('lodash');

const dbConnection = require('../db');
const Movie = require('../models/Movie');
const { fetchNewReleases, fetchDetails } = require('./fetch');

const checkIfMovieExists = (imdbId) => {
    return Movie.findOne({ imdbId }).then(movie => {
        return Boolean(movie);
    });
};

const createMovieIfNotExists = (movie) => {
    if (!movie.imdbId) {
        console.log('Movie has no IMDB id, skipping:', movie.title)
    } else {
        checkIfMovieExists(movie.imdbId)
            .then(doesExist => {
                if (doesExist) {
                    console.log('Movie exists, skipping: [' + movie.imdbId + '] ' + movie.title)
                } else {
                    fetchDetails(movie.imdbId)
                        .then(movieDetails =>
                            createMovie(_.merge({}, movie, movieDetails)))
                        .catch(ex => console.error('Error fetching', ex))
                }
            })
            .catch(err => console.error(err))
    }
};

const createMovie = (data) => {
    return (new Movie(data))
        .save()
        .then((savedMovie) => console.log('Saved movie', savedMovie.title))
        .catch(ex => console.error('Error saving movie:', data.title, ex));
};

Promise.all([
    dbConnection,
    fetchNewReleases()
]).then(([, movies]) => {
    movies.map(createMovieIfNotExists);
});