const argv = require('yargs').argv;

const config = require('../config/main.json');
const connectDb = require('../db');
const Movie = require('../models/Movie');
const { fetchNewReleases, fetchDetails } = require('./fetch');

const checkIfMovieExists = ({ imdbId, title, year, }) => {
    return Movie.findOne(imdbId ? { imdbId, } : { title, year, }).then(movie => {
        return Boolean(movie);
    });
};

const createMovieIfNotExists = (movie) => {
    if (!movie.imdbId) {
        console.warn('Movie has no IMDB id, using title/year "' + movie.title + '", ' + movie.year);
    }
    checkIfMovieExists(movie)
        .then(doesExist => {
            if (doesExist) {
                console.warn('Movie exists, skipping: ' + movie.imdbId + ' "' + movie.title + '", ' + movie.year);
            } else {
                return fetchDetails(movie)
                    .then(movieDetails => {
                        if (movieDetails)
                            createMovie(Object.assign({}, movie, movieDetails));
                    })
                    .catch(ex => console.error('Error fetching', movie.title, ex));
            }
        })
        .catch(err => console.error(err));
};

const createMovie = (data) => {
    return (new Movie(data))
        .save()
        .then((savedMovie) => console.log('Saved movie: "' + savedMovie.title + '", ' + savedMovie.year))
        .catch(ex => console.error('Error saving movie:', data.title, ex));
};

Promise.all([
    connectDb(config.db),
    fetchNewReleases(Number(argv.page)),
]).then(([, movies]) => {
    movies.map(createMovieIfNotExists);
});