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
    checkIfMovieExists(movie.imdbId)
        .then(doesExist => {
            if (doesExist) {
                console.log('Movie exists: [' + movie.imdbId + '] ' + movie.title)
            } else {
                fetchDetails(movie.imdbId)
                    .then(movieDetails =>
                        createMovie(_.merge({}, movie, movieDetails)))
                    .catch(ex => console.error('Error fetching', ex))
            }
        })
        .catch(err => console.error(err))
};

const createMovie = (data) => {
    (new Movie(data))
        .save()
        .then((savedMovie) => console.log('Saved movie', savedMovie.title))
        .catch(ex => console.error('Error saving movie:', ex));
};

Promise.all([
    dbConnection,
    fetchNewReleases()
]).then(([, movies]) => {
    movies.map(createMovieIfNotExists);
});