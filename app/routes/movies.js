const _ = require('lodash');
const express = require('express');

const Movie = require('../models/Movie');
const router = express.Router();

const moviesHandler = (req, res, next) => {

    const moviesToSkip = Number(req.query.skip) || 0;
    const moviesToShow = Number(req.query.limit) || 10;
    const moviesSorting = req.query.sort || '-rating';

    const pickMainProps = ({ _id, title, year, rating, desc, genres, poster, directors, actors, }) => ({
        _id,
        title,
        year,
        rating,
        genres,
        desc: desc.slice(0, 100),
        poster: poster.small,
        directors: _.pluck(directors, 'name'),
        actors: _.pluck(actors.slice(0, 5), 'name'),
    });

    Movie
        .find()
        .skip(moviesToSkip)
        .limit(moviesToShow)
        .sort(moviesSorting)
        .then(movies => res.json(movies.map(pickMainProps)))
        .catch(ex => next(ex))
};

module.exports = router.get('/', moviesHandler);
